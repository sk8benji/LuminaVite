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
