import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Configuración de AWS SES
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export interface HostEmailParams {
  hostEmail: string;
  eventoTitulo: string;
  slug: string;
  panelToken?: string | null;
  nombreInvitado: string;
  telefono?: string | null;
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
        <div class="field">
          <div class="label">Teléfono Móvil</div>
          <div class="value" style="font-size: 14px; font-family: monospace;">${telefono || "No especificado"}</div>
        </div>
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
  if (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "demo_key" ||
    !hostEmail
  ) {
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

  const cleanPhone = telefono.replace(/[^0-9+]/g, "");
  // Formatear si no tiene prefijo internacional
  const toPhone = cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`;

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
