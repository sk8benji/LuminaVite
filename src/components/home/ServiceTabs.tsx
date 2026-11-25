"use client";

import * as React from "react";
import { Language } from "@/lib/home-translations";

export interface ServiceTabsProps {
  lang?: Language;
}

export function ServiceTabs({ lang = "en" }: ServiceTabsProps) {
  const isEs = lang === "es";
  const [activeTab, setActiveTab] = React.useState(0);

  const tabs = isEs
    ? ["Control de Pases", "RSVP por SMS", "Navegación GPS en 1 Toque"]
    : ["Family Pass Control", "Instant SMS RSVP", "1-Tap GPS Navigation"];

  return (
    <section id="comparativa" className="bg-[#FFFFFF] py-[7.5rem] max-[767px]:py-20 text-[#090B10] scroll-mt-24">
      <div className="w-full px-8 max-[767px]:px-4">
        <div className="z-[2] w-full max-w-[1800px] mx-auto">
          {/* Headline */}
          <div className="max-w-[55rem] mx-auto mb-16 text-center max-[767px]:mb-10">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-neutral-200 bg-[#FAF8F5] font-['Montserrat'] text-[11px] tracking-[0.2em] uppercase text-[#720e26] font-bold mb-4">
              {isEs ? "Servicio Completo · No una Plantilla" : "A Complete Service · Not a Template"}
            </span>
            <h2 className="m-0 font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.22] font-bold tracking-tight text-[#090B10]">
              {isEs
                ? "Un servicio de gala a tu medida, no una plantilla vacía"
                : "A Bespoke Celebration Service, Not an Empty Template"}
            </h2>
            <p className="mt-4 text-base sm:text-lg font-normal leading-relaxed text-[#090B10]/75 font-['Montserrat',sans-serif] max-w-2xl mx-auto">
              {isEs
                ? "Diseñamos tu experiencia completa de invitación digital: eliminando el descontrol de invitados, acelerando confirmaciones y cuidando el presupuesto de tu evento."
                : "We handcraft your entire digital invitation experience—eliminating guest chaos, accelerating RSVPs, and protecting your reception budget."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-col justify-start items-center">
            {/* Tab Menu - Segmented Pill Bar */}
            <div className="inline-flex p-1.5 rounded-full bg-neutral-100 border border-neutral-200/90 gap-1.5 max-[767px]:flex-col max-[767px]:w-full max-[767px]:rounded-2xl mb-12 shadow-inner">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={[
                    "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer text-center",
                    "font-['Montserrat',sans-serif]",
                    "max-[767px]:w-full max-[767px]:py-2.5",
                    activeTab === i
                      ? "bg-[#720e26] text-white shadow-sm font-bold"
                      : "text-neutral-600 hover:text-[#090B10] hover:bg-white/70",
                  ].join(" ")}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="w-full">
              {/* Tab 1: Control de Pases */}
              {activeTab === 0 && (
                <div
                  className="grid grid-cols-2 gap-20 grid-rows-[auto] place-items-center max-w-[67.5rem] mx-auto max-[767px]:grid-cols-1 max-[767px]:gap-12"
                  style={{ alignItems: "center" }}
                >
                  {/* Widget */}
                  <div className="rounded-2xl border border-neutral-200 bg-[#FAF8F5] p-[3.25rem_2.5rem] relative overflow-hidden max-[479px]:p-[2.5rem_1.5rem] w-full shadow-sm">
                    <div className="relative z-[5] rounded-xl bg-[#FFFFFF] border border-neutral-200 w-full text-[#090B10] overflow-hidden shadow-sm">
                      {/* Widget Top */}
                      <div className="px-6 py-5 flex justify-between items-center border-b border-neutral-200 gap-6">
                        <div className="flex items-center gap-3">
                          <div className="flex justify-center items-center flex-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#720e26" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="text-sm font-bold font-['Montserrat',sans-serif] text-[#090B10]">
                            {isEs ? "Panel de Anfitrión en Vivo" : "Live Host Dashboard"}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10.5px] font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                          Live Sync
                        </span>
                      </div>

                      {/* Widget Bottom */}
                      <div className="px-6 pt-6 pb-8 flex flex-col gap-4 font-['Montserrat']">
                        <div className="grid grid-cols-3 gap-2 pb-2 border-b border-neutral-100 text-center text-xs">
                          <div className="bg-[#FAF8F5] rounded-lg p-2 border border-neutral-200/60">
                            <span className="block text-[9.5px] text-neutral-500 uppercase tracking-wider font-semibold">
                              {isEs ? "Confirmados" : "Confirmed"}
                            </span>
                            <span className="text-sm font-bold text-emerald-700">142</span>
                          </div>
                          <div className="bg-[#FAF8F5] rounded-lg p-2 border border-neutral-200/60">
                            <span className="block text-[9.5px] text-neutral-500 uppercase tracking-wider font-semibold">
                              {isEs ? "Declinados" : "Declined"}
                            </span>
                            <span className="text-sm font-bold text-rose-700">8</span>
                          </div>
                          <div className="bg-[#FAF8F5] rounded-lg p-2 border border-neutral-200/60">
                            <span className="block text-[9.5px] text-neutral-500 uppercase tracking-wider font-semibold">
                              {isEs ? "Pendientes" : "Pending"}
                            </span>
                            <span className="text-sm font-bold text-amber-700">15</span>
                          </div>
                        </div>

                        {/* Item 1 */}
                        <div className="flex justify-between items-center w-full gap-4 text-xs">
                          <div>
                            <div className="font-bold text-[#090B10]">Familia Morales</div>
                            <div className="text-[10px] text-neutral-500">4 pases asignados</div>
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                            {isEs ? "✓ 4 Confirmados" : "✓ 4 Attending"}
                          </span>
                        </div>
                        <div className="bg-neutral-100 w-full h-px"/>

                        {/* Item 2 */}
                        <div className="flex justify-between items-center w-full gap-4 text-xs">
                          <div>
                            <div className="font-bold text-[#090B10]">Carlos &amp; Diana Mendoza</div>
                            <div className="text-[10px] text-neutral-500">2 pases asignados</div>
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                            {isEs ? "✕ No asisten" : "✕ Declined"}
                          </span>
                        </div>
                        <div className="bg-neutral-100 w-full h-px"/>

                        {/* Item 3 */}
                        <div className="flex justify-between items-center w-full gap-4 text-xs">
                          <div>
                            <div className="font-bold text-[#090B10]">Sofia Valenzuela</div>
                            <div className="text-[10px] text-neutral-500">1 pase asignado</div>
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                            {isEs ? "⏳ Pendiente" : "⏳ Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-6 justify-start items-start max-[767px]:gap-5">
                    <div className="flex flex-col gap-2 max-[767px]:gap-2">
                      <div className="font-['Montserrat',sans-serif] text-[0.75rem] leading-3 font-bold uppercase tracking-[0.08rem] text-[#720e26]">
                        <span className="text-[#090B10]/50">01 //</span> 03 · {isEs ? "Control de Aforo" : "Capacity"}
                      </div>
                      <h3 className="m-0 font-['Playfair_Display',serif] text-[1.875rem] leading-[2.375rem] font-bold tracking-[-0.02rem] max-[767px]:text-2xl text-[#090B10]">
                        {isEs ? "Control de Pases Familiares" : "Family Pass Allocation"}
                      </h3>
                    </div>
                    <p className="m-0 text-base leading-relaxed font-normal font-['Montserrat',sans-serif] text-[#090B10]">
                      {isEs ? (
                        <>
                          <strong className="text-[#090B10] font-semibold">Cero invitados no deseados:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            cada familia busca su apellido y confirma únicamente la cantidad de pases que tú decidiste otorgarles.
                          </span>
                        </>
                      ) : (
                        <>
                          <strong className="text-[#090B10] font-semibold">Zero surprise plus-ones:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            each family looks up their name and confirms only the exact seat count allotted to them.
                          </span>
                        </>
                      )}
                    </p>
                    <p className="m-0 text-base leading-relaxed font-normal font-['Montserrat',sans-serif] text-[#090B10]">
                      {isEs ? (
                        <>
                          <strong className="text-[#090B10] font-semibold">Ahorro real en recepción:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            Evita pagar por asientos vacíos o invitados sorpresa durante la cena de tu evento.
                          </span>
                        </>
                      ) : (
                        <>
                          <strong className="text-[#090B10] font-semibold">Real reception savings:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            Prevent paying for empty seats or surprise guests at your reception dinner.
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: RSVP por SMS */}
              {activeTab === 1 && (
                <div
                  className="grid grid-cols-2 gap-20 grid-rows-[auto] place-items-center max-w-[67.5rem] mx-auto max-[767px]:grid-cols-1 max-[767px]:gap-12"
                  style={{ alignItems: "center" }}
                >
                  {/* Widget */}
                  <div className="rounded-2xl border border-neutral-200 bg-[#FAF8F5] p-[3.25rem_2.5rem] relative overflow-hidden max-[479px]:p-[2.5rem_1.5rem] w-full shadow-sm">
                    <div className="relative z-[5] rounded-xl bg-[#FFFFFF] border border-neutral-200 w-full text-[#090B10] p-6 shadow-sm flex flex-col gap-4 font-['Montserrat']">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <span className="text-xs font-bold text-[#720e26] uppercase tracking-wider">SMS Directo</span>
                        <span className="text-[10px] text-neutral-400">{isEs ? "Confirmación automática" : "Automatic confirmation"}</span>
                      </div>
                      <div className="bg-[#FAF8F5] rounded-xl border border-neutral-200 p-4 text-xs leading-relaxed text-[#090B10]">
                        <p className="font-semibold text-neutral-800 mb-1">Click &amp; Love Notification</p>
                        <p>
                          {isEs
                            ? "Hola Familia Ramos, confirmaste 3 pases para la Boda."
                            : "Hi Ramos Family, you confirmed 3 passes for the Wedding."}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-block px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                            {isEs ? "Misa ↗" : "Ceremony ↗"}
                          </span>
                          <span className="inline-block px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                            {isEs ? "Salón ↗" : "Reception ↗"}
                          </span>
                        </div>
                        <p>{isEs ? "Te esperamos!" : "See you there!"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-6 justify-start items-start max-[767px]:gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="font-['Montserrat',sans-serif] text-[0.75rem] leading-3 font-bold uppercase tracking-[0.08rem] text-[#720e26]">
                        <span className="text-[#090B10]/50">02 //</span> 03 · {isEs ? "Apertura Inmediata" : "Instant"}
                      </div>
                      <h3 className="m-0 font-['Playfair_Display',serif] text-[1.875rem] leading-[2.375rem] font-bold tracking-[-0.02rem] max-[767px]:text-2xl text-[#090B10]">
                        {isEs ? "RSVP Instantáneo sin Apps ni Contraseñas" : "Instant RSVP Without Apps or Logins"}
                      </h3>
                    </div>
                    <p className="m-0 text-base leading-relaxed font-normal font-['Montserrat',sans-serif] text-[#090B10]">
                      {isEs ? (
                        <>
                          <strong className="text-[#090B10] font-semibold">Entrega inmediata:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            los mensajes de texto SMS se leen al instante, a diferencia de los correos que terminan en la carpeta de spam.
                          </span>
                        </>
                      ) : (
                        <>
                          <strong className="text-[#090B10] font-semibold">Instant delivery:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            native SMS text messages are seen immediately, unlike emails that get lost in spam folders.
                          </span>
                        </>
                      )}
                    </p>
                    <p className="m-0 text-base leading-relaxed font-normal font-['Montserrat',sans-serif] text-[#090B10]">
                      {isEs ? (
                        <>
                          <strong className="text-[#090B10] font-semibold">Confirmación con los enlaces:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            tus invitados reciben su confirmación por SMS con los enlaces a la misa y al salón, sin descargar nada.
                          </span>
                        </>
                      ) : (
                        <>
                          <strong className="text-[#090B10] font-semibold">Confirmation with the links:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            your guests get their confirmation by SMS with the links to the ceremony and the reception, nothing to download.
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Navegación GPS en 1 Toque */}
              {activeTab === 2 && (
                <div
                  className="grid grid-cols-2 gap-20 grid-rows-[auto] place-items-center max-w-[67.5rem] mx-auto max-[767px]:grid-cols-1 max-[767px]:gap-12"
                  style={{ alignItems: "center" }}
                >
                  {/* Widget */}
                  <div className="rounded-2xl border border-neutral-200 bg-[#FAF8F5] p-[3.25rem_2.5rem] relative overflow-hidden max-[479px]:p-[2.5rem_1.5rem] w-full shadow-sm">
                    <div className="relative z-[5] rounded-xl bg-[#FFFFFF] border border-neutral-200 w-full text-[#090B10] p-6 shadow-sm flex flex-col gap-4 font-['Montserrat']">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <span className="text-xs font-bold text-[#720e26] uppercase tracking-wider">
                          Google Maps Navigation
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold">1-Tap GPS</span>
                      </div>
                      <p className="text-xs text-neutral-600 font-medium">
                        {isEs
                          ? "Guía directa a los dos lugares del evento:"
                          : "Direct turn-by-turn guidance to both event venues:"}
                      </p>
                      <div className="flex flex-col gap-2.5">
                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-[#FAF8F5] hover:border-emerald-500 hover:bg-emerald-50/40 transition group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 text-xs font-bold text-[#090B10]">
                            <span className="text-base">📍</span>
                            <span>{isEs ? "Misa / Ceremonia" : "Church / Ceremony"}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                            {isEs ? "Abrir Ruta →" : "Open Route →"}
                          </span>
                        </a>

                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-[#FAF8F5] hover:border-emerald-500 hover:bg-emerald-50/40 transition group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 text-xs font-bold text-[#090B10]">
                            <span className="text-base">📍</span>
                            <span>{isEs ? "Recepción / Fiesta" : "Reception / Party"}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                            {isEs ? "Abrir Ruta →" : "Open Route →"}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-6 justify-start items-start max-[767px]:gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="font-['Montserrat',sans-serif] text-[0.75rem] leading-3 font-bold uppercase tracking-[0.08rem] text-[#720e26]">
                        <span className="text-[#090B10]/50">03 //</span> 03 · {isEs ? "Llegada en 1 Toque" : "1-Tap Arrival"}
                      </div>
                      <h3 className="m-0 font-['Playfair_Display',serif] text-[1.875rem] leading-[2.375rem] font-bold tracking-[-0.02rem] max-[767px]:text-2xl text-[#090B10]">
                        {isEs ? "Navegación GPS en 1 Toque" : "1-Tap Church & Reception Navigation"}
                      </h3>
                    </div>
                    <p className="m-0 text-base leading-relaxed font-normal font-['Montserrat',sans-serif] text-[#090B10]">
                      {isEs ? (
                        <>
                          <strong className="text-[#090B10] font-semibold">Misa y recepción sin desvíos:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            Tus invitados reciben enlaces directos a Google Maps para la ceremonia religiosa y el banquete. Evita llamadas de familiares perdidos en el tráfico y asegura que todos lleguen a tiempo a la entrada correcta.
                          </span>
                        </>
                      ) : (
                        <>
                          <strong className="text-[#090B10] font-semibold">Direct venue routing:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            Guests receive direct Google Maps links for both the religious ceremony and the party reception. Avoid frantic phone calls from relatives stuck in traffic and ensure everyone arrives right on time at the correct entrance.
                          </span>
                        </>
                      )}
                    </p>
                    <p className="m-0 text-base leading-relaxed font-normal font-['Montserrat',sans-serif] text-[#090B10]">
                      {isEs ? (
                        <>
                          <strong className="text-[#090B10] font-semibold">Cero estrés para el anfitrión:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            Tus invitados abren la ruta en su teléfono con un solo clic, permitiéndote disfrutar de tu maquillaje, sesión de fotos y entrada triunfal sin interrupciones.
                          </span>
                        </>
                      ) : (
                        <>
                          <strong className="text-[#090B10] font-semibold">Zero stress for the host:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            Guests open turn-by-turn navigation on their phones in 1 tap, so you can enjoy getting ready, taking photos, and celebrating without interruptions.
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceTabs;
