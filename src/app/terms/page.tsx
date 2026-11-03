import React from "react";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Click & Love",
  description: "Terms of Service for Click & Love digital invitation and guest management platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 font-['Montserrat',sans-serif]">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900">
              Click &amp; Love
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-[#720e26] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-neutral-500 mb-8">
          Last updated: November 2026
        </p>

        <div className="space-y-6 text-sm text-neutral-700 leading-relaxed">
          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900 mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the services provided by Click &amp; Love LLC (&ldquo;Click &amp; Love&rdquo;, &ldquo;we&rdquo;, or &ldquo;us&rdquo;), you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900 mb-2">
              2. Digital Invitation &amp; Concierge Services
            </h2>
            <p>
              Click &amp; Love provides digital invitation experiences, guest RSVP portals, SMS event communications, and turn-by-turn navigation assistance for host celebrations (quinceañeras, weddings, sweet 16s, and galas).
            </p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900 mb-2">
              3. Host Responsibilities
            </h2>
            <p>
              Hosts are responsible for the accuracy of event details, guest rosters, and obtaining consent from guests to receive invitation links and RSVP reminders via SMS.
            </p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900 mb-2">
              4. Service Availability &amp; Modifications
            </h2>
            <p>
              We strive for continuous availability of all interactive invitations and host dashboards. We reserve the right to perform scheduled maintenance and enhancements to improve service stability.
            </p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900 mb-2">
              5. Contact &amp; Support
            </h2>
            <p>
              If you have inquiries regarding these Terms, contact our concierge team at <a href="mailto:concierge@clickandlove.app" className="text-[#720e26] font-medium underline">concierge@clickandlove.app</a> or call (818) 299-4882.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter lang="en" />
    </div>
  );
}
