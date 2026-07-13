"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { calculateAffordability, currency, percent } from "@/lib/calculator";
import { leadSchema, type LeadPayload } from "@/lib/lead-schema";
import { isStaticExport, sitePath } from "@/lib/site-url";

const defaultValues: LeadPayload = {
  zip: "",
  goal: "purchase",
  propertyUse: "primary",
  creditBand: "700-759",
  email: "",
  homePrice: 425000,
  downPaymentPercent: 10,
  grossMonthlyIncome: 9000,
  monthlyDebts: 650,
  firstName: "",
  lastName: "",
  phone: "",
  consent: true,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
};

export function LeadExperience() {
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<LeadPayload>({
    resolver: zodResolver(leadSchema),
    defaultValues,
    mode: "onTouched",
  });

  const values = watch();
  const affordability = useMemo(
    () =>
      calculateAffordability({
        homePrice: Number(values.homePrice) || 0,
        downPaymentPercent: Number(values.downPaymentPercent) || 0,
        annualRate: values.creditBand === "760+" ? 6.35 : values.creditBand === "<640" ? 7.2 : 6.65,
        termYears: 30,
        grossMonthlyIncome: Number(values.grossMonthlyIncome) || 0,
        monthlyDebts: Number(values.monthlyDebts) || 0,
      }),
    [
      values.creditBand,
      values.downPaymentPercent,
      values.grossMonthlyIncome,
      values.homePrice,
      values.monthlyDebts,
    ],
  );

  async function continueToStepTwo() {
    const valid = await trigger(["zip", "goal", "propertyUse", "creditBand", "email"]);
    if (valid) {
      setStep(2);
      setApiError("");
    }
  }

  async function onSubmit(data: LeadPayload) {
    setStatus("submitting");
    setApiError("");

    const params = new URLSearchParams(window.location.search);
    const payload: LeadPayload = {
      ...data,
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
    };

    if (isStaticExport) {
      const leads = JSON.parse(window.localStorage.getItem("mortgageSiteTestLeads") || "[]");
      leads.push({ ...payload, createdAt: new Date().toISOString() });
      window.localStorage.setItem("mortgageSiteTestLeads", JSON.stringify(leads));
    } else {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus("idle");
        setApiError("We could not submit your details. Please review the form and try again.");
        return;
      }
    }

    setStatus("submitted");
    window.location.href = sitePath("/thank-you");
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-12">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8d2c6] bg-white px-3 py-2 text-sm font-bold text-[#164e63]">
              <ShieldCheck size={16} aria-hidden="true" />
              Personalized options without a hard credit pull
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black leading-[1.04] tracking-normal text-[#102a31] sm:text-5xl lg:text-6xl">
                Get a personalized mortgage rate in minutes
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#465d63]">
                Compare purchase or refinance paths, estimate your payment, and send a loan
                specialist the details they need to follow up with useful options.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <TrustPoint icon={<ClipboardCheck size={19} />} label="3-minute pre-qual flow" />
              <TrustPoint icon={<Calculator size={19} />} label="Live payment estimate" />
              <TrustPoint icon={<LockKeyhole size={19} />} label="No SSN to see options" />
            </div>
            <div className="relative min-h-[260px] overflow-hidden rounded-lg border border-[rgba(16,42,49,0.12)] bg-[#d9eef0] lg:min-h-[330px]">
              <Image
                src={sitePath("/hero-home.svg")}
                alt="Modern home with mortgage approval dashboard"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          <div className="panel p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#d08d3e]">
                  Step {step} of 2
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#102a31]">
                  {step === 1 ? "Start your rate request" : "Complete your estimate"}
                </h2>
              </div>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#164e63] text-white">
                {step === 1 ? <Mail size={24} /> : <Phone size={24} />}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {step === 1 ? (
                <StepOne register={register} errors={errors} />
              ) : (
                <StepTwo register={register} errors={errors} affordability={affordability} />
              )}

              {apiError ? <p className="error">{apiError}</p> : null}

              {step === 1 ? (
                <button className="primary-button" type="button" onClick={continueToStepTwo}>
                  See my estimate <ArrowRight size={18} aria-hidden="true" />
                </button>
              ) : (
                <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                  <button className="secondary-button" type="button" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button className="primary-button" type="submit" disabled={status === "submitting"}>
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                        Submitting
                      </>
                    ) : (
                      <>
                        Request my options <ArrowRight size={18} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              )}

              <p className="fine-print">
                By continuing, you agree to our Privacy Policy and Terms. Estimates are not a loan
                approval or commitment to lend.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(16,42,49,0.1)] bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3">
          <Metric label="Borrower-friendly" value="No SSN" />
          <Metric label="Estimated P&I" value={currency(affordability.monthlyPayment)} />
          <Metric label="Estimated DTI" value={percent(affordability.totalDti)} />
        </div>
      </section>
    </>
  );
}

function StepOne({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<LeadPayload>>["register"];
  errors: ReturnType<typeof useForm<LeadPayload>>["formState"]["errors"];
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="ZIP code" error={errors.zip?.message}>
          <input className="input" data-invalid={Boolean(errors.zip)} {...register("zip")} />
        </Field>
        <Field label="Goal" error={errors.goal?.message}>
          <select className="input" {...register("goal")}>
            <option value="purchase">Purchase</option>
            <option value="refinance">Refinance</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Property use" error={errors.propertyUse?.message}>
          <select className="input" {...register("propertyUse")}>
            <option value="primary">Primary residence</option>
            <option value="second">Second home</option>
            <option value="investment">Investment</option>
          </select>
        </Field>
        <Field label="Credit band" error={errors.creditBand?.message}>
          <select className="input" {...register("creditBand")}>
            <option value="760+">760+</option>
            <option value="700-759">700-759</option>
            <option value="640-699">640-699</option>
            <option value="<640">&lt;640</option>
          </select>
        </Field>
      </div>
      <Field label="Email" error={errors.email?.message}>
        <input
          className="input"
          data-invalid={Boolean(errors.email)}
          type="email"
          autoComplete="email"
          {...register("email")}
        />
      </Field>
    </div>
  );
}

function StepTwo({
  register,
  errors,
  affordability,
}: {
  register: ReturnType<typeof useForm<LeadPayload>>["register"];
  errors: ReturnType<typeof useForm<LeadPayload>>["formState"]["errors"];
  affordability: ReturnType<typeof calculateAffordability>;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#d8d2c6] bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-extrabold text-[#164e63]">
          <DollarSign size={17} aria-hidden="true" />
          Estimate snapshot
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Estimate label="Loan amount" value={currency(affordability.loanAmount)} />
          <Estimate label="Monthly P&I" value={currency(affordability.monthlyPayment)} />
          <Estimate label="DTI" value={percent(affordability.totalDti)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Purchase price / balance" error={errors.homePrice?.message}>
          <input className="input" type="number" {...register("homePrice", { valueAsNumber: true })} />
        </Field>
        <Field label="Down payment %" error={errors.downPaymentPercent?.message}>
          <input
            className="input"
            type="number"
            step="0.1"
            {...register("downPaymentPercent", { valueAsNumber: true })}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Gross monthly income" error={errors.grossMonthlyIncome?.message}>
          <input
            className="input"
            type="number"
            {...register("grossMonthlyIncome", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Monthly debts" error={errors.monthlyDebts?.message}>
          <input className="input" type="number" {...register("monthlyDebts", { valueAsNumber: true })} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" error={errors.firstName?.message}>
          <input className="input" autoComplete="given-name" {...register("firstName")} />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <input className="input" autoComplete="family-name" {...register("lastName")} />
        </Field>
      </div>
      <Field label="Phone" error={errors.phone?.message}>
        <input className="input" type="tel" autoComplete="tel" {...register("phone")} />
      </Field>
      <label className="flex items-start gap-3 rounded-lg border border-[#d8d2c6] bg-white p-3">
        <input className="mt-1 h-4 w-4 shrink-0" type="checkbox" {...register("consent")} />
        <span className="fine-print text-[#253c43]">
          I agree to receive calls and texts at the number provided, including by automated
          technology, about mortgage products. Consent is not a condition of purchase. Msg and data
          rates may apply.
          {errors.consent?.message ? <span className="error block">{errors.consent.message}</span> : null}
        </span>
      </label>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}

function Estimate({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#61747a]">{label}</p>
      <p className="mt-1 text-lg font-black text-[#102a31]">{value}</p>
    </div>
  );
}

function TrustPoint({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-h-[58px] items-center gap-3 rounded-lg border border-[rgba(16,42,49,0.1)] bg-white px-3 py-2 text-sm font-extrabold text-[#102a31]">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#e8f3ef] text-[#2f855a]">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="shrink-0 text-[#2f855a]" size={26} aria-hidden="true" />
      <div>
        <p className="text-sm font-bold text-[#61747a]">{label}</p>
        <p className="text-2xl font-black text-[#102a31]">{value}</p>
      </div>
    </div>
  );
}
