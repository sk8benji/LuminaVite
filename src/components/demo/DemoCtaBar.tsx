// Barra CTA fija en páginas demo (Semana 2 del plan de marketing).
// Siempre visible aunque haya scroll: rótulo + botón principal con icono
// de llamada + "See packages" a los precios del home.
// Estilo a juego con el banner de contacto (borgoña #7A002A).
// Idioma: inglés por default; español solo cuando la plantilla abre en
// español (idiomaDefault === "es"), la misma regla que usan las plantillas.
// Historial 2026-10-29: el diseño "Call / Pricing" sin rótulo no le gustó
// a Abraham; se volvió a este diseño con el botón principal llamando.

import TrackLink from "@/components/analytics/TrackLink";

const PHONE_TEL = "tel:+18182994882";

export default function DemoCtaBar({
  estiloPlantilla,
  idioma,
}: {
  estiloPlantilla?: string;
  idioma?: string;
}) {
  const es = idioma === "es";

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#7A002A] text-white shadow-[0_-6px_28px_rgba(0,0,0,0.35)]">
      <div className="max-w-xl mx-auto px-4 pt-3 pb-[max(0.8rem,env(safe-area-inset-bottom))] flex items-center gap-2.5">
        <p className="flex-1 min-w-0 text-[13px] font-bold leading-snug truncate">
          {es ? "¿Te gusta esta plantilla?" : "Do you like this template?"}
        </p>
        <TrackLink
          href={PHONE_TEL}
          event="click_llamar"
          eventParams={{ origen: "barra_demo" }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FFD166] text-[#7A002A] text-[11px] font-extrabold uppercase tracking-wide shadow-sm shrink-0"
        >
          <span aria-hidden="true">📞</span>
          {es ? "Quiero esta plantilla" : "I want this template"}
        </TrackLink>
        <a
          href="/#precios"
          className="inline-flex items-center px-3.5 py-2.5 rounded-xl bg-white text-[#7A002A] text-[11px] font-extrabold uppercase tracking-wide shadow-sm shrink-0"
        >
          {es ? "Ver paquetes" : "See packages"}
        </a>
      </div>
    </div>
  );
}
