import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Click & Love",
  description: "Privacy Policy for Click & Love digital invitation and guest management platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 font-['Montserrat',sans-serif]">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 mb-8">
          Last updated: November 2026
        </p>

        <div className="space-y-6 text-sm text-neutral-700 leading-relaxed">
          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900 mb-2">
              1. Our Commitment to Privacy
            </h2>
            <p>
              Click &amp; Love LLC (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects the privacy of our hosts and their celebration guests. We do not sell guest lists, phone numbers, or personal details to third parties or advertising networks.
            </p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900 mb-2">
              2. Information We Collect
            </h2>
            <p>
              When hosts configure their invitation portal, we collect contact information (names, emails, and phone numbers for SMS RSVPs) strictly to deliver digital event invitations, track family pass counts, and provide navigation updates.
            </p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900 mb-2">
              3. Guest RSVP &amp; SMS Messaging
            </h2>
            <p>
              Guests receive SMS messages only relating to the specific celebration they were invited to by the host (event invitations, arrival reminders, and RSVP confirmations). Message and data rates may apply. Guests can opt out at any time by replying STOP.
            </p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900 mb-2">
              4. Data Security
            </h2>
            <p>
              We employ industry-standard encryption protocols in transit and at rest. Access to host dashboards is authenticated via secure Magic Links or encrypted sessions.
            </p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-neutral-900 mb-2">
              5. Contact Us
            </h2>
            <p>
              For any questions regarding this Privacy Policy or data requests, contact us at <a href="mailto:concierge@clickandlove.app" className="text-[#720e26] font-medium underline">concierge@clickandlove.app</a> or via phone at (818) 918-2519.
            </p>
          </section>
        </div>
      </main>

    </div>
  );
}
