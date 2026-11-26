import Link from "next/link";
import { Clock, MapPin, MessagesSquare, Star } from "lucide-react";

// Contenido compartido de About Us (EN) / Nosotros (ES). Textos copiados
// TAL CUAL de la vista previa aprobada (artefacto about-click-and-love).
// Las cifras son las que ya publica el sitio (home): 1,200+ familias,
// 99% RSVP a tiempo, entrega 48h, 5.0. La foto de Elena Samaniego está
// pendiente (Abraham la pasará); el retrato es un PLACEHOLDER con su
// nombre, nunca foto de stock.

const PHONE_DISPLAY = "(818) 918-2519";
const PHONE_TEL = "tel:+18189182519";
const WHATSAPP_EN =
  "https://wa.me/18182994882?text=Hello%20Click%20%26%20Love!%20I%20would%20like%20information%20about%20digital%20invitations.";
const WHATSAPP_ES =
  "https://wa.me/18182994882?text=Hola%20Click%20%26%20Love!%20Me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20invitaciones%20digitales.";

const COPY = {
  en: {
    eyebrow: "About Us",
    title: "We are passionate about helping families celebrate life's biggest moments.",
    subtitle:
      "Click & Love is a Los Angeles studio crafting bespoke digital invitations for weddings and quinceañeras — cinematic 3D envelopes, music, and RSVPs your guests confirm by text. No apps, no passwords, no chaos.",
    founderName: "Elena Samaniego",
    founderRole: "Founder",
    founderPhotoSoon: "Photo coming soon",
    rsvpLabel: "RSVP on time",
    rsvpValue: "99%",
    ctaFounder: "Meet our founder",
    ctaStart: "Start my invitation",
    ctaStartHref: "/pricing",
    metrics: [
      { value: "1,200+", label: "families confirmed this month" },
      { value: "99%", label: "on-time RSVP rate" },
      { value: "48h", label: "delivery guarantee" },
      { value: "5.0", label: "average guest rating" },
    ],
    founderEyebrow: "Our Founder",
    founderBio1:
      "Elena founded Click & Love in Los Angeles with a simple conviction: a celebration should feel joyful from the very first message a guest receives — not stressful for the family hosting it.",
    founderBio2:
      "That is why every Click & Love invitation is handcrafted by our team as a complete service, never an empty template: the design, the music, the RSVPs and the guest list are all handled for you, and there is always a real person to talk to — in English or Spanish.",
    founderSignature: "Elena Samaniego",
    founderSignatureRole: "Founder, Click & Love",
    glanceTitle: "At a glance",
    glance: [
      {
        icon: "pin",
        title: "Based in Los Angeles",
        text: "serving celebrations across the San Fernando Valley and nationwide.",
      },
      {
        icon: "chat",
        title: "Fully bilingual",
        text: "every invitation, page and conversation in English & Spanish.",
      },
      {
        icon: "clock",
        title: "Real human support",
        text: "Mon–Sat, 9AM–7PM PST, by phone, text or WhatsApp.",
      },
      {
        icon: "star",
        title: "One flat payment",
        text: "$99–$279, no monthly fees and no per-guest charges.",
      },
    ],
    whatEyebrow: "What we do",
    whatTitle: "Everything handled, so you enjoy the party",
    what: [
      {
        title: "3D envelopes",
        text: "Every invitation opens like a real envelope — in 3D, with your music playing.",
      },
      {
        title: "SMS RSVP & family passes",
        text: "Guests confirm by text in one tap, and each family gets exactly its passes.",
      },
      {
        title: "Live photo wall & GPS",
        text: "Guests share photos to a live wall with a QR code, and everyone gets one-tap directions to your venue.",
      },
    ],
    ctaTitle: "Ready for yours?",
    ctaText: "Call or text us — we answer today.",
    ctaCall: "Call",
    ctaWhatsapp: "WhatsApp",
    whatsappHref: WHATSAPP_EN,
  },
  es: {
    eyebrow: "Nosotros",
    title: "Nos apasiona ayudar a las familias a celebrar los momentos más importantes de la vida.",
    subtitle:
      "Click & Love es un estudio de Los Ángeles que crea invitaciones digitales a medida para bodas y quinceañeras — sobres 3D cinematográficos, música y confirmaciones que tus invitados confirman por texto. Sin apps, sin contraseñas, sin caos.",
    founderName: "Elena Samaniego",
    founderRole: "Fundadora",
    founderPhotoSoon: "Foto próximamente",
    rsvpLabel: "RSVP a tiempo",
    rsvpValue: "99%",
    ctaFounder: "Conoce a nuestra fundadora",
    ctaStart: "Crear mi invitación",
    ctaStartHref: "/es/precios",
    metrics: [
      { value: "1,200+", label: "familias confirmadas este mes" },
      { value: "99%", label: "confirmación a tiempo" },
      { value: "48h", label: "garantía de entrega" },
      { value: "5.0", label: "calificación promedio" },
    ],
    founderEyebrow: "Nuestra fundadora",
    founderBio1:
      "Elena fundó Click & Love en Los Ángeles con una convicción simple: una celebración debe sentirse alegre desde el primer mensaje que recibe un invitado — no estresante para la familia que la organiza.",
    founderBio2:
      "Por eso cada invitación de Click & Love la hace nuestro equipo a mano, como un servicio completo, nunca una plantilla vacía: el diseño, la música, las confirmaciones y la lista de invitados quedan en nuestras manos, y siempre hay una persona real con quien hablar — en inglés o en español.",
    founderSignature: "Elena Samaniego",
    founderSignatureRole: "Fundadora, Click & Love",
    glanceTitle: "De un vistazo",
    glance: [
      {
        icon: "pin",
        title: "Con sede en Los Ángeles",
        text: "servimos celebraciones en todo San Fernando Valley y en todo el país.",
      },
      {
        icon: "chat",
        title: "Totalmente bilingüe",
        text: "cada invitación, página y conversación en inglés y español.",
      },
      {
        icon: "clock",
        title: "Soporte humano real",
        text: "lun–sáb, 9 AM–7 PM PST, por teléfono, texto o WhatsApp.",
      },
      {
        icon: "star",
        title: "Un solo pago",
        text: "$99–$279, sin mensualidades y sin cargos por invitado.",
      },
    ],
    whatEyebrow: "Lo que hacemos",
    whatTitle: "Todo resuelto, para que tú disfrutes la fiesta",
    what: [
      {
        title: "Sobres 3D",
        text: "Cada invitación se abre como un sobre real — en 3D y con tu música sonando.",
      },
      {
        title: "RSVP por SMS y pases familiares",
        text: "Tus invitados confirman por texto con un toque, y cada familia recibe exactamente sus pases.",
      },
      {
        title: "Muro de fotos en vivo y GPS",
        text: "Tus invitados suben fotos al muro en vivo con un código QR, y todos llegan con un toque al GPS.",
      },
    ],
    ctaTitle: "¿Lista para la tuya?",
    ctaText: "Llámanos o mándanos un texto — te respondemos hoy mismo.",
    ctaCall: "Llamar",
    ctaWhatsapp: "WhatsApp",
    whatsappHref: WHATSAPP_ES,
  },
} as const;

const GLANCE_ICONS = {
  pin: MapPin,
  chat: MessagesSquare,
  clock: Clock,
  star: Star,
} as const;

export default function AboutContent({ lang }: { lang: "en" | "es" }) {
  const t = COPY[lang];
  return (
    <main>
      {/* Hero editorial — igual que la vista previa aprobada */}
      <section className="relative overflow-hidden bg-[#FAF8F5]">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#8A6B76] font-semibold">
              {t.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[60px] font-bold leading-[1.05] tracking-tight text-[#2B0A18]">
              {t.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#5A3C46] max-w-xl">
              {t.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#founder"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#7A002A] text-white font-semibold hover:brightness-110 transition"
              >
                {t.ctaFounder}
              </a>
              <Link
                href={t.ctaStartHref}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[#7A002A]/30 text-[#7A002A] font-semibold hover:bg-[#7A002A]/5 transition"
              >
                {t.ctaStart}
              </Link>
            </div>
          </div>

          {/* Tarjeta crema de Elena + tarjeta flotante RSVP 99% */}
          <div className="relative max-w-md w-full mx-auto lg:mx-0">
            <div className="rounded-3xl bg-[#F5EDE8] px-8 pt-10 pb-20 text-center">
              <p className="text-2xl font-bold text-[#2B0A18]">{t.founderName}</p>
              <p className="mt-1 text-xs tracking-[0.25em] uppercase text-[#7A002A] font-semibold">
                {t.founderRole}
              </p>
              <p className="mt-2 text-sm text-[#8A6B76]">{t.founderPhotoSoon}</p>
              {/* Placeholder con su nombre — NUNCA foto de stock como si fuera ella */}
              <div className="mt-8 mx-auto w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-[#EADFD8] flex items-center justify-center">
                <span className="text-6xl sm:text-7xl font-bold text-[#7A002A]">ES</span>
              </div>
            </div>
            <div className="relative z-10 -mt-12 ml-2 sm:ml-4 mr-10 sm:mr-16 rounded-2xl bg-white shadow-[0_20px_50px_rgba(43,10,24,0.15)] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#8A6B76]">
                  {t.rsvpLabel}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="mt-2 text-4xl font-bold text-[#2B0A18]">{t.rsvpValue}</p>
              <div className="mt-4 flex items-end gap-2 h-12" aria-hidden="true">
                <span className="w-5 rounded-full bg-[#2B0A18] h-[30%]" />
                <span className="w-5 rounded-full bg-[#2B0A18] h-[45%]" />
                <span className="w-5 rounded-full bg-[#2B0A18] h-[65%]" />
                <span className="w-5 rounded-full bg-[#2B0A18] h-[50%]" />
                <span className="w-5 rounded-full bg-[#2B0A18] h-[85%]" />
                <span className="w-5 rounded-full bg-[#2B0A18] h-[70%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="bg-white border-y border-[#7A002A]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {t.metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-[#7A002A]">
                {m.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-[#8A6B76]">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fundadora + At a glance */}
      <section id="founder" className="scroll-mt-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#B08D3C] font-semibold">
              {t.founderEyebrow}
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#2B0A18]">
              Elena Samaniego
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#5A3C46]">{t.founderBio1}</p>
            <p className="mt-4 text-lg leading-relaxed text-[#5A3C46]">{t.founderBio2}</p>
            <p className="mt-8 font-['Playfair_Display',serif] italic text-2xl font-bold text-[#7A002A]">
              {t.founderSignature}
            </p>
            <p className="mt-1 text-xs tracking-[0.25em] uppercase text-[#8A6B76] font-semibold">
              {t.founderSignatureRole}
            </p>
          </div>

          <div className="rounded-2xl border border-[#7A002A]/10 bg-[#FAF8F5] p-6 sm:p-8">
            <p className="text-xs tracking-[0.25em] uppercase text-[#8A6B76] font-semibold">
              {t.glanceTitle}
            </p>
            <ul className="mt-6 space-y-6">
              {t.glance.map((item) => {
                const Icon = GLANCE_ICONS[item.icon];
                return (
                  <li key={item.title} className="flex gap-3">
                    <Icon className="w-5 h-5 shrink-0 mt-0.5 text-[#7A002A]" aria-hidden="true" />
                    <p className="leading-relaxed text-[#5A3C46]">
                      <span className="font-bold text-[#2B0A18]">{item.title}</span> —{" "}
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-white border-t border-[#7A002A]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#B08D3C] font-semibold text-center">
            {t.whatEyebrow}
          </p>
          <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-[#2B0A18] text-center max-w-2xl mx-auto">
            {t.whatTitle}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.what.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#7A002A]/10 bg-[#FAF8F5] p-6 sm:p-8"
              >
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2B0A18]">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-[#5A3C46]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banda CTA vino */}
      <section className="bg-[#7A002A] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold">
            {t.ctaTitle}
          </h2>
          <p className="mt-3 text-lg text-white/85">{t.ctaText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={PHONE_TEL}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-[#7A002A] font-semibold hover:brightness-95 transition"
            >
              {t.ctaCall} {PHONE_DISPLAY}
            </a>
            <a
              href={t.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition"
            >
              {t.ctaWhatsapp}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
