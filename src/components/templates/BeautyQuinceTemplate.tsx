"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Gift, CalendarPlus } from "lucide-react";
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
  // Countdown del Canva: dígitos sin recuadros, sobre el fondo del palacio.
  const [timeLeft, setTimeLeft] = useState({ days: "000", hours: "00", minutes: "00", seconds: "00" });
  useEffect(() => {
    const target = new Date(data.fechaEvento).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const pad = (n: number, l = 2) => String(n).padStart(l, "0");
      setTimeLeft({
        days: pad(Math.floor(diff / 86400000), 3),
        hours: pad(Math.floor(diff / 3600000) % 24),
        minutes: pad(Math.floor(diff / 60000) % 60),
        seconds: pad(Math.floor(diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data.fechaEvento]);

  // Mapa de recepción: embed sin API key. Si el link guardado ya trae
  // ?q=, se le agrega output=embed; si es un goo.gl corto, se busca por
  // nombre + dirección. La dirección del demo es ficticia, así que el mapa
  // muestra la búsqueda, no una ficha exacta.
  const mapEmbedUrl =
    data.recepcionMapUrl && data.recepcionMapUrl.includes("?q=")
      ? `${data.recepcionMapUrl}&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(
          `${data.recepcionNombre || ""} ${data.recepcionDireccion || ""}`.trim()
        )}&output=embed`;

  // Botones de cierre: Google Calendar + .ics (Apple/Outlook), con el
  // mismo formato que AddToCalendarButton, pero en botones oscuros con
  // borde dorado para que vivan dentro del arco nocturno.
  const calStart = new Date(data.fechaEvento);
  const calEnd = new Date(calStart.getTime() + 6 * 60 * 60 * 1000);
  const calIso = (d: Date) => d.toISOString().replace(/-|:|\.\d\d/g, "");
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${data.titulo} - ${data.subtitulo || "Quinceañera"}`
  )}&dates=${calIso(calStart)}/${calIso(calEnd)}&details=${encodeURIComponent(
    "¡Acompáñanos a celebrar este gran momento!"
  )}&location=${encodeURIComponent(data.recepcionDireccion || "")}`;
  const handleDownloadIcs = () => {
    if (typeof window === "undefined") return;
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//LuminaVite//Invitaciones Digitales//ES\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nSUMMARY:${data.titulo} - ${data.subtitulo || "Quinceañera"}\nDESCRIPTION:¡Acompáñanos a celebrar este gran momento!\nLOCATION:${data.recepcionDireccion || ""}\nDTSTART:${calIso(calStart)}\nDTEND:${calIso(calEnd)}\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${data.titulo.replace(/[^a-zA-Z0-9]/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const poemaEn =
    "Fifteen candles softly glow,\nMarking how much love you know.\nA touch of a woman, a heart still so sweet,\nThe past and the future now dance at your feet.";
  const poemaEs =
    "Quince velas brillan con suavidad,\nmostrando cuánto amor hay de verdad.\nUn toque de mujer, un corazón tan dulce,\nel pasado y el futuro ya bailan a tus pies.";

  return (
    <div
      className="min-h-screen flex justify-center antialiased"
      style={{ backgroundColor: "#0A1E4A" }}
    >
      {/* Sin fondos blancos en sobre, tarjeta y rosas, en tema claro u
          oscuro: contenedores e imágenes transparentes. No se aplica a
          botones (los de idioma pierden su fondo azul y quedan ilegibles
          sobre dorado si se usa *). No se usa next/image aquí, solo
          <img>, así que ninguna optimización quita el canal alfa. */}
      <style>{`
        .envelope-container, .envelope-wrapper, .rose-item, .card-letter img, .envelope-container img {
          background: transparent !important;
          background-color: transparent !important;
        }
        .envelope-wrapper { background: none !important; }
        .venue-map-card:hover iframe { filter: sepia(15%) contrast(100%) brightness(100%); }
        @media (prefers-color-scheme: light), (prefers-color-scheme: dark) {
          .envelope-container, .envelope-wrapper, .rose-item, .card-letter img, .envelope-container img {
            background: transparent !important;
            background-color: transparent !important;
          }
        }
      `}</style>
      {/* Sobre de entrada, como el Canva: fondo cortina dorada, un solo
          sobre y dos botones de idioma. El sobre se recorta con
          object-cover en aspect 1.45 para quitar los márgenes blancos
          del archivo original (el sobre real mide 1.45:1, medido
          32..1087 x 196..922 en 1120x1120); tocar el sobre o un idioma abre. */}
      {!opened && (
        <div className="envelope-wrapper envelope-container fixed inset-0 z-50 overflow-hidden bg-transparent" style={{ background: "transparent" }}>
          <img src={A.marcoCortinaDorada} alt="" className="absolute inset-0 w-full h-full object-cover bg-transparent" />
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
              <div className="w-full aspect-[1.45] overflow-hidden drop-shadow-2xl bg-transparent">
                <img src={A.sobreCerradoSello} alt="Sobre Beauty Quince" className="w-full h-full object-cover object-center scale-[1.03] bg-transparent" style={{ background: "transparent" }} />
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
          <img src={A.bibliotecaDorada} alt="" className="absolute inset-0 w-full h-full object-cover bg-transparent" />
          <div className="relative px-5 pt-10 pb-8 flex flex-col items-center">
            <div className="envelope-container envelope-wrapper relative w-full max-w-[360px] h-[560px] bg-transparent" style={{ background: "transparent" }}>
              {/* Capa 1: solapa trasera abierta */}
              <img src={A.solapaSobreDorada} alt="" className="absolute bottom-0 left-0 w-full h-auto z-[1] pointer-events-none bg-transparent" style={{ background: "transparent" }} />
              {/* Capa 2: tarjeta saliendo del sobre */}
              <div className="card-letter absolute left-1/2 bottom-[110px] w-[82%] aspect-[2/3] -translate-x-1/2 rotate-[-4deg] origin-bottom z-[2] drop-shadow-xl bg-transparent" style={{ background: "transparent" }}>
                <img src={A.cartaPapelCinta} alt="" className="absolute inset-0 w-full h-full object-cover bg-transparent" />
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
              <img src={A.sobreAzulAbierto} alt="" className="absolute bottom-0 left-0 w-full h-auto z-[3] pointer-events-none drop-shadow-xl bg-transparent" style={{ background: "transparent" }} />
              {/* Capa 4: rosas frontales, rompen el marco por encima del bolsillo */}
              <div className="rose-item absolute right-[-10px] bottom-[140px] w-[110px] z-[4] pointer-events-none bg-transparent" style={{ background: "transparent" }}>
                <div className="relative w-[110px] h-[150px] bg-transparent" style={{ background: "transparent" }}>
                  <img src={A.rosaEncantada} alt="" className="rose-item absolute top-0 right-0 w-[80px] h-[80px] object-contain rotate-12 drop-shadow-xl bg-transparent" style={{ background: "transparent" }} />
                  <img src={A.rosaEncantada} alt="" className="rose-item absolute top-[50px] left-0 w-[70px] h-[70px] object-contain -rotate-12 drop-shadow-xl bg-transparent" style={{ background: "transparent" }} />
                  <img src={A.rosaEncantada} alt="" className="rose-item absolute bottom-0 right-[10px] w-[60px] h-[60px] object-contain rotate-6 drop-shadow-xl bg-transparent" style={{ background: "transparent" }} />
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
              className="mt-6 relative w-36 h-36 rounded-full overflow-hidden drop-shadow-xl cursor-pointer bg-transparent"
              style={{ background: "transparent" }}
            >
              <img src={A.discoMusica} alt="Disco de música" className="w-full h-full object-cover bg-transparent" style={{ background: "transparent" }} />
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
        <section className="relative w-full max-w-[430px] mx-auto overflow-hidden text-white" style={{ backgroundColor: "#0b1736", fontFamily: template.fontSubheading }}>
          {/* Nivel 1: cielo nocturno */}
          <div className="relative w-full h-[140px] z-[1]">
            <img src={A.castilloLuna} alt="Cielo nocturno" className="w-full h-full object-cover object-top block bg-transparent" />
            <div
              className="absolute left-0 bottom-[-1px] w-full h-[40px] z-[4] pointer-events-none"
              style={{
                backgroundRepeat: "repeat-x",
                backgroundSize: "contain",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,120 C200,30 450,110 700,20 C950,110 1100,50 1200,80 L1200,120 L0,120 Z' fill='%230b1736'/%3E%3C/svg%3E")`,
              }}
            />
          </div>
          {/* Nivel 2: foto central, entre los dos cortes rasgados */}
          <div className="relative w-full -mt-[25px] z-[2]">
            <img src={A.fotoVestidoManiqui} alt="Quinceañera y vestido" className="w-full h-auto block bg-transparent" />
          </div>
          {/* Nivel 3: castillo con textos del evento */}
          <div className="relative w-full min-h-[480px] -mt-[35px] z-[3]">
            <div
              className="absolute left-0 top-[-1px] w-full h-[40px] z-[4] pointer-events-none"
              style={{
                backgroundRepeat: "repeat-x",
                backgroundSize: "contain",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0 C150,90 350,-40 500,60 C650,140 900,10 1200,40 L1200,0 L0,0 Z' fill='%230c1d3f'/%3E%3C/svg%3E")`,
              }}
            />
            <img src={A.castilloLuna} alt="Castillo de noche" className="absolute inset-0 w-full h-full object-cover object-bottom block bg-transparent" />
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

        {/* Countdown integrado en imagen de fondo: se quita la sección
            beige con tarjetas y vestido/carroza sueltos. Fondo palacio
            (puertas-palacio: columnas doradas, paneles azules, candil),
            título COUNTDOWN TO party y dígitos sin recuadros blancos,
            foto de preparación con corte rasgado, base floral dorada. */}
        <section className="relative w-full max-w-[430px] mx-auto overflow-hidden flex flex-col justify-between items-center" style={{ minHeight: "780px", padding: "50px 16px 20px", boxSizing: "border-box", background: "transparent" }}>
          <div className="absolute inset-0 z-[1]">
            <img src={A.puertasPalacio} alt="Fondo de palacio" className="w-full h-full object-cover bg-transparent" style={{ background: "transparent" }} />
          </div>
          <div className="relative z-[3] w-full text-center" style={{ marginBottom: "20px", background: "transparent" }}>
            <div className="flex items-baseline justify-center" style={{ gap: "10px", marginBottom: "12px" }}>
              <span className="font-serif-roman font-bold" style={{ fontSize: "1.15rem", letterSpacing: "0.3em", color: "#1a365d" }}>COUNTDOWN TO</span>
              <span className="font-script" style={{ fontSize: "2.8rem", color: "#1e3a8a", lineHeight: 0.8 }}>party</span>
            </div>
            <div className="inline-flex items-start justify-center" style={{ gap: "8px", background: "transparent", padding: 0, margin: "0 auto" }}>
              {[
                { v: timeLeft.days, tag: "DAYS" },
                { v: timeLeft.hours, tag: "HOURS" },
                { v: timeLeft.minutes, tag: "MINUTES" },
                { v: timeLeft.seconds, tag: "SECONDS", highlight: true },
              ].map((u, i) => (
                <React.Fragment key={u.tag}>
                  {i > 0 && <span className="font-serif-roman" style={{ fontSize: "1.8rem", lineHeight: 1, color: "#1e3a8a", marginTop: "2px", opacity: 0.8 }}>:</span>}
                  <div className="flex flex-col items-center" style={{ minWidth: "44px" }}>
                    <span className="font-serif-roman" style={{ fontSize: "2.1rem", fontWeight: 500, lineHeight: 1, color: u.highlight ? "#991b1b" : "#1e3a8a", textShadow: "0 0 12px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.2)" }}>{u.v}</span>
                    <span className="font-serif-roman uppercase" style={{ fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.15em", color: "#2b4c7e", marginTop: "6px" }}>{u.tag}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="relative z-[2] w-[90%] mx-auto overflow-hidden" style={{ borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", background: "transparent" }}>
            <img src={A.fotoMaquillajeRasgado} alt="Preparación Quinceañera" className="w-full h-auto block bg-transparent" style={{ background: "transparent" }} />
          </div>
          <div className="relative z-[3] w-full bg-transparent" style={{ marginTop: "15px", background: "transparent" }}>
            <img src={A.baseFloralRosas} alt="Decoración floral" className="w-full h-auto block bg-transparent" style={{ background: "transparent" }} />
          </div>
        </section>

        {/* Fecha y lugar */}
        <section className="relative px-6 py-10 text-center overflow-hidden">
          <img src={A.bibliotecaAzul} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 bg-transparent" />
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
            <img src={portada} alt="Portada" className="w-full h-[260px] object-cover rounded-[18px] shadow mt-6 mb-[18px] bg-transparent" />
            {/* Mapa interactivo en lugar del bloque inferior vacío, con
                filtro dorado/pergamino/azul noche (sin API de Maps). */}
            <div className="venue-map-card w-full overflow-hidden" style={{ height: "270px", borderRadius: "18px", border: "1px solid #d4af37", boxShadow: "0 8px 24px rgba(11,23,54,0.35), inset 0 0 15px rgba(212,175,55,0.2)", backgroundColor: "#0b1736", marginBottom: "24px" }}>
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", filter: "sepia(35%) hue-rotate(5deg) contrast(105%) brightness(95%)", transition: "filter 0.3s ease" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={data.recepcionNombre || "Mapa de la recepción"}
              />
            </div>
            <a
              href={getMapDirectionsUrl(data.recepcionMapUrl)}
              target="_blank"
              rel="noreferrer"
              className="font-serif-roman flex items-center justify-center w-full mx-auto"
              style={{ maxWidth: "280px", padding: "14px 20px", backgroundColor: "#0b1736", color: "#ffffff", fontSize: "0.9rem", letterSpacing: "0.15em", textDecoration: "none", borderRadius: "12px", border: "1px solid rgba(255,215,0,0.3)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
            >
              {isEn ? "Directions" : "Cómo llegar"}
            </a>
          </div>
        </section>

        {/* Party Plan: timeline central alternado en pergamino, como el
            Canva. Sin lista simple, sin tarjetas blancas, sin iconos
            sueltos al fondo. Los 8 momentos son los del Canva (no el
            itinerario genérico de 5 eventos); los iconos ya son
            transparentes, sin recuadro blanco. Marco floral: no existe
            un marco pergamino-rosas en el set, así que arriba y abajo
            va la base floral dorada con rosas sobre pergamino #f7eed7. */}
        <section className="relative w-full max-w-[430px] mx-auto overflow-hidden" style={{ boxSizing: "border-box", backgroundColor: "#f7eed7" }}>
          <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: "90px" }}>
            <img src={A.baseFloralRosas} alt="Marco dorado superior" className="absolute inset-0 w-full h-full object-cover pointer-events-none bg-transparent" style={{ zIndex: 1, background: "transparent" }} />
            <h2 className="font-script relative text-center" style={{ zIndex: 2, fontSize: "3.4rem", color: "#8c1d28", textShadow: "0 1px 4px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.25)", margin: 0, padding: "0 40px", lineHeight: 1 }}>The Party Plan</h2>
          </div>
          <div className="relative z-[2] w-full flex flex-col items-center" style={{ padding: "30px 24px" }}>
            <div className="relative w-full" style={{ padding: "10px 0 20px" }}>
              <div className="absolute top-0 bottom-0" style={{ left: "50%", width: "2px", background: "linear-gradient(180deg, #d4af37 0%, #a88338 100%)", transform: "translateX(-50%)", zIndex: 1 }} />
              {[
                { side: "right", time: "11:00 AM", name: "CHURCH CEREMONY", icon: A.castillo, alt: "Ceremonia" },
                { side: "left", time: "12:00 PM", name: "LIMO ARRIVAL", icon: A.carroza, alt: "Llegada" },
                { side: "right", time: "1:00 PM", name: "ARRIVAL TO SALON", icon: A.rosaCampana, alt: "Recepción" },
                { side: "left", time: "3:00 PM", name: "FOOD SERVED", icon: A.copaBrindis, alt: "Banquete" },
                { side: "right", time: "4:00 PM", name: "VALS, BAILE SORPRESA", icon: A.vestidoBella, alt: "Vals" },
                { side: "left", time: "5:00 PM", name: "FATHER & DAUGHTER DANCE", icon: A.trajePrincipe, alt: "Baile papá" },
                { side: "right", time: "6:00 PM", name: "PADRINOS DE HONOR", icon: A.corona, alt: "Padrinos" },
                { side: "left", time: "7:00 PM", name: "BAILE STARTS", icon: A.abanico, alt: "Fiesta" },
              ].map((e) => (
                <div
                  key={e.time}
                  className="flex items-center relative"
                  style={{
                    width: "100%",
                    minHeight: "70px",
                    marginBottom: "24px",
                    zIndex: 2,
                    boxSizing: "border-box",
                    justifyContent: e.side === "left" ? "flex-start" : "flex-end",
                  }}
                >
                  <div className="absolute flex items-center justify-center" style={{ left: "50%", transform: "translateX(-50%)", width: "42px", height: "42px", backgroundColor: "#f7eed7", borderRadius: "50%", padding: "4px" }}>
                    <img src={e.icon} alt={e.alt} className="bg-transparent" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.2))", background: "transparent" }} />
                  </div>
                  <div className="flex flex-col" style={{ width: "calc(50% - 32px)", textAlign: e.side === "left" ? "right" : "left" }}>
                    <span className="font-serif-roman" style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em", color: "#a81c1c", marginBottom: "4px" }}>{e.time}</span>
                    <span className="font-serif-roman" style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", color: "#1e293b", lineHeight: 1.3 }}>{e.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: "90px" }}>
            <img src={A.baseFloralRosas} alt="Marco dorado inferior" className="absolute inset-0 w-full h-full object-cover pointer-events-none bg-transparent" style={{ zIndex: 1, background: "transparent" }} />
            <div className="relative flex items-center justify-center" style={{ zIndex: 2, gap: "12px", padding: "0 30px" }}>
              <img src={A.zapatoOro} alt="Zapatilla" className="block bg-transparent" style={{ width: "45px", height: "auto", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))", background: "transparent" }} />
              <span className="font-script" style={{ fontSize: "2.3rem", color: "#1e293b", textShadow: "0 1px 3px rgba(255,255,255,0.7)", whiteSpace: "nowrap", lineHeight: 1 }}>Bring Comfy Shoes</span>
            </div>
          </div>
        </section>

        {/* Kids Policy: marco en 3 partes con altura extensible, no una
            imagen fija. Rosas superiores e inferiores fijas en los
            bordes, cuerpo azul noche que crece con el texto, así el
            último párrafo ya no choca con las rosas inferiores. */}
        <section className="flex justify-center items-center w-full max-w-[430px] mx-auto" style={{ padding: "24px 16px", boxSizing: "border-box" }}>
          <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ border: "2px solid #d4af37", borderRadius: "20px", backgroundColor: "#0b1736", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}>
            <img src={A.marcoAzulSuperior} alt="" className="absolute top-0 left-0 right-0 w-full pointer-events-none" style={{ height: "90px", objectFit: "cover", objectPosition: "top center", zIndex: 1 }} />
            <img src={A.marcoAzulInferior} alt="" className="absolute bottom-0 left-0 right-0 w-full pointer-events-none" style={{ height: "90px", objectFit: "cover", objectPosition: "bottom center", zIndex: 1 }} />
            <div className="relative w-full text-center" style={{ zIndex: 2, padding: "80px 28px 70px", color: "#f8fafc", boxSizing: "border-box" }}>
              <span className="font-script block" style={{ fontSize: "2.6rem", lineHeight: 0.9, color: "#f7d070", textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>{isEn ? "Important" : "Importante"}</span>
              <h2 className="font-serif-roman font-bold" style={{ fontSize: "1.4rem", letterSpacing: "0.28em", color: "#ffffff", margin: "4px 0 10px", textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>DETAILS</h2>
              <h3 className="font-serif-roman" style={{ fontSize: "1.25rem", color: "#fde68a", marginBottom: "16px", fontWeight: 500 }}>{isEn ? "Kids Policy" : "Política para Niños"}</h3>
              <p style={{ fontSize: "0.78rem", lineHeight: 1.55, color: "#e2e8f0", marginBottom: "12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                {isEn
                  ? "We absolutely love and welcome children to celebrate this special day with us."
                  : "Amamos y damos la bienvenida a los niños en este día tan especial."}
              </p>
              <p style={{ fontSize: "0.78rem", lineHeight: 1.55, color: "#e2e8f0", marginBottom: "12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                {isEn
                  ? "To help keep certain moments safe and uninterrupted, we kindly ask that all children remain seated and supervised during important dances — especially the Father & Daughter Dance and any formal performances."
                  : "Para que ciertos momentos sean seguros y sin interrupciones, les pedimos amablemente que los niños permanezcan sentados y supervisados durante los bailes importantes, especialmente el baile de padre e hija y las presentaciones formales."}
              </p>
              <p style={{ fontSize: "0.78rem", lineHeight: 1.55, color: "#e2e8f0", marginBottom: "12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                {isEn
                  ? "For everyone's safety and to preserve these meaningful moments:"
                  : "Para la seguridad de todos y para preservar estos momentos significativos:"}
              </p>
              <ul className="text-left" style={{ listStyle: "none", padding: 0, margin: "12px 0 16px" }}>
                {(isEn
                  ? [
                      "Please ensure children do not enter the dance floor during these times",
                      "Children should remain seated and under adult supervision",
                      "We appreciate your help in keeping the space clear and safe",
                    ]
                  : [
                      "Por favor, que los niños no entren a la pista durante esos momentos",
                      "Los niños deben permanecer sentados y bajo supervisión de un adulto",
                      "Agradecemos su ayuda para mantener el espacio despejado y seguro",
                    ]
                ).map((b) => (
                  <li key={b} className="relative" style={{ paddingLeft: "20px", fontSize: "0.75rem", lineHeight: 1.45, color: "#f1f5f9", marginBottom: "8px", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                    <span className="absolute left-0 top-0" style={{ color: "#f7d070", fontSize: "0.75rem" }}>✦</span>
                    {b}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: "0.78rem", lineHeight: 1.55, color: "#e2e8f0", marginBottom: "12px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                {isEn
                  ? "Thank you for your understanding and cooperation in making this celebration beautiful for everyone."
                  : "Gracias por su comprensión y cooperación para que esta celebración sea hermosa para todos."}
              </p>
            </div>
          </div>
        </section>

        {/* Dress Code: rosa en cúpula focal arriba, vestido a la izquierda
            y casaca a la derecha flanqueando nota y paleta, como la
            referencia. Las tres piezas ya son transparentes, sin fondo
            blanco. La nota es la del requerimiento (evitar dorado
            reservado); zapatos cómodos queda en el pie de Party Plan. */}
        {data.mostrarDressCode !== false && (
          <section className="flex flex-col items-center w-full max-w-[430px] mx-auto text-center" style={{ padding: "40px 16px 20px", boxSizing: "border-box", backgroundColor: "#faf5ea" }}>
            <div style={{ width: "120px", height: "auto", marginBottom: "12px", filter: "drop-shadow(0 10px 15px rgba(11,23,54,0.2))" }}>
              <img src={A.rosaCampana} alt="Rosa Encantada" className="w-full h-auto block bg-transparent" style={{ background: "transparent" }} />
            </div>
            <span className="font-serif-roman block font-semibold" style={{ fontSize: "0.65rem", letterSpacing: "0.35em", color: "#8c733e", marginBottom: "4px" }}>DRESS CODE</span>
            <h2 className="font-script" style={{ fontSize: "3rem", color: "#a81c1c", margin: 0, lineHeight: 1 }}>{data.dressCodeTitulo || "Dress Code"}</h2>
            <h4 className="font-serif-roman font-semibold" style={{ fontSize: "0.85rem", letterSpacing: "0.2em", color: "#0b1736", margin: "8px 0 16px" }}>{isEn ? "FORMAL & RIGUROSA ETIQUETA" : "FORMAL Y RIGUROSA ETIQUETA"}</h4>
            <div className="flex items-center justify-between w-full" style={{ marginTop: "10px" }}>
              <div style={{ width: "25%", flexShrink: 0 }}>
                <img src={A.vestidoBella} alt="Etiqueta Damas" className="w-full h-auto block bg-transparent" style={{ background: "transparent", filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.18))" }} />
              </div>
              <div style={{ flex: 1, padding: "0 12px" }}>
                <p className="font-serif-roman" style={{ fontSize: "0.92rem", fontWeight: 500, lineHeight: 1.55, letterSpacing: "0.04em", color: "#1e293b", textAlign: "center", margin: "0 auto 18px", maxWidth: "220px" }}>
                  {isEn
                    ? (<>Formal gala attire. Please avoid the <span style={{ color: "#a81c1c", fontWeight: 700 }}>golden yellow tones reserved for the quinceañera</span>.</>)
                    : (<>Vestimenta formal de gala. Se solicita evitar los <span style={{ color: "#a81c1c", fontWeight: 700 }}>tonos amarillo dorado reservados para la quinceañera</span>.</>)}
                </p>
                {data.coloresReservados && data.coloresReservados.length > 0 && (
                  <div className="flex justify-center items-center" style={{ gap: "14px", marginTop: "14px" }}>
                    {data.coloresReservados.map((c) => (
                      <span key={c} className="inline-block" style={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: c, boxShadow: "0 2px 6px rgba(0,0,0,0.2)", border: "2px solid #ffffff" }} />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ width: "25%", flexShrink: 0 }}>
                <img src={A.trajePrincipe} alt="Etiqueta Caballeros" className="w-full h-auto block bg-transparent" style={{ background: "transparent", filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.18))" }} />
              </div>
            </div>
            <div className="flex items-center justify-center" style={{ gap: "12px", width: "80%", margin: "35px auto 10px", opacity: 0.5 }}>
              <span style={{ height: "1px", background: "linear-gradient(90deg, transparent, #8c733e, transparent)", flex: 1 }} />
              <span style={{ color: "#8c733e", fontSize: "0.9rem" }}>❦</span>
              <span style={{ height: "1px", background: "linear-gradient(90deg, transparent, #8c733e, transparent)", flex: 1 }} />
            </div>
          </section>
        )}

        {/* Corte de Honor: tarjeta pergamino con filetes dorados, tiara
            para Padrinos y cetro para el Chambelán de Honor, Damas y
            Chambelanes en 2 columnas. Se alimenta de corteHonorJson del
            evento; sin datos de corte, no se muestra. */}
        {(() => {
          const corte: any = (data as any).corteHonorJson || null;
          if (!corte) return null;
          const padrinos: string[] = corte.padrinos || [];
          const chambelan: string | null = corte.chambelan || corte.chambelanHonor || null;
          const damas: string[] = corte.damas || [];
          const chambelanes: string[] = corte.chambelanes || [];
          if (!padrinos.length && !chambelan && !damas.length && !chambelanes.length) return null;
          return (
            <section className="flex flex-col items-center w-full max-w-[430px] mx-auto text-center" style={{ padding: "40px 16px 50px", boxSizing: "border-box", backgroundColor: "#faf5ea" }}>
              <div style={{ marginBottom: "24px" }}>
                <span className="font-serif-roman block font-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.3em", color: "#8c733e", marginBottom: "4px" }}>CORTE DE HONOR</span>
                <h2 className="font-script" style={{ fontSize: "3.5rem", color: "#a81c1c", lineHeight: 1, margin: 0 }}>{isEn ? "Quince Court" : "Corte de Honor"}</h2>
              </div>
              <div className="w-full" style={{ background: "radial-gradient(circle at center, #ffffff 0%, #fbf8f2 100%)", border: "1.5px solid rgba(212,175,55,0.45)", borderRadius: "20px", padding: "32px 20px", boxShadow: "0 10px 30px rgba(11,23,54,0.08), inset 0 0 20px rgba(212,175,55,0.1)", boxSizing: "border-box" }}>
                {padrinos.length > 0 && (
                  <div className="w-full" style={{ margin: "8px 0" }}>
                    <div style={{ width: "50px", height: "auto", margin: "0 auto 8px" }}>
                      <img src={A.coronaTiara} alt="Corona Padrinos" className="w-full h-auto block bg-transparent" style={{ background: "transparent", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }} />
                    </div>
                    <h3 className="font-serif-roman font-bold uppercase" style={{ fontSize: "0.82rem", letterSpacing: "0.22em", color: "#0b1736", margin: "0 0 10px" }}>PADRINOS</h3>
                    <p className="font-serif" style={{ fontSize: "1.05rem", fontStyle: "italic", color: "#334155", margin: 0 }}>{padrinos.join(" & ")}</p>
                  </div>
                )}
                {padrinos.length > 0 && chambelan && <div style={{ color: "#d4af37", fontSize: "0.9rem", margin: "18px 0", opacity: 0.6 }}>❦</div>}
                {chambelan && (
                  <div className="w-full" style={{ margin: "8px 0" }}>
                    <div style={{ width: "50px", height: "auto", margin: "0 auto 8px" }}>
                      <img src={A.cetroReal} alt="Cetro de Honor" className="w-full h-auto block bg-transparent" style={{ background: "transparent", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }} />
                    </div>
                    <h3 className="font-serif-roman font-bold uppercase" style={{ fontSize: "0.82rem", letterSpacing: "0.22em", color: "#0b1736", margin: "0 0 10px" }}>CHAMBELÁN DE HONOR</h3>
                    <p className="font-serif font-semibold" style={{ fontSize: "1.05rem", fontStyle: "italic", color: "#a81c1c", margin: 0 }}>{chambelan}</p>
                  </div>
                )}
                {chambelan && damas.length > 0 && <div style={{ color: "#d4af37", fontSize: "0.9rem", margin: "18px 0", opacity: 0.6 }}>❦</div>}
                {damas.length > 0 && (
                  <div className="w-full" style={{ margin: "8px 0" }}>
                    <h3 className="font-serif-roman font-bold uppercase" style={{ fontSize: "0.82rem", letterSpacing: "0.22em", color: "#0b1736", margin: "0 0 10px" }}>DAMAS</h3>
                    <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 16px", maxWidth: "320px", margin: "0 auto" }}>
                      {damas.map((n) => (
                        <span key={n} className="font-serif-roman text-center" style={{ fontSize: "0.72rem", letterSpacing: "0.08em", color: "#475569", whiteSpace: "nowrap" }}>{n}</span>
                      ))}
                    </div>
                  </div>
                )}
                {damas.length > 0 && chambelanes.length > 0 && <div style={{ color: "#d4af37", fontSize: "0.9rem", margin: "18px 0", opacity: 0.6 }}>❦</div>}
                {chambelanes.length > 0 && (
                  <div className="w-full" style={{ margin: "8px 0" }}>
                    <h3 className="font-serif-roman font-bold uppercase" style={{ fontSize: "0.82rem", letterSpacing: "0.22em", color: "#0b1736", margin: "0 0 10px" }}>CHAMBELANES</h3>
                    <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 16px", maxWidth: "320px", margin: "0 auto" }}>
                      {chambelanes.map((n) => (
                        <span key={n} className="font-serif-roman text-center" style={{ fontSize: "0.72rem", letterSpacing: "0.08em", color: "#475569", whiteSpace: "nowrap" }}>{n}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })()}

        {/* Registry: libro de cuento protagonista, sección propia en
            pergamino. No va duplicado en el arco de cierre: el arco queda
            solo con Save the Date. */}
        {data.mostrarMesaRegalos !== false && (
          <section className="flex justify-center items-center w-full max-w-[430px] mx-auto" style={{ padding: "30px 16px 50px", boxSizing: "border-box", backgroundColor: "#faf5ea" }}>
            <div className="flex flex-col items-center w-full text-center" style={{ background: "radial-gradient(circle at center, #ffffff 0%, #fbf7ee 100%)", border: "1px solid rgba(212,175,55,0.4)", borderRadius: "20px", padding: "36px 24px 32px", boxShadow: "0 10px 30px rgba(11,23,54,0.08), inset 0 0 20px rgba(212,175,55,0.1)", boxSizing: "border-box" }}>
              <div style={{ marginBottom: "8px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>
                <Gift className="w-7 h-7 mx-auto" style={{ color: "#a88338" }} />
              </div>
              <h3 className="font-script" style={{ fontSize: "3.2rem", color: "#a81c1c", margin: "0 0 12px", lineHeight: 1 }}>{isEn ? "Registry" : "Mesa de Regalos"}</h3>
              <p className="font-serif-roman" style={{ fontSize: "0.76rem", lineHeight: 1.65, letterSpacing: "0.06em", color: "#4a5568", maxWidth: "320px", margin: "0 0 20px" }}>
                {isEn
                  ? "The biggest gift I could ask for is for you to join me to celebrate my quinceañera. However, if you wish to bring a present, I have left a registry list here. Thank you so much!"
                  : "El regalo más grande que puedo pedir es que me acompañes a celebrar mis quince años. Si deseas traer un presente, aquí dejaré mi lista de regalos. ¡Muchas gracias!"}
              </p>
              <div style={{ width: "170px", height: "auto", margin: "8px auto 24px", perspective: "600px" }}>
                <img src={A.libroCuento} alt="Mesa de Regalos" className="w-full h-auto block bg-transparent" style={{ background: "transparent", filter: "drop-shadow(0 15px 25px rgba(11,23,54,0.35))" }} />
              </div>
              {data.wishlistUrl && (
                <a href={data.wishlistUrl} target="_blank" rel="noreferrer" className="font-serif-roman inline-flex items-center justify-center font-semibold" style={{ backgroundColor: "#0b1736", color: "#ffffff", fontSize: "0.85rem", letterSpacing: "0.18em", textDecoration: "none", padding: "14px 34px", borderRadius: "10px", border: "1px solid #d4af37", boxShadow: "0 6px 18px rgba(11,23,54,0.3)" }}>
                  {isEn ? "View Registry" : "Ver Mesa de Regalos"}
                </a>
              )}
            </div>
          </section>
        )}

        {/* RSVP estilo cuento: la sección compartida renderiza su variante
            royal (tarjeta pergamino, copa focal, rosa lateral). */}
        <RsvpSection
          eventoId={data.id}
          eventoTitulo={data.titulo}
          telefonoWhatsapp={data.telefonoWhatsappRsvp}
          maxPases={data.maxPasesPorInvitado ?? 4}
          fechaLimite={data.fechaLimiteRsvp || data.rsvpFechaLimite}
          template={template}
          permitirConfirmacionTelefono={data.permitirConfirmacionTelefono}
          isEn={isEn}
          royal
          gobletImage={A.copaBrindis}
          roseImage={A.rosaEncantada}
        />

        {/* Cierre: cabecera pergamino con firma + arco floral con castillo
            como fondo completo. Save the Date va DENTRO del cielo del
            arco; Registry tiene su sección propia arriba y ya no va
            duplicado aquí. */}
        <div className="relative text-center" style={{ backgroundColor: "#f7eedb", padding: "30px 20px 20px" }}>
          <h2 className="font-script" style={{ fontSize: "4rem", color: "#a81c1c", margin: 0, lineHeight: 1 }}>{data.titulo}</h2>
          <img src={A.espejoMano} alt="Detalle decorativo" className="absolute pointer-events-none bg-transparent" style={{ top: "15px", right: "25px", width: "55px", height: "auto", background: "transparent" }} />
        </div>
        {/* Escena final: solo Save the Date, centrado sobre el cielo del
            arco. Sin franja beige inferior: el arco cierra la página. */}
        <section className="relative w-full max-w-[430px] mx-auto overflow-hidden" style={{ boxSizing: "border-box", minHeight: "520px", marginBottom: 0, paddingBottom: 0 }}>
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            <img src={A.arcoRosasCastillo} alt="Castillo de noche con arco de rosas" className="w-full h-full object-cover block bg-transparent" style={{ background: "transparent", verticalAlign: "bottom" }} />
          </div>
          <div className="relative flex flex-col items-center text-center" style={{ zIndex: 2, padding: "85px 24px 60px", justifyContent: "flex-start" }}>
            <div className="flex flex-col items-center w-full">
              <div className="flex items-baseline justify-center" style={{ gap: "8px", marginBottom: "22px" }}>
                <span className="font-script" style={{ fontSize: "3.2rem", color: "#ff4d4d", textShadow: "0 2px 10px rgba(0,0,0,0.9)", lineHeight: 0.8 }}>{isEn ? "Save" : "Guarda"}</span>
                <span className="font-serif-roman font-bold" style={{ fontSize: "1.25rem", letterSpacing: "0.25em", color: "#ff6b6b", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>THE DATE</span>
              </div>
              <div className="flex flex-col items-center w-full" style={{ gap: "12px", maxWidth: "270px" }}>
                <a href={googleCalendarUrl} target="_blank" rel="noreferrer" className="font-serif-roman inline-flex items-center justify-center" style={{ backgroundColor: "#0b1736", color: "#ffffff", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.15em", padding: "13px 16px", borderRadius: "10px", border: "1px solid rgba(212,175,55,0.5)", textDecoration: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.6)", width: "100%", boxSizing: "border-box" }}>
                  <CalendarPlus className="w-4 h-4 mr-2" /> GOOGLE CALENDAR
                </a>
                <button type="button" onClick={handleDownloadIcs} className="font-serif-roman inline-flex items-center justify-center cursor-pointer" style={{ backgroundColor: "#0b1736", color: "#ffffff", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.15em", padding: "13px 16px", borderRadius: "10px", border: "1px solid rgba(212,175,55,0.5)", boxShadow: "0 4px 15px rgba(0,0,0,0.6)", width: "100%", boxSizing: "border-box" }}>
                  APPLE / OUTLOOK (.ICS)
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
