import { NextRequest, NextResponse } from "next/server";
import {
  getOrderByDatosToken,
  saveDatosRespuestas,
  updatePlantillaDeseada,
} from "@/lib/order-store";
import {
  calcularProgresoDatos,
  filtrarRespuestasValidas,
  type DatosRespuestas,
} from "@/lib/datos-questions";
import { listPlantillasPortal } from "@/lib/datos-plantillas";

/**
 * Portal de datos del cliente — acceso por token único, sin login.
 * El token es el secreto: solo quien tiene el link de su orden entra.
 * Nunca se devuelve el token de otra orden ni datos de pago.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const order = await getOrderByDatosToken(token);
  if (!order) {
    return NextResponse.json({ error: "Link no válido o expirado." }, { status: 404 });
  }
  const respuestas = (order.datosRespuestas || {}) as DatosRespuestas;
  return NextResponse.json({
    success: true,
    nombreCliente: order.nombreCliente,
    paqueteNombre: order.paqueteNombre,
    respuestas,
    progreso: calcularProgresoDatos(respuestas),
    completado: order.onboardingCompletado,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const order = await getOrderByDatosToken(token);
  if (!order) {
    return NextResponse.json({ error: "Link no válido o expirado." }, { status: 404 });
  }
  try {
    const body = await req.json();
    // Completar: solo marca onboardingCompletado; no mueve el estado del pedido.
    if (body.completar === true) {
      const updated = await saveDatosRespuestas(order.id, {}, true);
      if (!updated) {
        return NextResponse.json({ error: "No se pudo guardar." }, { status: 500 });
      }
      return NextResponse.json({ success: true, completado: true });
    }
    // Guardado por partes: mezcla con lo ya guardado, solo campos válidos.
    const validas = filtrarRespuestasValidas(body.respuestas);
    // La plantilla elegida debe existir en el catálogo; si es válida,
    // también queda en plantillaDeseada de la orden.
    const elegida = (validas as any).plantillaElegida as string | undefined;
    if (elegida) {
      const estilos = new Set(
        (await listPlantillasPortal()).map((p) => p.estilo),
      );
      if (!estilos.has(elegida)) {
        delete (validas as any).plantillaElegida;
      }
    }
    const updated = await saveDatosRespuestas(order.id, validas, false);
    if (updated && elegida && (validas as any).plantillaElegida) {
      await updatePlantillaDeseada(order.id, elegida);
    }
    if (!updated) {
      return NextResponse.json({ error: "No se pudo guardar." }, { status: 500 });
    }
    const respuestas = (updated.datosRespuestas || {}) as DatosRespuestas;
    return NextResponse.json({
      success: true,
      respuestas,
      progreso: calcularProgresoDatos(respuestas),
    });
  } catch (err: any) {
    console.error("Error en /api/datos:", err?.message || err);
    return NextResponse.json({ error: "No se pudo guardar." }, { status: 500 });
  }
}
