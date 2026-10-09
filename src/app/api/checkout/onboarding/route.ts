import { NextRequest, NextResponse } from "next/server";
import { saveOrder, getOrderBySessionId } from "@/lib/order-store";
import { sendCustomerOrderConfirmationEmail, sendAdminOrderAlertEmail } from "@/lib/order-emails";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      nombreCliente,
      emailCliente,
      telefonoCliente,
      tipoEvento,
      fechaEvento,
      plantillaDeseada,
      comentarios,
    } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Falta sessionId" }, { status: 400 });
    }

    const existing = await getOrderBySessionId(sessionId);
    if (!existing) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    const updated = await saveOrder({
      stripeSessionId: sessionId,
      nombreCliente: nombreCliente || existing.nombreCliente,
      emailCliente: emailCliente || existing.emailCliente,
      telefonoCliente: telefonoCliente || existing.telefonoCliente,
      tipoEvento: tipoEvento || existing.tipoEvento,
      fechaEvento: fechaEvento || existing.fechaEvento,
      plantillaDeseada: plantillaDeseada || existing.plantillaDeseada,
      comentarios: comentarios || existing.comentarios,
      onboardingCompletado: true,
      estadoPedido: "RECOPILANDO_DATOS",
    });

    const origin = req.nextUrl.origin || "https://clickandlove.app";

    // Enviar correos por AWS SES (no bloqueante para responder de inmediato)
    Promise.allSettled([
      sendCustomerOrderConfirmationEmail(updated, origin),
      sendAdminOrderAlertEmail(updated, origin),
    ]).catch((err) => {
      console.error("Error enviando notificaciones AWS SES:", err);
    });

    return NextResponse.json({
      success: true,
      order: updated,
    });
  } catch (error: any) {
    console.error("Error en /api/checkout/onboarding:", error);
    return NextResponse.json(
      { error: error?.message || "Error al guardar los datos de onboarding" },
      { status: 500 }
    );
  }
}
