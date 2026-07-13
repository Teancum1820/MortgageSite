import { Header } from "@/components/header";
import { LeadExperience } from "@/components/lead-experience";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <LeadExperience />
      </main>
      <SiteFooter />
    </div>
  );
}
