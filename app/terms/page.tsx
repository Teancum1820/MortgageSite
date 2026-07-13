import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";

export default function TermsPage() {
  return (
    <div className="app-shell">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 leading-8 text-[#253c43] sm:px-6">
        <h1 className="text-4xl font-black text-[#102a31]">Terms of Use</h1>
        <div className="mt-6 space-y-5">
          <p>
            The calculator and rate request flow provide estimates for informational purposes only.
            They are not a loan approval, loan estimate, or commitment to lend.
          </p>
          <p>
            Final loan terms depend on a completed application, verification, underwriting, market
            conditions, and applicable lender guidelines. Replace this starter page with
            counsel-approved terms before launch.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
