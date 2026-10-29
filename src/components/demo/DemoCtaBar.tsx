// Barra CTA fija en páginas demo (Semana 2 del plan de marketing).
// Siempre visible aunque haya scroll: "Quiero esta plantilla" abre un SMS
// prellenado con la plantilla, y "Ver paquetes" lleva a los precios del home.
// Estilo a juego con el banner de contacto (borgoña #7A002A).
// Idioma: inglés por default; español solo cuando la plantilla abre en
// español (idiomaDefault === "es"), la misma regla que usan las plantillas.

const PHONE_SMS = "sms:+18182994882";

// ELEGANT_ROSE -> "Elegant Rose", BEAUTY_QUINCE -> "Beauty Quince", etc.
function nombrePlantilla(estilo: string | undefined): string {
  if (!estilo) return "esta plantilla";
  return estilo
    .split("_")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

export default function DemoCtaBar({
  estiloPlantilla,
  idioma,
}: {
  estiloPlantilla?: string;
  idioma?: string;
}) {
  const es = idioma === "es";
  const nombre = nombrePlantilla(estiloPlantilla);
  const sms = `${PHONE_SMS}?&body=${encodeURIComponent(
    es
      ? `Hola, vi la plantilla ${nombre} y la quiero para mi evento`
      : `Hi, I saw the ${nombre} template and I want it for my event`
  )}`;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#7A002A] text-white shadow-[0_-6px_28px_rgba(0,0,0,0.35)]">
      <div className="max-w-xl mx-auto px-4 pt-3 pb-[max(0.8rem,env(safe-area-inset-bottom))] flex items-center gap-2.5">
        <p className="flex-1 min-w-0 text-[13px] font-bold leading-snug truncate">
          {es ? "¿Te gusta esta plantilla?" : "Do you like this template?"}
        </p>
        <a
          href={sms}
          className="inline-flex items-center px-3.5 py-2.5 rounded-xl bg-[#FFD166] text-[#7A002A] text-[11px] font-extrabold uppercase tracking-wide shadow-sm shrink-0"
        >
          {es ? "Quiero esta plantilla" : "I want this template"}
        </a>
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
