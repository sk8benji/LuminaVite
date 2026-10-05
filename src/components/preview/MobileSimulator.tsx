"use client";

import TemplateDispatcher from "../templates/TemplateDispatcher";
import { InvitationData } from "../invitation/InvitationMobileView";

interface MobileSimulatorProps {
  data: InvitationData;
}

export default function MobileSimulator({ data }: MobileSimulatorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Marco de smartphone */}
      <div className="relative w-full max-w-[400px] h-[780px] bg-stone-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-stone-800 ring-1 ring-stone-700/50">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
        </div>

        {/* Pantalla del teléfono con scroll independiente */}
        <div className="w-full h-full bg-white rounded-[38px] overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-stone-300">
          <TemplateDispatcher data={data} />
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
