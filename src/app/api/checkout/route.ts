import { NextRequest, NextResponse } from "next/server";
import { getStripe, PACKAGES } from "@/lib/stripe";
import { saveOrder } from "@/lib/order-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan = "signature" } = body;

    const pkg = PACKAGES[plan] || PACKAGES.signature;
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const publicHost = host.replace(/^admin\./, "");
    const origin = publicHost ? `${proto}://${publicHost}` : (process.env.NEXT_PUBLIC_SITE_URL || "https://clickandlove.app");

    const stripe = getStripe();

    // 1. Si Stripe está configurado con clave secreta
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: pkg.currency,
              product_data: {
                name: `Click and love - Paquete ${pkg.name}`,
                description: pkg.description,
                images: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"],
              },
              unit_amount: Math.round(pkg.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        billing_address_collection: "auto",
        phone_number_collection: {
          enabled: true,
        },
        metadata: {
          paqueteId: pkg.id,
          paqueteNombre: pkg.name,
        },
        success_url: `${origin}/gracias?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/#precios`,
      });

      // Registrar pre-orden en estado PENDIENTE
      await saveOrder({
        stripeSessionId: session.id,
        montoTotal: pkg.price,
        moneda: pkg.currency,
        paqueteId: pkg.id,
        paqueteNombre: pkg.name,
        estadoPago: "PENDIENTE",
        estadoPedido: "NUEVO",
        emailCliente: "",
        onboardingCompletado: false,
      });

      return NextResponse.json({ url: session.url });
    }

    // 2. Si no hay clave de Stripe configurada (Modo Preview / Desarrollo)
    const mockSessionId = `sim_session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    await saveOrder({
      stripeSessionId: mockSessionId,
      montoTotal: pkg.price,
      moneda: pkg.currency,
      paqueteId: pkg.id,
      paqueteNombre: pkg.name,
      estadoPago: "PAGADO",
      estadoPedido: "NUEVO",
      emailCliente: "cliente.demo@clickandlove.app",
      nombreCliente: "Cliente Demo",
      telefonoCliente: "+1 818 555 0199",
      onboardingCompletado: false,
    });

    return NextResponse.json({
      url: `${origin}/gracias?session_id=${mockSessionId}&preview=true`,
      simulated: true,
    });
  } catch (error: any) {
    console.error("Error en /api/checkout:", error);
    return NextResponse.json(
      { error: error?.message || "Error al procesar la sesión de pago" },
      { status: 500 }
    );
  }
}
