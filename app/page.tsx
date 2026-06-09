import { FeatureCards } from "@/components/layout/FeatureCards";
import { LandingHero } from "@/components/layout/LandingHero";
import { LandingTopNav } from "@/components/layout/LandingTopNav";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingTopNav />
      <LandingHero />
      <FeatureCards />
      <footer className="border-t border-border/50 bg-[#fdfdfd] px-6 py-8 text-center text-sm text-muted">
        Demo mode is active. Provider calls, imports, exports, and persistence remain disabled in this phase.
      </footer>
    </main>
  );
}
