import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogSlugs } from "@/lib/blog-posts";

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
    "@type": "Article",
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
            See live demos, pick your design and share the link. Assisted $99.
            VIP $199.
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
    </>
  );
}
