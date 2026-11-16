"use client";

import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { translations, type Language } from "@/lib/home-translations";

// Bloque "Latest Articles" del home (SEO, nov 2026): la home no enlazaba al
// blog y los 5 artículos estaban huérfanos de autoridad interna. Los artículos
// son EN (no hay versión ES del blog); el encabezado sí va en ambos idiomas.
export default function LatestArticles({ lang = "en" }: { lang?: Language }) {
  const t = translations[lang].blog;
  return (
    <section
      id="articulos"
      className="py-20 px-4 sm:px-6 bg-white border-t border-b border-neutral-200 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="font-['Playfair_Display',serif] font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
            {t.title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-neutral-600 leading-relaxed font-['Montserrat',sans-serif] max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="rounded-3xl bg-[#FAF8F5] border border-neutral-200 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(114,14,38,0.12)] transition-all duration-300 flex flex-col p-6"
            >
              <p className="font-['Montserrat'] text-xs text-[#8A6B76]">
                {post.datePublished} · {post.readMinutes} {t.readSuffix}
              </p>
              <h3 className="font-['Playfair_Display',serif] font-bold text-xl text-neutral-900 mt-2">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="font-['Montserrat'] text-sm text-neutral-600 leading-relaxed mt-2 flex-1">
                {post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-2 font-['Montserrat'] font-bold text-sm text-[#720e26] hover:text-[#581825] transition"
              >
                {t.readMore}
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-['Montserrat'] font-bold text-sm text-[#720e26] hover:text-[#581825] transition"
          >
            {t.viewAll} →
          </Link>
        </div>
      </div>
    </section>
  );
}
