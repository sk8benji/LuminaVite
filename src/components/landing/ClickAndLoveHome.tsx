import { SiteHeader } from "./SiteHeader";
import { HeroSection } from "./HeroSection";
import { BentoFeatures } from "./BentoFeatures";
import { CelebrationPillars } from "./CelebrationPillars";
import { HowItWorks } from "./HowItWorks";
import { TemplateGallery } from "./TemplateGallery";
import { PricingSection } from "./PricingSection";
import { FaqSection } from "./FaqSection";
import { FinalCta } from "./FinalCta";

export default function ClickAndLoveHome() {
  return (
    <div lang="en" className="min-h-screen bg-ivory font-sans text-charcoal antialiased">
      <SiteHeader />
      <main>
        <HeroSection />
        <BentoFeatures />
        <CelebrationPillars />
        <HowItWorks />
        <TemplateGallery />
        <PricingSection />
        <FaqSection />
      </main>
      <FinalCta />
    </div>
  );
}
