import fs from "fs";
import path from "path";
import os from "os";
import prisma from "@/lib/db";
import { ensurePostgresTables } from "@/lib/init-db";

export interface OrderData {
  id: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  montoTotal: number;
  moneda: string;
  paqueteId: string;
  paqueteNombre: string;
  estadoPago: "PENDIENTE" | "PAGADO" | "FALLIDO" | "REEMBOLSADO";
  estadoPedido: "NUEVO" | "CONTACTADO" | "RECOPILANDO_DATOS" | "EN_DISENO" | "PUBLICADO" | "CANCELADO";
  nombreCliente?: string | null;
  emailCliente: string;
  telefonoCliente?: string | null;
  tipoEvento?: string | null;
  fechaEvento?: string | null;
  plantillaDeseada?: string | null;
  comentarios?: string | null;
  onboardingCompletado: boolean;
  eventoId?: string | null;
  createdAt: string;
  updatedAt: string;
}

const FALLBACK_DIR = path.join(os.tmpdir(), "clickandlove_orders");
const FALLBACK_FILE = path.join(FALLBACK_DIR, "orders.json");

function ensureFallbackDir() {
  if (!fs.existsSync(FALLBACK_DIR)) {
    fs.mkdirSync(FALLBACK_DIR, { recursive: true });
  }
}

function readFallbackOrders(): OrderData[] {
  try {
    ensureFallbackDir();
    if (!fs.existsSync(FALLBACK_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(FALLBACK_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Error leyendo órdenes de fallback local:", err);
    return [];
  }
}

function saveFallbackOrders(orders: OrderData[]) {
  try {
    ensureFallbackDir();
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.warn("Error guardando órdenes de fallback local:", err);
  }
}

/**
 * Guarda o actualiza una orden de compra
 */
export async function saveOrder(data: Partial<OrderData> & { stripeSessionId: string }): Promise<OrderData> {
  const now = new Date().toISOString();
  const id = data.id || `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Intentar con Prisma / PostgreSQL
  try {
    await ensurePostgresTables();

    const existing = await prisma.ordenCompra.findUnique({
      where: { stripeSessionId: data.stripeSessionId },
    });

    if (existing) {
      const updated = await prisma.ordenCompra.update({
        where: { stripeSessionId: data.stripeSessionId },
        data: {
          stripePaymentIntentId: data.stripePaymentIntentId ?? existing.stripePaymentIntentId,
          montoTotal: data.montoTotal ?? existing.montoTotal,
          moneda: data.moneda ?? existing.moneda,
          paqueteId: data.paqueteId ?? existing.paqueteId,
          paqueteNombre: data.paqueteNombre ?? existing.paqueteNombre,
          estadoPago: (data.estadoPago as any) ?? existing.estadoPago,
          estadoPedido: (data.estadoPedido as any) ?? existing.estadoPedido,
          nombreCliente: data.nombreCliente !== undefined ? data.nombreCliente : existing.nombreCliente,
          emailCliente: data.emailCliente ?? existing.emailCliente,
          telefonoCliente: data.telefonoCliente !== undefined ? data.telefonoCliente : existing.telefonoCliente,
          tipoEvento: (data.tipoEvento as any) ?? existing.tipoEvento,
          fechaEvento: data.fechaEvento ? new Date(data.fechaEvento) : existing.fechaEvento,
          plantillaDeseada: (data.plantillaDeseada as any) ?? existing.plantillaDeseada,
          comentarios: data.comentarios !== undefined ? data.comentarios : existing.comentarios,
          onboardingCompletado: data.onboardingCompletado ?? existing.onboardingCompletado,
          eventoId: data.eventoId ?? existing.eventoId,
        },
      });

      return {
        ...updated,
        fechaEvento: updated.fechaEvento ? updated.fechaEvento.toISOString() : null,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      } as unknown as OrderData;
    } else {
      const created = await prisma.ordenCompra.create({
        data: {
          id,
          stripeSessionId: data.stripeSessionId,
          stripePaymentIntentId: data.stripePaymentIntentId,
          montoTotal: data.montoTotal || 0,
          moneda: data.moneda || "usd",
          paqueteId: data.paqueteId || "basic",
          paqueteNombre: data.paqueteNombre || "Digital Basic",
          estadoPago: (data.estadoPago as any) || "PENDIENTE",
          estadoPedido: (data.estadoPedido as any) || "NUEVO",
          nombreCliente: data.nombreCliente,
          emailCliente: data.emailCliente || "",
          telefonoCliente: data.telefonoCliente,
          tipoEvento: (data.tipoEvento as any) || "QUINCEANERA",
          fechaEvento: data.fechaEvento ? new Date(data.fechaEvento) : null,
          plantillaDeseada: (data.plantillaDeseada as any) || null,
          comentarios: data.comentarios,
          onboardingCompletado: data.onboardingCompletado || false,
          eventoId: data.eventoId,
        },
      });

      return {
        ...created,
        fechaEvento: created.fechaEvento ? created.fechaEvento.toISOString() : null,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      } as unknown as OrderData;
    }
  } catch (dbErr) {
    console.warn("⚠️ No se pudo guardar la orden en PostgreSQL, usando fallback local:", dbErr);
  }

  // 2. Fallback a almacenamiento local / JSON
  const orders = readFallbackOrders();
  const existingIdx = orders.findIndex((o) => o.stripeSessionId === data.stripeSessionId);

  if (existingIdx >= 0) {
    const updated: OrderData = {
      ...orders[existingIdx],
      ...data,
      updatedAt: now,
    };
    orders[existingIdx] = updated;
    saveFallbackOrders(orders);
    return updated;
  } else {
    const newOrder: OrderData = {
      id,
      stripeSessionId: data.stripeSessionId,
      stripePaymentIntentId: data.stripePaymentIntentId || null,
      montoTotal: data.montoTotal || 0,
      moneda: data.moneda || "usd",
      paqueteId: data.paqueteId || "basic",
      paqueteNombre: data.paqueteNombre || "Digital Basic",
      estadoPago: data.estadoPago || "PENDIENTE",
      estadoPedido: data.estadoPedido || "NUEVO",
      nombreCliente: data.nombreCliente || null,
      emailCliente: data.emailCliente || "",
      telefonoCliente: data.telefonoCliente || null,
      tipoEvento: data.tipoEvento || "QUINCEANERA",
      fechaEvento: data.fechaEvento || null,
      plantillaDeseada: data.plantillaDeseada || null,
      comentarios: data.comentarios || null,
      onboardingCompletado: data.onboardingCompletado || false,
      eventoId: data.eventoId || null,
      createdAt: now,
      updatedAt: now,
    };
    orders.unshift(newOrder);
    saveFallbackOrders(orders);
    return newOrder;
  }
}

/**
 * Obtener orden por Stripe Session ID
 */
export async function getOrderBySessionId(sessionId: string): Promise<OrderData | null> {
  try {
    await ensurePostgresTables();
    const order = await prisma.ordenCompra.findUnique({
      where: { stripeSessionId: sessionId },
    });
    if (order) {
      return {
        ...order,
        fechaEvento: order.fechaEvento ? order.fechaEvento.toISOString() : null,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      } as unknown as OrderData;
    }
  } catch (err) {
    // Continuar a fallback
  }

  const orders = readFallbackOrders();
  return orders.find((o) => o.stripeSessionId === sessionId) || null;
}

/**
 * Listar todas las órdenes
 */
export async function listAllOrders(): Promise<OrderData[]> {
  try {
    await ensurePostgresTables();
    const orders = await prisma.ordenCompra.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (orders && orders.length > 0) {
      return orders.map((o) => ({
        ...o,
        fechaEvento: o.fechaEvento ? o.fechaEvento.toISOString() : null,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      })) as unknown as OrderData[];
    }
  } catch (err) {
    // Continuar a fallback
  }

  return readFallbackOrders();
}

/**
 * Actualizar estado del pedido (admin)
 */
export async function updateOrderStatus(
  id: string,
  estadoPedido: OrderData["estadoPedido"]
): Promise<OrderData | null> {
  try {
    await ensurePostgresTables();
    const updated = await prisma.ordenCompra.update({
      where: { id },
      data: { estadoPedido: estadoPedido as any },
    });
    return {
      ...updated,
      fechaEvento: updated.fechaEvento ? updated.fechaEvento.toISOString() : null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    } as unknown as OrderData;
  } catch (err) {
    // Fallback
  }

  const orders = readFallbackOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx].estadoPedido = estadoPedido;
    orders[idx].updatedAt = new Date().toISOString();
    saveFallbackOrders(orders);
    return orders[idx];
  }
  return null;
}
