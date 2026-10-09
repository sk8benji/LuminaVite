import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/db";
import { normalizeSlug, getEventBySlug } from "@/lib/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  try {
    // 1. Si se solicita un evento específico por slug
    if (slug) {
      const cleanSlug = normalizeSlug(slug);
      const evento = await getEventBySlug(cleanSlug);

      if (!evento) {
        return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
      }

      return NextResponse.json({ evento });
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
  try {
    const body = await req.json();

    const {
      titulo,
      slug,
      tipoEvento = "QUINCEANERA",
      estiloPlantilla = "PRINCESA_ROSA",
      subtitulo,
      frasePersonalizada,
      fechaEvento,
      fechaTextoPersonalizada,
      fotoPortadaUrl,
      fotoInfanciaUrl,
      fotoActualUrl,
      fotoCierreUrl,
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
      fechaPlacaHora,
      fechaPlacaLugar,
      countdownEncabezado,
      dressCodeEtiqueta,
      dressCodeColoresReservados,
      regalosMensaje,
      regalosZelle,
      regalosCashApp,
      rsvpFechaLimite,
      rsvpDiasAntes,
      autorBendicion,
      textoDisco,
      mensajeDespedida,
      dressCodeTitulo,
      dressCodeNota,
      coloresReservados,
      itinerario,
      itinerarioJson,
      corteHonorJson,
      mesaRegalosJson,
      hospedajeJson,
      transporteJson,
      historiaHitosJson,
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

    const secretPanelKey = randomBytes(4).toString("hex");

    const nuevoEvento = await prisma.evento.create({
      data: {
        usuarioId: adminUser.id,
        titulo,
        slug: cleanSlug,
        panelToken: secretPanelKey,
        tipoEvento,
        estiloPlantilla,
        subtitulo: subtitulo || null,
        frasePersonalizada: frasePersonalizada || null,
        fechaEvento: parseSafeIsoString(fechaEvento),
        fechaTextoPersonalizada: fechaTextoPersonalizada || null,
        fotoPortadaUrl,
        fotoInfanciaUrl: fotoInfanciaUrl || null,
        fotoActualUrl: fotoActualUrl || null,
        fotoCierreUrl: fotoCierreUrl || null,
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
        dressCodeTitulo: dressCodeTitulo || null,
        dressCodeNota: dressCodeNota || null,
        coloresReservados: coloresReservados || [],
        itinerarioJson: (Array.isArray(itinerario) && itinerario.length > 0) ? itinerario : (itinerarioJson || null),
        corteHonorJson: corteHonorJson || null,
        mesaRegalosJson: mesaRegalosJson || null,
        hospedajeJson: hospedajeJson || null,
        transporteJson: transporteJson || null,
        historiaHitosJson: historiaHitosJson || null,
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
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Se requiere el slug del evento para actualizar." },
        { status: 400 }
      );
    }

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
        frasePersonalizada: body.frasePersonalizada ?? null,
        fechaEvento: body.fechaEvento ? parseSafeIsoString(body.fechaEvento) : undefined,
        fechaTextoPersonalizada: body.fechaTextoPersonalizada ?? null,
        fotoPortadaUrl: body.fotoPortadaUrl,
        fotoInfanciaUrl: body.fotoInfanciaUrl ?? null,
        fotoActualUrl: body.fotoActualUrl ?? null,
        fotoCierreUrl: body.fotoCierreUrl ?? null,
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
        dressCodeTitulo: body.dressCodeTitulo ?? null,
        dressCodeNota: body.dressCodeNota ?? null,
        coloresReservados: body.coloresReservados ?? [],
        itinerarioJson: (Array.isArray(body.itinerario) && body.itinerario.length > 0) ? body.itinerario : (body.itinerarioJson ?? null),
        corteHonorJson: body.corteHonorJson ?? null,
        mesaRegalosJson: body.mesaRegalosJson ?? null,
        hospedajeJson: body.hospedajeJson ?? null,
        transporteJson: body.transporteJson ?? null,
        historiaHitosJson: body.historiaHitosJson ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      evento: updatedEvento,
      message: "Invitación actualizada exitosamente en la base de datos.",
    });
  } catch (error: any) {
    console.error("Error al actualizar evento en PostgreSQL:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al actualizar el evento en la base de datos." },
      { status: 500 }
    );
  }
}
