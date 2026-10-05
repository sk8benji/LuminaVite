import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/db";
import { fallbackEventStore } from "@/lib/event-fallback-store";

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
    console.warn("PostgreSQL no disponible para listar eventos, usando fallback:", error);
    const fallbackList = fallbackEventStore.getAllEvents().map((e) => ({
      ...e,
      _count: { rsvps: (e.rsvps || []).length },
    }));
    return NextResponse.json({ eventos: fallbackList });
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

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    const secretPanelKey = randomBytes(8).toString("hex");

    let nuevoEvento: any = null;
    let savedToDb = false;

    // Intentar guardar en PostgreSQL con auto-recuperación de esquema P2021
    for (let intento = 0; intento < 2; intento++) {
      try {
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

        nuevoEvento = await prisma.evento.create({
          data: {
            usuarioId: adminUser.id,
            titulo,
            slug: cleanSlug,
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
            emailOrganizador: emailOrganizador ? String(emailOrganizador).trim() : null,
            aforoTotal: Number(aforoTotal) || 200,
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
        savedToDb = true;
        break;
      } catch (err: any) {
        if (err.code === "P2002") {
          return NextResponse.json(
            { error: "Ya existe una invitación con este slug (enlace). Elige otro diferente." },
            { status: 409 }
          );
        }
        if (err.code === "P2021" && intento === 0) {
          console.warn("⚠️ [PostgreSQL] Tablas no encontradas (P2021). Ejecutando npx prisma db push...");
          try {
            const { execSync } = await import("child_process");
            execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
            console.log("✅ Tablas creadas con éxito. Reintentando guardado de evento...");
            continue;
          } catch (syncErr: any) {
            console.warn("No se pudo ejecutar prisma db push directamente:", syncErr?.message);
          }
        }
        console.warn("⚠️ Error al operar con base de datos principal:", err?.message);
        break;
      }
    }

    if (!savedToDb) {
      console.warn("⚠️ Guardando evento en almacenamiento de respaldo para slug:", cleanSlug);
      nuevoEvento = {
        id: `ev-${cleanSlug}-${Date.now()}`,
        titulo,
        slug: cleanSlug,
        panelToken: secretPanelKey,
        tipoEvento,
        estiloPlantilla,
        subtitulo,
        frasePersonalizada,
        fechaEvento: new Date(fechaEvento).toISOString(),
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
        emailOrganizador: emailOrganizador ? String(emailOrganizador).trim() : null,
        aforoTotal: Number(aforoTotal) || 200,
        fechaLimiteRsvp: fechaLimiteRsvp ? new Date(fechaLimiteRsvp).toISOString() : null,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      fallbackEventStore.saveEvent(nuevoEvento);
    }

    return NextResponse.json({ success: true, evento: nuevoEvento });
  } catch (error: any) {
    console.error("Error al procesar petición de creación:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al guardar la invitación." },
      { status: 500 }
    );
  }
}
