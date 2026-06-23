import type { Metadata } from "next";

import { Comparison } from "@/components/landing/Comparison";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Faq } from "@/components/landing/Faq";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { LiveDemo } from "@/components/landing/LiveDemo";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { SocialProof } from "@/components/landing/SocialProof";
import { TrustBar } from "@/components/landing/TrustBar";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI code flowcharts & explanations",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — Understand any code with AI flowcharts`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

export default function Home() {
  return (
    <div className="dark landing-root relative flex min-h-full flex-1 flex-col">
      <div className="relative isolate flex min-h-full flex-1 flex-col">
        <div
          aria-hidden="true"
          className="landing-mesh pointer-events-none absolute inset-0 -z-10"
        />
        <div
          aria-hidden="true"
          className="landing-dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] opacity-40 [mask-image:linear-gradient(180deg,#000_0%,transparent_85%)]"
        />
        <div
          aria-hidden="true"
          className="landing-grain pointer-events-none absolute inset-0 -z-10"
        />

        <LandingNav />

        <main className="flex flex-1 flex-col">
          <Hero />
          <TrustBar />
          <LiveDemo />
          <FeatureGrid />
          <HowItWorks />
          <Comparison />
          <SocialProof />
          <PricingTeaser />
          <Faq />
          <CtaBanner />
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
