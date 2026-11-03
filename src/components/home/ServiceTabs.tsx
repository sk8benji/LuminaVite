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
            {/* Tab Menu */}
            <div className="flex mb-12 max-[767px]:flex-col max-[767px]:w-full max-[767px]:max-w-[25rem] max-[767px]:gap-3 max-[767px]:mb-8">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={[
                    "min-w-[15.31rem] px-4 pb-3 pt-0 border-b-2 flex justify-center items-center bg-transparent transition-colors duration-200 cursor-pointer",
                    "font-['Montserrat',sans-serif] text-base leading-6 font-semibold",
                    "max-[767px]:px-3 max-[767px]:pb-2 max-[767px]:min-w-0",
                    activeTab === i
                      ? "border-b-[#720e26] text-[#720e26]"
                      : "border-b-neutral-200 text-neutral-400 hover:text-neutral-700",
                  ].join(" ")}
                >
                  <div className="text-base leading-6 font-semibold font-['Montserrat',sans-serif]">{tab}</div>
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
                            <div className="text-[10px] text-neutral-500">4 pases asignados · Mesa #7</div>
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
                        {isEs ? "Control Estricto de Pases Familiares" : "Strict Family Pass Allocation"}
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
                          <strong className="text-[#090B10] font-semibold">Ahorro real en banquetes:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            evita pagar cientos de dólares en platillos desperdiciados o asientos vacíos con el salón de eventos.
                          </span>
                        </>
                      ) : (
                        <>
                          <strong className="text-[#090B10] font-semibold">Real catering savings:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            prevent spending hundreds of dollars on wasted meals or empty chairs at your ballroom.
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
                        <span className="text-[10px] text-neutral-400">98.4% Open Rate</span>
                      </div>
                      <div className="bg-[#FAF8F5] rounded-xl border border-neutral-200 p-4 text-xs leading-relaxed text-[#090B10]">
                        <p className="font-semibold text-neutral-800 mb-1">Click &amp; Love Notification</p>
                        <p>
                          {isEs
                            ? "¡Hola Familia Ramos! Confirmamos 3 pases para la Boda. Mesa #7 asignada. Tu pase y confirmación directa:"
                            : "Hi Ramos Family! 3 passes confirmed for the Wedding. Table #7 reserved. Your pass & direct link:"}
                        </p>
                        <div className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-[#720e26] text-white font-bold text-[11px]">
                          {isEs ? "Confirmar Asistencia" : "Confirm Attendance"}
                        </div>
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
                          <strong className="text-[#090B10] font-semibold">Tasa de apertura superior al 98%:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            los mensajes de texto SMS se leen al instante, a diferencia de los correos que terminan en la carpeta de spam.
                          </span>
                        </>
                      ) : (
                        <>
                          <strong className="text-[#090B10] font-semibold">98%+ open rate:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            native SMS text messages are seen immediately, unlike emails that get lost in spam folders.
                          </span>
                        </>
                      )}
                    </p>
                    <p className="m-0 text-base leading-relaxed font-normal font-['Montserrat',sans-serif] text-[#090B10]">
                      {isEs ? (
                        <>
                          <strong className="text-[#090B10] font-semibold">Recordatorio el día del evento:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            tus invitados reciben un aviso automático con el número de mesa y vestimenta para que nadie olvide asistir.
                          </span>
                        </>
                      ) : (
                        <>
                          <strong className="text-[#090B10] font-semibold">Day-of automated reminder:</strong>{" "}
                          <span className="text-[#090B10]/70">
                            guests receive their table assignment and dress code reminders on their phones automatically.
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
