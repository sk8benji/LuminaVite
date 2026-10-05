import fs from "fs";
import path from "path";
import { saveEventToS3, getEventFromS3, listEventsFromS3 } from "@/lib/s3";

export interface FallbackEvento {
  id: string;
  slug: string;
  panelToken: string;
  titulo: string;
  subtitulo?: string | null;
  frasePersonalizada?: string | null;
  fechaEvento: string;
  fechaTextoPersonalizada?: string | null;
  fotoPortadaUrl: string;
  fotoInfanciaUrl?: string | null;
  fotoActualUrl?: string | null;
  fotoCierreUrl?: string | null;
  musicaUrl?: string | null;
  videoUrl?: string | null;
  galeriaFotosUrls?: string[];
  wishlistUrl?: string | null;
  idiomaDefault?: string;
  celebrationGuideline?: string | null;
  telefonoWhatsappRsvp: string;
  emailOrganizador?: string | null;
  aforoTotal: number;
  fechaLimiteRsvp?: string | null;
  maxPasesPorInvitado: number;
  ceremoniaNombre?: string | null;
  ceremoniaDireccion?: string | null;
  ceremoniaMapUrl?: string | null;
  recepcionNombre: string;
  recepcionDireccion: string;
  recepcionMapUrl: string;
  fechaPlacaMes?: string | null;
  fechaPlacaHora?: string | null;
  fechaPlacaLugar?: string | null;
  countdownEncabezado?: string | null;
  dressCodeEtiqueta?: string | null;
  dressCodeColoresReservados?: string | null;
  regalosMensaje?: string | null;
  regalosZelle?: string | null;
  regalosCashApp?: string | null;
  rsvpFechaLimite?: string | null;
  rsvpDiasAntes?: number | null;
  autorBendicion?: string | null;
  textoDisco?: string | null;
  mensajeDespedida?: string | null;
  dressCodeTitulo?: string | null;
  dressCodeNota?: string | null;
  coloresReservados?: string[];
  itinerarioJson?: any;
  corteHonorJson?: any;
  mesaRegalosJson?: any;
  hospedajeJson?: any;
  transporteJson?: any;
  historiaHitosJson?: any;
  rsvps?: any[];
  createdAt: string;
  updatedAt: string;
}

const memoryStore: Map<string, FallbackEvento> = new Map();

function getStoreFilePath(): string {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
  return path.join(dir, "fallback-events.json");
}

function loadStoreFromFile(): void {
  try {
    const filePath = getStoreFilePath();
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      if (Array.isArray(data)) {
        data.forEach((ev: FallbackEvento) => {
          if (ev && ev.slug) {
            memoryStore.set(ev.slug.toLowerCase(), ev);
          }
        });
      }
    }
  } catch (err) {
    console.warn("No se pudo leer el archivo de almacenamiento temporal:", err);
  }
}

function saveStoreToFile(): void {
  try {
    const filePath = getStoreFilePath();
    const data = Array.from(memoryStore.values());
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("No se pudo persistir el almacenamiento temporal:", err);
  }
}

// Cargar estado inicial
loadStoreFromFile();

export const fallbackEventStore = {
  saveEvent(evento: FallbackEvento): FallbackEvento {
    const cleanEv = {
      ...evento,
      rsvps: evento.rsvps || [],
      updatedAt: new Date().toISOString(),
    };
    memoryStore.set(evento.slug.toLowerCase().trim(), cleanEv);
    saveStoreToFile();
    // Respaldo inmediato en AWS S3 para persistencia permanente
    saveEventToS3(evento.slug, cleanEv).catch(() => {});
    return cleanEv;
  },

  async getEvent(slug: string): Promise<FallbackEvento | undefined> {
    const key = slug.toLowerCase().trim();
    let ev = memoryStore.get(key);
    if (!ev) {
      loadStoreFromFile();
      ev = memoryStore.get(key);
    }
    if (!ev) {
      // Si el contenedor fue reiniciado o reconstruido por Railway, recuperar de AWS S3
      try {
        const s3Ev = await getEventFromS3(key);
        if (s3Ev) {
          memoryStore.set(key, s3Ev);
          saveStoreToFile();
          ev = s3Ev;
        }
      } catch {}
    }
    return ev;
  },

  async getAllEvents(): Promise<FallbackEvento[]> {
    loadStoreFromFile();
    try {
      const s3Events = await listEventsFromS3();
      for (const ev of s3Events) {
        if (ev && ev.slug && !memoryStore.has(ev.slug.toLowerCase())) {
          memoryStore.set(ev.slug.toLowerCase(), ev);
        }
      }
      if (s3Events.length > 0) {
        saveStoreToFile();
      }
    } catch {}

    return Array.from(memoryStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  addRsvp(
    slug: string,
    rsvp: {
      nombreInvitado: string;
      telefono?: string;
      asistira: boolean;
      pases: number;
    }
  ) {
    const key = slug.toLowerCase().trim();
    const ev = memoryStore.get(key);
    if (!ev) return null;

    if (!ev.rsvps) ev.rsvps = [];
    const existingIndex = ev.rsvps.findIndex(
      (r) => r.telefono && rsvp.telefono && r.telefono === rsvp.telefono
    );

    const rsvpRecord = {
      id: `rsvp-${Date.now()}`,
      eventoId: ev.id,
      nombreInvitado: rsvp.nombreInvitado,
      telefono: rsvp.telefono,
      asistira: rsvp.asistira,
      pases: rsvp.pases,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      ev.rsvps[existingIndex] = rsvpRecord;
    } else {
      ev.rsvps.push(rsvpRecord);
    }

    saveStoreToFile();
    saveEventToS3(key, ev).catch(() => {});
    return rsvpRecord;
  },
};
