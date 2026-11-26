import type { Metadata } from "next";
import Link from "next/link";
import BlogArticlesSection from "@/components/blog/BlogArticlesSection";
import { BLOG_POSTS } from "@/lib/blog-posts";

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
    </>
  );
}
