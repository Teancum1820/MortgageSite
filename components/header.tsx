import Link from "next/link";
import { Home, ShieldCheck } from "lucide-react";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Mortgage Lead Center";

export function Header() {
  return (
    <header className="border-b border-[rgba(16,42,49,0.1)] bg-[#fffaf2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 font-extrabold text-[#102a31]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#164e63] text-white">
            <Home size={22} aria-hidden="true" />
          </span>
          <span className="truncate">{siteName}</span>
        </Link>
        <div className="hidden items-center gap-2 text-sm font-bold text-[#164e63] sm:flex">
          <ShieldCheck size={18} aria-hidden="true" />
          No SSN required to start
        </div>
      </div>
    </header>
  );
}
