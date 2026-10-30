"use client";

import { useEffect, useRef } from "react";
import TemplateDispatcher from "../templates/TemplateDispatcher";
import { InvitationData } from "../invitation/InvitationMobileView";

interface MobileSimulatorProps {
  data: InvitationData;
  activeSection?: string;
}

export default function MobileSimulator({ data, activeSection }: MobileSimulatorProps) {
  const pantallaRef = useRef<HTMLDivElement | null>(null);

  // Al cambiar la sección en el menú del editor, el teléfono se mueve a esa
  // parte de la invitación. Solo mueve el scroll del teléfono, no la página.
  // Portada = arriba del todo. Si la plantilla no tiene ancla para esa
  // sección, no se mueve (nunca a un lugar equivocado).
  useEffect(() => {
    if (!activeSection) return;
    const pantalla = pantallaRef.current;
    if (!pantalla) return;
    if (activeSection === "portada") {
      pantalla.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = pantalla.querySelector(`[data-preview-section="${activeSection}"]`);
    if (!el) return;
    const rectPantalla = pantalla.getBoundingClientRect();
    const rectEl = el.getBoundingClientRect();
    pantalla.scrollTo({
      top: pantalla.scrollTop + (rectEl.top - rectPantalla.top) - 16,
      behavior: "smooth",
    });
  }, [activeSection]);
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Marco de smartphone */}
      <div className="relative w-full max-w-[400px] h-[780px] bg-stone-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-stone-800 ring-1 ring-stone-700/50">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
        </div>

        {/* Pantalla del teléfono con scroll independiente */}
        {/* translateZ(0): contiene los fixed del template (el sobre es fixed inset-0) dentro del teléfono; sin esto el sobre tapa todo el admin */}
        <div ref={pantallaRef} className="w-full h-full bg-white rounded-[38px] overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-stone-300 [transform:translateZ(0)]">
          <TemplateDispatcher data={data} skipIntro={true} />
        </div>

        {/* Barra de inicio inferior de iOS */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-stone-600 rounded-full" />
      </div>
      <p className="text-xs text-stone-400 mt-3 font-medium">
        📱 Vista previa en tiempo real (formato 9:16 vertical)
      </p>
    </div>
  );
}
