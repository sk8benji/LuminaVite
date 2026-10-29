// Barra CTA fija en páginas demo (Semana 2 del plan de marketing).
// Siempre visible aunque haya scroll. Desde 2026-10-29 (orden de Abraham):
// la acción principal es LLAMAR (no un SMS con texto largo, que además
// truncaba el rótulo en móvil) y el segundo botón va a precios.
// Estilo a juego con el banner de contacto (borgoña #7A002A).
// Idioma: inglés por default; español solo cuando la plantilla abre en
// español (idiomaDefault === "es"), la misma regla que usan las plantillas.

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
      <div className="max-w-xl mx-auto px-4 pt-3 pb-[max(0.8rem,env(safe-area-inset-bottom))] flex items-center justify-center gap-2.5">
        <a
          href={PHONE_TEL}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FFD166] text-[#7A002A] text-[13px] font-extrabold uppercase tracking-wide shadow-sm"
        >
          <span aria-hidden="true">📞</span>
          {es ? "Llamar" : "Call"}
        </a>
        <a
          href="/#precios"
          className="flex-1 inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-white text-[#7A002A] text-[13px] font-extrabold uppercase tracking-wide shadow-sm"
        >
          {es ? "Precios" : "Pricing"}
        </a>
      </div>
    </div>
  );
}
