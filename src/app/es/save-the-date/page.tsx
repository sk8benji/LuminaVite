import type { Metadata } from "next";
import SaveTheDateLandingPageEs from "@/components/SaveTheDateLandingPageEs";

export const metadata: Metadata = {
  title: "Save the Date Digital | Invitaciones Click and Love",
  description:
    "Envía un Save the Date digital en minutos: sobre, cuenta regresiva, guardar en calendario y Confirmación Anticipada. Solo $49, o gratis en VIP.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/es/save-the-date",
    languages: {
      en: "https://clickandlove.app/save-the-date",
      es: "https://clickandlove.app/es/save-the-date",
      "x-default": "https://clickandlove.app/save-the-date",
    },
  },
  openGraph: {
    title: "Save the Date Digital | Invitaciones Click and Love",
    description:
      "Envía un Save the Date digital en minutos: sobre, cuenta regresiva, guardar en calendario y Confirmación Anticipada. Solo $49, o gratis en VIP.",
    url: "https://clickandlove.app/es/save-the-date",
    siteName: "Click & Love",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Save the Date Digital - Click & Love",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Save the Date Digital | Invitaciones Click and Love",
    description:
      "Envía un Save the Date digital en minutos. Sobre, cuenta regresiva, guardar en calendario y Confirmación Anticipada. Solo $49.",
    images: ["https://clickandlove.app/assets/og-banner.png"],
  },
};

export default function SaveTheDatePageEs() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Save the Date Digital",
        image: "https://clickandlove.app/assets/save-the-date/principal.jpeg",
        description:
          "Un Save the Date digital con un sobre que se abre sobre tu foto, cuenta regresiva en vivo, guardar en calendario con un toque, Confirmación Anticipada, galería de fotos y música — en inglés y español.",
        brand: {
          "@type": "Brand",
          name: "Click & Love",
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "49",
          highPrice: "279",
          offerCount: "2",
          offers: [
            {
              "@type": "Offer",
              name: "Save the Date",
              price: "49",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "VIP Todo Incluido",
              price: "279",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "¿Cómo se envía un Save the Date digital?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Con un enlace — por mensaje de texto, WhatsApp o correo. Tus invitados lo tocan y el sobre se abre en su teléfono: tu foto, la fecha, una cuenta regresiva en vivo y un botón para guardarla en su calendario. Sin app que instalar, sin cuenta que crear, sin nada que imprimir.",
            },
          },
          {
            "@type": "Question",
            name: "¿Se puede combinar el Save the Date con el RSVP?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí. Cada Save the Date incluye Confirmación Anticipada: tus invitados ya pueden decirte si planean venir, meses antes de que salga la invitación formal. Ves las respuestas tempranas en tu panel de anfitrión.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cuánto cuesta un Save the Date?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Un Save the Date digital de Click and Love cuesta $49, pago único — sobre, cuenta regresiva, guardar en calendario, Confirmación Anticipada, galería de fotos y música incluidos. El Save the Date también viene incluido sin costo en el plan VIP ($279).",
            },
          },
          {
            "@type": "Question",
            name: "¿Cuándo se deben enviar los Save the Date?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "De 6 a 12 meses antes de la celebración. Es lo suficientemente temprano para que los invitados de fuera planeen su viaje, y lo suficientemente tarde para que la fecha ya esté firme. La invitación formal se envía unas 8 semanas antes del evento.",
            },
          },
          {
            "@type": "Question",
            name: "¿Qué debe llevar un Save the Date?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Cuatro cosas: sus nombres, la fecha, la ciudad y una forma de guardarla. El nuestro agrega el resto por ti — tu foto, una cuenta regresiva en vivo, el botón para guardar en calendario y la Confirmación Anticipada para que te respondan de inmediato.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SaveTheDateLandingPageEs />
    </>
  );
}
