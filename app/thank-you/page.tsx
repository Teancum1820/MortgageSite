import Link from "next/link";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { isStaticExport } from "@/lib/site-url";

const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

export default function ThankYouPage() {
  return (
    <div className="app-shell">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="panel p-6 sm:p-8">
          <CheckCircle2 className="text-[#2f855a]" size={44} aria-hidden="true" />
          <h1 className="mt-5 text-4xl font-black text-[#102a31]">Thanks, you are in.</h1>
          <p className="mt-4 text-lg leading-8 text-[#465d63]">
            We received your details and are preparing your mortgage options. A loan specialist can
            review your estimate and next steps with you.
          </p>
          {isStaticExport ? (
            <div className="mt-6 rounded-lg border border-[#d8d2c6] bg-white p-4 text-[#253c43]">
              GitHub Pages testing mode stores submitted leads in this browser only. Production
              hosting should use Amplify or a CRM webhook.
            </div>
          ) : null}
          {calendlyUrl ? (
            <Link className="primary-button mt-6 max-w-sm" href={calendlyUrl}>
              <CalendarClock size={18} aria-hidden="true" />
              Book a review call
            </Link>
          ) : (
            <div className="mt-6 rounded-lg border border-[#d8d2c6] bg-white p-4 text-[#253c43]">
              Add `NEXT_PUBLIC_CALENDLY_URL` to enable calendar booking here.
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
