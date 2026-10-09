import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { OrderData } from "./order-store";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_SES_KEY || process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_SES_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Enviar correo de confirmación de compra y bienvenida de lujo al comprador
 */
export async function sendCustomerOrderConfirmationEmail(
  order: OrderData,
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://clickandlove.app"
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || "notificaciones@clickandlove.app";
  const toEmail = order.emailCliente;

  if (!toEmail) {
    return { success: false, error: "No email specified for customer" };
  }

  const subject = `✨ ¡Bienvenido a Click and love! Confirmación de Pedido #${order.id.slice(-6).toUpperCase()}`;

  const thankYouUrl = `${siteUrl}/gracias?session_id=${order.stripeSessionId}`;
  const whatsappUrl = `https://wa.me/18181234567?text=${encodeURIComponent(
    `Hola Click and love! Acabo de comprar el paquete ${order.paqueteNombre} (Orden #${order.id.slice(-6).toUpperCase()}) y me gustaría coordinar los detalles de mi evento.`
  )}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 0; color: #2C1F1B; }
    .container { max-width: 600px; margin: 30px auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(44,31,27,0.06); border: 1px solid #E8E3D9; }
    .header { background: linear-gradient(135deg, #2C1F1B 0%, #4A352F 100%); padding: 40px 30px; text-align: center; color: #FFFFFF; }
    .logo { font-size: 26px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase; color: #EED3A1; margin: 0; }
    .tagline { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #D5C9B8; margin-top: 8px; }
    .content { padding: 40px 35px; }
    .greeting { font-size: 22px; font-weight: bold; color: #2C1F1B; margin-bottom: 12px; }
    .order-box { background-color: #FAF8F5; border: 1px solid #E8E3D9; border-radius: 16px; padding: 20px; margin: 25px 0; }
    .order-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #E8E3D9; font-size: 14px; }
    .order-row:last-child { border-bottom: none; font-weight: bold; font-size: 16px; color: #C5A059; padding-top: 12px; }
    .badge { display: inline-block; background-color: #F5EFE4; border: 1px solid #C5A059; color: #9C7736; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .concierge-card { background: linear-gradient(135deg, #FAF8F5 0%, #F5EFE4 100%); border-left: 4px solid #C5A059; padding: 20px; border-radius: 12px; margin: 25px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #C5A059 0%, #9C7736 100%); color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; text-align: center; margin-top: 15px; }
    .btn-outline { display: inline-block; background-color: transparent; border: 1px solid #2C1F1B; color: #2C1F1B !important; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; font-size: 13px; text-align: center; margin-left: 10px; }
    .footer { background-color: #FAF8F5; padding: 25px; text-align: center; font-size: 12px; color: #8C8077; border-top: 1px solid #E8E3D9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Click and love</h1>
      <div class="tagline">Editorial Luxury Digital Invitations</div>
    </div>
    <div class="content">
      <div class="greeting">¡Felicidades${order.nombreCliente ? `, ${order.nombreCliente}` : ""}!</div>
      <p style="font-size: 15px; line-height: 1.6; color: #5E534C; margin: 0 0 20px 0;">
        Tu pago ha sido procesado con éxito. Hemos reservado tu diseño y nuestro equipo de Concierge ya tiene todo listo para comenzar a crear tu invitación de ensueño.
      </p>

      <div class="order-box">
        <div style="margin-bottom: 12px;">
          <span class="badge">Orden Confirmada</span>
        </div>
        <div class="order-row">
          <span>Paquete adquirido:</span>
          <strong>${order.paqueteNombre}</strong>
        </div>
        <div class="order-row">
          <span>Número de Orden:</span>
          <span>#${order.id.slice(-6).toUpperCase()}</span>
        </div>
        ${order.tipoEvento ? `
        <div class="order-row">
          <span>Tipo de Evento:</span>
          <span>${order.tipoEvento}</span>
        </div>` : ""}
        ${order.fechaEvento ? `
        <div class="order-row">
          <span>Fecha estimada:</span>
          <span>${new Date(order.fechaEvento).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>` : ""}
        <div class="order-row">
          <span>Total Pagado:</span>
          <span>$${order.montoTotal.toFixed(2)} USD</span>
        </div>
      </div>

      <div class="concierge-card">
        <h4 style="margin: 0 0 8px 0; color: #2C1F1B; font-size: 15px;">¿Qué ocurre ahora? (Cero estrés)</h4>
        <p style="margin: 0; font-size: 13px; color: #5E534C; line-height: 1.6;">
          No te preocupes si aún no tienes todas las fotos o la lista de chambelanes/padrinos lista. Nos pondremos en contacto contigo por WhatsApp para que nos envíes tus archivos a tu propio ritmo.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0 10px 0;">
        <a href="${thankYouUrl}" class="btn">Ver Mi Orden & Detalles</a>
        <a href="${whatsappUrl}" class="btn-outline">Escribir por WhatsApp</a>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0;">Click and love • Todos los derechos reservados.</p>
      <p style="margin: 6px 0 0 0;">Si tienes preguntas inmediatas, contáctanos a soporte@clickandlove.app</p>
    </div>
  </div>
</body>
</html>
  `;

  // Enviar con AWS SES
  try {
    const hasCredentials = !!(process.env.AWS_ACCESS_SES_KEY || process.env.AWS_ACCESS_KEY_ID);
    if (!hasCredentials) {
      console.log(`[AWS SES SIMULACIÓN] Email de confirmación enviado a cliente "${toEmail}": "${subject}"`);
      return { success: true, simulated: true };
    }

    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: htmlBody, Charset: "UTF-8" },
          Text: {
            Data: `¡Felicidades! Tu compra de ${order.paqueteNombre} ($${order.montoTotal} USD) en Click and love ha sido confirmada.\nNúmero de orden: #${order.id.slice(-6).toUpperCase()}.\nVer detalles: ${thankYouUrl}`,
            Charset: "UTF-8",
          },
        },
      },
    });

    await sesClient.send(command);
    console.log(`[AWS SES] Correo de compra enviado con éxito a ${toEmail}`);
    return { success: true };
  } catch (err: any) {
    console.error("[AWS SES Error enviando a cliente]:", err?.message || err);
    return { success: false, error: err?.message };
  }
}

/**
 * Enviar alerta instantánea al administrador alertando sobre una nueva venta
 */
export async function sendAdminOrderAlertEmail(
  order: OrderData,
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://clickandlove.app"
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || "notificaciones@clickandlove.app";
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || fromEmail;

  const subject = `🚨 ¡NUEVA VENTA! $${order.montoTotal} USD • ${order.paqueteNombre} • ${order.nombreCliente || order.emailCliente}`;

  // WhatsApp directo al cliente para empezar a chatear con un click
  const clientWhatsappRaw = (order.telefonoCliente || "").replace(/\D/g, "");
  const whatsappChatUrl = clientWhatsappRaw
    ? `https://wa.me/${clientWhatsappRaw}?text=${encodeURIComponent(
        `Hola ${order.nombreCliente || ""}! Te saluda el equipo de Click and love. Muchas gracias por adquirir tu paquete ${order.paqueteNombre}. Estoy a tu disposición para comenzar el diseño de tu invitación.`
      )}`
    : null;

  const adminDashboardUrl = `${siteUrl}/dashboard`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F5F7; margin: 0; padding: 0; color: #172B4D; }
    .container { max-width: 580px; margin: 25px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #DFE1E6; }
    .header { background-color: #00875A; padding: 25px; color: #FFFFFF; text-align: center; }
    .badge { display: inline-block; background-color: #E3FCEF; color: #006644; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; }
    .amount { font-size: 32px; font-weight: bold; margin: 10px 0 0 0; }
    .content { padding: 30px; }
    .info-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .info-table td { padding: 10px 0; border-bottom: 1px solid #EBECF0; font-size: 14px; }
    .info-table td.label { color: #6B778C; width: 40%; font-weight: 500; }
    .info-table td.val { color: #172B4D; font-weight: 600; }
    .btn { display: inline-block; background-color: #25D366; color: #FFFFFF !important; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: bold; font-size: 14px; margin-top: 20px; }
    .btn-admin { display: inline-block; background-color: #091E42; color: #FFFFFF !important; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: bold; font-size: 14px; margin-top: 20px; margin-left: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Pago Aprobado en Stripe</span>
      <div class="amount">+$${order.montoTotal.toFixed(2)} USD</div>
      <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">Paquete: ${order.paqueteNombre}</div>
    </div>
    <div class="content">
      <h3 style="margin: 0 0 15px 0;">Ficha del Comprador</h3>
      <table class="info-table">
        <tr>
          <td class="label">Cliente:</td>
          <td class="val">${order.nombreCliente || "No especificado"}</td>
        </tr>
        <tr>
          <td class="label">Email:</td>
          <td class="val"><a href="mailto:${order.emailCliente}">${order.emailCliente}</a></td>
        </tr>
        <tr>
          <td class="label">Teléfono / WhatsApp:</td>
          <td class="val">${order.telefonoCliente || "No indicado aún"}</td>
        </tr>
        <tr>
          <td class="label">Tipo de Evento:</td>
          <td class="val">${order.tipoEvento || "Sin definir"}</td>
        </tr>
        <tr>
          <td class="label">Fecha del Evento:</td>
          <td class="val">${order.fechaEvento ? new Date(order.fechaEvento).toLocaleDateString("es-ES") : "Por definir"}</td>
        </tr>
        <tr>
          <td class="label">Plantilla Deseada:</td>
          <td class="val">${order.plantillaDeseada || "A coordinar"}</td>
        </tr>
        <tr>
          <td class="label">Comentarios / Notas:</td>
          <td class="val" style="font-weight: normal; font-style: italic;">${order.comentarios || "Ninguno"}</td>
        </tr>
        <tr>
          <td class="label">ID de Orden:</td>
          <td class="val">${order.id}</td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 25px;">
        ${
          whatsappChatUrl
            ? `<a href="${whatsappChatUrl}" class="btn">Abrir WhatsApp del Cliente</a>`
            : ""
        }
        <a href="${adminDashboardUrl}" class="btn-admin">Ver en Panel Admin</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const hasCredentials = !!(process.env.AWS_ACCESS_SES_KEY || process.env.AWS_ACCESS_KEY_ID);
    if (!hasCredentials) {
      console.log(`[AWS SES SIMULACIÓN] Alerta enviada al Admin "${adminEmail}": "${subject}"`);
      return { success: true, simulated: true };
    }

    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [adminEmail],
      },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: htmlBody, Charset: "UTF-8" },
          Text: {
            Data: `Nueva Venta: ${order.nombreCliente || order.emailCliente} compró ${order.paqueteNombre} por $${order.montoTotal} USD.\nTeléfono: ${order.telefonoCliente || "No indicado"}\nFecha: ${order.fechaEvento || "Por definir"}\nVer en panel: ${adminDashboardUrl}`,
            Charset: "UTF-8",
          },
        },
      },
    });

    await sesClient.send(command);
    console.log(`[AWS SES] Alerta de venta enviada a admin ${adminEmail}`);
    return { success: true };
  } catch (err: any) {
    console.error("[AWS SES Error enviando a admin]:", err?.message || err);
    return { success: false, error: err?.message };
  }
}
