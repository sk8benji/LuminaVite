"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-posts";

// Sección de artículos del blog — diseño estilo LogoGen adaptado a Click & Love:
// tarjeta destacada + dos horizontales apiladas + lista "More guides".
// Colores de marca (vino #7A002A, dorado #FFD166). Sin framer-motion:
// la entrada escalonada se hace con IntersectionObserver + transiciones CSS.

const POST_META: Record<string, { image: string; category: string }> = {
  "how-to-collect-wedding-photos-from-guests": {
    image: "/blog/wedding-photos-guests.jpg",
    category: "Guest Photos",
  },
  "quinceanera-invitation-wording-examples": {
    image: "/blog/quinceanera-wording.jpg",
    category: "Wording",
  },
  "best-google-photos-alternatives-for-events": {
    image: "/blog/google-photos-alternatives.jpg",
    category: "Guest Photos",
  },
  "how-to-track-event-rsvps-via-sms": {
    image: "/blog/rsvp-sms.jpg",
    category: "RSVP",
  },
  "how-to-make-guests-rsvp-on-time": {
    image: "/blog/rsvp-on-time.jpg",
    category: "RSVP",
  },
  "how-to-send-text-message-invitations": {
    image: "/blog/text-message-invitations.jpg",
    category: "SMS",
  },
};

function Reveal({
  children,
  delay = 0,
  from = "y",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "x" | "y";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hidden =
    from === "x" ? "opacity-0 translate-x-[30px]" : "opacity-0 translate-y-[30px]";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={`${className} transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : hidden
      }`}
    >
      {children}
    </div>
  );
}

function ArrowIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-5 h-5 shrink-0 transition-all duration-300 ${
        active ? "-rotate-45 text-[#B08D3C]" : "text-[#2B0A18]"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CtaRow({ active }: { active: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`text-[18px] font-medium leading-[160%] tracking-[-0.18px] transition-all duration-300 ${
          active
            ? "text-transparent bg-clip-text bg-gradient-to-r from-[#7A002A] to-[#B08D3C]"
            : "text-[#2B0A18]"
        }`}
      >
        Read the guide
      </span>
      <ArrowIcon active={active} />
    </span>
  );
}

function TagRow({ category }: { category: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A002A]/10 border border-[#7A002A]/15 text-[#7A002A] font-semibold text-[11px] leading-none uppercase">
        {category}
      </span>
      <span className="text-[#D8C9CE] font-bold">•</span>
      <span className="text-[#8A6B76] font-semibold text-[11px] leading-none">
        Guide
      </span>
    </span>
  );
}

export default function BlogArticlesSection({ posts }: { posts: BlogPost[] }) {
  const [activeId, setActiveId] = useState(1);
  const featured = posts[0];
  const stacked = posts.slice(1, 3);
  const more = posts.slice(3);

  if (!featured) return null;

  const featuredMeta = POST_META[featured.slug] ?? {
    image: "",
    category: "Guide",
  };

  return (
    <section
      id="articles-section"
      className="w-full bg-[#F7F7F6] flex justify-center items-center overflow-hidden"
    >
      <div className="w-full max-w-[1440px] px-6 md:px-12 lg:px-[64px] py-[60px] md:py-[100px] lg:py-[120px] flex flex-col items-center gap-[48px] lg:gap-[64px]">
        {/* Header */}
        <div className="w-full max-w-[1312px] flex flex-col items-center text-center gap-[12px]">
          <Reveal delay={0}>
            <span className="text-xs md:text-[14px] font-semibold tracking-[1px] md:tracking-[2px] uppercase text-[#8A6B76]">
              Guides
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-['Montserrat'] text-[#2B0A18] text-[36px] sm:text-[48px] lg:text-[56px] font-semibold leading-[130%] tracking-[-0.8px] max-w-[850px]">
              Ideas,{" "}
              <span className="text-[#F97316]">tips</span> &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#A855F7]">
                inspiration
              </span>{" "}
              for weddings &amp; quinceañeras
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#5A3C46] text-[16px] sm:text-[18px] leading-[160%] max-w-[640px]">
              Practical guides for invitations, wording, SMS confirmations and
              guest photos. No fluff, just what works for real events.
            </p>
          </Reveal>
        </div>

        {/* Tarjetas: destacada + 2 apiladas */}
        <div
          className="w-full max-w-[1312px] flex flex-col lg:flex-row items-stretch gap-8 lg:gap-[32px]"
          onMouseLeave={() => setActiveId(1)}
        >
          {/* Destacada */}
          <Reveal delay={0.3} className="w-full lg:w-[644px]">
            <Link
              href={`/blog/${featured.slug}`}
              onMouseEnter={() => setActiveId(1)}
              className="w-full flex flex-col items-start rounded-[20px] border border-[#2B0A18]/10 bg-white overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(43,10,24,0.01)] hover:shadow-[0_20px_50px_rgba(43,10,24,0.06)] cursor-pointer group"
            >
              <span className="w-full h-[370px] overflow-hidden relative block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredMeta.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-all duration-[800ms] ease-out group-hover:scale-105 group-hover:rotate-1"
                />
              </span>
              <span className="flex flex-col p-6 sm:p-8 items-start gap-12 sm:gap-[64px] self-stretch justify-between flex-1">
                <span className="flex flex-col items-start gap-4">
                  <TagRow category={featuredMeta.category} />
                  <span className="text-sm text-[#8A6B76]">
                    {featured.datePublished} · {featured.readMinutes} min read
                  </span>
                  <span className="font-['Montserrat'] max-w-[366px] text-[#2B0A18] text-[24px] sm:text-[28px] font-semibold leading-[140%] sm:leading-[160%] tracking-[-0.56px]">
                    {featured.title}
                  </span>
                  <span className="max-w-[440px] text-[#5A3C46] text-[15px] sm:text-[18px] font-normal leading-[160%] tracking-[-0.18px] mt-1 line-clamp-3">
                    {featured.description}
                  </span>
                </span>
                <CtaRow active={activeId === 1} />
              </span>
            </Link>
          </Reveal>

          {/* Apiladas */}
          <div className="w-full lg:w-[644px] flex flex-col gap-6">
            {stacked.map((post, idx) => {
              const id = idx + 2;
              const meta = POST_META[post.slug] ?? {
                image: "",
                category: "Guide",
              };
              return (
                <Reveal key={post.slug} delay={0.45 + idx * 0.15} from="x">
                  <Link
                    href={`/blog/${post.slug}`}
                    onMouseEnter={() => setActiveId(id)}
                    className="w-full flex flex-col sm:flex-row items-stretch rounded-[20px] border border-[#2B0A18]/10 bg-white overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(43,10,24,0.01)] hover:shadow-[0_20px_50px_rgba(43,10,24,0.06)] cursor-pointer group"
                  >
                    <span className="w-full sm:w-[260px] h-[200px] sm:h-auto overflow-hidden relative shrink-0 block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={meta.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-all duration-[800ms] ease-out group-hover:scale-105 group-hover:rotate-1"
                      />
                    </span>
                    <span className="flex flex-col p-6 sm:p-8 items-start gap-8 justify-between flex-1">
                      <span className="flex flex-col items-start gap-4">
                        <TagRow category={meta.category} />
                        <span className="text-sm text-[#8A6B76]">
                          {post.datePublished} · {post.readMinutes} min read
                        </span>
                        <span className="font-['Montserrat'] text-[#2B0A18] text-[20px] sm:text-[24px] font-bold leading-[140%] sm:leading-[150%] tracking-[-0.2px]">
                          {post.title}
                        </span>
                        <span className="text-[#5A3C46] text-[15px] sm:text-[18px] font-normal leading-[160%] tracking-[-0.18px] mt-1 line-clamp-4">
                          {post.description}
                        </span>
                      </span>
                      <span className="mt-1.5">
                        <CtaRow active={activeId === id} />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Más guías */}
        {more.length > 0 && (
          <div className="w-full max-w-[1312px] flex flex-col gap-6">
            <Reveal delay={0.1}>
              <h3 className="font-['Montserrat'] text-[#2B0A18] text-[24px] sm:text-[28px] font-semibold tracking-[-0.5px]">
                More guides
              </h3>
            </Reveal>
            {more.map((post, idx) => {
              const meta = POST_META[post.slug] ?? {
                image: "",
                category: "Guide",
              };
              return (
                <Reveal key={post.slug} delay={0.2 + idx * 0.15} from="x">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="w-full flex flex-row items-stretch rounded-[20px] border border-[#2B0A18]/10 bg-white overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(43,10,24,0.01)] hover:shadow-[0_20px_50px_rgba(43,10,24,0.06)] cursor-pointer group"
                  >
                    <span className="w-[120px] sm:w-[180px] shrink-0 overflow-hidden relative block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={meta.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-all duration-[800ms] ease-out group-hover:scale-105 group-hover:rotate-1"
                      />
                    </span>
                    <span className="flex flex-col p-5 sm:p-6 items-start gap-2 justify-center flex-1 min-w-0">
                      <TagRow category={meta.category} />
                      <span className="text-sm text-[#8A6B76]">
                        {post.datePublished} · {post.readMinutes} min read
                      </span>
                      <span className="font-['Montserrat'] text-[#2B0A18] text-[18px] sm:text-[22px] font-bold leading-[140%] tracking-[-0.2px]">
                        {post.title}
                      </span>
                      <span className="text-[#5A3C46] text-[14px] sm:text-[16px] leading-[160%] line-clamp-2">
                        {post.description}
                      </span>
                      <span className="mt-1 font-bold text-[#7A002A]">
                        Read the guide →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
