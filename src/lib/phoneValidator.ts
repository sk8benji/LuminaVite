export interface PhoneValidationResult {
  isValid: boolean;
  e164Phone: string | null;
  error?: string;
}

/**
 * Valida y normaliza números telefónicos antes de llamar a Twilio o registrar en base de datos.
 * Prioriza formato NANP (+1 USA/Canadá) y estándar internacional E.164 (8 a 15 dígitos).
 * Previene el error Twilio 21265 ("'To' number cannot be a Short Code").
 */
export function validateAndFormatPhone(rawPhone: string): PhoneValidationResult {
  if (!rawPhone || typeof rawPhone !== "string") {
    return { isValid: false, e164Phone: null, error: "Número vacío o inválido" };
  }

  // Eliminar espacios, guiones, paréntesis y puntos
  const cleaned = rawPhone.trim().replace(/[\s\-\(\)\.]/g, "");

  if (!cleaned) {
    return { isValid: false, e164Phone: null, error: "Número vacío" };
  }

  // Caso 1: 10 dígitos estándar de EE. UU. (ej. 8182973697)
  if (/^\d{10}$/.test(cleaned)) {
    const areaCode = cleaned[0];
    const exchange = cleaned[3];
    if (areaCode === "0" || areaCode === "1" || exchange === "0" || exchange === "1") {
      return {
        isValid: false,
        e164Phone: null,
        error: "Código de área o central NANP inválido en formato de 10 dígitos",
      };
    }
    return { isValid: true, e164Phone: `+1${cleaned}` };
  }

  // Caso 2: 11 dígitos iniciando con 1 (ej. 18182973697)
  if (/^1\d{10}$/.test(cleaned)) {
    const areaCode = cleaned[1];
    const exchange = cleaned[4];
    if (areaCode === "0" || areaCode === "1" || exchange === "0" || exchange === "1") {
      return {
        isValid: false,
        e164Phone: null,
        error: "Código de área o central NANP inválido en formato de 11 dígitos",
      };
    }
    return { isValid: true, e164Phone: `+${cleaned}` };
  }

  // Caso 3: Ya incluye '+' (formato internacional explícito)
  if (cleaned.startsWith("+")) {
    const digitsOnly = cleaned.slice(1);

    // Verificar si es un número de 10 dígitos estadounidense al que erróneamente solo se le antepuso '+'
    // (como +8182973697 que Twilio detecta como código corto o prefijo de Japón inválido)
    if (/^\d{10}$/.test(digitsOnly)) {
      const areaCode = digitsOnly[0];
      const exchange = digitsOnly[3];
      // Si cumple formato NANP (área 2-9, exchange 2-9), corregir a +1
      if (areaCode !== "0" && areaCode !== "1" && exchange !== "0" && exchange !== "1") {
        return { isValid: true, e164Phone: `+1${digitsOnly}` };
      }
    }

    // Regla E.164 estándar general: entre 8 y 15 dígitos numéricos
    if (/^\d{8,15}$/.test(digitsOnly)) {
      return { isValid: true, e164Phone: `+${digitsOnly}` };
    }

    return {
      isValid: false,
      e164Phone: null,
      error: "Formato internacional E.164 fuera de rango (8-15 dígitos)",
    };
  }

  // Caso 4: Solo dígitos, de entre 8 y 15 dígitos sin prefijo
  if (/^\d{8,15}$/.test(cleaned)) {
    // Si tiene 10 dígitos ya fue capturado en Caso 1.
    // Si tiene 11 y empieza con 1 ya fue capturado en Caso 2.
    // Para otros países sin '+' previo, se antepone '+' si tiene longitud válida de país
    return { isValid: true, e164Phone: `+${cleaned}` };
  }

  return {
    isValid: false,
    e164Phone: null,
    error: "Longitud o caracteres no reconocidos para teléfono E.164",
  };
}

/**
 * Versión simplificada que devuelve el string normalizado o null si es inválido.
 */
export function formatE164(rawPhone: string): string | null {
  const result = validateAndFormatPhone(rawPhone);
  return result.isValid ? result.e164Phone : null;
}
