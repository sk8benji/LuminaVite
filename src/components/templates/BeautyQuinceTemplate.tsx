"use client";

import React, { useState } from "react";
import { MapPin, Gift, Music, CalendarPlus, Sparkles } from "lucide-react";
import { InvitationData } from "../invitation/InvitationMobileView";
import { getTemplate } from "@/lib/templates";
import { getMapDirectionsUrl } from "@/lib/maps";
import {
  BEAUTY_QUINCE_ASSETS,
  resolveBeautyQuinceAssets,
  type BeautyQuinceArtOverrides,
} from "@/lib/templates/beautyQuinceAssets";
import AudioPlayer from "../invitation/AudioPlayer";
import RsvpSection from "../invitation/RsvpSection";
import TimelineSection from "../invitation/TimelineSection";
import AddToCalendarButton from "../invitation/AddToCalendarButton";

/**
 * Beauty Quince (réplica Canva "Beauty Quince Invitation", Jasmine).
 * El arte NO está regado por el JSX: todo sale de BEAUTY_QUINCE_ASSETS y
 * cualquier reemplazo guardado en la plantilla (arteBeautyQuince, desde el
 * admin) lo pisa sin tocar código. Las piezas decorativas se muestran con
 * object-contain, así que un reemplazo con otra proporción no se recorta
 * ni rompe la sección; los fondos y fotos usan object-cover.
 */
export default function BeautyQuinceTemplate({
  data,
  skipIntro = false,
}: {
  data: InvitationData;
  skipIntro?: boolean;
}) {
  const overrides = (data as unknown as { arteBeautyQuince?: BeautyQuinceArtOverrides })
    .arteBeautyQuince ||
    (data.configPlantilla as unknown as { arteBeautyQuince?: BeautyQuinceArtOverrides } | null)
      ?.arteBeautyQuince ||
    null;
  const A = resolveBeautyQuinceAssets(overrides);
  const template = getTemplate("BEAUTY_QUINCE");

  const [opened, setOpened] = useState(skipIntro);
  const [currentLang, setCurrentLang] = useState<"es" | "en">(
    data.idiomaDefault === "es" ? "es" : "en"
  );
  const isEn = currentLang === "en";

  const formattedDate =
    data.fechaTextoPersonalizada ||
    new Date(data.fechaEvento).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).toUpperCase();

  // Fecha del collage, dinámica del evento (no el 20XX del Canva).
  const eventDateObj = new Date(data.fechaEvento);
  const collageMonth = eventDateObj.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  const collageWeekday = eventDateObj.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const collageDay = eventDateObj.getDate();
  const collageYear = eventDateObj.getFullYear();
  const collageTime =
    "AT " + eventDateObj.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).toUpperCase();
  const addrParts = (data.recepcionDireccion || "123 Forever Street, Quince City").split(",");
  const addrStreet = addrParts[0].trim().toUpperCase();
  const addrCity = (addrParts.slice(1).join(",").trim() || "Quince City").toUpperCase();

  const handleOpen = (lang?: "es" | "en") => {
    if (lang) setCurrentLang(lang);
    if (typeof window !== "undefined" && data.reproducirMusicaAlAbrir !== false) {
      window.dispatchEvent(new CustomEvent("luminavite:play-audio"));
    }
    setOpened(true);
  };

  const portada = data.fotoPortadaUrl || A.fotoCarrozaAtardecer;
  const fotoVestido = data.fotoActualUrl || A.fotoVestidoManiqui;
  const fotoArreglo = data.fotoInfanciaUrl || A.fotoMaquillaje;
  const fotoCierre = data.fotoCierreUrl || A.arcoRosasCastillo;

  const poemaEn =
    "Fifteen candles softly glow,\nMarking how much love you know.\nA touch of a woman, a heart still so sweet,\nThe past and the future now dance at your feet.";
  const poemaEs =
    "Quince velas brillan con suavidad,\nmostrando cuánto amor hay de verdad.\nUn toque de mujer, un corazón tan dulce,\nel pasado y el futuro ya bailan a tus pies.";

  return (
    <div
      className="min-h-screen flex justify-center antialiased"
      style={{ backgroundColor: "#0A1E4A" }}
    >
      {/* Sobre de entrada, como el Canva: fondo cortina dorada, un solo
          sobre y dos botones de idioma. El sobre se recorta con
          object-cover en aspect 1.45 para quitar los márgenes blancos
          del archivo original (el sobre real mide 1.45:1, medido
          32..1087 x 196..922 en 1120x1120); tocar el sobre o un idioma abre. */}
      {!opened && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <img src={A.marcoCortinaDorada} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative h-full w-full max-w-[440px] mx-auto flex flex-col items-center justify-center px-5 py-8 text-center">
            <p className="font-script leading-[0.95] text-[64px]" style={{ color: "#2A2A9C" }}>
              You are
              <br />
              <span className="inline-block ml-8">Invited</span>
            </p>
            <button
              onClick={() => handleOpen()}
              aria-label="Abrir la invitación"
              className="w-full mt-10 cursor-pointer"
            >
              <div className="w-full aspect-[1.45] overflow-hidden shadow-2xl">
                <img src={A.sobreCerradoSello} alt="Sobre Beauty Quince" className="w-full h-full object-cover object-center scale-[1.03]" />
              </div>
            </button>
            <div className="mt-10 flex gap-3 justify-center">
              <button
                onClick={() => handleOpen("es")}
                className="px-7 py-3 rounded-full border border-[#C5A059] text-sm font-bold tracking-wide shadow-xl"
                style={{ backgroundColor: "#0A1E4A", color: "#E5C158" }}
              >
                Español
              </button>
              <button
                onClick={() => handleOpen("en")}
                className="px-7 py-3 rounded-full border border-[#C5A059] text-sm font-bold tracking-wide shadow-xl"
                style={{ backgroundColor: "#0A1E4A", color: "#E5C158" }}
              >
                English
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        className="w-full max-w-[440px] min-h-screen shadow-2xl relative overflow-hidden flex flex-col pb-12"
        style={{ backgroundColor: "#FDF6E3", color: "#12265A", fontFamily: template.fontBody }}
      >
        <AudioPlayer audioUrl={data.musicaUrl} template={template} />

        {/* Hero: efecto sobre abierto con tarjeta saliendo, 4 capas.
            Capa 1 solapa trasera dorada, capa 2 tarjeta, capa 3 bolsillo
            frontal azul en V (transparente arriba, la tarjeta asoma por
            la V), capa 4 rosas frontales. Solapa y bolsillo ya son
            transparentes (fondo blanco quitado), así que no sale cuadro. */}
        <section className="relative overflow-hidden">
          <img src={A.bibliotecaDorada} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative px-5 pt-10 pb-8 flex flex-col items-center">
            <div className="relative w-full max-w-[360px] h-[560px]">
              {/* Capa 1: solapa trasera abierta */}
              <img src={A.solapaSobreDorada} alt="" className="absolute bottom-0 left-0 w-full h-auto z-[1] pointer-events-none" />
              {/* Capa 2: tarjeta saliendo del sobre */}
              <div className="absolute left-1/2 bottom-[110px] w-[82%] aspect-[2/3] -translate-x-1/2 rotate-[-4deg] origin-bottom z-[2] shadow-2xl">
                <img src={A.cartaPapelCinta} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-[2] flex flex-col items-center text-center px-8 pt-[24%] pb-[16%]">
                  <h1 className="font-script text-5xl leading-none" style={{ color: "#2A2A9C" }}>{data.titulo}</h1>
                  <p className="font-script text-3xl leading-tight mt-1" style={{ color: "#2A2A9C" }}>
                    {data.subtitulo || "Quinceañera"}
                  </p>
                  <p className="font-serif-roman text-[11px] tracking-[0.15em] uppercase font-bold mt-4" style={{ color: "#2A2A9C" }}>
                    {formattedDate.replace(" AT ", " | ")}
                  </p>
                  <p className="text-[10px] leading-relaxed tracking-[0.08em] uppercase whitespace-pre-line mt-4" style={{ color: "#2A2A9C" }}>
                    {data.frasePersonalizada || (isEn ? poemaEn : poemaEs)}
                  </p>
                </div>
              </div>
              {/* Capa 3: bolsillo frontal en V, oculta la parte baja de la tarjeta */}
              <img src={A.sobreAzulAbierto} alt="" className="absolute bottom-0 left-0 w-full h-auto z-[3] pointer-events-none drop-shadow-xl" />
              {/* Capa 4: rosas frontales, rompen el marco por encima del bolsillo */}
              <div className="absolute right-[-10px] bottom-[140px] w-[110px] z-[4] pointer-events-none">
                <div className="relative w-[110px] h-[150px]">
                  <img src={A.rosaEncantada} alt="" className="absolute top-0 right-0 w-[80px] h-[80px] object-contain rotate-12 drop-shadow-xl" />
                  <img src={A.rosaEncantada} alt="" className="absolute top-[50px] left-0 w-[70px] h-[70px] object-contain -rotate-12 drop-shadow-xl" />
                  <img src={A.rosaEncantada} alt="" className="absolute bottom-0 right-[10px] w-[60px] h-[60px] object-contain rotate-6 drop-shadow-xl" />
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("luminavite:play-audio"));
                }
              }}
              aria-label={isEn ? "Play music" : "Reproducir música"}
              className="mt-6 relative w-36 h-36 rounded-full overflow-hidden shadow-2xl cursor-pointer"
            >
              <img src={A.discoMusica} alt="Disco de música" className="w-full h-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-12 h-12 rounded-full bg-white/85 flex items-center justify-center text-[#0A1E4A] text-xl pl-1">▶</span>
              </span>
            </button>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mt-3" style={{ color: "#12265A" }}>
              {isEn ? "Click to Play Music" : "Toca para escuchar"}
            </p>
          </div>
        </section>

        {/* Collage cinematográfico justo debajo del hero: cielo, foto
            con bordes rasgados y castillo con fecha/hora/dirección.
            La foto vestido-maniquí ya es transparente en sus bordes
            rasgados, así que cielo y castillo asoman por el corte.
            Se quitan la sección poema con corona/llave en cuadro blanco
            y el recuadro blanco del temporizador de esta zona (el poema
            ya está en la tarjeta del hero). */}
        <section className="relative w-full max-w-[430px] mx-auto overflow-hidden text-white" style={{ backgroundColor: "#030816", fontFamily: template.fontSubheading }}>
          {/* Nivel 1: cielo nocturno */}
          <div className="relative w-full h-[140px] z-[1]">
            <img src={A.castilloLuna} alt="Cielo nocturno" className="w-full h-full object-cover object-top block" />
            <div
              className="absolute left-0 bottom-[-1px] w-full h-[40px] z-[4] pointer-events-none"
              style={{
                backgroundRepeat: "repeat-x",
                backgroundSize: "contain",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,120 C200,30 450,110 700,20 C950,110 1100,50 1200,80 L1200,120 L0,120 Z' fill='%23030816'/%3E%3C/svg%3E")`,
              }}
            />
          </div>
          {/* Nivel 2: foto central, entre los dos cortes rasgados */}
          <div className="relative w-full -mt-[25px] z-[2]">
            <img src={A.fotoVestidoManiqui} alt="Quinceañera y vestido" className="w-full h-auto block" />
          </div>
          {/* Nivel 3: castillo con textos del evento */}
          <div className="relative w-full min-h-[480px] -mt-[30px] z-[3]">
            <div
              className="absolute left-0 top-[-1px] w-full h-[40px] z-[4] pointer-events-none"
              style={{
                backgroundRepeat: "repeat-x",
                backgroundSize: "contain",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0 C150,90 350,-40 500,60 C650,140 900,10 1200,40 L1200,0 L0,0 Z' fill='%23030816'/%3E%3C/svg%3E")`,
              }}
            />
            <img src={A.castilloLuna} alt="Castillo de noche" className="absolute inset-0 w-full h-full object-cover object-bottom block" />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 pt-10 pb-[100px]"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.7)" }}
            >
              <span className="text-[1.3rem] tracking-[0.35em] font-semibold mb-2">{collageMonth}</span>
              <div className="flex items-center justify-center gap-4 w-full my-1.5">
                <span className="text-[0.95rem] tracking-[0.2em] font-medium">{collageWeekday}</span>
                <span className="font-script text-[3.2rem] leading-none" style={{ color: "#f7d070" }}>{collageDay}</span>
                <span className="text-[0.95rem] tracking-[0.2em] font-medium">{collageTime}</span>
              </div>
              <span className="text-[1.1rem] tracking-[0.4em] mb-6">{collageYear}</span>
              <div className="text-[0.8rem] tracking-[0.25em] leading-relaxed opacity-90">
                <p>{addrStreet}</p>
                <p>{addrCity}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fotos: vestido y arreglo */}
        <section className="px-6 py-8 text-center">
          <h2 className="font-script text-5xl text-[#A6192E]">{isEn ? "A Dream Come True" : "Un Sueño Hecho Realidad"}</h2>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <img src={fotoVestido} alt="Vestido" className="w-full h-56 object-cover rounded-2xl shadow" />
            <img src={fotoArreglo} alt="Arreglo" className="w-full h-56 object-cover rounded-2xl shadow" />
          </div>
          <img src={A.vestidoBella} alt="Vestido Bella" className="w-40 h-40 object-contain mx-auto mt-4" />
          <img src={A.carroza} alt="Carroza" className="w-48 h-48 object-contain mx-auto -mt-2" />
        </section>

        {/* Fecha y lugar */}
        <section className="relative px-6 py-10 text-center overflow-hidden">
          <img src={A.bibliotecaAzul} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="relative">
            <h2 className="font-script text-5xl text-[#A6192E]">{isEn ? "When & Where" : "Fecha y Lugar"}</h2>
            <p className="font-serif-roman tracking-[0.2em] uppercase text-sm mt-3 font-bold">{formattedDate}</p>
            {data.ceremoniaNombre && (
              <div className="mt-5">
                <p className="text-xs tracking-[0.25em] uppercase font-bold text-[#C5A059]">{isEn ? "Church Ceremony" : "Ceremonia"}</p>
                <p className="font-serif-roman text-lg">{data.ceremoniaNombre}</p>
                {data.ceremoniaDireccion && <p className="text-sm opacity-80">{data.ceremoniaDireccion}</p>}
                {data.ceremoniaMapUrl && (
                  <a href={getMapDirectionsUrl(data.ceremoniaMapUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-[#A6192E] mt-1">
                    <MapPin className="w-4 h-4" /> {isEn ? "Directions" : "Cómo llegar"}
                  </a>
                )}
              </div>
            )}
            <div className="mt-5">
              <p className="text-xs tracking-[0.25em] uppercase font-bold text-[#C5A059]">{isEn ? "Reception" : "Recepción"}</p>
              <p className="font-serif-roman text-lg">{data.recepcionNombre}</p>
              <p className="text-sm opacity-80">{data.recepcionDireccion}</p>
              <a href={getMapDirectionsUrl(data.recepcionMapUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-[#A6192E] mt-1">
                <MapPin className="w-4 h-4" /> {isEn ? "Directions" : "Cómo llegar"}
              </a>
            </div>
            <img src={portada} alt="Portada" className="w-full h-72 object-cover rounded-2xl shadow mt-6" />
            <img src={A.puertasPalacio} alt="Puertas del palacio" className="w-full h-72 object-cover rounded-2xl shadow mt-3" />
          </div>
        </section>

        {/* Party Plan / Itinerario */}
        <section className="px-4 py-8">
          <TimelineSection items={data.itinerarioJson as never} template={template} isEn={isEn} />
          <div className="flex justify-center gap-4 mt-2">
            <img src={A.copaBrindis} alt="Brindis" className="w-16 h-16 object-contain" />
            <img src={A.candelabro} alt="Candelabro" className="w-16 h-16 object-contain" />
            <img src={A.zapatoOro} alt="Zapato" className="w-16 h-16 object-contain" />
          </div>
        </section>

        {/* Kids Policy: texto tal cual del Canva original */}
        <section className="px-6 py-10 text-center">
          <img src={A.marcoAzulRosas} alt="" className="w-full h-64 object-cover rounded-2xl shadow" />
          <h2 className="font-script text-5xl text-[#A6192E] mt-4">{isEn ? "Kids Policy" : "Niños"}</h2>
          <p className="text-sm leading-relaxed mt-3">
            {isEn
              ? "We absolutely love and welcome children to celebrate this special day with us. To help keep certain moments safe and uninterrupted, we kindly ask that all children remain seated and supervised during important dances — especially the Father & Daughter Dance and any formal performances. Please ensure children do not enter the dance floor during these times. Thank you for your understanding and cooperation in making this celebration beautiful for everyone."
              : "Amamos y damos la bienvenida a los niños en este día tan especial. Para que ciertos momentos sean seguros y sin interrupciones, les pedimos amablemente que los niños permanezcan sentados y supervisados durante los bailes importantes, especialmente el baile de padre e hija y las presentaciones formales. Por favor, que no entren a la pista en esos momentos. Gracias por ayudarnos a que esta celebración sea hermosa para todos."}
          </p>
          <p className="text-xs mt-3 opacity-70">{isEn ? "Bring comfy shoes." : "Trae zapatos cómodos."}</p>
          <img src={A.cartaPapelCinta} alt="Papel carta" className="w-full h-64 object-cover rounded-2xl shadow mt-4" />
        </section>

        {/* Dress code + detalles */}
        {data.mostrarDressCode !== false && (
          <section className="px-6 py-8 text-center">
            <img src={A.trajePrincipe} alt="Traje" className="w-32 h-32 object-contain mx-auto" />
            <h2 className="font-script text-5xl text-[#A6192E]">{data.dressCodeTitulo || (isEn ? "Dress Code" : "Código de Vestimenta")}</h2>
            {data.dressCodeNota && <p className="text-sm mt-2">{isEn ? data.dressCodeNotaEn || data.dressCodeNota : data.dressCodeNota}</p>}
            {data.coloresReservados && data.coloresReservados.length > 0 && (
              <div className="flex justify-center gap-2 mt-3">
                {data.coloresReservados.map((c) => (
                  <span key={c} className="w-8 h-8 rounded-full border border-black/10 inline-block" style={{ backgroundColor: c }} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Registry / Regalos */}
        {data.mostrarMesaRegalos !== false && (
          <section className="relative px-6 py-10 text-center overflow-hidden">
            <img src={A.marcoCremaEsquinas} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="relative">
            <Gift className="w-8 h-8 mx-auto text-[#C5A059]" />
            <h2 className="font-script text-5xl text-[#A6192E] mt-2">{isEn ? "Registry" : "Mesa de Regalos"}</h2>
            <p className="text-sm leading-relaxed mt-3">
              {data.regalosMensaje ||
                (isEn
                  ? "The biggest gift I could ask for is for you to join me to celebrate my quinceañera. However, if you wish to bring a present, I will be leaving a registry list here. Thank you so much!"
                  : "El regalo más grande que puedo pedir es que me acompañes a celebrar mis quince años. Si deseas traer un presente, aquí dejaré mi lista de regalos. ¡Muchas gracias!")}
            </p>
            <img src={A.libroCuento} alt="Libro de cuento" className="w-32 h-32 object-contain mx-auto mt-3" />
            {data.wishlistUrl && (
              <a href={data.wishlistUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 px-6 py-3 rounded-full text-sm font-bold" style={{ backgroundColor: "#0A1E4A", color: "#fff" }}>
                {isEn ? "View Registry" : "Ver Mesa de Regalos"}
              </a>
            )}
            </div>
          </section>
        )}

        {/* RSVP */}
        <section className="px-4 py-6">
          <RsvpSection
            eventoId={data.id}
            eventoTitulo={data.titulo}
            telefonoWhatsapp={data.telefonoWhatsappRsvp}
            maxPases={data.maxPasesPorInvitado ?? 4}
            fechaLimite={data.fechaLimiteRsvp || data.rsvpFechaLimite}
            template={template}
            permitirConfirmacionTelefono={data.permitirConfirmacionTelefono}
            isEn={isEn}
          />
        </section>

        {/* Cierre */}
        <section className="px-6 py-10 text-center">
          <img src={A.rosaCampana} alt="Rosa en campana" className="w-40 h-40 object-contain mx-auto" />
          <img src={A.marcoCortinaDorada} alt="Marco cortina dorada" className="w-full h-64 object-cover rounded-2xl shadow mt-2" />
          <img src={A.destellosDorados} alt="Destellos dorados" className="w-full h-32 object-contain mt-2" />
          <img src={A.brilloDoradoMarco} alt="Brillo dorado" className="w-full h-32 object-contain" />
          <img src={fotoCierre} alt="Cierre" className="w-full h-72 object-cover rounded-2xl shadow mt-2" />
          <h2 className="font-script text-5xl text-[#A6192E] mt-5">{isEn ? "See you soon!" : "¡Te esperamos!"}</h2>
          {data.mensajeDespedida && <p className="text-sm mt-2">{data.mensajeDespedida}</p>}
          <div className="mt-5 flex flex-col items-center gap-3">
            <AddToCalendarButton
              titulo={`${data.titulo} - ${data.subtitulo || "Quinceañera"}`}
              ubicacion={data.recepcionDireccion}
              fechaEvento={data.fechaEvento}
              template={template}
            />
            <span className="inline-flex items-center gap-1 text-xs opacity-70"><CalendarPlus className="w-4 h-4" /> {isEn ? "Save the date" : "Guarda la fecha"}</span>
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <img src={A.espejoMano} alt="Espejo" className="w-14 h-14 object-contain" />
            <img src={A.abanico} alt="Abanico" className="w-14 h-14 object-contain" />
            <img src={A.castillo} alt="Castillo" className="w-14 h-14 object-contain" />
          </div>
          <p className="text-[11px] tracking-widest uppercase opacity-50 mt-6 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" /> Beauty Quince <Music className="w-3 h-3" />
          </p>
        </section>
      </main>
    </div>
  );
}
