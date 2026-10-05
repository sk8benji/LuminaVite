import { NextRequest, NextResponse } from "next/server";
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
      fotoPortadaUrl,
      fotoInfanciaUrl,
      fotoActualUrl,
      musicaUrl,
      telefonoWhatsappRsvp,
      fechaLimiteRsvp,
      maxPasesPorInvitado = 4,
      ceremoniaNombre,
      ceremoniaDireccion,
      ceremoniaMapUrl,
      recepcionNombre,
      recepcionDireccion,
      recepcionMapUrl,
      dressCodeTitulo,
      dressCodeNota,
      coloresReservados,
      itinerarioJson,
      corteHonorJson,
      mesaRegalosJson,
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

    // Crear el evento
    const nuevoEvento = await prisma.evento.create({
      data: {
        usuarioId: adminUser.id,
        titulo,
        slug: slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
        tipoEvento,
        estiloPlantilla,
        subtitulo,
        frasePersonalizada,
        fechaEvento: new Date(fechaEvento),
        fotoPortadaUrl,
        fotoInfanciaUrl: fotoInfanciaUrl || null,
        fotoActualUrl: fotoActualUrl || null,
        musicaUrl: musicaUrl || null,
        telefonoWhatsappRsvp: telefonoWhatsappRsvp.replace(/[^0-9]/g, ""),
        fechaLimiteRsvp: fechaLimiteRsvp ? new Date(fechaLimiteRsvp) : null,
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
        itinerarioJson: itinerarioJson || null,
        corteHonorJson: corteHonorJson || null,
        mesaRegalosJson: mesaRegalosJson || null,
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
