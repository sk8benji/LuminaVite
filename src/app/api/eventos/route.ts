import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
    });

    return NextResponse.json({ eventos });
  } catch (error) {
    console.error("Error al listar eventos:", error);
    return NextResponse.json({ eventos: [] });
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
      telefonoWhatsappRsvp,
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

    // Asegurar o buscar usuario admin demo
    let adminUser = await prisma.usuario.findFirst();
    if (!adminUser) {
      adminUser = await prisma.usuario.create({
        data: {
          email: "admin@luminavite.com",
          nombre: "Administrador LuminaVite",
          passwordHash: "demo_hash",
          rol: "ADMIN",
        },
      });
    }

    const secretPanelKey = randomBytes(8).toString("hex");

    // Crear el evento
    const nuevoEvento = await prisma.evento.create({
      data: {
        usuarioId: adminUser.id,
        titulo,
        slug: slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
        panelToken: secretPanelKey,
        tipoEvento,
        estiloPlantilla,
        subtitulo,
        frasePersonalizada,
        fechaEvento: new Date(fechaEvento),
        fechaTextoPersonalizada: fechaTextoPersonalizada || null,
        fotoPortadaUrl,
        fotoInfanciaUrl: fotoInfanciaUrl || null,
        fotoActualUrl: fotoActualUrl || null,
        fotoCierreUrl: fotoCierreUrl || null,
        musicaUrl: musicaUrl || null,
        videoUrl: videoUrl || null,
        galeriaFotosUrls: Array.isArray(galeriaFotosUrls) ? galeriaFotosUrls : [],
        wishlistUrl: wishlistUrl || null,
        idiomaDefault: idiomaDefault || "es",
        celebrationGuideline: celebrationGuideline || null,
        telefonoWhatsappRsvp: telefonoWhatsappRsvp.replace(/[^0-9]/g, ""),
        fechaLimiteRsvp: fechaLimiteRsvp ? new Date(fechaLimiteRsvp) : null,
        maxPasesPorInvitado: Number(maxPasesPorInvitado) || 4,
        ceremoniaNombre: ceremoniaNombre || null,
        ceremoniaDireccion: ceremoniaDireccion || null,
        ceremoniaMapUrl: ceremoniaMapUrl || null,
        recepcionNombre,
        recepcionDireccion: recepcionDireccion || "",
        recepcionMapUrl,
        fechaPlacaMes: fechaPlacaMes || null,
        fechaPlacaHora: fechaPlacaHora || null,
        fechaPlacaLugar: fechaPlacaLugar || null,
        countdownEncabezado: countdownEncabezado || null,
        dressCodeEtiqueta: dressCodeEtiqueta || null,
        dressCodeColoresReservados: dressCodeColoresReservados || null,
        regalosMensaje: regalosMensaje || null,
        regalosZelle: regalosZelle || null,
        regalosCashApp: regalosCashApp || null,
        rsvpFechaLimite: rsvpFechaLimite || null,
        autorBendicion: autorBendicion || null,
        textoDisco: textoDisco || null,
        mensajeDespedida: mensajeDespedida || null,
        dressCodeTitulo: dressCodeTitulo || null,
        dressCodeNota: dressCodeNota || null,
        coloresReservados: coloresReservados || [],
        itinerarioJson: (Array.isArray(itinerario) && itinerario.length > 0) ? itinerario : (itinerarioJson || null),
        corteHonorJson: corteHonorJson || null,
        mesaRegalosJson: mesaRegalosJson || null,
        hospedajeJson: hospedajeJson || null,
        transporteJson: transporteJson || null,
        historiaHitosJson: historiaHitosJson || null,
      },
    });

    return NextResponse.json({ success: true, evento: nuevoEvento });
  } catch (error: any) {
    console.error("Error al crear evento:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una invitación con este slug (enlace). Elige otro diferente." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Ocurrió un error al guardar la invitación." },
      { status: 500 }
    );
  }
}
