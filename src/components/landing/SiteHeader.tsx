"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "./site";

export function Logo() {
  return (
    <Link href="/" className="flex items-baseline gap-1.5" aria-label="Click & Love home">
      <span className="font-playfair text-xl font-semibold tracking-tight text-charcoal">Click</span>
      <span className="font-playfair text-xl italic text-wine">&amp;</span>
      <span className="font-playfair text-xl font-semibold tracking-tight text-charcoal">Love</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/5 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-charcoal/70 transition-colors hover:text-wine"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="hidden rounded-full border border-champagne px-4 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-champagne/10 sm:inline-flex"
          >
            View Live Demo
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-charcoal/5 bg-ivory md:hidden">
          <ul className="flex flex-col px-5 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-charcoal/80"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/demo"
                className="flex justify-center rounded-full border border-champagne px-4 py-3 text-sm font-medium text-charcoal"
              >
                View Live Demo
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
