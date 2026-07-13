import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy">
      <p>
        We collect the information you submit through this site to respond to your mortgage request,
        estimate payment scenarios, and route your inquiry to the appropriate contact or system.
      </p>
      <p>
        Replace this starter policy with counsel-approved language before launch, especially if you
        connect ads, analytics, SMS, email automation, or third-party lead buyers.
      </p>
    </InfoPage>
  );
}

function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 leading-8 text-[#253c43] sm:px-6">
        <h1 className="text-4xl font-black text-[#102a31]">{title}</h1>
        <div className="mt-6 space-y-5">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
