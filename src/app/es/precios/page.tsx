import type { Metadata } from "next";
import Link from "next/link";
import PricingPlans from "@/components/pricing/PricingPlans";
import SiteFooter from "@/components/layout/SiteFooter";
import { pricingPlans, planByKey, planPriceNumber, pricingRange } from "@/lib/pricing";

const PHONE_DISPLAY = "(818) 299-4882";
const PHONE_TEL = "tel:+18182994882";

// Title / meta exactos del keyword research (keyword-research-pricing-2026-11-15.md).
export const metadata: Metadata = {
  title: "Precios de Invitaciones Digitales 2026 | Click and Love",
  description:
    "Las invitaciones impresas promedian $400–$600. Las digitales de Click and Love cuestan $99–$279 fijos: sobre 3D, música y RSVP por SMS. Ver precios.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/es/precios",
    languages: {
      en: "https://clickandlove.app/pricing",
      es: "https://clickandlove.app/es/precios",
      "x-default": "https://clickandlove.app/pricing",
    },
  },
  openGraph: {
    title: "Precios de Invitaciones Digitales 2026 | Click and Love",
    description:
      "Las invitaciones impresas promedian $400–$600. Las digitales de Click and Love cuestan $99–$279 fijos: sobre 3D, música y RSVP por SMS. Ver precios.",
    url: "https://clickandlove.app/es/precios",
    siteName: "Click & Love",
    locale: "es_US",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Precios de Invitaciones Digitales - Click & Love",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Precios de Invitaciones Digitales 2026 | Click and Love",
    description:
      "Las invitaciones impresas promedian $400–$600. Las digitales de Click and Love cuestan $99–$279 fijos: sobre 3D, música y RSVP por SMS. Ver precios.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function PreciosPage() {
  // Precios SIEMPRE desde home-translations.ts (misma fuente que el home).
  const range = pricingRange("es");
  const express = planByKey("es", "express");
  const assisted = planByKey("es", "assisted");
  const vip = planByKey("es", "vip");
  const plans = pricingPlans("es");

  // FAQ: preguntas PAA verbatim del estudio (DataForSEO). Las respuestas usan
  // solo cifras atribuidas a su fuente y precios derivados de los planes.
  const faq: { q: string; a: string }[] = [
    {
      q: "¿Cuánto se cobra una tarjeta digital?",
      a: `Los precios varían mucho: hay plantillas de unos pocos dólares y servicios hechos a medida de cientos. En Click and Love la invitación digital completa — sobre 3D, música, RSVP y panel en vivo — cuesta ${range.label} fijos, pago único.`,
    },
    {
      q: "¿Cómo hacer una invitación desde mi celular?",
      a: "Con Click and Love no necesitas computadora ni programas: nos envías tus fotos y datos por WhatsApp y nuestro equipo arma tu invitación. Tus invitados la abren en su celular con un enlace — sin app y sin descargar nada.",
    },
    {
      q: "¿Cuánto cuesta una invitación digital de 15 años?",
      a: `Lo mismo que una de boda: ${range.label} fijos, pago único. Los tres planes — ${express.name}, ${assisted.name} y ${vip.name} — aplican para quinceañeras, y el VIP incluye el álbum de fotos en vivo y el Save the Date digital.`,
    },
    {
      q: "¿Cuál es el tamaño ideal para una invitación digital de WhatsApp?",
      a: "Nuestras invitaciones no son una imagen: son una página web que se abre a pantalla completa en cualquier celular, así que no hay un tamaño que cuidar. Solo compartes el enlace por WhatsApp y listo.",
    },
    {
      q: "¿Cuál es el tamaño ideal para las tarjetas de invitación?",
      a: "En invitaciones impresas el tamaño varía según el diseño. En digital no aplica: la invitación de Click and Love se adapta a la pantalla de cada invitado, sea celular, tablet o computadora.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Click and Love Invitaciones Digitales",
        image: "https://clickandlove.app/assets/og-banner.png",
        description:
          "Invitaciones digitales con sobre 3D, música, RSVP por SMS y panel de anfitrión en vivo. Precio fijo, sin impresión ni envío.",
        brand: { "@type": "Brand", name: "Click & Love" },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: String(range.min),
          highPrice: String(range.max),
          offerCount: String(plans.length),
          offers: plans.map((p) => ({
            "@type": "Offer",
            name: p.name,
            price: String(planPriceNumber(p.price)),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          })),
        },
        areaServed: { "@type": "Country", name: "United States" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#FDFBF8] text-[#2B0A18] font-['Montserrat']">
        {/* Header */}
        <header className="bg-[#7A002A] text-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
            <Link href="/es" className="flex items-center gap-2.5 shrink-0" aria-label="Click and Love">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Click and Love" className="w-10 h-10 object-contain" />
              <span className="flex items-baseline whitespace-nowrap">
                <span className="font-['Montserrat'] font-extrabold text-[20px] tracking-tight text-white">
                  Click
                </span>
                <span className="font-vibes text-[28px] leading-none text-[#FFD166] ml-1.5">and Love</span>
              </span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 text-[13px] font-semibold">
              <Link href="/es/demo" className="hover:text-[#FFD166] transition">
                Ver demos
              </Link>
              <a href={PHONE_TEL} className="hover:text-[#FFD166] transition">
                {PHONE_DISPLAY}
              </a>
              <Link
                href="/pricing"
                className="border border-white/40 rounded-full px-3 py-1 hover:bg-white/10 transition"
              >
                English
              </Link>
            </nav>
          </div>
          <div className="max-w-4xl mx-auto px-4 pb-10 pt-4">
            <p className="text-sm tracking-widest uppercase text-[#FFD166] font-bold">
              Click &amp; Love · Los Ángeles
            </p>
            <h1 className="mt-3 font-['Cinzel'] text-4xl sm:text-5xl font-bold leading-tight">
              Precios de Invitaciones Digitales
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/90">
              Las invitaciones impresas promedian $400–$600 para la mayoría de las parejas, según
              Yeah Weddings. Las digitales de Click and Love cuestan {range.label} fijos: un solo
              pago, sin impresión, sin envío y sin costo por invitado. Todos los planes incluyen
              el sobre 3D interactivo con música, ubicación GPS y panel de RSVP en vivo — Assisted
              y VIP suman confirmaciones por SMS.
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Planes */}
          <section aria-label="Planes">
            <h2 className="font-['Cinzel'] text-3xl font-bold text-center">Elige tu plan</h2>
            <p className="text-center text-[15px] text-[#5A3C46] mt-3 max-w-2xl mx-auto">
              Pago único. Nuestro equipo en Los Ángeles arma tu invitación — tú solo envías tus
              fotos y datos.
            </p>
            <div className="mt-10">
              <PricingPlans lang="es" />
            </div>
          </section>

          {/* H2: ¿Cuánto cuestan las invitaciones de boda? */}
          <section className="mt-16">
            <h2 className="font-['Cinzel'] text-3xl font-bold">¿Cuánto cuestan las invitaciones de boda?</h2>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              En invitaciones impresas, la mayoría de las parejas gasta $400–$600, según Yeah
              Weddings — y la papelería de lujo puede llegar a $5,000–$8,000, según los expertos
              citados en la misma guía. Greenvelope pone el promedio de la invitación impresa en
              $220, con suites impresas para 100 invitados entre $400 y $650.
            </p>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Eso es más o menos $4–$6 por tarjeta en una suite típica de 100 invitados. Y la
              suite es solo una parte: las invitaciones impresas suman sobres, envío y tiempo de
              armado — costos que simplemente no existen con una invitación digital.
            </p>
          </section>

          {/* H2: ¿Cuánto cuestan las invitaciones digitales? */}
          <section className="mt-12">
            <h2 className="font-['Cinzel'] text-3xl font-bold">¿Cuánto cuestan las invitaciones digitales?</h2>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Las invitaciones digitales de Click and Love cuestan {range.label} fijos. El precio
              no cambia con la cantidad de invitados: {express.name} {express.price},{" "}
              {assisted.name} {assisted.price} y {vip.name} {vip.price} — un solo pago, sin
              impresión, sin envío y sin costo por invitado.
            </p>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Tu invitación es un enlace web que compartes por SMS, WhatsApp o código QR. Tus
              invitados lo abren en su celular, ven cómo se abre el sobre 3D con música y
              confirman por mensaje — sin app y sin crear cuenta. Todos los planes incluyen el
              panel de anfitrión en vivo, para que veas cada confirmación en tiempo real.
            </p>
          </section>

          {/* H2: Costo promedio — tabla comparativa */}
          <section className="mt-12">
            <h2 className="font-['Cinzel'] text-3xl font-bold">Costo promedio de las invitaciones de boda</h2>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Los mismos 100 invitados, dos totales muy distintos:
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-[14px] border border-[#E7DCC8] rounded-2xl overflow-hidden bg-white">
                <thead>
                  <tr className="bg-[#7A002A] text-white">
                    <th className="px-4 py-3 font-bold">100 invitados</th>
                    <th className="px-4 py-3 font-bold">Impresa</th>
                    <th className="px-4 py-3 font-bold">Digital Click and Love</th>
                  </tr>
                </thead>
                <tbody className="text-[#45303B]">
                  <tr className="border-t border-[#E7DCC8]">
                    <td className="px-4 py-3 font-semibold">Precio total</td>
                    <td className="px-4 py-3">$400–$650</td>
                    <td className="px-4 py-3 font-bold text-[#7A002A]">{range.label} fijos</td>
                  </tr>
                  <tr className="border-t border-[#E7DCC8]">
                    <td className="px-4 py-3 font-semibold">Por invitado</td>
                    <td className="px-4 py-3">Aprox. $4–$6 por tarjeta</td>
                    <td className="px-4 py-3">$0 — precio fijo, cualquier cantidad</td>
                  </tr>
                  <tr className="border-t border-[#E7DCC8]">
                    <td className="px-4 py-3 font-semibold">Impresión y envío</td>
                    <td className="px-4 py-3">Extra, además de la suite</td>
                    <td className="px-4 py-3">Ninguno</td>
                  </tr>
                  <tr className="border-t border-[#E7DCC8]">
                    <td className="px-4 py-3 font-semibold">RSVP</td>
                    <td className="px-4 py-3">Tarjetas de respuesta + estampillas</td>
                    <td className="px-4 py-3">Confirmación por SMS (Assisted y VIP) o panel web</td>
                  </tr>
                  <tr className="border-t border-[#E7DCC8]">
                    <td className="px-4 py-3 font-semibold">Entrega</td>
                    <td className="px-4 py-3">Por correo, días</td>
                    <td className="px-4 py-3">Enlace instantáneo, el mismo día</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-[#8A6B76]">
              Cifras impresas: Greenvelope (2026) y Yeah Weddings. Precios digitales: nuestros
              planes actuales, pago único.
            </p>
          </section>

          {/* H2: Save the Date */}
          <section className="mt-12">
            <h2 className="font-['Cinzel'] text-3xl font-bold">¿Cuánto cuestan los Save the Date?</h2>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Los Save the Date impresos implican una segunda tirada y otra ronda de envío. Con
              Click and Love, el Save the Date digital viene incluido en el plan {vip.name} sin
              costo extra — con el mismo estilo de sobre 3D, enviado como enlace el día que tú
              quieras.
            </p>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              Un Save the Date solo necesita sus nombres, la fecha de la boda y la ciudad o el
              salón. La invitación formal con todos los detalles llega después — y para entonces
              tus invitados ya tienen la fecha apartada.
            </p>
          </section>

          {/* H2: Quinceañera */}
          <section className="mt-12">
            <h2 className="font-['Cinzel'] text-3xl font-bold">Precios de invitaciones de quinceañera</h2>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              ¿Cuánto cuesta una invitación digital de 15 años? Lo mismo que una de boda:{" "}
              {range.label} fijos. Las invitaciones de quinceañera usan los mismos tres planes —{" "}
              {express.name} {express.price}, {assisted.name} {assisted.price} y {vip.name}{" "}
              {vip.price} — con las mismas funciones. Una invitación digital de quinceañera
              cuesta lo mismo que una de boda: un precio fijo, sin impresión y sin costo por
              invitado.
            </p>
            <p className="mt-4 leading-relaxed text-[#45303B]">
              El plan {vip.name} suma el álbum de fotos en vivo — tus invitados suben fotos y
              videos durante la fiesta con un código QR en las mesas — además del Save the Date
              digital y cambios ilimitados hasta el evento.
            </p>
          </section>

          {/* H2: FAQ */}
          <section className="mt-16">
            <h2 className="font-['Cinzel'] text-3xl font-bold">Preguntas frecuentes</h2>
            <div className="mt-6 space-y-4">
              {faq.map((f) => (
                <details
                  key={f.q}
                  className="rounded-2xl border border-[#E7DCC8] bg-white px-5 py-4"
                >
                  <summary className="font-bold text-[15px] text-[#7A002A] cursor-pointer">
                    {f.q}
                  </summary>
                  <p className="mt-3 leading-relaxed text-[#45303B] text-[14.5px]">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 rounded-3xl bg-[#7A002A] text-white px-6 py-10 text-center">
            <h2 className="font-['Cinzel'] text-3xl font-bold">Mírala antes de pagarla</h2>
            <p className="mt-3 text-white/90 max-w-xl mx-auto leading-relaxed">
              Prueba las demos en vivo — abre el sobre 3D, escucha la música y confirma por SMS,
              exactamente como lo harán tus invitados.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/es/demo"
                className="px-7 py-3.5 rounded-full bg-white text-[#7A002A] font-bold text-sm hover:bg-[#F5EDDA] transition"
              >
                Ver demos en vivo
              </Link>
              <a
                href={PHONE_TEL}
                className="px-7 py-3.5 rounded-full border border-white/50 font-bold text-sm hover:bg-white/10 transition"
              >
                Llamar {PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-5 text-sm text-white/70">
              <Link href="/pricing" className="underline underline-offset-4 hover:text-white">
                See pricing in English →
              </Link>
            </p>
          </section>
        </main>
      </div>
      <SiteFooter lang="es" />
    </>
  );
}
