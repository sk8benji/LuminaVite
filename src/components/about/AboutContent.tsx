import Link from "next/link";

// Contenido compartido de About Us (EN) / Nosotros (ES). Las cifras son las
// que ya publica el sitio (home): 1,200+ familias, 99% RSVP a tiempo,
// entrega 48h, 5.0. La foto de Elena Samaniego está pendiente (Abraham la
// pasará); el retrato es un PLACEHOLDER con su nombre, nunca foto de stock.

const PHONE_DISPLAY = "(818) 918-2519";
const PHONE_TEL = "tel:+18189182519";
const WHATSAPP_EN =
  "https://wa.me/18182994882?text=Hello%20Click%20%26%20Love!%20I%20would%20like%20information%20about%20digital%20invitations.";
const WHATSAPP_ES =
  "https://wa.me/18182994882?text=Hola%20Click%20%26%20Love!%20Me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20invitaciones%20digitales.";

const COPY = {
  en: {
    eyebrow: "About Click & Love",
    title: "Beautiful invitations, made with love in Los Angeles",
    subtitle:
      "Click & Love is a Los Angeles studio that designs interactive digital invitations for quinceañeras and weddings — 3D envelopes, music, SMS confirmations and live guest support, all handled by our team.",
    rsvpLabel: "Live RSVP",
    rsvpValue: "1,200+",
    rsvpText: "families confirmed this month across Los Angeles & San Fernando Valley",
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
    founderRole: "Founder",
    founderPhotoSoon: "Photo coming soon",
    founderBio1:
      "Elena founded Click & Love in Los Angeles with one simple idea: an invitation should feel like the celebration itself — beautiful to open, easy to answer, and impossible to lose.",
    founderBio2:
      "Today our team designs every invitation by hand, adds the music, sets up SMS confirmations and family passes, and stays on call for your guests until the last dance — so you can enjoy your party instead of chasing replies.",
    glanceTitle: "At a glance",
    glance: [
      { label: "Based in", value: "Los Angeles, California" },
      { label: "Focus", value: "Quinceañeras & weddings" },
      { label: "Serving", value: "Southern California" },
      { label: "Support", value: "Mon–Sat, 9 AM–7 PM PST" },
      { label: "Languages", value: "English & Spanish" },
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
    eyebrow: "Nosotros · Click & Love",
    title: "Invitaciones hermosas, hechas con amor en Los Ángeles",
    subtitle:
      "Click & Love es un estudio en Los Ángeles que diseña invitaciones digitales interactivas para quinceañeras y bodas — sobres 3D, música, confirmación por SMS y soporte en vivo, todo a cargo de nuestro equipo.",
    rsvpLabel: "RSVP en vivo",
    rsvpValue: "1,200+",
    rsvpText: "familias confirmadas este mes en Los Ángeles y San Fernando Valley",
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
    founderRole: "Fundadora",
    founderPhotoSoon: "Foto próximamente",
    founderBio1:
      "Elena fundó Click & Love en Los Ángeles con una idea simple: una invitación debe sentirse como la celebración misma — hermosa al abrirla, fácil de responder e imposible de perder.",
    founderBio2:
      "Hoy nuestro equipo diseña cada invitación a mano, le pone la música, configura la confirmación por SMS y los pases familiares, y atiende a tus invitados hasta el último baile — para que tú disfrutes tu fiesta en vez de andar persiguiendo respuestas.",
    glanceTitle: "De un vistazo",
    glance: [
      { label: "Sede", value: "Los Ángeles, California" },
      { label: "Enfoque", value: "Quinceañeras y bodas" },
      { label: "Cobertura", value: "Sur de California" },
      { label: "Soporte", value: "Lun–Sáb, 9 AM–7 PM PST" },
      { label: "Idiomas", value: "Inglés y español" },
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

export default function AboutContent({ lang }: { lang: "en" | "es" }) {
  const t = COPY[lang];
  return (
    <main>
      {/* Hero editorial */}
      <section className="relative overflow-hidden bg-[#FAF8F5]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(#7A002A22 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#B08D3C] font-semibold">
              {t.eyebrow}
            </p>
            <h1 className="mt-4 font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-[#2B0A18]">
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

          {/* Tarjeta RSVP */}
          <div className="rounded-3xl border border-[#7A002A]/10 bg-white/80 backdrop-blur p-6 sm:p-8 shadow-[0_20px_50px_rgba(43,10,24,0.08)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#8A6B76]">
                {t.rsvpLabel}
              </span>
            </div>
            <p className="mt-4 font-['Playfair_Display',serif] text-5xl font-bold text-[#7A002A]">
              {t.rsvpValue}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#5A3C46]">{t.rsvpText}</p>
            <div className="mt-6 flex items-end gap-2 h-16" aria-hidden="true">
              <span className="w-8 rounded-t bg-[#7A002A]/20 h-[35%]" />
              <span className="w-8 rounded-t bg-[#7A002A]/40 h-[55%]" />
              <span className="w-8 rounded-t bg-[#7A002A]/60 h-[75%]" />
              <span className="w-8 rounded-t bg-[#7A002A] h-full" />
              <span className="w-8 rounded-t bg-[#B08D3C] h-[65%]" />
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

      {/* Fundadora */}
      <section id="founder" className="scroll-mt-24 bg-[#FAF8F5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Placeholder de foto — NUNCA foto de stock como si fuera ella */}
          <div className="rounded-3xl border border-[#7A002A]/15 bg-gradient-to-b from-[#7A002A]/5 to-[#B08D3C]/10 aspect-[4/5] max-w-md w-full mx-auto flex flex-col items-center justify-center text-center p-8">
            <span className="font-['Playfair_Display',serif] text-7xl font-bold text-[#7A002A]/30">
              ES
            </span>
            <p className="mt-6 font-['Playfair_Display',serif] text-2xl font-bold text-[#2B0A18]">
              Elena Samaniego
            </p>
            <p className="mt-1 text-xs tracking-[0.25em] uppercase text-[#B08D3C] font-semibold">
              {t.founderRole}
            </p>
            <p className="mt-4 text-sm text-[#8A6B76]">{t.founderPhotoSoon}</p>
          </div>

          <div>
            <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#B08D3C] font-semibold">
              {t.founderEyebrow}
            </p>
            <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-[#2B0A18]">
              Elena Samaniego
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#5A3C46]">{t.founderBio1}</p>
            <p className="mt-4 text-lg leading-relaxed text-[#5A3C46]">{t.founderBio2}</p>

            <div className="mt-8 rounded-2xl border border-[#7A002A]/10 bg-white p-6">
              <p className="font-['Playfair_Display',serif] text-lg font-bold text-[#2B0A18]">
                {t.glanceTitle}
              </p>
              <dl className="mt-4 space-y-3">
                {t.glance.map((row) => (
                  <div key={row.label} className="flex gap-3 text-sm">
                    <dt className="w-24 shrink-0 font-semibold text-[#7A002A]">{row.label}</dt>
                    <dd className="text-[#5A3C46]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
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
