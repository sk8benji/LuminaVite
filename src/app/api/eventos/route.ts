import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/db";
import { normalizeSlug, getEventBySlug, stripSensitiveEventFields } from "@/lib/events";
import { requireAdmin } from "@/lib/auth";
import { sanitizeEventUrls } from "@/lib/url-safety";
import {
  ensurePanelShortCodeColumn,
  generatePanelShortCodeForNewEvent,
} from "@/lib/panel-link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Validación de modalidad RSVP (igual que el PATCH del panel)
const VALID_MODALIDADES_RSVP = ["ESTRICTO", "HIBRIDO", "ABIERTO"];

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  try {
    // Las consultas de Evento leen todas las columnas: asegurar panelShortCode
    await ensurePanelShortCodeColumn();
    // 1. Si se solicita un evento específico por slug
    if (slug) {
      const cleanSlug = normalizeSlug(slug);
      const evento = await getEventBySlug(cleanSlug);

      if (!evento) {
        return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
      }

      // Nunca exponer passwordHash ni datos internos en JSON
      return NextResponse.json({ evento: stripSensitiveEventFields(evento) });
    }

    // 2. Listado general de eventos para el dashboard administrativo
    const eventos = await prisma.evento.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
    });

    return NextResponse.json({ eventos });
  } catch (error: any) {
    console.error("Error al consultar eventos en PostgreSQL:", error);
    return NextResponse.json(
      { error: "Error al consultar la base de datos.", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    await ensurePanelShortCodeColumn();
    const body = await req.json();

    // C6: sanitizar URLs — solo http(s), rechaza javascript:/data:
    sanitizeEventUrls(body);

    // B3: validar modalidadRsvp igual que el PUT/PATCH del panel
    if (
      body.modalidadRsvp !== undefined &&
      body.modalidadRsvp !== null &&
      !VALID_MODALIDADES_RSVP.includes(body.modalidadRsvp)
    ) {
      return NextResponse.json(
        { error: "Modalidad inválida. Debe ser ESTRICTO, HIBRIDO o ABIERTO." },
        { status: 400 }
      );
    }

    const {
      titulo,
      slug,
      tipoEvento = "QUINCEANERA",
      estiloPlantilla = "PRINCESA_ROSA",
      subtitulo,
      mostrarFrasePersonalizada,
      frasePersonalizada,
      frasePersonalizadaEn,
      fechaEvento,
      fechaTextoPersonalizada,
      fotoPortadaUrl,
      fotoInfanciaUrl,
      fotoActualUrl,
      fotoCierreUrl,
      fotoZapato1Url,
      fotoZapato2Url,
      musicaUrl,
      videoUrl,
      galeriaFotosUrls = [],
      wishlistUrl,
      idiomaDefault = "es",
      celebrationGuideline,
      reproducirMusicaAlAbrir,
      telefonoWhatsappRsvp,
      emailOrganizador,
      aforoTotal = 200,
      fechaLimiteRsvp,
      maxPasesPorInvitado = 4,
      ceremoniaNombre,
      ceremoniaDireccion,
      ceremoniaMapUrl,
      recepcionNombre,
      recepcionDireccion,
      recepcionMapUrl,
      fechaPlacaMes,
      mostrarFechaPlacaHora,
      fechaPlacaHora,
      fechaPlacaHoraEn,
      fechaPlacaLugar,
      countdownEncabezado,
      dressCodeEtiqueta,
      dressCodeColoresReservados,
      regalosMensaje,
      regalosMensajeEn,
      mostrarMesaRegalos,
      regalosZelle,
      regalosCashApp,
      rsvpFechaLimite,
      rsvpDiasAntes,
      autorBendicion,
      textoDisco,
      mensajeDespedida,
      mostrarDressCode,
      dressCodeTitulo,
      dressCodeTituloEn,
      dressCodeNota,
      dressCodeNotaEn,
      coloresReservados,
      itinerario,
      itinerarioJson,
      corteHonorJson,
      mesaRegalosJson,
      hospedajeJson,
      transporteJson,
      historiaHitosJson,
      configPlantilla,
      modalidadRsvp,
      permitirConfirmacionTelefono,
    } = body;

    if (!titulo || !slug || !fechaEvento || !fotoPortadaUrl || !telefonoWhatsappRsvp || !recepcionNombre || !recepcionMapUrl) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios para crear la invitación." },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const parseSafeDate = (val: any): Date | null => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    const parseSafeIsoString = (val: any): string => {
      if (!val) return new Date().toISOString();
      const d = new Date(val);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    };

    // Verificar si ya existe el slug en PostgreSQL
    const existente = await prisma.evento.findUnique({
      where: { slug: cleanSlug },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Ya existe una invitación con este slug (enlace). Elige otro diferente." },
        { status: 409 }
      );
    }

    // Asegurar usuario administrador para asociar el evento
    const adminUser = await prisma.usuario.upsert({
      where: { email: "admin@clickandlove.app" },
      update: {},
      create: {
        email: "admin@clickandlove.app",
        nombre: "Admin Click & Love",
        passwordHash: "system-auto-generated",
        rol: "ADMIN",
      },
    });

    // Panel token de 32 bytes aleatorios (64 hex) — fuerza bruta inviable
    const secretPanelKey = randomBytes(32).toString("hex");

    // Link corto del panel (/m/<code>) generado desde la creación del evento
    const newPanelShortCode = await generatePanelShortCodeForNewEvent();

    const nuevoEvento = await prisma.evento.create({
      data: {
        usuarioId: adminUser.id,
        titulo,
        slug: cleanSlug,
        panelToken: secretPanelKey,
        panelShortCode: newPanelShortCode,
        tipoEvento,
        estiloPlantilla,
        subtitulo: subtitulo || null,
        mostrarFrasePersonalizada: mostrarFrasePersonalizada !== false,
        frasePersonalizada: frasePersonalizada || null,
        frasePersonalizadaEn: frasePersonalizadaEn || null,
        fechaEvento: parseSafeIsoString(fechaEvento),
        fechaTextoPersonalizada: fechaTextoPersonalizada || null,
        fotoPortadaUrl,
        fotoInfanciaUrl: fotoInfanciaUrl || null,
        fotoActualUrl: fotoActualUrl || null,
        fotoCierreUrl: fotoCierreUrl || null,
        fotoZapato1Url: fotoZapato1Url || null,
        fotoZapato2Url: fotoZapato2Url || null,
        musicaUrl: musicaUrl || null,
        reproducirMusicaAlAbrir: reproducirMusicaAlAbrir !== false,
        videoUrl: videoUrl || null,
        galeriaFotosUrls: Array.isArray(galeriaFotosUrls) ? galeriaFotosUrls : [],
        wishlistUrl: wishlistUrl || null,
        idiomaDefault: idiomaDefault || "es",
        celebrationGuideline: celebrationGuideline || null,
        telefonoWhatsappRsvp: telefonoWhatsappRsvp.replace(/[^0-9]/g, ""),
        emailOrganizador: emailOrganizador ? String(emailOrganizador).trim() : null,
        aforoTotal: Number(aforoTotal) || 200,
        fechaLimiteRsvp: parseSafeDate(fechaLimiteRsvp),
        maxPasesPorInvitado: Number(maxPasesPorInvitado) || 4,
        ceremoniaNombre: ceremoniaNombre || null,
        ceremoniaDireccion: ceremoniaDireccion || null,
        ceremoniaMapUrl: ceremoniaMapUrl || null,
        recepcionNombre,
        recepcionDireccion: recepcionDireccion || "",
        recepcionMapUrl,
        fechaPlacaMes: fechaPlacaMes || null,
        mostrarFechaPlacaHora: mostrarFechaPlacaHora !== false,
        fechaPlacaHora: fechaPlacaHora || null,
        fechaPlacaHoraEn: fechaPlacaHoraEn || null,
        fechaPlacaLugar: fechaPlacaLugar || null,
        countdownEncabezado: countdownEncabezado || null,
        dressCodeEtiqueta: dressCodeEtiqueta || null,
        dressCodeColoresReservados: dressCodeColoresReservados || null,
        rsvpFechaLimite: rsvpFechaLimite || null,
        rsvpDiasAntes: rsvpDiasAntes !== undefined && rsvpDiasAntes !== null ? Number(rsvpDiasAntes) : undefined,
        autorBendicion: autorBendicion || null,
        textoDisco: textoDisco || null,
        mensajeDespedida: mensajeDespedida || null,
        mostrarDressCode: mostrarDressCode !== false,
        dressCodeTitulo: dressCodeTitulo || null,
        dressCodeTituloEn: dressCodeTituloEn || null,
        dressCodeNota: dressCodeNota || null,
        dressCodeNotaEn: dressCodeNotaEn || null,
        coloresReservados: coloresReservados || [],
        itinerarioJson: (Array.isArray(itinerario) && itinerario.length > 0) ? itinerario : (itinerarioJson || null),
        regalosMensaje: regalosMensaje || null,
        regalosMensajeEn: regalosMensajeEn || null,
        mostrarMesaRegalos: mostrarMesaRegalos !== false,
        regalosZelle: regalosZelle || null,
        regalosCashApp: regalosCashApp || null,
        corteHonorJson: corteHonorJson || null,
        mesaRegalosJson: mesaRegalosJson || null,
        hospedajeJson: hospedajeJson || null,
        transporteJson: transporteJson || null,
        historiaHitosJson: historiaHitosJson || null,
        configPlantilla: configPlantilla || {},
        modalidadRsvp: modalidadRsvp || "HIBRIDO",
        permitirConfirmacionTelefono: permitirConfirmacionTelefono !== false,
        activo: true,
      },
    });

    return NextResponse.json({ success: true, evento: nuevoEvento });
  } catch (error: any) {
    console.error("Error al crear evento en PostgreSQL:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una invitación con este slug (enlace)." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Ocurrió un error al guardar la invitación en la base de datos." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    // El update devuelve el evento completo: asegurar la columna nueva.
    // OJO: panelShortCode NO va en la lista de campos editables del PUT;
    // el link corto solo se genera/regenera desde sus endpoints de admin.
    await ensurePanelShortCodeColumn();
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Se requiere el slug del evento para actualizar." },
        { status: 400 }
      );
    }

    // B3: validar modalidadRsvp igual que el PATCH del panel
    if (
      body.modalidadRsvp !== undefined &&
      !VALID_MODALIDADES_RSVP.includes(body.modalidadRsvp)
    ) {
      return NextResponse.json(
        { error: "Modalidad inválida. Debe ser ESTRICTO, HIBRIDO o ABIERTO." },
        { status: 400 }
      );
    }

    // C6: sanitizar URLs — solo http(s), rechaza javascript:/data:
    sanitizeEventUrls(body);

    const cleanSlug = slug.toLowerCase().trim();

    const parseSafeDate = (val: any): Date | null => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    const parseSafeIsoString = (val: any): string => {
      if (!val) return new Date().toISOString();
      const d = new Date(val);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    };

    const updatedEvento = await prisma.evento.update({
      where: { slug: cleanSlug },
      data: {
        titulo: body.titulo,
        tipoEvento: body.tipoEvento,
        estiloPlantilla: body.estiloPlantilla,
        subtitulo: body.subtitulo ?? null,
        mostrarFrasePersonalizada: body.mostrarFrasePersonalizada !== undefined ? Boolean(body.mostrarFrasePersonalizada) : undefined,
        frasePersonalizada: body.frasePersonalizada ?? null,
        frasePersonalizadaEn: body.frasePersonalizadaEn ?? null,
        fechaEvento: body.fechaEvento ? parseSafeIsoString(body.fechaEvento) : undefined,
        fechaTextoPersonalizada: body.fechaTextoPersonalizada ?? null,
        fotoPortadaUrl: body.fotoPortadaUrl,
        fotoInfanciaUrl: body.fotoInfanciaUrl ?? null,
        fotoActualUrl: body.fotoActualUrl ?? null,
        fotoCierreUrl: body.fotoCierreUrl ?? null,
        fotoZapato1Url: body.fotoZapato1Url ?? null,
        fotoZapato2Url: body.fotoZapato2Url ?? null,
        musicaUrl: body.musicaUrl ?? null,
        reproducirMusicaAlAbrir: body.reproducirMusicaAlAbrir !== undefined ? Boolean(body.reproducirMusicaAlAbrir) : undefined,
        videoUrl: body.videoUrl ?? null,
        galeriaFotosUrls: Array.isArray(body.galeriaFotosUrls) ? body.galeriaFotosUrls : [],
        wishlistUrl: body.wishlistUrl ?? null,
        idiomaDefault: body.idiomaDefault || "es",
        celebrationGuideline: body.celebrationGuideline ?? null,
        telefonoWhatsappRsvp: body.telefonoWhatsappRsvp ? body.telefonoWhatsappRsvp.replace(/[^0-9]/g, "") : undefined,
        emailOrganizador: body.emailOrganizador ? String(body.emailOrganizador).trim() : null,
        aforoTotal: body.aforoTotal ? Number(body.aforoTotal) : undefined,
        fechaLimiteRsvp: parseSafeDate(body.fechaLimiteRsvp),
        maxPasesPorInvitado: body.maxPasesPorInvitado ? Number(body.maxPasesPorInvitado) : undefined,
        ceremoniaNombre: body.ceremoniaNombre ?? null,
        ceremoniaDireccion: body.ceremoniaDireccion ?? null,
        ceremoniaMapUrl: body.ceremoniaMapUrl ?? null,
        recepcionNombre: body.recepcionNombre,
        recepcionDireccion: body.recepcionDireccion ?? "",
        recepcionMapUrl: body.recepcionMapUrl,
        fechaPlacaMes: body.fechaPlacaMes !== undefined ? (body.fechaPlacaMes || null) : undefined,
        mostrarFechaPlacaHora: body.mostrarFechaPlacaHora !== undefined ? Boolean(body.mostrarFechaPlacaHora) : undefined,
        fechaPlacaHora: body.fechaPlacaHora !== undefined ? (body.fechaPlacaHora || null) : undefined,
        fechaPlacaHoraEn: body.fechaPlacaHoraEn !== undefined ? (body.fechaPlacaHoraEn || null) : undefined,
        fechaPlacaLugar: body.fechaPlacaLugar !== undefined ? (body.fechaPlacaLugar || null) : undefined,
        countdownEncabezado: body.countdownEncabezado !== undefined ? (body.countdownEncabezado || null) : undefined,
        dressCodeEtiqueta: body.dressCodeEtiqueta !== undefined ? (body.dressCodeEtiqueta || null) : undefined,
        dressCodeColoresReservados: body.dressCodeColoresReservados !== undefined ? (body.dressCodeColoresReservados || null) : undefined,
        rsvpFechaLimite: body.rsvpFechaLimite !== undefined ? (body.rsvpFechaLimite || null) : undefined,
        rsvpDiasAntes: body.rsvpDiasAntes !== undefined && body.rsvpDiasAntes !== null ? Number(body.rsvpDiasAntes) : undefined,
        autorBendicion: body.autorBendicion !== undefined ? (body.autorBendicion || null) : undefined,
        textoDisco: body.textoDisco !== undefined ? (body.textoDisco || null) : undefined,
        mensajeDespedida: body.mensajeDespedida !== undefined ? (body.mensajeDespedida || null) : undefined,
        mostrarDressCode: body.mostrarDressCode !== undefined ? Boolean(body.mostrarDressCode) : undefined,
        dressCodeTitulo: body.dressCodeTitulo !== undefined ? (body.dressCodeTitulo || null) : undefined,
        dressCodeTituloEn: body.dressCodeTituloEn !== undefined ? (body.dressCodeTituloEn || null) : undefined,
        dressCodeNota: body.dressCodeNota !== undefined ? (body.dressCodeNota || null) : undefined,
        dressCodeNotaEn: body.dressCodeNotaEn !== undefined ? (body.dressCodeNotaEn || null) : undefined,
        coloresReservados: body.coloresReservados ?? [],
        itinerarioJson: (Array.isArray(body.itinerario) && body.itinerario.length > 0) ? body.itinerario : (body.itinerarioJson ?? null),
        corteHonorJson: body.corteHonorJson ?? null,
        mesaRegalosJson: body.mesaRegalosJson ?? null,
        hospedajeJson: body.hospedajeJson ?? null,
        transporteJson: body.transporteJson ?? null,
        historiaHitosJson: body.historiaHitosJson ?? null,
        configPlantilla: body.configPlantilla ?? undefined,
        modalidadRsvp: body.modalidadRsvp !== undefined ? body.modalidadRsvp : undefined,
        permitirConfirmacionTelefono: body.permitirConfirmacionTelefono !== undefined ? Boolean(body.permitirConfirmacionTelefono) : undefined,
        mostrarMesaRegalos: body.mostrarMesaRegalos !== undefined ? Boolean(body.mostrarMesaRegalos) : undefined,
        regalosMensaje: body.regalosMensaje !== undefined ? (body.regalosMensaje || null) : undefined,
        regalosMensajeEn: body.regalosMensajeEn !== undefined ? (body.regalosMensajeEn || null) : undefined,
        regalosZelle: body.regalosZelle !== undefined ? (body.regalosZelle || null) : undefined,
        regalosCashApp: body.regalosCashApp !== undefined ? (body.regalosCashApp || null) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      evento: updatedEvento,
      message: "Invitación actualizada exitosamente en la base de datos.",
    });
  } catch (error: any) {
    console.error("Error al actualizar evento en PostgreSQL:", error);
    // Slug inexistente al actualizar: 404 claro en vez del 500 genérico
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "No existe una invitación con ese enlace (slug) para actualizar." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Ocurrió un error al actualizar el evento en la base de datos." },
      { status: 500 }
    );
  }
}
