import Link from "next/link";

const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "Company Name";
const nmls = process.env.NEXT_PUBLIC_NMLS_ID || "123456";

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(16,42,49,0.1)] bg-[#102a31] text-white">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-sm sm:px-6 md:grid-cols-[1fr_auto] md:items-center">
        <p className="leading-6 text-white/78">
          {companyName}, NMLS #{nmls}. Equal Housing Lender. This site provides estimates and
          lead intake only; final loan terms require a complete application and underwriting.
        </p>
        <nav className="flex flex-wrap gap-4 font-bold text-white">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/licensing">Licensing</Link>
        </nav>
      </div>
    </footer>
  );
}
