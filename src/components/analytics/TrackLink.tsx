"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

// Enlace <a> que dispara un evento GA4 al clic, sin impedir la navegación.
// Para páginas servidor (catálogo, barra de demo) que no pueden usar onClick.
export default function TrackLink({
  href,
  className,
  event,
  eventParams,
  children,
}: {
  href: string;
  className?: string;
  event: string;
  eventParams?: Record<string, string | number>;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(event, eventParams)}
    >
      {children}
    </a>
  );
}
