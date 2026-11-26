"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Gift,
  Copy,
} from "lucide-react";
import confetti from "canvas-confetti";
import { GATSBY_20S_ASSETS } from "@/lib/templates/gatsby20sAssets";
import { InvitationData } from "../invitation/InvitationMobileView";
import { parseTemplateConfig, Gatsby20sConfig } from "@/types/templateConfigs";
import { getMapDirectionsUrl } from "@/lib/maps";
import DynamicRsvpForm from "../invitation/DynamicRsvpForm";
import { isSectionEnabledInEvent, SeccionId } from "@/config/templateSections";

interface Gatsby20sTemplateProps {
  data: InvitationData;
  skipIntro?: boolean;
}

export default function Gatsby20sTemplate({
  data,
  skipIntro = false,
}: Gatsby20sTemplateProps) {
  const config = parseTemplateConfig<Gatsby20sConfig>(data.configPlantilla, {
    subtitulo: (data.configPlantilla as any)?.subtitulo || data.subtitulo || "Mis Quince Años",
    subtituloEn: (data.configPlantilla as any)?.subtituloEn || "My Sweet Fifteen",
    fraseApertura: (data.configPlantilla as any)?.fraseApertura || "Una Celebración Años 20",
    fraseAperturaEn: (data.configPlantilla as any)?.fraseAperturaEn || "A Roaring Twenties Celebration",
    ticketFechaTexto: "THURSDAY 10.14.2027 • 7:00 PM • ADMIT ONE",
    venueNombre: "GRAND HALL BALLROOM",
    venueDireccion: "1920 Speakeasy Blvd, Los Angeles, CA",
    dressCodeTitulo: "ROARING 20'S ATTIRE",
    dressCodeTexto: "Vestimenta de gala estilo años 20: Vestidos de flecos, plumas, perlas o traje formal de etiqueta.",
    cocktailsTitulo: "GIFT REGISTRY",
    cocktailsTexto: "Su presencia es nuestro mejor regalo. Si desean tener un detalle con la quinceañera, contaremos con un buzón de sobres en la recepción.",
    agradecimientoTexto: "¡Compartir este momento tan especial con ustedes significa más de lo que las palabras pueden expresar!",
    agradecimientoTextoEn: "Sharing this milestone with you means more than words can say!",
    colorAcentoHex: "#C5A059",
  });

  // Idioma (por defecto EN con toggle a ES)
  const [idioma, setIdioma] = useState<"EN" | "ES">(
    data.idiomaDefault === "es" ? "ES" : "EN"
  );

  // Línea de bienvenida de la portada (Sección 1): undefined = texto del template; "" = oculta la línea.
  const bienvenidaPortada = idioma === "EN"
    ? (config.portadaBienvenidaEn ?? "WELCOME TO THE")
    : (config.portadaBienvenida ?? "BIENVENIDOS A");
  // Línea de colores reservados (Sección 7 Vestimenta): en ES usa el valor guardado
  // del evento si no hay texto en el admin; en EN solo muestra lo escrito en el admin.
  // "" explícito = oculta la línea en ese idioma.
  const coloresReservadosTexto = idioma === "EN"
    ? (config.coloresReservadosEn ?? "")
    : (config.coloresReservados ?? data.dressCodeColoresReservados ?? "");

  // Estados del Sobre y Animación de Apertura
  const [sobreAbierto, setSobreAbierto] = useState<boolean>(skipIntro);
  const [animandoSobre, setAnimandoSobre] = useState<boolean>(false);
  const [scrollPermitido, setScrollPermitido] = useState<boolean>(skipIntro);

  // Audio / Reproductor de Vinilo
  const [reproduciendo, setReproduciendo] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Referencias para scroll
  const contenidoRef = useRef<HTMLDivElement | null>(null);


  // Modal / Detalle de Regalos
  const [mostrarRegaloModal, setMostrarRegaloModal] = useState(false);
  const [cuentaCopiada, setCuentaCopiada] = useState(false);


  // Cuenta Regresiva (Conectada a la fecha de evento configurada en el Admin)
  const [tiempoRestante, setTiempoRestante] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  useEffect(() => {
    const fechaObjetivo = data.fechaEvento
      ? new Date(data.fechaEvento).getTime()
      : new Date("2026-10-14T20:00:00Z").getTime();

    const actualizarCountdown = () => {
      const ahora = new Date().getTime();
      const diferencia = Math.max(0, fechaObjetivo - ahora);
      setTiempoRestante({
        dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((diferencia % (1000 * 60)) / 1000),
      });
    };
    actualizarCountdown();
    const intervalId = setInterval(actualizarCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [data.fechaEvento]);

  // Nombre de la Quinceañera
  const nombreQuinceanera =
    (data.configPlantilla as any)?.nombreQuinceanera ||
    data.titulo?.split("·")[0]?.replace(/Chloe's.*/i, "Chloe")?.trim() ||
    "Chloe";

  // Corte de honor desde el admin (corteHonorJson); sin datos, demo Chloe
  const corte = (data.corteHonorJson || {}) as any;
  const padresTexto = corte.parents || "MATEO & CAMILA TORRES";
  const damasLista: string[] =
    Array.isArray(corte.damas) && corte.damas.length > 0
      ? corte.damas
      : ["VALERIA SANDOVAL", "MARIANA DELGADO", "ISABELA RÍOS", "JULIETA MONTOYA", "CAMILA ESPARZA", "LUNA HERRERA", "SOFÍA NAVARRO"];
  const chambelanHonor = corte.chambelan || "JOAQUÍN JIMÉNEZ";
  const chambelanesLista: string[] =
    Array.isArray(corte.chambelanes) && corte.chambelanes.length > 0
      ? corte.chambelanes
      : ["DIEGO TORRES", "THIAGO MENDOZA", "NICOLÁS JIMÉNEZ", "SAMUEL RAMÍREZ", "EMILIANO VEGA", "MATEO CASTILLO", "ALEJANDRO CRUZ"];
  // Fotos de la corte editables desde el admin (corteHonorJson); sin foto, arte del template
  const fotoDamasUrl = corte.fotoDamasUrl || GATSBY_20S_ASSETS.damasGatsby;
  const fotoChambelanesUrl = corte.fotoChambelanesUrl || GATSBY_20S_ASSETS.chambelanesGatsby;

  // Hora de la placa bilingüe: el valor guardado trae el prefijo en español
  // ("A LAS 6:19 PM") y la invitación es bilingüe — en inglés se muestra
  // "AT 6:19 PM". Si fechaPlacaHoraEn no está guardado, se deriva del ES.
  const horaPlacaTexto = (fallback: string) => {
    const raw =
      (idioma === "EN" ? data.fechaPlacaHoraEn : data.fechaPlacaHora) ||
      data.fechaPlacaHora ||
      fallback;
    const hora = String(raw).replace(/^(A LAS|AT)\s+/i, "");
    return idioma === "EN" ? `AT ${hora}` : `A LAS ${hora}`;
  };

  // Hora propia de la recepcion (configPlantilla.horaRecepcion, seccion 6 del
  // editor); vacia = la recepcion comparte la hora de la placa (ceremonia).
  const horaRecepcionTexto = (fallback: string) => {
    const raw = (config as any)?.horaRecepcion;
    if (raw && String(raw).trim() !== "") {
      const hora = String(raw).replace(/^(A LAS|AT)\s+/i, "").trim();
      return idioma === "EN" ? `AT ${hora}` : `A LAS ${hora}`;
    }
    return horaPlacaTexto(fallback);
  };

  // Fecha del ticket derivada de la fecha del evento (zona Los Ángeles)
  const fechaTicket = (() => {
    try {
      const d = new Date(data.fechaEvento || "2027-10-15T02:00:00Z");
      const fechaEn = d.toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", month: "2-digit", day: "2-digit", year: "numeric" }).replace(/\//g, ".");
      const fechaEs = d.toLocaleDateString("es-ES", { timeZone: "America/Los_Angeles", day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
      const horaEn = d.toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", hour12: true });
      const horaEs = d.toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit", hour12: true });
      return { fechaEn, fechaEs, horaEn, horaEs };
    } catch {
      return { fechaEn: "10.14.2027", fechaEs: "14.10.2027", horaEn: "7 PM", horaEs: "7:00 PM" };
    }
  })();

  // Secciones habilitadas desde el editor (por defecto todas activas)
  const isSectionActive = (sectionId: SeccionId): boolean => {
    return isSectionEnabledInEvent(sectionId, data.configPlantilla, {
      mostrarFrasePersonalizada: data.mostrarFrasePersonalizada,
      mostrarFechaPlacaHora: data.mostrarFechaPlacaHora,
      mostrarDressCode: data.mostrarDressCode,
      mostrarMesaRegalos: data.mostrarMesaRegalos,
      permitirConfirmacionTelefono: data.permitirConfirmacionTelefono,
    });
  };

  // Inicializar Audio
  useEffect(() => {
    if (typeof window !== "undefined" && isSectionActive("musica") && data.musicaUrl) {
      audioRef.current = new Audio(data.musicaUrl);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [data.musicaUrl]);

  // Bloquear scroll vertical antes de abrir el sobre
  useEffect(() => {
    if (!scrollPermitido) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [scrollPermitido]);

  const toggleMusica = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;
    if (reproduciendo) {
      audioRef.current.pause();
      setReproduciendo(false);
    } else {
      audioRef.current
        .play()
        .then(() => setReproduciendo(true))
        .catch(() => {});
    }
  };

  // Función de apertura fluida con cubic-bezier(0.22, 1, 0.36, 1) y duración de 0.8s
  const ejecutarApertura = (nuevoIdioma?: "EN" | "ES") => {
    if (nuevoIdioma) {
      setIdioma(nuevoIdioma);
    }
    if (animandoSobre || sobreAbierto) return;

    setAnimandoSobre(true);

    if (isSectionActive("musica") && audioRef.current && !reproduciendo) {
      audioRef.current
        .play()
        .then(() => setReproduciendo(true))
        .catch(() => {});
    }

    setTimeout(() => {
      setSobreAbierto(true);
      setAnimandoSobre(false);
      setScrollPermitido(true);

      try {
        confetti({
          particleCount: 80,
          spread: 85,
          origin: { y: 0.55 },
          colors: ["#D4AF37", "#C5A059", "#F3E5AB", "#111111", "#FFFFFF"],
        });
      } catch {}
    }, 800);
  };

  const scrollHaciaDetalles = () => {
    if (contenidoRef.current) {
      contenidoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const copiarCuenta = () => {
    if (!data.regalosZelle) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(data.regalosZelle);
      setCuentaCopiada(true);
      setTimeout(() => setCuentaCopiada(false), 2500);
    }
  };

  return (
    <div
      className="w-full flex justify-center text-[#EADFC7] antialiased relative selection:bg-[#C5A059] selection:text-black min-h-screen"
      style={{
        backgroundColor: "#0d0d0d",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.55)), url(${GATSBY_20S_ASSETS.bgTexture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Import de fuentes Art Déco */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Great+Vibes&family=Marcellus&display=swap');

        @font-face {
          font-family: 'Geotica Four Open';
          src: url('/fonts/GeoticaFourOpen.woff2') format('woff2'),
               url('/fonts/GeoticaFourOpen.woff') format('woff');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Gatsby Display';
          src: url('/fonts/GatsbyDisplay.woff') format('woff');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        .font-geotica {
          font-family: 'Geotica Four Open', 'Cinzel Decorative', serif;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f5e6ab;
          text-shadow: 0 2px 10px rgba(212, 175, 55, 0.35);
        }

        .font-gatsby-display {
          font-family: 'Gatsby Display', 'Limelight', serif;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #f5e6ab;
        }

        .font-cinzel-decorative {
          font-family: 'Cinzel Decorative', 'Cinzel', serif;
        }
        .font-great-vibes {
          font-family: 'Great Vibes', cursive;
        }
        .font-marcellus {
          font-family: 'Marcellus', serif;
        }

        /* RSVP del sistema en modo oscuro Gatsby (solo este template; DynamicRsvpForm.tsx no se toca) */
        .gatsby-rsvp-dark > div { background-color: #0e0e0e !important; border: none !important; border-radius: 0 !important; box-shadow: none !important; }
        .gatsby-rsvp-dark .text-stone-900, .gatsby-rsvp-dark .text-stone-800 { color: #f5e6ab !important; }
        .gatsby-rsvp-dark span.text-2xl { display: none !important; }
        .gatsby-rsvp-dark .text-stone-700 { color: #e8d9a8 !important; }
        .gatsby-rsvp-dark .text-stone-600 { color: #c9b896 !important; }
        .gatsby-rsvp-dark .text-stone-500 { color: #b8a67c !important; }
        .gatsby-rsvp-dark .text-stone-400 { color: #8a7a55 !important; }
        .gatsby-rsvp-dark .text-neutral-500 { color: #8a7a55 !important; }
        .gatsby-rsvp-dark .bg-stone-50, .gatsby-rsvp-dark .bg-stone-50\/80 { background-color: #171717 !important; }
        .gatsby-rsvp-dark .bg-stone-100 { background-color: #1f1f1f !important; }
        .gatsby-rsvp-dark .border-stone-200 { border-color: rgba(212,175,55,.4) !important; }
        .gatsby-rsvp-dark .border-stone-100 { border-color: rgba(212,175,55,.25) !important; }
        .gatsby-rsvp-dark .border-pink-200\/80, .gatsby-rsvp-dark .border-pink-100\/90 { border-color: rgba(212,175,55,.35) !important; }
        .gatsby-rsvp-dark .bg-pink-50, .gatsby-rsvp-dark .bg-pink-100\/90 { background-color: transparent !important; }
        .gatsby-rsvp-dark .text-\[\#7A002A\] { color: #f5e6ab !important; }
        .gatsby-rsvp-dark .text-\[\#B74F5F\] { color: #d4af37 !important; }
        .gatsby-rsvp-dark input, .gatsby-rsvp-dark select, .gatsby-rsvp-dark textarea { background-color: #171717 !important; color: #f5e6ab !important; border-radius: 0 !important; }
        .gatsby-rsvp-dark input::placeholder, .gatsby-rsvp-dark textarea::placeholder { color: #8a7a55 !important; }
        .gatsby-rsvp-dark .focus\:bg-white:focus { background-color: #171717 !important; }
        .gatsby-rsvp-dark .focus\:ring-stone-400:focus { --tw-ring-color: #d4af37 !important; }
        .gatsby-rsvp-dark .rounded-2xl, .gatsby-rsvp-dark .rounded-xl, .gatsby-rsvp-dark .rounded-full { border-radius: 0 !important; }
        .gatsby-rsvp-dark .bg-emerald-50, .gatsby-rsvp-dark .bg-emerald-50\/90 { background-color: rgba(6,78,59,.55) !important; }
        .gatsby-rsvp-dark .text-emerald-800 { color: #a7f3d0 !important; }
        .gatsby-rsvp-dark .text-emerald-900 { color: #d1fae5 !important; }
        .gatsby-rsvp-dark .text-emerald-600 { color: #34d399 !important; }
        .gatsby-rsvp-dark .border-emerald-200 { border-color: rgba(52,211,153,.45) !important; }
        .gatsby-rsvp-dark .border-emerald-500 { border-color: #34d399 !important; }
        .gatsby-rsvp-dark .bg-rose-50, .gatsby-rsvp-dark .bg-rose-50\/80 { background-color: rgba(76,5,25,.55) !important; }
        .gatsby-rsvp-dark .text-rose-800, .gatsby-rsvp-dark .text-rose-700 { color: #fda4af !important; }
        .gatsby-rsvp-dark .text-rose-600 { color: #fb7185 !important; }
        .gatsby-rsvp-dark .border-rose-200 { border-color: rgba(251,113,133,.4) !important; }
        .gatsby-rsvp-dark .border-rose-400 { border-color: #fb7185 !important; }
        .gatsby-rsvp-dark .bg-amber-50\/80 { background-color: #241d08 !important; }
        .gatsby-rsvp-dark .text-amber-950 { color: #f5e6ab !important; }
        .gatsby-rsvp-dark .border-amber-200 { border-color: rgba(212,175,55,.4) !important; }
        .gatsby-rsvp-dark .bg-stone-900 { background-color: #d4af37 !important; }
        .gatsby-rsvp-dark .text-white { color: #000000 !important; }
        .gatsby-rsvp-dark .hover\:bg-stone-100:hover { background-color: #1f1f1f !important; }
        .gatsby-rsvp-dark .hover\:border-stone-400:hover { border-color: #d4af37 !important; }
        .gatsby-rsvp-dark .hover\:bg-pink-100\/90:hover { background-color: rgba(212,175,55,.12) !important; }
        .gatsby-rsvp-dark .hover\:bg-black:hover { background-color: #e5c65a !important; }
        .gatsby-rsvp-dark .group:hover .group-hover\:text-black { color: #ffffff !important; }

        /* Fondo de pagina negro mientras este template esta montado (el body global es #FAF8F5 y se veia una franja clara bajo el sobre final) */
        body { background-color: #0d0d0d !important; }
      `}</style>

      {/* Selector de Idioma Flotante Superior (Visible solo cuando el sobre ya está abierto) */}
      {sobreAbierto && (
        <div
          className="fixed top-3.5 right-3.5 sm:top-5 sm:right-5 z-50 flex items-center p-1 rounded-full shadow-2xl transition-all duration-300 animate-fadeIn"
          style={{
            backgroundColor: "rgba(13, 13, 13, 0.88)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(212, 175, 55, 0.55)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
          }}
          role="region"
          aria-label="Language Selector"
        >
          <button
            onClick={() => setIdioma("EN")}
            className={`px-3 py-1 rounded-full text-[10.5px] font-bold tracking-widest transition-all cursor-pointer ${
              idioma === "EN"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-black shadow-xs"
                : "text-[#D4AF37] hover:text-white"
            }`}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            onClick={() => setIdioma("ES")}
            className={`px-3 py-1 rounded-full text-[10.5px] font-bold tracking-widest transition-all cursor-pointer ${
              idioma === "ES"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-black shadow-xs"
                : "text-[#D4AF37] hover:text-white"
            }`}
            aria-label="Cambiar a Español"
          >
            ES
          </button>
        </div>
      )}

      {/* Contenedor Móvil Vertical Art Déco (max-w 440px) */}
      <div className="w-full max-w-[440px] relative flex flex-col items-center">
        {/* =========================================================================
            SECCIÓN 1: HERO / SOBRE INTERACTIVO (100svh, SIN SCROLL ANTES DE ABRIR)
           ========================================================================= */}
        <section
          className={`w-full relative flex flex-col items-center select-none justify-center h-[100svh] ${
            sobreAbierto ? "px-3 overflow-visible" : "px-4 overflow-hidden"
          }`}
        >
          {/* Luz / Resplandor Dorado de Fondo */}
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.3)_0%,transparent_75%)]" />

          {/* =======================================================================
              ESTADO 1: SOBRE CERRADO CON DISTRIBUCIÓN CENTRADA EQUILIBRADA (GAP: 28px, MARGEN INFERIOR >= 90px)
             ======================================================================= */}
          {!sobreAbierto ? (
            <div
              className={`w-full h-full flex flex-col items-center justify-center z-10 transition-all duration-700 ${
                animandoSobre ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
              }`}
              style={{
                gap: "28px",
                paddingBottom: "90px", // Al menos 90px de margen inferior libre sobre la barra fija del demo
              }}
            >
              {/* Encabezado Superior Sutil (Editable desde el admin) */}
              <div className="text-center">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.38em] text-[#C5A059] font-serif font-bold block mb-1">
                  {idioma === "EN"
                    ? (config.fraseAperturaEn || "A ROARING TWENTIES CELEBRATION")
                    : (config.fraseApertura || "UNA CELEBRACIÓN AÑOS 20")}
                </span>
                <h1 className="text-xl sm:text-2xl font-cinzel-decorative tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2D4] via-[#D4AF37] to-[#9E7A32]">
                  {idioma === "EN"
                    ? (config.subtituloEn || "MY SWEET FIFTEEN")
                    : (config.subtitulo || "MIS QUINCE AÑOS")}
                </h1>
              </div>

              {/* Contenedor del Sobre Negro Cerrado (e6.png) con Sello XV (sello-xv.png) */}
              <div
                onClick={() => ejecutarApertura()}
                className={`relative w-[92%] max-w-[340px] cursor-pointer transition-all ${
                  animandoSobre
                    ? "scale-90 opacity-60 filter blur-[1px]"
                    : "hover:scale-[1.02] active:scale-[0.98]"
                }`}
                style={{
                  transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                role="button"
                aria-label={idioma === "EN" ? "Open invitation envelope" : "Abrir sobre de invitación"}
              >
                {/* Sobre Negro Cerrado (e6.png) */}
                <div className="relative w-full rounded-2xl overflow-visible shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
                  <img
                    src={GATSBY_20S_ASSETS.envelopeClosed}
                    alt="Sobre negro cerrado"
                    className="w-full h-auto object-contain block drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]"
                  />

                  {/* Sello de Lacre XV Circular (sello-xv.png) centrado en la punta de la solapa triangular */}
                  <div
                    className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      ejecutarApertura();
                    }}
                  >
                    <img
                      src={GATSBY_20S_ASSETS.selloXv}
                      alt="Sello de lacre XV"
                      className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] object-contain transition-transform hover:scale-105 active:scale-95"
                      style={{
                        filter: "drop-shadow(0 6px 14px rgba(0, 0, 0, 0.85))",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Selector inferior: Mantén únicamente el texto SELECT LANGUAGE TO ENTER y los dos botones tipo píldora ENGLISH y ESPAÑOL debajo del sobre */}
              <div className="w-full flex flex-col items-center gap-2">
                <span className="text-[9.5px] uppercase tracking-[0.25em] text-[#C5A059]/80 font-serif font-medium">
                  {idioma === "EN" ? "SELECT LANGUAGE TO ENTER" : "ELIGE EL IDIOMA PARA INGRESAR"}
                </span>

                <div
                  className="flex items-center gap-3 p-1.5 rounded-full shadow-2xl"
                  style={{
                    backgroundColor: "rgba(13, 13, 13, 0.78)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid #d4af37",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.75), inset 0 0 12px rgba(212, 175, 55, 0.15)",
                  }}
                >
                  {/* Botón ENGLISH */}
                  <button
                    onClick={() => ejecutarApertura("EN")}
                    className={`px-5 py-2 rounded-full text-xs font-serif font-bold tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                      idioma === "EN"
                        ? "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA8232] text-black shadow-md scale-105"
                        : "text-[#D4AF37] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    ENGLISH
                  </button>

                  {/* Divisor vertical sutil */}
                  <div className="w-px h-4 bg-[#D4AF37]/40" />

                  {/* Botón ESPAÑOL */}
                  <button
                    onClick={() => ejecutarApertura("ES")}
                    className={`px-5 py-2 rounded-full text-xs font-serif font-bold tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer ${
                      idioma === "ES"
                        ? "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA8232] text-black shadow-md scale-105"
                        : "text-[#D4AF37] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    ESPAÑOL
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* =======================================================================
                ESTADO 2: COMPOSICIÓN ASIMÉTRICA GATSBY HERO ABIERTO
               ======================================================================= */
            <div
              className="w-full relative max-w-[420px] select-none"
              style={{
                height: "545px",
                minHeight: "auto",
                transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* ===================================================================
                  CAPA 1 (Fondo superior derecho): Sobre Abierto con Chispas (e9 + ec)
                 =================================================================== */}
              <div
                className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 pointer-events-none select-none animate-fadeIn"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  zIndex: 1,
                  paddingLeft: "15px",
                }}
              >
                {/* Sobre Abierto con Interior Dorado (sobre-abierto.png) */}
                <img
                  src={GATSBY_20S_ASSETS.envelopeOpen}
                  alt="Sobre abierto con interior dorado"
                  className="w-full h-auto object-contain block drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]"
                />

                {/* Bengalas doradas en palillo (2a8f841c99e752562e974ce53dc05255.png) entre el sobre y el marco */}
                {/* 1. Bengala izquierda */}
                <div
                  className="absolute top-[23%] left-[24%] sm:left-[25%] w-[105px] sm:w-[120px] pointer-events-none select-none"
                  style={{
                    transform: "rotate(-10deg)",
                    filter: "drop-shadow(0 0 14px rgba(243,229,171,0.45))",
                  }}
                >
                  <img
                    src={GATSBY_20S_ASSETS.sparklerStar}
                    alt="Bengala dorada izquierda"
                    className="w-full h-auto object-contain block"
                  />
                </div>

                {/* 2. Bengala derecha */}
                <div
                  className="absolute top-[23%] right-[16%] sm:right-[18%] w-[105px] sm:w-[120px] pointer-events-none select-none"
                  style={{
                    transform: "rotate(14deg)",
                    filter: "drop-shadow(0 0 14px rgba(243,229,171,0.45))",
                  }}
                >
                  <img
                    src={GATSBY_20S_ASSETS.sparklerStar}
                    alt="Bengala dorada derecha"
                    className="w-full h-auto object-contain block"
                  />
                </div>

                {/* Chispas animadas doradas (ec.gif) superpuestas sobre la cabeza de la bengala izquierda */}
                <div
                  className="absolute top-[26%] left-[22%] sm:left-[24%] w-24 sm:w-28 h-24 sm:h-28 pointer-events-none"
                  style={{
                    mixBlendMode: "screen",
                    WebkitMaskImage: "radial-gradient(circle, black 45%, transparent 70%)",
                    maskImage: "radial-gradient(circle, black 45%, transparent 70%)",
                  }}
                >
                  <img
                    src={GATSBY_20S_ASSETS.sparklersGif}
                    alt="Chispas doradas animadas"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Chispas animadas doradas superpuestas sobre la cabeza de la bengala derecha */}
                <div
                  className="absolute top-[26%] right-[14%] sm:right-[16%] w-24 sm:w-28 h-24 sm:h-28 pointer-events-none"
                  style={{
                    mixBlendMode: "screen",
                    WebkitMaskImage: "radial-gradient(circle, black 45%, transparent 70%)",
                    maskImage: "radial-gradient(circle, black 45%, transparent 70%)",
                    transform: "scaleX(-1)",
                  }}
                >
                  <img
                    src={GATSBY_20S_ASSETS.sparklersGif}
                    alt="Chispas doradas animadas"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* ===================================================================
                  CAPA 2: Tarjeta Principal con Borde de Abanicos Grueso (padding: 24px)
                  + Centro Negro Sólido (#0e0e0e)
                 =================================================================== */}
              <div
                className="absolute top-[13rem] left-0 rounded-sm overflow-hidden animate-gatsby-rise"
                style={{
                  width: "65%",
                  zIndex: 2,
                  animationDelay: "120ms",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.85)",
                  backgroundImage: `url(${GATSBY_20S_ASSETS.artDecoPattern})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "24px",
                }}
              >
                {/* Panel interior negro mate sólido (#0e0e0e) */}
                {isSectionActive("portada") && (
                  <div className="w-full h-full bg-[#0e0e0e] rounded-xs flex flex-col items-center p-0 text-center border border-[#D4AF37]/35 shadow-inner">
                  {/* ARRIBA (Foto limpia rectangular y vertical sin marco barroco, con borde dorado de 2px) */}
                  <div
                    className="relative w-full overflow-hidden rounded-xs border-2 border-[#D4AF37]/70 shadow-md"
                    style={{ height: "170px" }}
                  >
                    <img
                      src={data.fotoPortadaUrl || GATSBY_20S_ASSETS.quinceaneraGatsby || GATSBY_20S_ASSETS.quinceanera}
                      alt={nombreQuinceanera}
                      className="w-full h-full object-cover object-top block"
                      style={{ objectPosition: "center 12%" }}
                    />
                  </div>

                  {/* ABAJO (Nuevo texto de celebración: WELCOME TO THE / CHLOE / ROARING 15th CELEBRATION) */}
                  <div className="mt-3.5 flex flex-col items-center text-center space-y-0.5 w-full">
                    {/* Línea 1: WELCOME TO THE (editable en el admin, Sección 1 Portada) */}
                    {bienvenidaPortada !== "" && (
                      <span className="font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.26em] text-[#D4AF37] uppercase font-semibold">
                        {bienvenidaPortada}
                      </span>
                    )}

                    {/* Línea 2: CHLOE (La protagonista: el texto más grande de la tarjeta) */}
                    <h2 className="font-gatsby-display text-3xl sm:text-4xl my-0.5">
                      {nombreQuinceanera.toUpperCase()}
                    </h2>

                    {/* Línea 3: ROARING 15th CELEBRATION */}
                    <p className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.22em] text-[#D4AF37] uppercase font-bold mt-0.5">
                      {idioma === "EN" ? "ROARING 15th CELEBRATION" : "CELEBRACIÓN ROARING 15"}
                    </p>

                    {/* BASE: Delicada floritura dorada (floritura-chloe.png) */}
                    <div className="w-32 sm:w-36 h-auto mt-2 mb-0.5 flex items-center justify-center opacity-95">
                      <img
                        src={GATSBY_20S_ASSETS.florituraChloe}
                        alt="Floritura dorada Chloe"
                        className="w-full h-auto object-contain block drop-shadow-[0_2px_6px_rgba(212,175,55,0.3)]"
                      />
                    </div>
                  </div>
                </div>
                )}
              </div>

              {/* ===================================================================
                  CAPA 3 (Esquina inferior derecha): Disco de Vinilo + Ticket de Fecha
                 =================================================================== */}
              {/* 1. Disco de Vinilo (bb9dc50bdef6c4f4d2a669a595b16a0c.png): mitad derecha, superpuesto al borde */}
              {isSectionActive("musica") && (
                <div
                onClick={toggleMusica}
                className="absolute right-[-10px] sm:right-[2%] w-[88px] sm:w-[96px] h-[88px] sm:h-[96px] cursor-pointer group animate-gatsby-rise"
                style={{ top: "360px", zIndex: 3, animationDelay: "240ms" }}
                role="button"
                aria-label="Tap for music"
              >
                {/* Texto Curvo "TAP FOR MUSIC" en la parte superior del disco */}
                <svg viewBox="0 0 100 100" className="absolute -top-3.5 inset-x-0 w-full h-full pointer-events-none overflow-visible">
                  <path id="curveVinyl" d="M 14,50 A 36,36 0 0,1 86,50" fill="transparent" />
                  <text className="text-[7px] font-serif font-bold uppercase tracking-[0.24em] fill-[#D4AF37]">
                    <textPath href="#curveVinyl" startOffset="50%" textAnchor="middle">
                      {idioma === "EN" ? "TAP FOR MUSIC" : "TOCA PARA MÚSICA"}
                    </textPath>
                  </text>
                </svg>

                {/* Disco girando suavemente */}
                <img
                  src={GATSBY_20S_ASSETS.vinylRecord}
                  alt="Disco de Vinilo Gatsby"
                  className={`w-full h-full object-contain block drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)] ${
                    reproduciendo ? "animate-spin" : ""
                  }`}
                  style={{
                    animationDuration: "6s",
                    animationTimingFunction: "linear",
                  }}
                />

                {/* Ícono Dorado de Play / Pause en el centro */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#F3E5AB] to-[#AA8232] text-black flex items-center justify-center shadow-md">
                    {reproduciendo ? (
                      <Pause className="w-3 h-3 fill-black text-black" />
                    ) : (
                      <Play className="w-3 h-3 fill-black text-black ml-0.5" />
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* 2. Ticket Negro Vintage (c9bb422442ef42c19f1835d77746abf0.png): ancho 175px, desplazado a la derecha */}
              {isSectionActive("medallonFecha") && (
                <div
                className="absolute right-[-25px] sm:right-[0px] w-[175px] aspect-[16/9] flex items-center justify-center animate-gatsby-rise"
                style={{ top: "447px", zIndex: 4, animationDelay: "360ms" }}
              >
                <img
                  src={GATSBY_20S_ASSETS.ticketBadge}
                  alt="Ticket Save the Date"
                  className="w-full h-full object-contain block drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                  <span className="text-[7.5px] sm:text-[8px] tracking-[0.22em] text-[#D4AF37] font-serif font-bold uppercase block mb-0.5">
                    {idioma === "EN" ? "SAVE THE DATE" : "RESERVA LA FECHA"}
                  </span>
                  <span className="text-[15px] sm:text-[16px] tracking-[0.18em] text-[#F3E5AB] font-serif font-bold uppercase block leading-tight my-0.5">
                    {idioma === "EN" ? fechaTicket.fechaEn : fechaTicket.fechaEs}
                  </span>
                  <span className="text-[7px] sm:text-[7.5px] tracking-[0.26em] text-[#D4AF37] font-serif uppercase mt-0.5">
                    {idioma === "EN" ? `AT ${fechaTicket.horaEn}` : fechaTicket.horaEs}
                  </span>
                </div>
              </div>
              )}
            </div>
          )}
        </section>

        {/* =========================================================================
            SECCIONES SIGUIENTES (HABILITADAS AL ABRIR EL SOBRE)
           ========================================================================= */}
        {sobreAbierto && (
          <div
            ref={contenidoRef}
            className="w-full flex flex-col items-center gap-14 pl-0 pr-4 pb-2 animate-gatsby-rise mt-0"
            style={{ animationDelay: "150ms" }}
          >
            {/* =====================================================================
                SECCIÓN 2: PEQUEÑA GALERÍA / COLLAGE FOTOGRÁFICO VINTAGE
               ===================================================================== */}
            <section className="w-full flex flex-col items-center select-none pt-0 pb-2">
              <div
                className="relative w-full max-w-[390px] h-[360px]"
                style={{
                  marginTop: "16px",
                  marginBottom: "24px",
                }}
              >
                {/* -------------------------------------------------------------
                    CAPA 0 (Base Inferior — z-index: 1): Bandeja ovalada dorada
                   ------------------------------------------------------------- */}
                <div
                  className="absolute pointer-events-none select-none"
                  style={{
                    width: "490px",
                    left: "-50px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    filter: "drop-shadow(0 20px 35px rgba(0,0,0,0.95))",
                  }}
                >
                  <img
                    src={GATSBY_20S_ASSETS.goldOval}
                    alt="Bandeja ovalada dorada vintage"
                    className="w-full h-auto object-contain block"
                  />
                </div>

                {/* -------------------------------------------------------------
                    CAPA 1 (Sobre la bandeja al fondo — z-index: 2 y 3):
                    Sobre negro inclinado + Collar de perlas blancas
                   ------------------------------------------------------------- */}
                {/* Sobre negro inclinado (width: 50%, right: 0%, top: 30%, transform: rotate(-10deg), z-index: 2) */}
                <div
                  className="absolute pointer-events-none select-none"
                  style={{
                    width: "50%",
                    right: "0%",
                    top: "30%",
                    transform: "rotate(-10deg)",
                    zIndex: 2,
                    filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.95))",
                  }}
                >
                  <img
                    src={GATSBY_20S_ASSETS.envelopeClosed}
                    alt="Sobre negro vintage apoyado sobre la bandeja"
                    className="w-full h-auto object-contain block opacity-95"
                  />
                </div>

                {/* Collar de perlas blancas (width: 370px, right: -10%, top: 14%, z-index: 3) */}
                <div
                  className="absolute pointer-events-none select-none"
                  style={{
                    width: "370px",
                    right: "-10%",
                    top: "14%",
                    zIndex: 3,
                    transform: "scaleX(-1) rotate(15deg)",
                    filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.9))",
                  }}
                >
                  <img
                    src={GATSBY_20S_ASSETS.pearls}
                    alt="Collar de perlas blancas"
                    className="w-full h-auto object-contain block opacity-95"
                  />
                </div>

                {/* -------------------------------------------------------------
                    CAPA 2 (Tira de Photobooth a la Derecha — z-index: 4):
                    Papel crema con 3 fotos cuadradas en B&W
                   ------------------------------------------------------------- */}
                <div
                  className="absolute flex flex-col items-center"
                  style={{
                    width: "31%",
                    right: "13%",
                    top: "8%",
                    transform: "rotate(3deg)",
                    backgroundColor: "#f4f1ea",
                    padding: "6px 6px 14px 6px",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.85)",
                    zIndex: 4,
                    borderRadius: "2px",
                  }}
                >
                  <div
                    className="w-full flex flex-col"
                    style={{ gap: "5px" }}
                  >
                    {/* Foto 1 (photobooth-1.jpg) */}
                    <div className="w-full aspect-square overflow-hidden bg-[#181818] rounded-[1px]">
                      <img
                        src={GATSBY_20S_ASSETS.photobooth1}
                        alt="Photobooth 1"
                        className="w-full h-full object-cover block"
                        style={{ filter: "grayscale(100%) contrast(1.15)" }}
                      />
                    </div>

                    {/* Foto 2 (photobooth-2.jpg) */}
                    <div className="w-full aspect-square overflow-hidden bg-[#181818] rounded-[1px]">
                      <img
                        src={GATSBY_20S_ASSETS.photobooth2}
                        alt="Photobooth 2"
                        className="w-full h-full object-cover block"
                        style={{ filter: "grayscale(100%) contrast(1.15)" }}
                      />
                    </div>

                    {/* Foto 3 (photobooth-3.jpg) */}
                    <div className="w-full aspect-square overflow-hidden bg-[#181818] rounded-[1px]">
                      <img
                        src={GATSBY_20S_ASSETS.photobooth3}
                        alt="Photobooth 3"
                        className="w-full h-full object-cover block"
                        style={{ filter: "grayscale(100%) contrast(1.15)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CAPA 3 (Marco Barroco Dorado a la Izquierda — z-index: 5):
                    Marco 4f.png + Foto a color quinceanera-dorado.jpg
                   ------------------------------------------------------------- */}
                <div
                  className="absolute"
                  style={{
                    width: "52%",
                    left: "7%",
                    top: "11%",
                    transform: "rotate(-3deg)",
                    zIndex: 5,
                    filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.9))",
                  }}
                >
                  <div className="relative w-full aspect-[3/4]">
                    {/* Foto a color quinceanera-dorado.jpg */}
                    <div className="absolute inset-[13.5%] overflow-hidden rounded-xs bg-[#111111]">
                      <img
                        src={GATSBY_20S_ASSETS.quinceaneraDorado || GATSBY_20S_ASSETS.photoChloeDress}
                        alt={nombreQuinceanera}
                        className="w-full h-full object-cover block"
                        style={{ objectPosition: "top center" }}
                      />
                    </div>

                    {/* Marco ornamental barroco dorado superpuesto (4f.png) */}
                    <img
                      src={GATSBY_20S_ASSETS.goldFrame}
                      alt="Marco Barroco Ornamental"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none block"
                    />
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CAPA 4 (Adornos en Primer Plano — z-index: 6):
                    Destello superior + Pluma dorada
                   ------------------------------------------------------------- */}
                {/* Destello superior (2a8f841c99e752562e974ce53dc05255.png) */}
                <div
                  className="absolute pointer-events-none select-none"
                  style={{
                    width: "42px",
                    left: "5%",
                    top: "6%",
                    zIndex: 6,
                    filter: "drop-shadow(0 0 10px rgba(243,229,171,0.7))",
                  }}
                >
                  <img
                    src={GATSBY_20S_ASSETS.sparklerStar}
                    alt="Destello dorado superior"
                    className="w-full h-auto object-contain block"
                  />
                </div>

                {/* Pluma dorada (0d2f707047d95435120acb0d2524b26a.png) */}
                <div
                  className="absolute pointer-events-none select-none"
                  style={{
                    width: "200px",
                    left: "14%",
                    bottom: "3%",
                    transform: "rotate(-16deg)",
                    zIndex: 6,
                    filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.85))",
                  }}
                >
                  <img
                    src={GATSBY_20S_ASSETS.goldFeather}
                    alt="Pluma dorada ornamental"
                    className="w-full h-auto object-contain block"
                  />
                </div>
              </div>
            </section>

            {/* =====================================================================
                SECCIÓN 3: PADRES Y CORTE DE HONOR (DISEÑO ABIERTO ART DÉCO)
               ===================================================================== */}
            {isSectionActive("corteHonor") && (<section className="w-full flex flex-col items-center select-none py-2">
              {/* Contenedor abierto y centrado sobre el fondo negro texturizado */}
              <div
                className="w-[92%] max-w-[400px] flex flex-col items-center"
                style={{
                  margin: "32px auto",
                  background: "transparent",
                }}
              >
                {/* Corona / Tiara Art Déco Superior (Untitled design (17).png) */}
                <img
                  src={GATSBY_20S_ASSETS.tiaraArtDeco}
                  alt="Corona Art Déco"
                  className="block object-contain"
                  style={{
                    width: "150px",
                    margin: "0 auto 12px auto",
                    filter: "drop-shadow(0 4px 12px rgba(212,175,55,0.35))",
                  }}
                />

                {/* -------------------------------------------------------------
                    BLOQUE 1: PADRES (PARENTS / PADRES)
                   ------------------------------------------------------------- */}
                {corte.showParents !== false && (<>
                <h3
                  className="font-marcellus text-[11px] text-[#d4af37] uppercase text-center"
                  style={{ letterSpacing: "0.25em" }}
                >
                  {idioma === "EN" ? "PARENTS" : "PADRES"}
                </h3>

                <p
                  className="font-gatsby-display text-[17px] text-center mt-1.5 leading-snug"
                  style={{ marginBottom: "28px" }}
                >
                  {padresTexto}
                </p>
                </>)}

                {/* -------------------------------------------------------------
                    BLOQUE 2: DAMAS EN DOS COLUMNAS + FOTO EDITORIAL
                   ------------------------------------------------------------- */}
                {corte.showDamas !== false && (<>
                <h3
                  className="font-marcellus text-[11px] text-[#d4af37] uppercase text-center"
                  style={{ letterSpacing: "0.25em" }}
                >
                  DAMAS
                </h3>

                {/* Cuadrícula de 2 columnas */}
                <div
                  className="w-full"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px 16px",
                    textAlign: "center",
                    marginTop: "14px",
                  }}
                >
                  {/* Columna 1 */}
                  <div className="flex flex-col gap-2.5">
                    {damasLista.slice(0, 4).map((nombreDama, idx) => (
                      <p
                        key={idx}
                        className="font-marcellus text-[12px] text-[#f5e6ab] uppercase tracking-wider leading-tight whitespace-nowrap"
                      >
                        {nombreDama}
                      </p>
                    ))}
                  </div>

                  {/* Columna 2 */}
                  <div className="flex flex-col gap-2.5">
                    {damasLista.slice(4).map((nombreDama, idx) => (
                      <p
                        key={idx}
                        className="font-marcellus text-[12px] text-[#f5e6ab] uppercase tracking-wider leading-tight whitespace-nowrap"
                      >
                        {nombreDama}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Foto cuadrada damas-gatsby.jpg con esquinero Art Déco */}
                <div
                  className="relative rounded-xs"
                  style={{
                    width: "210px",
                    height: "210px",
                    margin: "22px auto 32px auto",
                    border: "1px solid #d4af37",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.85)",
                  }}
                >
                  {/* Esquinero Art Déco (Untitled design (21).png) en esquina superior izquierda */}
                  <img
                    src={GATSBY_20S_ASSETS.esquineroArtDeco}
                    alt="Esquinero dorado"
                    className="absolute -top-2.5 -left-2.5 pointer-events-none z-10"
                    style={{
                      width: "55px",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))",
                    }}
                  />

                  <img
                    src={fotoDamasUrl}
                    alt="Damas de Honor"
                    className="w-full h-full object-cover block rounded-xs"
                  />
                </div>
                </>)}

                {/* -------------------------------------------------------------
                    BLOQUE 3: CHAMBELÁN DE HONOR Y CHAMBELANES EN DOS COLUMNAS + FOTO
                   ------------------------------------------------------------- */}
                {corte.showChambelan !== false && (<>
                <h3
                  className="font-marcellus text-[11px] text-[#d4af37] uppercase text-center"
                  style={{ letterSpacing: "0.25em" }}
                >
                  {idioma === "EN" ? "HEAD CHAMBELÁN" : "CHAMBELÁN DE HONOR"}
                </h3>

                <p className="font-gatsby-display text-[17px] text-center mt-1.5 leading-snug">
                  {chambelanHonor}
                </p>
                </>)}

                {corte.showChambelanes !== false && (<>
                <h4
                  className="font-marcellus text-[11px] text-[#d4af37] uppercase text-center"
                  style={{ letterSpacing: "0.25em", marginTop: "20px" }}
                >
                  CHAMBELANES
                </h4>

                {/* Cuadrícula de 2 columnas */}
                <div
                  className="w-full"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px 16px",
                    textAlign: "center",
                    marginTop: "14px",
                  }}
                >
                  {/* Columna 1 */}
                  <div className="flex flex-col gap-2.5">
                    {chambelanesLista.slice(0, 4).map((nombreChambelan, idx) => (
                      <p
                        key={idx}
                        className="font-marcellus text-[12px] text-[#f5e6ab] uppercase tracking-wider leading-tight whitespace-nowrap"
                      >
                        {nombreChambelan}
                      </p>
                    ))}
                  </div>

                  {/* Columna 2 */}
                  <div className="flex flex-col gap-2.5">
                    {chambelanesLista.slice(4).map((nombreChambelan, idx) => (
                      <p
                        key={idx}
                        className="font-marcellus text-[12px] text-[#f5e6ab] uppercase tracking-wider leading-tight whitespace-nowrap"
                      >
                        {nombreChambelan}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Foto cuadrada chambelanes-gatsby.jpg con esquinero Art Déco */}
                <div
                  className="relative rounded-xs"
                  style={{
                    width: "210px",
                    height: "210px",
                    margin: "22px auto",
                    border: "1px solid #d4af37",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.85)",
                  }}
                >
                  {/* Esquinero Art Déco en esquina inferior derecha (rotado 180deg) */}
                  <img
                    src={GATSBY_20S_ASSETS.esquineroArtDeco}
                    alt="Esquinero dorado"
                    className="absolute -bottom-2.5 -right-2.5 pointer-events-none z-10"
                    style={{
                      width: "55px",
                      transform: "rotate(180deg)",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))",
                    }}
                  />

                  <img
                    src={fotoChambelanesUrl}
                    alt="Chambelanes de Honor"
                    className="w-full h-full object-cover block rounded-xs"
                  />
                </div>
                </>)}

                {/* Remate final de sección: Abanico de plumas (Untitled design (22).png) */}
                <img
                  src={GATSBY_20S_ASSETS.abanicoPlumas}
                  alt="Abanico de plumas Art Déco"
                  className="block object-contain"
                  style={{
                    width: "110px",
                    margin: "24px auto 8px auto",
                    filter: "drop-shadow(0 4px 10px rgba(212,175,55,0.3))",
                  }}
                />
              </div>
            </section>)}


            {/* =====================================================================
                SECCIÓN 4: CUENTA REGRESIVA, UBICACIONES, ITINERARIO Y CÓDIGO DE VESTIMENTA
               ===================================================================== */}
            <section className="w-full flex flex-col items-center select-none">
              {/* Bloque 1: Cuenta Regresiva (Countdown) */}
              {isSectionActive("cuentaRegresiva") && (
                <div className="w-full flex flex-col items-center text-center">
                <h3
                  className="font-marcellus text-[11px] text-[#d4af37] tracking-[0.25em] uppercase"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                >
                  {idioma === "EN" ? "COUNTDOWN TO THE GALA" : "CUENTA REGRESIVA"}
                </h3>

                <div
                  className="grid grid-cols-4 gap-2 text-center"
                  style={{
                    width: "88%",
                    maxWidth: "350px",
                    margin: "14px auto 34px auto",
                  }}
                >
                  {/* DÍAS / DAYS */}
                  <div
                    className="flex flex-col items-center justify-center py-2.5 px-1"
                    style={{
                      borderRadius: "0px",
                      backgroundColor: "#0e0e0e",
                      border: "1px solid #d4af37",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
                    }}
                  >
                    <span
                      className="font-gatsby-display text-[22px] leading-tight text-[#f5e6ab]"
                      style={{ textShadow: "0 2px 8px rgba(212,175,55,0.4)" }}
                    >
                      {tiempoRestante.dias}
                    </span>
                    <span className="font-marcellus text-[9px] text-[#d4af37] uppercase tracking-wider mt-1">
                      {idioma === "EN" ? "DAYS" : "DÍAS"}
                    </span>
                  </div>

                  {/* HORAS / HOURS */}
                  <div
                    className="flex flex-col items-center justify-center py-2.5 px-1"
                    style={{
                      borderRadius: "0px",
                      backgroundColor: "#0e0e0e",
                      border: "1px solid #d4af37",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
                    }}
                  >
                    <span
                      className="font-gatsby-display text-[22px] leading-tight text-[#f5e6ab]"
                      style={{ textShadow: "0 2px 8px rgba(212,175,55,0.4)" }}
                    >
                      {String(tiempoRestante.horas).padStart(2, "0")}
                    </span>
                    <span className="font-marcellus text-[9px] text-[#d4af37] uppercase tracking-wider mt-1">
                      {idioma === "EN" ? "HOURS" : "HORAS"}
                    </span>
                  </div>

                  {/* MINUTOS / MIN */}
                  <div
                    className="flex flex-col items-center justify-center py-2.5 px-1"
                    style={{
                      borderRadius: "0px",
                      backgroundColor: "#0e0e0e",
                      border: "1px solid #d4af37",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
                    }}
                  >
                    <span
                      className="font-gatsby-display text-[22px] leading-tight text-[#f5e6ab]"
                      style={{ textShadow: "0 2px 8px rgba(212,175,55,0.4)" }}
                    >
                      {String(tiempoRestante.minutos).padStart(2, "0")}
                    </span>
                    <span className="font-marcellus text-[9px] text-[#d4af37] uppercase tracking-wider mt-1">
                      {idioma === "EN" ? "MIN" : "MIN"}
                    </span>
                  </div>

                  {/* SEGUNDOS / SEC */}
                  <div
                    className="flex flex-col items-center justify-center py-2.5 px-1"
                    style={{
                      borderRadius: "0px",
                      backgroundColor: "#0e0e0e",
                      border: "1px solid #d4af37",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
                    }}
                  >
                    <span
                      className="font-gatsby-display text-[22px] leading-tight text-[#f5e6ab]"
                      style={{ textShadow: "0 2px 8px rgba(212,175,55,0.4)" }}
                    >
                      {String(tiempoRestante.segundos).padStart(2, "0")}
                    </span>
                    <span className="font-marcellus text-[9px] text-[#d4af37] uppercase tracking-wider mt-1">
                      {idioma === "EN" ? "SEC" : "SEG"}
                    </span>
                  </div>
                </div>
              </div>
              )}

              {/* Bloque 2: Cuándo y Dónde (Dos tarjetas separadas) */}
              {/* Tarjeta A (Ceremonia / Misa) */}
              {data.mostrarCeremonia !== false && isSectionActive("ubicaciones") && (
                <div
                  className="relative"
                  style={{
                    width: "88%",
                    maxWidth: "350px",
                    margin: "0 auto 24px auto",
                    padding: "18px",
                    borderRadius: "0px",
                    backgroundColor: "#111111",
                    backgroundImage: `url(${GATSBY_20S_ASSETS.artDecoPattern})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "0px",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.9)",
                  }}
                >
                  <div
                    className="w-full flex flex-col items-center text-center"
                    style={{
                      borderRadius: "0px",
                      backgroundColor: "#0e0e0e",
                      border: "0px solid",
                      padding: "24px 18px",
                    }}
                  >
                    <h3
                      className="font-geotica text-[24px] leading-none"
                      style={{
                        color: "#f5e6ab",
                        textShadow: "0 2px 10px rgba(212, 175, 55, 0.35)",
                      }}
                    >
                      {idioma === "EN" ? "CEREMONY" : "CEREMONIA"}
                    </h3>

                    <div
                      className="font-marcellus text-[13px] text-[#f5e6ab] flex flex-col items-center"
                      style={{
                        lineHeight: "1.7",
                        marginTop: "12px",
                      }}
                    >
                      <p className="font-bold tracking-widest text-[#d4af37]">
                        {horaPlacaTexto("5:00 PM")}
                      </p>
                      <p className="font-semibold tracking-wider mt-0.5">
                        {data.ceremoniaNombre || "ST. PATRICK CATHEDRAL"}
                      </p>
                      <p className="tracking-wide text-xs opacity-90">
                        {data.ceremoniaDireccion || "120 MAIN STREET, LOS ANGELES, CA"}
                      </p>
                    </div>

                    <a
                      href={
                        data.ceremoniaMapUrl ||
                        getMapDirectionsUrl(data.ceremoniaDireccion, data.ceremoniaNombre) ||
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${data.ceremoniaNombre || "St. Patrick Cathedral"}, ${data.ceremoniaDireccion || "120 Main Street, Los Angeles, CA"}`
                        )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-marcellus text-[13px] text-[#d4af37] hover:text-[#f5e6ab] transition-colors uppercase"
                      style={{
                        marginTop: "16px",
                        letterSpacing: "0.18em",
                        textDecoration: "underline",
                        textUnderlineOffset: "5px",
                      }}
                    >
                      {idioma === "EN" ? "MAPS" : "VER MAPA"}
                    </a>
                  </div>
                </div>
              )}

              {/* Tarjeta B (Recepción / Fiesta) */}
              {data.mostrarRecepcion !== false && isSectionActive("ubicaciones") && (
                <div
                  className="relative"
                  style={{
                    width: "88%",
                    maxWidth: "350px",
                    margin: "0 auto 34px auto",
                    padding: "18px",
                    borderRadius: "0px",
                    backgroundColor: "#111111",
                    backgroundImage: `url(${GATSBY_20S_ASSETS.artDecoPattern})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "0px",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.9)",
                  }}
                >
                  <div
                    className="w-full flex flex-col items-center text-center"
                    style={{
                      borderRadius: "0px",
                      backgroundColor: "#0e0e0e",
                      border: "0px solid",
                      padding: "24px 18px",
                    }}
                  >
                    <h3
                      className="font-geotica text-[24px] leading-none"
                      style={{
                        color: "#f5e6ab",
                        textShadow: "0 2px 10px rgba(212, 175, 55, 0.35)",
                      }}
                    >
                      {idioma === "EN" ? "RECEPTION" : "RECEPCIÓN"}
                    </h3>

                    <div
                      className="font-marcellus text-[13px] text-[#f5e6ab] flex flex-col items-center"
                      style={{
                        lineHeight: "1.7",
                        marginTop: "12px",
                      }}
                    >
                      <p className="font-bold tracking-widest text-[#d4af37]">
                        {horaRecepcionTexto("7:00 PM")}
                      </p>
                      <p className="font-semibold tracking-wider mt-0.5">
                        {data.recepcionNombre || config.venueNombre || "THE GRAND GATSBY HALL"}
                      </p>
                      <p className="tracking-wide text-xs opacity-90">
                        {data.recepcionDireccion || config.venueDireccion || "123 TOWN ROAD, LOS ANGELES, CA"}
                      </p>
                    </div>

                    <a
                      href={
                        data.recepcionMapUrl ||
                        getMapDirectionsUrl(data.recepcionDireccion, data.recepcionNombre) ||
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${data.recepcionNombre || "The Grand Gatsby Hall"}, ${data.recepcionDireccion || "123 Town Road, Los Angeles, CA"}`
                        )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-marcellus text-[13px] text-[#d4af37] hover:text-[#f5e6ab] transition-colors uppercase"
                      style={{
                        marginTop: "16px",
                        letterSpacing: "0.18em",
                        textDecoration: "underline",
                        textUnderlineOffset: "5px",
                      }}
                    >
                      {idioma === "EN" ? "MAPS" : "VER MAPA"}
                    </a>
                  </div>
                </div>
              )}

              {/* Bloque 3: Itinerario del Evento (Timeline) */}
              {isSectionActive("itinerario") && (
                <div
                className="flex flex-col items-center text-center"
                style={{
                  width: "86%",
                  maxWidth: "340px",
                  margin: "0 auto 34px auto",
                }}
              >
                <h3
                  className="font-geotica text-[24px] leading-none"
                  style={{
                    color: "#f5e6ab",
                    textShadow: "0 2px 10px rgba(212, 175, 55, 0.35)",
                  }}
                >
                  {idioma === "EN" ? "ITINERARY" : "ITINERARIO"}
                </h3>

                {/* Línea de tiempo vertical centrada */}
                <div className="relative w-full flex flex-col items-center mt-6">
                  {/* Línea delgada dorada en el eje */}
                  <div
                    className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 pointer-events-none"
                    style={{
                      width: "1px",
                      backgroundColor: "rgba(212, 175, 55, 0.45)",
                    }}
                  />

                  {/* Momentos del Timeline dinámicos desde admin */}
                  {(
                    (Array.isArray(data.itinerarioJson) && data.itinerarioJson.length > 0)
                      ? data.itinerarioJson.map((it: any) => ({
                          hora: it.hora || it.time || "",
                          eventoEn: it.tituloEn || it.titulo || it.evento || "",
                          eventoEs: it.titulo || it.evento || it.tituloEn || "",
                        }))
                      : (Array.isArray(data.itinerario) && data.itinerario.length > 0)
                      ? data.itinerario.map((it: any) => ({
                          hora: it.hora || it.time || "",
                          eventoEn: it.tituloEn || it.titulo || it.evento || "",
                          eventoEs: it.titulo || it.evento || it.tituloEn || "",
                        }))
                      : [
                          { hora: "5:00 PM", eventoEn: "Ceremony", eventoEs: "Ceremonia" },
                          { hora: "7:00 PM", eventoEn: "Cocktail & Reception", eventoEs: "Cóctel y Recepción" },
                          { hora: "8:30 PM", eventoEn: "Waltz & Toast", eventoEs: "Vals y Brindis" },
                          { hora: "9:30 PM", eventoEn: "Gala Dinner", eventoEs: "Cena de Gala" },
                          { hora: "10:30 PM", eventoEn: "Roaring Party", eventoEs: "Baile y Fiesta" },
                        ]
                  ).map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 w-full py-2.5 relative z-10"
                    >
                      {/* Hora a la izquierda */}
                      <span
                        className="font-marcellus text-[13px] text-[#f5e6ab] text-right font-medium tracking-wider"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                      >
                        {item.hora}
                      </span>

                      {/* Rombo dorado centrado */}
                      <div
                        className="w-[6px] h-[6px] rotate-45 flex-shrink-0"
                        style={{
                          backgroundColor: "#d4af37",
                          boxShadow: "0 0 6px rgba(212, 175, 55, 0.8)",
                        }}
                      />

                      {/* Evento a la derecha */}
                      <span
                        className="font-marcellus text-[13px] text-[#f5e6ab] text-left tracking-wide"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                      >
                        {idioma === "EN" ? item.eventoEn : item.eventoEs}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Bloque 4: Código de Vestimenta (Dress Code) */}
              {isSectionActive("dressCode") && (
                <div
                  className="relative"
                  style={{
                    width: "88%",
                    maxWidth: "350px",
                    margin: "0 auto 32px auto",
                    padding: "18px",
                    borderRadius: "0px",
                    backgroundColor: "#111111",
                    backgroundImage: `url(${GATSBY_20S_ASSETS.artDecoPattern})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "0px",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.9)",
                  }}
                >
                  <div
                    className="w-full flex flex-col items-center text-center"
                    style={{
                      borderRadius: "0px",
                      backgroundColor: "#0e0e0e",
                      border: "0px solid",
                      padding: "26px 18px",
                    }}
                  >
                    <h3
                      className="font-geotica text-[24px] leading-none"
                      style={{
                        color: "#f5e6ab",
                        textShadow: "0 2px 10px rgba(212, 175, 55, 0.35)",
                      }}
                    >
                      {idioma === "EN"
                        ? (data.dressCodeTituloEn || data.dressCodeTitulo || config.dressCodeTitulo || "DRESS CODE")
                        : (data.dressCodeTitulo || config.dressCodeTitulo || "VESTIMENTA")}
                    </h3>

                    <p
                      className="font-marcellus text-[13px] text-[#f5e6ab] leading-relaxed max-w-[280px]"
                      style={{
                        margin: "12px auto 8px auto",
                      }}
                    >
                      {(idioma === "EN" ? data.dressCodeNotaEn : data.dressCodeNota) ||
                        data.dressCodeEtiqueta ||
                        config.dressCodeTexto ||
                        (idioma === "EN"
                          ? "Formal Gatsby Attire: 1920s flapper dresses and dapper suits encouraged."
                          : "Etiqueta Formal Gatsby: Se sugiere vestimenta elegante años 20 y trajes de etiqueta.")}
                    </p>

                    {/* Línea de colores reservados (editable en el admin, Sección 7 Vestimenta) */}
                    {coloresReservadosTexto !== "" && (
                      <p
                        className="font-marcellus text-[11px] text-[#d4af37] leading-normal max-w-[270px] italic"
                        style={{
                          marginBottom: "16px",
                        }}
                      >
                        {coloresReservadosTexto}
                      </p>
                    )}

                    <img
                      src={GATSBY_20S_ASSETS.coupleDance}
                      alt="1920s Dancing Couple"
                      className="object-contain block opacity-95"
                      style={{
                        height: "68px",
                        width: "auto",
                        filter: "drop-shadow(0 4px 14px rgba(212,175,55,0.4))",
                      }}
                    />
                  </div>
                </div>
              )}
            </section>



            {/* =====================================================================
                SECCIÓN 5: MESA DE REGALOS Y FORMULARIO RSVP
               ===================================================================== */}
            <section className="w-full flex flex-col items-center select-none">
              {/* Bloque 1: Mesa de Regalos / Lluvia de Sobres (GIFT REGISTRY / MESA DE REGALOS) */}
              {isSectionActive("mesaRegalos") && (
                <div
                className="flex flex-col items-center text-center"
                style={{
                  width: "88%",
                  maxWidth: "350px",
                  margin: "12px auto 36px auto",
                }}
              >
                <h3
                  className="font-geotica text-[24px] leading-none"
                  style={{
                    color: "#f5e6ab",
                    textShadow: "0 2px 10px rgba(212, 175, 55, 0.35)",
                  }}
                >
                  {idioma === "EN" ? "GIFT REGISTRY" : "MESA DE REGALOS"}
                </h3>

                <img
                  src={GATSBY_20S_ASSETS.envelopeOpen}
                  alt="Lluvia de Sobres / Gift Registry"
                  className="block object-contain"
                  style={{
                    width: "95px",
                    margin: "14px auto",
                    filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.85))",
                  }}
                />

                <p
                  className="font-marcellus text-[13px] text-[#f5e6ab] leading-[1.65]"
                  style={{ marginBottom: "18px" }}
                >
                  {idioma === "EN"
                    ? `Your presence is our greatest gift. If you wish to honor ${nombreQuinceanera} with a token of love, an envelope box will be available at the reception, or you may view her registry below.`
                    : `Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con ${nombreQuinceanera}, contaremos con lluvia de sobres en la recepción o puedes consultar su mesa de regalos.`}
                </p>

                {/* Botón 1: Zelle / Datos Lluvia de Sobres con copia al portapapeles */}
                <button
                  type="button"
                  onClick={() => {
                    copiarCuenta();
                    setMostrarRegaloModal((prev) => !prev);
                  }}
                  className="w-full flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-[#d4af37]/20"
                  style={{
                    borderRadius: "0px",
                    border: "1px solid #d4af37",
                    backgroundColor: "#0e0e0e",
                    color: "#f5e6ab",
                    fontFamily: "'Marcellus', serif",
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                    padding: "11px 16px",
                    textTransform: "uppercase",
                  }}
                >
                  <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>
                    {cuentaCopiada
                      ? (idioma === "EN" ? "COPIED!" : "¡COPIADO!")
                      : (idioma === "EN" ? "ENVELOPE / ZELLE DETAILS" : "DATOS LLUVIA DE SOBRES")}
                  </span>
                </button>

                {/* Desplegable opcional con datos visibles */}
                {mostrarRegaloModal && (
                  <div
                    className="w-full mt-2.5 p-3 text-center animate-fadeIn"
                    style={{
                      borderRadius: "0px",
                      backgroundColor: "#0e0e0e",
                      border: "1px solid rgba(212, 175, 55, 0.5)",
                    }}
                  >
                    <p className="font-marcellus text-[11px] text-[#d4af37] tracking-wider uppercase mb-1">
                      {idioma === "EN" ? "ZELLE & ACCOUNT DETAILS" : "DATOS DE ZELLE Y TRANSFERENCIA"}
                    </p>
                    {data.regalosZelle ? (
                      <p className="font-mono text-xs text-[#f5e6ab] select-all">
                        {data.regalosZelle}
                      </p>
                    ) : (
                      <p className="font-marcellus text-xs text-[#f5e6ab]">
                        {idioma === "EN" ? "Ask the family for the details at the reception." : "Pregunta por los datos en la recepción."}
                      </p>
                    )}
                  </div>
                )}

                {/* Botón 2: Mesa de regalos externa (Amazon Registry) */}
                <a
                  href="https://www.amazon.com/registries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-[#d4af37]/20"
                  style={{
                    marginTop: "10px",
                    borderRadius: "0px",
                    border: "1px solid #d4af37",
                    backgroundColor: "#0e0e0e",
                    color: "#f5e6ab",
                    fontFamily: "'Marcellus', serif",
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                    padding: "11px 16px",
                    textTransform: "uppercase",
                  }}
                >
                  <Gift className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>
                    {idioma === "EN" ? "VIEW AMAZON REGISTRY" : "VER MESA DE REGALOS"}
                  </span>
                </a>
              </div>
              )}

              {/* Bloque 2: RSVP - Formulario del sistema con marco dorado Gatsby (ba.png) */}
              {isSectionActive("rsvp") && (
                <div data-preview-section="rsvp" className="w-full flex justify-center mb-9">
                  <div
                    className="relative"
                    style={{
                      width: "88%",
                      maxWidth: "380px",
                      margin: "0 auto",
                      padding: "18px",
                      borderRadius: "0px",
                      backgroundColor: "#111111",
                      backgroundImage: `url(${GATSBY_20S_ASSETS.artDecoPattern})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "0px",
                      boxShadow: "0 15px 40px rgba(0,0,0,0.9)",
                    }}
                  >
                    <div
                      className="w-full flex flex-col items-center text-center"
                      style={{
                        borderRadius: "0px",
                        backgroundColor: "#0e0e0e",
                        border: "1px solid #d4af37",
                        padding: "26px 18px",
                      }}
                    >
                      <h3
                        className="font-gatsby-display text-[44px] leading-none"
                        style={{ color: "#f5e6ab" }}
                      >
                        RSVP
                      </h3>
                      <div className="gatsby-rsvp-dark w-full mt-4">
                        <DynamicRsvpForm
                          slug={data.slug || "demo"}
                          eventTitle={data.titulo}
                          eventDate={data.fechaEvento}
                          ceremoniaMapUrl={data.ceremoniaMapUrl}
                          recepcionMapUrl={data.recepcionMapUrl}
                          telefonoWhatsapp={data.telefonoWhatsappRsvp}
                          primaryColor="#C5A059"
                          accentBgColor="bg-[#0e0e0e]"
                          deadlineText={data.rsvpFechaLimite || "POR FAVOR, CONFIRMA TU ASISTENCIA."}
                          deadlineTextEn={data.rsvpFechaLimiteEn || "PLEASE CONFIRM YOUR ATTENDANCE."}
                          rsvpTitulo=""
                          rsvpTituloEn=""
                          rsvpSubtitulo=""
                          rsvpSubtituloEn=""
                          rsvpTelefonoTitulo={data.rsvpTelefonoTitulo}
                          rsvpTelefonoTituloEn={data.rsvpTelefonoTituloEn}
                          lang={idioma === "EN" ? "en" : "es"}
                          permiteSms={data.permiteSms}
                          tipoPlan={data.tipoPlan}
                          modalidadRsvp={data.modalidadRsvp || undefined}
                          maxPasesPorInvitado={data.maxPasesPorInvitado}
                          permitirConfirmacionTelefono={data.permitirConfirmacionTelefono !== false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* =====================================================================
                SECCIÓN 6: AGRADECIMIENTO (THANK YOU / GRACIAS) - COMPOSICIÓN EN CAPAS
               ===================================================================== */}
            <section className="w-full flex flex-col items-center select-none">
              <div
                className="relative"
                style={{
                  width: "90%",
                  maxWidth: "360px",
                  margin: "0 auto 16px auto",
                  textAlign: "center",
                }}
              >
                {/* 1. Base: Imagen del sobre abierto en flujo normal (define la altura del bloque) */}
                <img
                  src={GATSBY_20S_ASSETS.envelopeOpen}
                  alt="Sobre Gatsby Abierto"
                  className="w-full h-auto block select-none pointer-events-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]"
                />

                {/* 2. Tarjeta superpuesta posicionada dentro del sobre */}
                <div
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "39%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxWidth: "285px",
                    padding: "13px",
                    borderRadius: "0px",
                    border: "none",
                    backgroundImage: `url(${GATSBY_20S_ASSETS.artDecoPattern})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.9)",
                  }}
                >
                  {/* Chispa / Sparkler dorado en CSS puro (esquina superior derecha de la tarjeta) */}
                  <div
                    className="absolute -top-4 -right-4 pointer-events-none select-none z-10"
                    style={{ width: "70px", height: "70px" }}
                  >
                    {/* Glow radial difuso */}
                    <div
                      className="absolute inset-0 rounded-full animate-pulse"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,245,210,0.95) 0%, rgba(212,175,55,0.7) 35%, rgba(212,175,55,0) 70%)",
                        filter: "blur(2px)",
                      }}
                    />
                    {/* Rayos finos en cruz y diagonales */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-[1.5px] bg-gradient-to-r from-transparent via-[#fff5d0] to-transparent rotate-0" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-[1.5px] bg-gradient-to-r from-transparent via-[#fff5d0] to-transparent rotate-90" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent rotate-45" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent -rotate-45" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-[1px] bg-gradient-to-r from-transparent via-[#f5e6ab] to-transparent rotate-[25deg]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-[1px] bg-gradient-to-r from-transparent via-[#f5e6ab] to-transparent -rotate-[25deg]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-[1px] bg-gradient-to-r from-transparent via-[#f5e6ab] to-transparent rotate-[65deg]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-[1px] bg-gradient-to-r from-transparent via-[#f5e6ab] to-transparent -rotate-[65deg]" />
                    {/* Punto central brillante */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"
                      style={{
                        boxShadow: "0 0 8px #ffffff, 0 0 16px #f5e6ab, 0 0 24px #d4af37",
                      }}
                    />
                    {/* Partículas de destellos adyacentes */}
                    <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#fff]" />
                    <div className="absolute bottom-3 left-2 w-1 h-1 rounded-full bg-[#f5e6ab] shadow-[0_0_4px_#f5e6ab]" />
                    <div className="absolute top-3 left-4 w-0.5 h-0.5 rounded-full bg-white" />
                  </div>

                  {/* Panel interior negro mate (#0e0e0e) */}
                  <div
                    className="w-full flex flex-col items-center text-center relative"
                    style={{
                      borderRadius: "0px",
                      backgroundColor: "#0e0e0e",
                      border: "1px solid #d4af37",
                      padding: "22px 14px 20px 14px",
                    }}
                  >
                    {/* Título en tipografía script dorada #f5e6ab, 26px, itálica */}
                    <h3
                      className="font-great-vibes text-[28px] sm:text-[30px] text-[#f5e6ab] italic leading-tight"
                      style={{
                        textShadow: "0 2px 10px rgba(212, 175, 55, 0.45)",
                        marginBottom: "8px",
                      }}
                    >
                      {idioma === "EN" ? "Thank You" : "Gracias"}
                    </h3>

                    {/* Texto en Marcellus, 12px, #f5e6ab, line-height: 1.5 */}
                    <p
                      className="font-marcellus text-[11.5px] sm:text-[12px] text-[#f5e6ab] leading-[1.55] max-w-[220px]"
                      style={{
                        margin: "4px 0 0 0",
                      }}
                    >
                      {idioma === "EN"
                        ? (config.agradecimientoTextoEn ||
                           (data.mensajeDespedida && !data.mensajeDespedida.includes("Love,") ? data.mensajeDespedida : "") ||
                           "Sharing this milestone with you means more than words can say!")
                        : (config.agradecimientoTexto ||
                           (data.mensajeDespedida && !data.mensajeDespedida.includes("Love,") ? data.mensajeDespedida : "") ||
                           "¡Compartir este momento tan especial con ustedes significa más de lo que las palabras pueden expresar!")}
                    </p>
                  </div>
                </div>

                {/* 3. Firma manuscrita en cursiva dorada sobre el bolsillo inferior del sobre (como en la referencia Canva) */}
                <div
                  className="absolute bottom-[6%] sm:bottom-[7%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none"
                >
                  <p
                    className="font-great-vibes text-[22px] sm:text-[25px] text-[#f5e6ab] italic leading-tight"
                    style={{
                      letterSpacing: "0.04em",
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.95)",
                    }}
                  >
                    {idioma === "EN" ? "Love," : "Con cariño,"}
                    <br />
                    <span className="text-[26px] sm:text-[30px]">{nombreQuinceanera}</span>
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
