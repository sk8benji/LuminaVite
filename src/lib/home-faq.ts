// FAQ del home — preguntas PAA verbatim de los estudios DataForSEO
// (keyword-research-home-2026-11-15.md y keyword-research-pricing-2026-11-15.md).
// Las respuestas con precios se derivan de la fuente única (src/lib/pricing.ts);
// NUNCA hardcodear un precio aquí: todo precio sale de pricingRange/planByKey.
import { planByKey, pricingRange } from "@/lib/pricing";
import type { Language } from "@/lib/home-translations";

export type FaqItem = { q: string; a: string };

export function homeFaq(lang: Language): { title: string; items: FaqItem[] } {
  const range = pricingRange(lang);
  const express = planByKey(lang, "express");
  const assisted = planByKey(lang, "assisted");
  const vip = planByKey(lang, "vip");

  if (lang === "es") {
    return {
      title: "Preguntas Sobre Invitaciones Digitales, Save the Dates y RSVP",
      items: [
        {
          q: "¿Cuánto cuesta una invitación digital de 15 años?",
          a: `Lo mismo que una de boda: ${range.label} fijos — ${express.name} ${express.price}, ${assisted.name} ${assisted.price} y ${vip.name} ${vip.price} — un solo pago, sin impresión ni envío por correo. El plan VIP incluye el álbum de fotos en vivo y la invitación digital Save the Date.`,
        },
        {
          q: "¿Cómo puedo crear una invitación para enviar por WhatsApp?",
          a: "Tu invitación es un enlace web: lo compartes por WhatsApp y tus invitados lo abren en el celular, sin app ni registro. La vista previa sale con tu diseño y confirman por SMS.",
        },
        {
          q: "¿Cómo puedo hacer mis invitaciones digitales?",
          a: `Puedes diseñarla tú en Canva o Invitio, o dejar que nuestro equipo la arme: nos mandas tus fotos y datos y la recibes lista para enviar, con sobre 3D, música y RSVP por SMS, desde ${express.price}.`,
        },
        {
          q: "¿Cuál es la mejor aplicación para hacer invitaciones digitales gratis?",
          a: `Canva e Invitio son las más usadas para diseñar una invitación gratis tú mismo. Si quieres el diseño hecho, con RSVP por SMS y panel de anfitrión, nuestros planes cuestan ${range.label} fijos.`,
        },
      ],
    };
  }

  return {
    title: "Questions About Digital Invitations, Save the Dates & RSVP",
    items: [
      {
        q: "How much do digital wedding invitations cost?",
        a: `Click and Love digital invitations cost ${range.label} flat — ${express.name} ${express.price}, ${assisted.name} ${assisted.price} and ${vip.name} ${vip.price} — one payment, no printing, no postage, no per-guest fees. Printed invitations average $400–$600 for most couples, according to Yeah Weddings.`,
      },
      {
        q: "Can I send digital wedding invitations?",
        a: "Yes. Your invitation is a web link you share by SMS, WhatsApp, email or QR code. Guests open it on their phone — no app, no account, no download — and confirm by text.",
      },
      {
        q: "Is it cheaper to buy or make wedding invitations?",
        a: `Buying from a print shop is usually cheaper than making invitations once you count materials, ink, envelopes and postage — and far faster. Going digital is cheaper than both: ${range.label} flat with no materials at all.`,
      },
      {
        q: "How soon before a wedding should you send invites?",
        a: "Send digital invitations six to eight weeks before the event, with the RSVP deadline three to four weeks out. That gives every guest time to reply — and you one clean window to remind only the guests who have not answered yet.",
      },
      {
        q: "What are the best electronic invitations?",
        a: "The best electronic invitations combine a design your guests actually open with an RSVP that works: a 3D envelope with music, SMS confirmations, strict family pass control and a live host panel. That is what Click and Love builds — try a live demo to see it.",
      },
      {
        q: "What is the cheapest way to save the date?",
        a: `A digital save the date: no printing, no postage, sent as a link in seconds. A digital save the date invitation is included in the ${vip.name} plan at no extra cost.`,
      },
    ],
  };
}
