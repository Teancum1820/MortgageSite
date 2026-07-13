import { z } from "zod";

export const leadSchema = z.object({
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code."),
  goal: z.enum(["purchase", "refinance"]),
  propertyUse: z.enum(["primary", "second", "investment"]),
  creditBand: z.enum(["760+", "700-759", "640-699", "<640"]),
  email: z.string().trim().email("Enter a valid email."),
  homePrice: z.number().min(50000, "Enter a realistic amount.").max(10000000),
  downPaymentPercent: z.number().min(0).max(100),
  grossMonthlyIncome: z.number().min(0).max(1000000),
  monthlyDebts: z.number().min(0).max(1000000),
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().min(1, "Last name is required.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-().\s]{10,20}$/, "Enter a valid phone number."),
  consent: z.literal(true, {
    error: "Consent is required.",
  }),
  utmSource: z.string().nullable().optional(),
  utmMedium: z.string().nullable().optional(),
  utmCampaign: z.string().nullable().optional(),
});

export type LeadPayload = z.infer<typeof leadSchema>;
