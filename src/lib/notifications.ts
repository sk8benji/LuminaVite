import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { validateAndFormatPhone } from "@/lib/phoneValidator";

// Configuración de AWS SES
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_SES_KEY || process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_SES_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export interface HostEmailParams {
  hostEmail: string;
  eventoTitulo: string;
  slug: string;
  panelToken?: string | null;
  nombreInvitado: string;
  telefono?: string | null;
  email?: string | null;
  pases: number;
  totalPasesConfirmados: number;
  aforoTotal: number;
  siteUrl?: string;
}

export interface GuestSmsParams {
  telefono: string;
  nombreInvitado: string;
  pases: number;
  eventoTitulo: string;
  recepcionNombre?: string;
  recepcionMapUrl?: string;
}

export interface GuestEmailParams {
  guestEmail: string;
  nombreInvitado: string;
  pases: number;
  eventoTitulo: string;
  slug: string;
  recepcionNombre?: string;
  recepcionDireccion?: string;
  recepcionMapUrl?: string;
  siteUrl?: string;
}

/**
 * Enviar correo al anfitrión (Mamá / Organizador) con AWS SES
 * cada vez que un invitado confirma asistencia.
 */
export async function sendHostNotificationEmail(params: HostEmailParams): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const {
    hostEmail,
    eventoTitulo,
    slug,
    panelToken,
    nombreInvitado,
    telefono,
    email,
    pases,
    totalPasesConfirmados,
    aforoTotal,
    siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  } = params;

  const magicLink = panelToken
    ? `${siteUrl}/${slug}/panel?key=${panelToken}`
    : `${siteUrl}/${slug}/panel`;

  const subject = `¡Nueva confirmación! ${nombreInvitado} (${pases} ${pases === 1 ? "pase" : "pases"}) • ${eventoTitulo}`;
  const porcentaje = Math.min(100, Math.round((totalPasesConfirmados / (aforoTotal || 200)) * 100));

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 20px; color: #2d3748; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #edf2f7; }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #2f5a84 100%); padding: 32px 24px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #bfdbfe; }
    .content { padding: 32px 24px; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .field { margin-bottom: 12px; }
    .field:last-child { margin-bottom: 0; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600; }
    .value { font-size: 16px; color: #0f172a; font-weight: 600; margin-top: 2px; }
    .progress-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 28px; }
    .progress-bar-bg { width: 100%; height: 10px; background: #dbeafe; border-radius: 5px; overflow: hidden; margin-top: 10px; }
    .progress-bar-fill { height: 100%; background: #2563eb; border-radius: 5px; width: ${porcentaje}%; }
    .btn-container { text-align: center; margin: 32px 0 16px; }
    .btn { display: inline-block; background-color: #1e293b; color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 10px; letter-spacing: 0.5px; }
    .footer { text-align: center; font-size: 12px; color: #94a3b8; padding: 20px 24px; border-top: 1px solid #f1f5f9; background: #fafafa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 28px; margin-bottom: 8px;">✨ 🦋 ✨</div>
      <h1>¡Nueva Confirmación Registrada!</h1>
      <p>${eventoTitulo}</p>
    </div>

    <div class="content">
      <p style="font-size: 15px; line-height: 1.5; margin-top: 0;">
        ¡Buenas noticias! Una familia acaba de confirmar su asistencia a través de la invitación digital:
      </p>

      <div class="card">
        <div class="field">
          <div class="label">Invitado / Familia</div>
          <div class="value">${nombreInvitado}</div>
        </div>
        <div class="field">
          <div class="label">Pases Confirmados</div>
          <div class="value" style="color: #047857; font-size: 18px;">${pases} ${pases === 1 ? "pase" : "pases"}</div>
        </div>
        ${email ? `
        <div class="field">
          <div class="label">Correo Electrónico</div>
          <div class="value" style="font-size: 14px; font-family: monospace;">${email}</div>
        </div>` : ""}
        ${telefono ? `
        <div class="field">
          <div class="label">Teléfono Móvil</div>
          <div class="value" style="font-size: 14px; font-family: monospace;">${telefono}</div>
        </div>` : !email ? `
        <div class="field">
          <div class="label">Contacto</div>
          <div class="value" style="font-size: 14px; font-family: monospace;">No especificado</div>
        </div>` : ""}
      </div>

      <div class="progress-box">
        <div style="font-size: 13px; color: #1e40af; font-weight: 600;">
          Balance en tiempo real:
        </div>
        <div style="font-size: 18px; font-weight: 800; color: #1e3a8a; margin-top: 4px;">
          Llevas ${totalPasesConfirmados} de ${aforoTotal} pases confirmados
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill"></div>
        </div>
        <div style="font-size: 11px; color: #3b82f6; margin-top: 6px;">
          ${porcentaje}% del aforo confirmado
        </div>
      </div>

      <div class="btn-container">
        <a href="${magicLink}" class="btn" target="_blank">
          Ver Lista de Invitados en Vivo
        </a>
      </div>
      <p style="text-align: center; font-size: 11px; color: #64748b; margin-top: 8px;">
        Acceso directo seguro sin necesidad de recordar contraseñas.
      </p>
    </div>

    <div class="footer">
      LuminaVite • Plataforma de Invitaciones Digitales Interactivas
    </div>
  </div>
</body>
</html>
`;

  // Si no hay credenciales válidas en .env, logueamos el modo simulación para desarrollo local
  const hasCredentials = !!(process.env.AWS_ACCESS_SES_KEY || process.env.AWS_ACCESS_KEY_ID);
  if (!hasCredentials || !hostEmail) {
    console.log(
      `[AWS SES SIMULACIÓN] Email enviado a "${hostEmail}": "${subject}". Magic Link: ${magicLink}`
    );
    return { success: true, simulated: true };
  }

  try {
    const fromEmail = process.env.AWS_SES_FROM_EMAIL || "notificaciones@luminavite.com";
    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [hostEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: `¡Nueva confirmación! ${nombreInvitado} confirmó ${pases} pases para ${eventoTitulo}.\nLlevas ${totalPasesConfirmados} de ${aforoTotal} pases confirmados.\nVer lista completa en: ${magicLink}`,
            Charset: "UTF-8",
          },
        },
      },
    });

    await sesClient.send(command);
    console.log(`[AWS SES] Correo transaccional enviado con éxito a ${hostEmail}`);
    return { success: true };
  } catch (err: any) {
    console.error("[AWS SES Error]:", err?.message || err);
    // Retornamos éxito simulado para no interrumpir el flujo de confirmación del usuario
    return { success: false, error: err?.message };
  }
}

/**
 * Disparar SMS transaccional de confirmación al invitado con Twilio REST API
 */
export async function sendGuestConfirmationSms(params: GuestSmsParams): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const {
    telefono,
    nombreInvitado,
    pases,
    eventoTitulo,
    recepcionNombre,
    recepcionMapUrl,
  } = params;

  if (!telefono) {
    return { success: false, error: "No se proporcionó número telefónico." };
  }

  const phoneValidation = validateAndFormatPhone(telefono);
  if (!phoneValidation.isValid || !phoneValidation.e164Phone) {
    console.warn(
      `[TWILIO SMS] Número telefónico descartado por formato inválido (${telefono}):`,
      phoneValidation.error
    );
    return {
      success: false,
      error: phoneValidation.error || "Formato de teléfono inválido para E.164.",
    };
  }

  const toPhone = phoneValidation.e164Phone;

  let body = `¡Hola ${nombreInvitado}! Tu confirmación para ${pases} ${pases === 1 ? "pase" : "pases"} a "${eventoTitulo}" ha sido registrada exitosamente.`;
  if (recepcionNombre) {
    body += ` Salón: ${recepcionNombre}.`;
  }
  if (recepcionMapUrl) {
    body += ` Ubicación GPS: ${recepcionMapUrl}`;
  }
  body += ` ¡Te esperamos!`;

  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  // Si no hay credenciales configuradas de Twilio, registramos simulación
  if (!twilioSid || !twilioAuthToken || !twilioFrom) {
    console.log(
      `[TWILIO SMS SIMULACIÓN] Enviado a ${toPhone}:\n"${body}"`
    );
    return { success: true, simulated: true };
  }

  try {
    const authHeader = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString("base64");
    const formData = new URLSearchParams();
    formData.append("To", toPhone);
    formData.append("From", twilioFrom);
    formData.append("Body", body);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[TWILIO SMS Error Response]:", errorText);
      return { success: false, error: errorText };
    }

    console.log(`[TWILIO SMS] Mensaje enviado satisfactoriamente a ${toPhone}`);
    return { success: true };
  } catch (err: any) {
    console.error("[TWILIO SMS Error]:", err?.message || err);
    return { success: false, error: err?.message };
  }
}

/**
 * Enviar correo de confirmación de pases al invitado con AWS SES
 * (Costo prácticamente nulo: ~$0.0001 USD por envío para plan Digital Basic)
 */
export async function sendGuestConfirmationEmail(
  params: GuestEmailParams
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const {
    guestEmail,
    nombreInvitado,
    pases,
    eventoTitulo,
    slug,
    recepcionNombre,
    recepcionDireccion,
    recepcionMapUrl,
    siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clickandlove.app",
  } = params;

  if (!guestEmail || !guestEmail.includes("@")) {
    return { success: false, error: "Correo electrónico no válido." };
  }

  const cleanEmail = guestEmail.trim().toLowerCase();
  const eventLink = `${siteUrl}/${slug}`;
  const subject = `¡Tus pases para ${eventoTitulo}! • ${pases} ${pases === 1 ? "pase confirmado" : "pases confirmados"}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); padding: 36px 24px; text-align: center; color: white; }
    .header h1 { margin: 8px 0 0; font-size: 22px; font-weight: 700; letter-spacing: 0.3px; }
    .header p { margin: 6px 0 0; font-size: 14px; color: #cbd5e1; }
    .content { padding: 32px 24px; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .field { margin-bottom: 12px; }
    .field:last-child { margin-bottom: 0; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600; }
    .value { font-size: 16px; color: #0f172a; font-weight: 600; margin-top: 2px; }
    .badge { display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 15px; }
    .btn-container { text-align: center; margin: 28px 0 16px; }
    .btn { display: inline-block; background-color: #0f172a; color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 10px; }
    .btn-map { display: inline-block; background-color: #ffffff; color: #0f172a !important; text-decoration: none; padding: 10px 20px; font-size: 13px; font-weight: 600; border-radius: 8px; border: 1px solid #cbd5e1; margin-top: 8px; }
    .footer { text-align: center; font-size: 12px; color: #94a3b8; padding: 20px 24px; border-top: 1px solid #f1f5f9; background: #fafafa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 32px; margin-bottom: 4px;">🎉 ✨</div>
      <h1>¡Tu Asistencia está Confirmada!</h1>
      <p>${eventoTitulo}</p>
    </div>

    <div class="content">
      <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
        ¡Hola <strong>${nombreInvitado}</strong>! Hemos registrado exitosamente tu confirmación. Aquí tienes los detalles de tu acceso para el evento:
      </p>

      <div class="card">
        <div class="field">
          <div class="label">Pases Confirmados</div>
          <div style="margin-top: 6px;">
            <span class="badge">${pases} ${pases === 1 ? "Pase Confirmado" : "Pases Confirmados"}</span>
          </div>
        </div>

        ${recepcionNombre ? `
        <div class="field" style="margin-top: 16px;">
          <div class="label">Lugar de Recepción</div>
          <div class="value">${recepcionNombre}</div>
          ${recepcionDireccion ? `<div style="font-size: 13px; color: #64748b; margin-top: 2px;">${recepcionDireccion}</div>` : ""}
          ${recepcionMapUrl ? `
          <div style="margin-top: 8px;">
            <a href="${recepcionMapUrl}" class="btn-map" target="_blank">📍 Abrir en Google Maps</a>
          </div>` : ""}
        </div>
        ` : ""}
      </div>

      <div class="btn-container">
        <a href="${eventLink}" class="btn" target="_blank">
          Ver Invitación Digital & Detalles
        </a>
      </div>
      <p style="text-align: center; font-size: 12px; color: #64748b; margin-top: 8px;">
        Guarda este correo para presentarlo o consultar el itinerario en cualquier momento.
      </p>
    </div>

    <div class="footer">
      LuminaVite • Plataforma de Invitaciones Digitales Interactivas
    </div>
  </div>
</body>
</html>
`;

  const hasCredentials = !!(process.env.AWS_ACCESS_SES_KEY || process.env.AWS_ACCESS_KEY_ID);
  if (!hasCredentials || !cleanEmail) {
    console.log(
      `[AWS SES SIMULACIÓN] Email de invitado enviado a "${cleanEmail}": "${subject}". Evento: ${eventLink}`
    );
    return { success: true, simulated: true };
  }

  try {
    const fromEmail = process.env.AWS_SES_FROM_EMAIL || "notificaciones@luminavite.com";
    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [cleanEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: `¡Hola ${nombreInvitado}! Tu confirmación para ${pases} ${pases === 1 ? "pase" : "pases"} a "${eventoTitulo}" ha sido registrada exitosamente.\nAccede a la invitación completa aquí: ${eventLink}`,
            Charset: "UTF-8",
          },
        },
      },
    });

    await sesClient.send(command);
    console.log(`[AWS SES] Correo de invitado enviado con éxito a ${cleanEmail}`);
    return { success: true };
  } catch (err: any) {
    console.error("[AWS SES Error Invitado]:", err?.message || err);
    return { success: false, error: err?.message };
  }
}

export interface HostManualRequestEmailParams {
  hostEmail: string;
  eventoTitulo: string;
  slug: string;
  panelToken?: string | null;
  nombreSolicitante: string;
  telefono?: string | null;
  pasesSolicitados: number;
  siteUrl?: string;
}

/**
 * Enviar alerta interna por correo al anfitrión con AWS SES cuando alguien
 * que no está en la lista oficial solicita confirmación manual.
 * (100% interno vía AWS SES - Cero SMS de Twilio para eliminar riesgo de toll fraud / SMS bombing)
 */
export async function sendHostManualRequestEmail(
  params: HostManualRequestEmailParams
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const {
    hostEmail,
    eventoTitulo,
    slug,
    panelToken,
    nombreSolicitante,
    telefono,
    pasesSolicitados,
    siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clickandlove.app",
  } = params;

  const magicLink = panelToken
    ? `${siteUrl}/${slug}/panel?key=${panelToken}`
    : `${siteUrl}/${slug}/panel`;

  const subject = `🔔 Solicitud de Aprobación de Pases: ${nombreSolicitante} (${pasesSolicitados} ${pasesSolicitados === 1 ? "pase" : "pases"}) • ${eventoTitulo}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 20px; color: #292524; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e7e5e4; }
    .header { background: linear-gradient(135deg, #78350f 0%, #b45309 100%); padding: 32px 24px; text-align: center; color: white; }
    .header h1 { margin: 6px 0 0; font-size: 20px; font-weight: 700; letter-spacing: 0.3px; }
    .header p { margin: 4px 0 0; font-size: 13px; color: #fef3c7; }
    .content { padding: 32px 24px; }
    .card { background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .field { margin-bottom: 12px; }
    .field:last-child { margin-bottom: 0; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e; font-weight: 600; }
    .value { font-size: 16px; color: #451a03; font-weight: 700; margin-top: 2px; }
    .badge-status { display: inline-block; background-color: #fef3c7; color: #b45309; border: 1px solid #fcd34d; padding: 4px 10px; border-radius: 9999px; font-weight: 700; font-size: 12px; }
    .btn-container { text-align: center; margin: 28px 0 16px; }
    .btn { display: inline-block; background-color: #1c1917; color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 10px; }
    .footer { text-align: center; font-size: 12px; color: #a8a29e; padding: 20px 24px; border-top: 1px solid #f5f5f4; background: #fafaf9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 28px; margin-bottom: 4px;">📩 ⚠️</div>
      <h1>Solicitud de Confirmación Manual</h1>
      <p>${eventoTitulo}</p>
    </div>

    <div class="content">
      <p style="font-size: 14px; line-height: 1.6; margin-top: 0; color: #44403c;">
        Una persona no registrada en la lista oficial de invitados ha enviado una <strong>Solicitud de Confirmación Manual</strong> desde la invitación:
      </p>

      <div class="card">
        <div class="field">
          <div class="label">Nombre / Familia</div>
          <div class="value">${nombreSolicitante}</div>
        </div>
        <div class="field">
          <div class="label">Pases Solicitados</div>
          <div class="value" style="font-size: 18px; color: #b45309;">
            ${pasesSolicitados} ${pasesSolicitados === 1 ? "pase" : "pases"}
          </div>
        </div>
        <div class="field">
          <div class="label">Teléfono Móvil de Contacto</div>
          <div class="value" style="font-size: 14px; font-family: monospace;">${telefono || "No especificado"}</div>
        </div>
        <div class="field">
          <div class="label">Estado en Sistema</div>
          <div style="margin-top: 4px;">
            <span class="badge-status">⏳ PENDIENTE DE APROBACIÓN</span>
          </div>
        </div>
      </div>

      <p style="font-size: 13px; color: #57534e; line-height: 1.5;">
        Esta solicitud quedó guardada en tu base de datos de PostgreSQL con estado <strong>PENDIENTE_APROBACION</strong>. Puedes ingresar a tu panel para autorizar, modificar o contactar al invitado:
      </p>

      <div class="btn-container">
        <a href="${magicLink}" class="btn" target="_blank">
          Revisar Solicitud en el Panel
        </a>
      </div>
      <p style="text-align: center; font-size: 11px; color: #78716c; margin-top: 8px;">
        Acceso directo seguro al panel de control de invitados.
      </p>
    </div>

    <div class="footer">
      LuminaVite • Control de Pases y Notificaciones
    </div>
  </div>
</body>
</html>
`;

  const hasCredentials = !!(process.env.AWS_ACCESS_SES_KEY || process.env.AWS_ACCESS_KEY_ID);
  if (!hasCredentials || !hostEmail) {
    console.log(
      `[AWS SES SIMULACIÓN] Alerta interna enviada a "${hostEmail}": "${subject}". Magic Link: ${magicLink}`
    );
    return { success: true, simulated: true };
  }

  try {
    const fromEmail = process.env.AWS_SES_FROM_EMAIL || "notificaciones@luminavite.com";
    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [hostEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: `Solicitud de confirmación manual de ${nombreSolicitante} (${pasesSolicitados} pases) para ${eventoTitulo}.\nTeléfono: ${telefono || "No especificado"}.\nRevisar en: ${magicLink}`,
            Charset: "UTF-8",
          },
        },
      },
    });

    await sesClient.send(command);
    console.log(`[AWS SES] Alerta de solicitud manual enviada con éxito a ${hostEmail}`);
    return { success: true };
  } catch (err: any) {
    console.error("[AWS SES Error Alerta Manual]:", err?.message || err);
    return { success: false, error: err?.message };
  }
}


