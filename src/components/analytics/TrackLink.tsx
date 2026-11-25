"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

// Enlace <a> que dispara un evento GA4 al clic, sin impedir la navegación.
// Para páginas servidor (catálogo, barra de demo) que no pueden usar onClick.
// Si se pasa copyText, el clic además copia ese texto al portapapeles y
// muestra copiedLabel durante 2s: respaldo visible en PC, donde tel:/sms:
// no abren ninguna app y el botón parecía muerto (en móvil el href sigue
// abriendo el marcador o los mensajes como antes).
export default function TrackLink({
  href,
  className,
  event,
  eventParams,
  copyText,
  copiedLabel,
  children,
}: {
  href: string;
  className?: string;
  event: string;
  eventParams?: Record<string, string | number>;
  copyText?: string;
  copiedLabel?: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleClick = () => {
    track(event, eventParams);
    if (!copyText || !copiedLabel) return;
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {copied ? copiedLabel : children}
    </a>
  );
}
