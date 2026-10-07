import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/db";
import { fallbackEventStore } from "@/lib/event-fallback-store";
import { ensurePostgresTables } from "@/lib/init-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  // Si se solicita un evento específico por slug
  if (slug) {
    const cleanSlug = slug.toLowerCase().trim();
    let dbEvento: any = null;
    try {
      dbEvento = await prisma.evento.findUnique({
        where: { slug: cleanSlug },
      });
    } catch (err) {
      console.warn("Aviso al consultar evento en DB:", err);
    }

    const fallback = await fallbackEventStore.getEvent(cleanSlug);

    // Si ambos existen, devolver el registro más reciente por updatedAt
    let mostRecent: any = null;
    if (dbEvento && fallback) {
      const dbTime = new Date(dbEvento.updatedAt || 0).getTime();
      const fbTime = new Date(fallback.updatedAt || 0).getTime();
      mostRecent = fbTime >= dbTime ? fallback : dbEvento;
    } else if (fallback) {
      mostRecent = fallback;
    } else if (dbEvento) {
      mostRecent = dbEvento;
    }

    if (mostRecent) {
      return NextResponse.json({ evento: mostRecent });
    }

    return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
  }

  // Listado general de eventos para el dashboard
  let dbEventos: any[] = [];
  try {
    dbEventos = await prisma.evento.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
    });
  } catch (error) {
    console.warn("PostgreSQL no disponible para listar eventos, usando fallback:", error);
  }

  const rawFallback = await fallbackEventStore.getAllEvents();
  const fallbackList = rawFallback.map((e) => ({
    ...e,
    _count: { rsvps: (e.rsvps || []).length },
  }));

  // Combinar sin duplicar por slug (prioriza BD si existe, sino fallback/S3)
  const slugMap = new Map<string, any>();
  for (const ev of dbEventos) {
    if (ev && ev.slug) {
      slugMap.set(ev.slug.toLowerCase().trim(), ev);
    }
  }
  for (const fb of fallbackList) {
    const key = fb.slug.toLowerCase().trim();
    if (!slugMap.has(key)) {
      slugMap.set(key, fb);
    }
  }

  const combined = Array.from(slugMap.values()).sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ eventos: combined });
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

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    const secretPanelKey = randomBytes(8).toString("hex");

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
            fechaEvento: parseSafeDate(fechaEvento) || new Date(),
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
            fechaLimiteRsvp: parseSafeDate(fechaLimiteRsvp),
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
            rsvpDiasAntes: Number(rsvpDiasAntes) || 15,
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
          console.warn("⚠️ [PostgreSQL] Tablas no encontradas (P2021). Creando tablas nativamente...");
          const ok = await ensurePostgresTables();
          if (ok) {
            console.log("✅ Tablas creadas con éxito. Reintentando guardado de evento...");
            continue;
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
        fechaEvento: parseSafeIsoString(fechaEvento),
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
        fechaLimiteRsvp: parseSafeDate(fechaLimiteRsvp)?.toISOString() || null,
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
        rsvpDiasAntes: Number(rsvpDiasAntes) || 15,
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

    let updatedEvento: any = null;

    // 1. Intentar actualizar en PostgreSQL
    try {
      if (body.estiloPlantilla === "QUINCE_ROSADO") {
        await prisma.$executeRawUnsafe(`ALTER TYPE "EstiloPlantilla" ADD VALUE IF NOT EXISTS 'QUINCE_ROSADO';`).catch(() => {});
      }
      updatedEvento = await prisma.evento.update({
        where: { slug: cleanSlug },
        data: {
          titulo: body.titulo,
          tipoEvento: body.tipoEvento,
          estiloPlantilla: body.estiloPlantilla,
          subtitulo: body.subtitulo || null,
          frasePersonalizada: body.frasePersonalizada || null,
          fechaEvento: body.fechaEvento ? parseSafeIsoString(body.fechaEvento) : undefined,
          fechaTextoPersonalizada: body.fechaTextoPersonalizada || null,
          fotoPortadaUrl: body.fotoPortadaUrl,
          fotoInfanciaUrl: body.fotoInfanciaUrl || null,
          fotoActualUrl: body.fotoActualUrl || null,
          fotoCierreUrl: body.fotoCierreUrl || null,
          musicaUrl: body.musicaUrl || null,
          videoUrl: body.videoUrl || null,
          galeriaFotosUrls: Array.isArray(body.galeriaFotosUrls) ? body.galeriaFotosUrls : [],
          wishlistUrl: body.wishlistUrl || null,
          idiomaDefault: body.idiomaDefault || "es",
          celebrationGuideline: body.celebrationGuideline || null,
          telefonoWhatsappRsvp: body.telefonoWhatsappRsvp ? body.telefonoWhatsappRsvp.replace(/[^0-9]/g, "") : undefined,
          emailOrganizador: body.emailOrganizador ? String(body.emailOrganizador).trim() : null,
          aforoTotal: body.aforoTotal ? Number(body.aforoTotal) : undefined,
          fechaLimiteRsvp: parseSafeDate(body.fechaLimiteRsvp),
          maxPasesPorInvitado: body.maxPasesPorInvitado ? Number(body.maxPasesPorInvitado) : undefined,
          ceremoniaNombre: body.ceremoniaNombre || null,
          ceremoniaDireccion: body.ceremoniaDireccion || null,
          ceremoniaMapUrl: body.ceremoniaMapUrl || null,
          recepcionNombre: body.recepcionNombre,
          recepcionDireccion: body.recepcionDireccion || "",
          recepcionMapUrl: body.recepcionMapUrl,
          fechaPlacaMes: body.fechaPlacaMes || null,
          fechaPlacaHora: body.fechaPlacaHora || null,
          fechaPlacaLugar: body.fechaPlacaLugar || null,
          countdownEncabezado: body.countdownEncabezado || null,
          dressCodeEtiqueta: body.dressCodeEtiqueta || null,
          dressCodeColoresReservados: body.dressCodeColoresReservados || null,
          regalosMensaje: body.regalosMensaje || null,
          regalosZelle: body.regalosZelle || null,
          regalosCashApp: body.regalosCashApp || null,
          rsvpFechaLimite: body.rsvpFechaLimite || null,
          rsvpDiasAntes: body.rsvpDiasAntes ? Number(body.rsvpDiasAntes) : 15,
          autorBendicion: body.autorBendicion || null,
          textoDisco: body.textoDisco || null,
          mensajeDespedida: body.mensajeDespedida || null,
          dressCodeTitulo: body.dressCodeTitulo || null,
          dressCodeNota: body.dressCodeNota || null,
          coloresReservados: body.coloresReservados || [],
          itinerarioJson: (Array.isArray(body.itinerario) && body.itinerario.length > 0) ? body.itinerario : (body.itinerarioJson || null),
          corteHonorJson: body.corteHonorJson || null,
          mesaRegalosJson: body.mesaRegalosJson || null,
          hospedajeJson: body.hospedajeJson || null,
          transporteJson: body.transporteJson || null,
          historiaHitosJson: body.historiaHitosJson || null,
        },
      });
    } catch (err: any) {
      console.warn("Aviso al actualizar en PostgreSQL:", err?.message);
    }

    // 2. Actualizar también en el almacenamiento de respaldo y AWS S3
    const existingFallback: any = (await fallbackEventStore.getEvent(cleanSlug)) || {};
    const fallbackRecord = {
      ...existingFallback,
      ...body,
      slug: cleanSlug,
      panelToken: existingFallback.panelToken || body.panelToken,
      fechaEvento: parseSafeIsoString(body.fechaEvento),
      fechaLimiteRsvp: parseSafeDate(body.fechaLimiteRsvp)?.toISOString() || null,
      updatedAt: new Date().toISOString(),
    };
    fallbackEventStore.saveEvent(fallbackRecord);

    return NextResponse.json({
      success: true,
      evento: updatedEvento || fallbackRecord,
      message: "Invitación actualizada exitosamente.",
    });
  } catch (error: any) {
    console.error("Error al actualizar evento:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al actualizar el evento." },
      { status: 500 }
    );
  }
}
