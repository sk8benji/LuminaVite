import Link from "next/link";

interface SiteHeaderProps {
  lang?: "en" | "es";
}

// Header ÚNICO del sitio (estilo WordPress, 25 nov 2026): lo renderiza el
// root layout en TODAS las páginas de marketing, en vez de que cada página
// ponga su propia copia (por eso el blog no lo tenía y las copias se
// desincronizaban). Server component: desplegable de escritorio CSS puro
// (group-hover) y menú móvil con <details> nativo, sin estado cliente.
// Las anclas (#como-funciona, #prices/#precios...) viven en la home, por
// eso van con la ruta absoluta (/#... o /es#...) para que funcionen desde
// cualquier página; en ES apuntan a /es para no sacar al visitante del
// idioma. "Live demo" enlaza a /demo (en la home abría el modal).
const MENU_LANDING_LINKS: Record<
  "en" | "es",
  { href: string; label: string }[]
> = {
  en: [
    { href: "/save-the-date", label: "Save the Date" },
    { href: "/quince-invitations", label: "Quince Invitations" },
    { href: "/wedding-invitations-los-angeles", label: "Wedding Invitations" },
    { href: "/wedding-invitations-las-vegas", label: "Wedding Invitations Las Vegas" },
    { href: "/text-message-invitations", label: "Text Message Invitations" },
    { href: "/rsvp-tracking", label: "RSVP Tracking" },
    { href: "/whatsapp-invitations", label: "WhatsApp Invitations" },
  ],
  es: [
    { href: "/es/save-the-date", label: "Save the Date" },
    { href: "/es/invitaciones-de-quinceanera", label: "Invitaciones de Quinceañera" },
    { href: "/wedding-invitations-los-angeles", label: "Invitaciones de Boda" },
    { href: "/wedding-invitations-las-vegas", label: "Invitaciones de Boda Las Vegas" },
    { href: "/text-message-invitations", label: "Invitaciones por Mensaje de Texto" },
    { href: "/rsvp-tracking", label: "Invitaciones con RSVP" },
    { href: "/whatsapp-invitations", label: "Invitaciones por WhatsApp" },
  ],
};

export default function SiteHeader({ lang = "en" }: SiteHeaderProps) {
  const isEs = lang === "es";
  const homeBase = isEs ? "/es" : "";
  const pricingHref = isEs ? "/es#precios" : "/#prices";
  const t = {
    topbar: isEs
      ? "Los Angeles · Invitaciones digitales con RSVP por SMS · (818) 918-2519"
      : "Los Angeles · Digital invitations with SMS RSVP · (818) 918-2519",
    liveDemo: isEs ? "Demo en vivo" : "Live demo",
    howItWorks: isEs ? "Cómo funciona" : "How it works",
    compare: isEs ? "Comparativa" : "Comparison",
    templates: isEs ? "Plantillas" : "Templates",
    pricing: isEs ? "Precios" : "Pricing",
    reviews: isEs ? "Opiniones" : "Reviews",
    services: isEs ? "Servicios ▾" : "Services ▾",
    servicesTitle: isEs ? "SERVICIOS" : "SERVICES",
    createBtn: isEs ? "Crear mi invitación" : "Create my invitation",
    openMenu: isEs ? "Abrir menú" : "Open menu",
  };

  return (
    <>
      {/* Barra superior borgoña — igual que la home */}
      <div className="bg-[#7A002A] text-white py-2.5 px-4 text-center">
        <span className="font-['Montserrat'] text-[11px] sm:text-xs font-semibold tracking-wide">
          {t.topbar}
        </span>
      </div>

      {/* Header del sitio */}
      <header className="sticky top-0 z-40 bg-[#FDFBF8]/92 backdrop-blur-md border-b border-[#E7DCC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[76px] flex items-center justify-between gap-3">
          <Link href={isEs ? "/es" : "/"} className="flex items-center gap-2.5 shrink-0" aria-label="Click and Love">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Click and Love" className="w-11 h-11 object-contain" />
            <span className="flex items-baseline whitespace-nowrap">
              <span className="font-['Montserrat'] font-extrabold text-[22px] tracking-tight text-[#2B0A18]">
                Click
              </span>
              <span className="font-vibes text-[30px] leading-none text-[#C2185B] ml-1.5">and Love</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 font-['Montserrat'] text-[13.5px] font-semibold text-[#2B0A18]">
            <Link href="/demo" className="hover:text-[#7A002A] transition">
              {t.liveDemo}
            </Link>
            <a href={`${homeBase}#como-funciona`} className="hover:text-[#7A002A] transition">
              {t.howItWorks}
            </a>
            <a href={`${homeBase}#comparativa`} className="hover:text-[#7A002A] transition">
              {t.compare}
            </a>
            <a href={`${homeBase}#plantillas`} className="hover:text-[#7A002A] transition">
              {t.templates}
            </a>
            <a href={pricingHref} className="hover:text-[#7A002A] transition">
              {t.pricing}
            </a>
            <a href={`${homeBase}#reviews`} className="hover:text-[#7A002A] transition">
              {t.reviews}
            </a>
            <div className="relative group">
              <span className="hover:text-[#7A002A] transition cursor-pointer">
                {t.services}
              </span>
              <div className="hidden group-hover:block absolute right-0 top-full pt-3 z-50">
                <div className="w-64 rounded-xl border border-[#E7DCC8] bg-white shadow-xl py-2">
                  {MENU_LANDING_LINKS[lang].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block px-4 py-2.5 text-[13px] hover:bg-[#FDFBF8] hover:text-[#7A002A] transition"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] font-bold tracking-widest text-[#5A3C46]">
              <Link
                href="/es"
                className={`px-1.5 py-0.5 rounded transition ${
                  isEs ? "text-[#7A002A] border-b-2 border-[#7A002A]" : "text-[#A98B96] hover:text-[#7A002A]"
                }`}
                aria-label="Cambiar a Español"
              >
                ES
              </Link>
              <span className="text-[#B08D3C]/50 select-none">|</span>
              <Link
                href="/"
                className={`px-1.5 py-0.5 rounded transition ${
                  !isEs ? "text-[#7A002A] border-b-2 border-[#7A002A]" : "text-[#A98B96] hover:text-[#7A002A]"
                }`}
                aria-label="Switch to English"
              >
                EN
              </Link>
            </div>

            <details className="lg:hidden relative">
              <summary
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#E7DCC8] text-[#2B0A18] transition cursor-pointer list-none"
                aria-label={t.openMenu}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </summary>
              <div className="absolute right-0 top-full mt-3 w-72 rounded-xl border border-[#E7DCC8] bg-white shadow-xl py-2 z-50 flex flex-col font-['Montserrat'] text-[13.5px] font-semibold text-[#2B0A18]">
                <Link href="/demo" className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  {t.liveDemo}
                </Link>
                <a href={`${homeBase}#como-funciona`} className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  {t.howItWorks}
                </a>
                <a href={`${homeBase}#comparativa`} className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  {t.compare}
                </a>
                <a href={`${homeBase}#plantillas`} className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  {t.templates}
                </a>
                <a href={pricingHref} className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  {t.pricing}
                </a>
                <a href={`${homeBase}#reviews`} className="py-2.5 px-4 hover:text-[#7A002A] transition">
                  {t.reviews}
                </a>
                <p className="pt-3 px-4 mt-1 border-t border-[#E7DCC8] text-xs font-bold tracking-widest text-[#7A002A]">
                  {t.servicesTitle}
                </p>
                {MENU_LANDING_LINKS[lang].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="py-2.5 px-4 hover:text-[#7A002A] transition"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </details>
            <a
              href={pricingHref}
              className="hidden sm:inline-flex px-5 py-2.5 bg-[#7A002A] hover:bg-[#660025] text-white rounded-full text-[13px] font-['Montserrat'] font-bold shadow-[0_6px_18px_rgba(122,0,42,0.35)] transition active:scale-95"
            >
              {t.createBtn}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
