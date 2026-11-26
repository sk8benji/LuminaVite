import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import BlogArticlesSection from "@/components/blog/BlogArticlesSection";
import { BLOG_POSTS } from "@/lib/blog-posts";

// Enlaces del menú Servicios (locale EN) — mismos que la home (HomeView).
const MENU_LANDING_LINKS_EN = [
  { href: "/save-the-date", label: "Save the Date" },
  { href: "/quince-invitations", label: "Quince Invitations" },
  { href: "/wedding-invitations-los-angeles", label: "Wedding Invitations" },
  { href: "/wedding-invitations-las-vegas", label: "Wedding Invitations Las Vegas" },
  { href: "/text-message-invitations", label: "Text Message Invitations" },
  { href: "/rsvp-tracking", label: "RSVP Tracking" },
  { href: "/whatsapp-invitations", label: "WhatsApp Invitations" },
];

export const metadata: Metadata = {
  title: "Blog | Click & Love",
  description:
    "Guides for weddings and quinceañeras: wording examples, SMS RSVP tracking, guest photo sharing and invitation tips for Los Angeles events.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/blog",
  },
  openGraph: {
    title: "Blog | Click & Love",
    description:
      "Guides for weddings and quinceañeras: wording examples, SMS RSVP tracking, guest photo sharing and invitation tips for Los Angeles events.",
    url: "https://clickandlove.app/blog",
    siteName: "Click & Love",
    locale: "en_US",
    type: "website",
  },
};

export default function BlogIndexPage() {
  return (
    <>
      {/* Barra superior borgoña — igual que la home */}
      <div className="bg-[#7A002A] text-white py-2.5 px-4 text-center">
        <span className="font-['Montserrat'] text-[11px] sm:text-xs font-semibold tracking-wide">
          Los Angeles · Digital invitations with SMS RSVP · (818) 918-2519
        </span>
      </div>

      {/* Header del sitio — igual que la home (locale EN) */}
      <header className="sticky top-0 z-40 bg-[#FDFBF8]/92 backdrop-blur-md border-b border-[#E7DCC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[76px] flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Click and Love">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Click and Love" className="w-11 h-11 object-contain" />
            <span className="flex items-baseline whitespace-nowrap">
              <span className="font-['Montserrat'] font-extrabold text-[22px] tracking-tight text-[#2B0A18]">
                Click
              </span>
              <span className="font-vibes text-[30px] leading-none text-[#C2185B] ml-1.5">and Love</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 font-['Montserrat'] text-[13.5px] font-semibold text-[#2B0A18]">
            <Link href="/demo" className="hover:text-[#7A002A] transition">
              Live demo
            </Link>
            <a href="/#como-funciona" className="hover:text-[#7A002A] transition">
              How it works
            </a>
            <a href="/#comparativa" className="hover:text-[#7A002A] transition">
              Comparison
            </a>
            <a href="/#plantillas" className="hover:text-[#7A002A] transition">
              Templates
            </a>
            <a href="/#prices" className="hover:text-[#7A002A] transition">
              Pricing
            </a>
            <a href="/#reviews" className="hover:text-[#7A002A] transition">
              Reviews
            </a>
            <div className="relative group">
              <span className="hover:text-[#7A002A] transition cursor-pointer">
                Services ▾
              </span>
              <div className="hidden group-hover:block absolute right-0 top-full pt-3 z-50">
                <div className="w-64 rounded-xl border border-[#E7DCC8] bg-white shadow-xl py-2">
                  {MENU_LANDING_LINKS_EN.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block px-4 py-2.5 text-[13px] hover:bg-[#FDFBF8] hover:text-[#7A002A] transition"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] font-bold tracking-widest text-[#5A3C46]">
              <Link
                href="/es"
                className="px-1.5 py-0.5 rounded transition text-[#A98B96] hover:text-[#7A002A]"
                aria-label="Cambiar a Español"
              >
                ES
              </Link>
              <span className="text-[#B08D3C]/50 select-none">|</span>
              <Link
                href="/"
                className="px-1.5 py-0.5 rounded transition text-[#7A002A] border-b-2 border-[#7A002A]"
                aria-label="Switch to English"
              >
                EN
              </Link>
            </div>

            <details className="lg:hidden relative">
              <summary
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#E7DCC8] text-[#2B0A18] transition cursor-pointer list-none"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </summary>
              <div className="absolute right-0 top-full mt-3 w-72 rounded-xl border border-[#E7DCC8] bg-white shadow-xl py-2 z-50 flex flex-col font-['Montserrat'] text-[13.5px] font-semibold text-[#2B0A18]">
                <Link href="/demo" className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  Live demo
                </Link>
                <a href="/#como-funciona" className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  How it works
                </a>
                <a href="/#comparativa" className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  Comparison
                </a>
                <a href="/#plantillas" className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  Templates
                </a>
                <a href="/#prices" className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  Pricing
                </a>
                <a href="/#reviews" className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  Reviews
                </a>
                <p className="pt-3 px-4 mt-1 border-t border-[#E7DCC8] text-xs font-bold tracking-widest text-[#7A002A]">
                  SERVICES
                </p>
                {MENU_LANDING_LINKS_EN.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="py-2.5 px-4 hover:text-[#7A002A] transition"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </details>
            <a
              href="/#prices"
              className="hidden sm:inline-flex px-5 py-2.5 bg-[#7A002A] hover:bg-[#660025] text-white rounded-full text-[13px] font-['Montserrat'] font-bold shadow-[0_6px_18px_rgba(122,0,42,0.35)] transition active:scale-95"
            >
              Create my invitation
            </a>
          </div>
        </div>
      </header>

      <header className="bg-[#7A002A] text-white">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="text-sm tracking-widest uppercase text-[#FFD166] font-bold">
            Click &amp; Love · Los Angeles
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight">
            Blog: Guides for Weddings &amp; Quinceañeras
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            Practical guides for invitations, wording, SMS confirmations and
            guest photos. No fluff, just what works for real events.
          </p>
        </div>
      </header>
      <main>
        <BlogArticlesSection posts={BLOG_POSTS} />
        <p className="py-10 text-center bg-[#F7F7F6]">
          <Link href="/" className="text-[#7A002A] font-bold underline">
            digital invitations in Los Angeles
          </Link>
        </p>
      </main>
      <SiteFooter lang="en" />
    </>
  );
}
