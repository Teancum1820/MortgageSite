import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";

const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "Company Name";
const nmls = process.env.NEXT_PUBLIC_NMLS_ID || "123456";

export default function LicensingPage() {
  return (
    <div className="app-shell">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 leading-8 text-[#253c43] sm:px-6">
        <h1 className="text-4xl font-black text-[#102a31]">Licensing</h1>
        <div className="mt-6 space-y-5">
          <p>
            {companyName}, NMLS #{nmls}. Equal Housing Lender.
          </p>
          <p>
            Add state-specific licenses, branch information, disclosures, and any required Equal
            Housing marks before publishing paid traffic campaigns.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
