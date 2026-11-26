import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/layout/SiteFooter";
import { getBlogPost, getBlogSlugs } from "@/lib/blog-posts";

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

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog | Click & Love" };
  return {
    title: `${post.title} | Click & Love`,
    description: post.description,
    metadataBase: new URL("https://clickandlove.app"),
    alternates: {
      canonical: `https://clickandlove.app/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Click & Love`,
      description: post.description,
      url: `https://clickandlove.app/blog/${post.slug}`,
      siteName: "Click & Love",
      locale: "en_US",
      type: "article",
    },
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Renderiza enlaces inline [texto](url) dentro de un párrafo.
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/g);
  return parts.map((part, i) => {
    if (i % 3 === 2) {
      const label = parts[i - 1];
      return (
        <a
          key={`${keyPrefix}-${i}`}
          href={part}
          className="text-[#7A002A] font-bold underline"
        >
          {label}
        </a>
      );
    }
    if (i % 3 === 0) return <span key={`${keyPrefix}-${i}`}>{part}</span>;
    return null;
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const canonical = `https://clickandlove.app/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    author: {
      "@type": "Organization",
      name: "Click & Love",
      url: "https://clickandlove.app/",
    },
    publisher: {
      "@type": "Organization",
      name: "Click & Love",
      url: "https://clickandlove.app/",
    },
    mainEntityOfPage: canonical,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            Click &amp; Love · Blog
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            {post.description}
          </p>
          <p className="mt-4 text-sm text-white/80">
            {post.datePublished} · {post.readMinutes} min read
          </p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-12">
        <nav className="rounded-2xl border border-[#7A002A]/20 bg-white p-5">
          <p className="font-bold text-[#7A002A]">In this guide</p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            {post.sections.map((s) => (
              <li key={s.heading}>
                <a
                  href={`#${slugify(s.heading)}`}
                  className="text-[#7A002A] font-bold underline"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {post.sections.map((s) => (
          <section key={s.heading} id={slugify(s.heading)} className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#7A002A]">{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed">
                {renderInline(p, `${slugify(s.heading)}-${i}`)}
              </p>
            ))}
            {s.table && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      {s.table.headers.map((h) => (
                        <th key={h} className="border border-[#E7DCC8] bg-[#FDFBF8] px-3 py-2 text-left font-bold text-[#7A002A]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="border border-[#E7DCC8] px-3 py-2 leading-relaxed">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {s.bullets && (
              <ul className="mt-3 space-y-2 list-disc pl-5 leading-relaxed">
                {s.bullets.map((b) => (
                  <li key={b}>{renderInline(b, `${slugify(s.heading)}-b`)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <section className="rounded-2xl bg-[#7A002A] text-white p-6 text-center">
          <h2 className="text-2xl font-bold">Ready to send yours?</h2>
          <p className="mt-3 text-white/90">
            See live demos, pick your design and share the link. Assisted $199.
            VIP $279.
          </p>
          <Link
            href={post.landing.href}
            className="mt-5 inline-block px-6 py-3 rounded-xl bg-white text-[#7A002A] font-extrabold"
          >
            {post.landing.label} →
          </Link>
        </section>
        <p className="text-center">
          <Link href="/" className="text-[#7A002A] font-bold underline">
            digital invitations in Los Angeles
          </Link>
        </p>
      </main>
      <SiteFooter lang="en" />
    </>
  );
}
