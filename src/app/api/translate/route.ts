import { NextRequest, NextResponse } from "next/server";

// Diccionario de frases y títulos clásicos de eventos (Quinceañeras / Bodas)
const EVENT_DICTIONARY_ES_TO_EN: Record<string, string> = {
  // Dedicatorias clásicas
  "hoy comienzo a escribir un nuevo capitulo al dejar atras mi ninez para convertirme en mujer. en este dia tan especial, rodeada del carino de quienes mas quiero, seria un honor contar con tu presencia para celebrar un momento que guardare por siempre en mi corazon.":
    "Today I begin to write a new chapter as I leave childhood behind to become a young woman. On this special day, surrounded by the love of those I cherish most, it would be an honor to have your presence to celebrate a moment I will keep in my heart forever.",
  "con la bendicion de dios y el amor de mi familia, tengo el honor de invitarte a celebrar este dia tan esperado.":
    "With the blessing of God and the love of my family, I have the honor of inviting you to celebrate this long-awaited day.",

  // Dress Code
  "rigurosa etiqueta": "Black Tie Formal",
  "formal elegante": "Formal Elegant",
  "traje formal": "Formal Attire",
  "vestimenta formal": "Formal Attire",
  "etiqueta rigurosa": "Black Tie / Strict Formal",
  "vestido de noche": "Evening Gown / Dark Suit",

  // Regalos
  "lluvia de sobres": "Envelope Shower (Monetary Gifts)",
  "tu presencia es nuestro mayor regalo": "Your presence is our greatest gift",
  "tu presencia es nuestro mejor regalo": "Your presence is our greatest gift",

  // Hitos de Itinerario
  "misa de accion de gracias": "Thanksgiving Mass",
  "ceremonia religiosa": "Religious Ceremony",
  "ceremonia en la iglesia": "Church Ceremony",
  "misa": "Religious Mass",
  "llegada de invitados": "Guest Arrival",
  "llegada al salon": "Arrival at Banquet Hall",
  "llegada en carruaje": "Carriage Arrival",
  "recepcion y coctel": "Cocktail & Welcome Reception",
  "recepcion y coctel de bienvenida": "Cocktail & Welcome Reception",
  "recepcion": "Reception",
  "coctel de bienvenida": "Welcome Cocktail",
  "entrada triunfal": "Grand Entrance",
  "entrada de la quinceanera": "Quinceañera Grand Entrance",
  "llegada de la quinceanera": "Quinceañera Arrival",
  "brindis de honor": "Toast of Honor",
  "brindis": "Toast of Honor",
  "cena de gala": "Gala Dinner",
  "cena": "Dinner Service",
  "comida": "Dinner Service",
  "vals principal": "The Main Waltz",
  "vals": "The Waltz",
  "vals con el padre": "Father & Daughter Waltz",
  "vals con papa": "Father & Daughter Waltz",
  "baile con el padre": "Father & Daughter Dance",
  "baile con los padres": "Waltz with Parents",
  "corte de honor": "Court of Honor Presentation",
  "presentacion de la corte": "Court of Honor Presentation",
  "presentacion de la corte de honor": "Court of Honor Presentation",
  "cambio de zapatilla": "Changing of the Shoes Ceremony",
  "cambio de zapatillas": "Changing of the Shoes Ceremony",
  "entrega de la ultima muneca": "The Last Doll Ceremony",
  "ultima muneca": "The Last Doll Ceremony",
  "coronacion": "Crowning Ceremony",
  "apertura de pista": "Party Begins / Dance Floor Opens",
  "baile sorpresa": "Surprise Dance",
  "fiesta y baile": "Party Time & Open Dance",
  "fiesta": "Party Time & Celebration",
  "hora loca": "Crazy Hour (La Hora Loca)",
  "pastel y dulces": "Cake Cutting & Dessert",
  "corte de pastel": "Cake Cutting",
  "agradecimientos y despedida": "Farewell & Thank You",
  "despedida": "Farewell",
};

// Normalizar texto para búsquedas en diccionario (elimina acentos y minúsculas)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getDictionaryTranslation(text: string, targetLang: string): string | null {
  if (targetLang !== "en") return null;
  const norm = normalizeText(text);

  // Coincidencia exacta
  if (EVENT_DICTIONARY_ES_TO_EN[norm]) {
    return EVENT_DICTIONARY_ES_TO_EN[norm];
  }

  // Coincidencia por aproximación para itinerarios comunes
  for (const [key, value] of Object.entries(EVENT_DICTIONARY_ES_TO_EN)) {
    if (norm === key || norm.includes(key)) {
      return value;
    }
  }

  return null;
}

// Proveedor de Google Gemini (gemini-3.8-flash / gemini-3.5-flash-lite / gemini-flash-latest)
async function translateWithGemini(text: string, targetLang: "en" | "es"): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return null;

  const targetLanguageName =
    targetLang === "es"
      ? "Spanish (Español latinoamericano cálido y elegante)"
      : "English (Natural, elegant invitation tone)";

  const prompt = `You are a professional luxury event translator specializing in invitations (Quinceañeras, Weddings, Sweet 16).
Translate the provided text accurately to ${targetLanguageName}.
Maintain an elegant, emotive, and celebratory tone suitable for high-end digital invitations.
Preserve proper names, times, hashtags, and money signs.
Do not wrap your answer in quotes or add markdown formatting. Return ONLY the translation.

Text to translate:
${text.trim()}`;

  const models = ["gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-flash-latest"];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          },
        }),
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (translated) return translated;
      }
    } catch (err) {
      console.warn(`Error calling Gemini API (${model}):`, err);
    }
  }

  return null;
}

// Fallback gratuito mediante MyMemory API
async function translateWithMyMemory(text: string, targetLang: "en" | "es"): Promise<string | null> {
  try {
    const pair = targetLang === "en" ? "es|en" : "en|es";
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${pair}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (translated && typeof translated === "string" && translated.trim()) {
      // MyMemory a veces devuelve texto codificado en HTML entities
      return translated
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
    }
    return null;
  } catch (err) {
    console.warn("MyMemory fallback error:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang = "en" } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ success: true, translatedText: "" });
    }

    const trimmedText = text.trim();

    // 1. Verificar si existe coincidencia rápida en diccionario temático
    const dictMatch = getDictionaryTranslation(trimmedText, targetLang);
    if (dictMatch && trimmedText.length < 150) {
      return NextResponse.json({
        success: true,
        translatedText: dictMatch,
        provider: "dictionary",
      });
    }

    // 2. Intentar con Google Gemini si GEMINI_API_KEY está configurada
    const geminiTranslation = await translateWithGemini(trimmedText, targetLang);
    if (geminiTranslation) {
      return NextResponse.json({
        success: true,
        translatedText: geminiTranslation,
        provider: "gemini",
      });
    }

    // 3. Intentar con OpenAI gpt-4o-mini si OPENAI_API_KEY está disponible
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const targetLanguageName =
          targetLang === "es"
            ? "Spanish (Español latinoamericano cálido y elegante)"
            : "English (Natural, elegant invitation tone)";

        const systemPrompt = `You are a professional luxury event translator specializing in invitations (Quinceañeras, Weddings, Sweet 16).
Translate the provided text accurately to ${targetLanguageName}.
Maintain an elegant, emotive, and celebratory tone suitable for high-end digital invitations.
Preserve proper names, times, hashtags, and money signs.
Do not wrap your answer in quotes or add markdown formatting. Return ONLY the translation.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: trimmedText },
            ],
            temperature: 0.3,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const translatedText = data?.choices?.[0]?.message?.content?.trim() || "";
          if (translatedText) {
            return NextResponse.json({
              success: true,
              translatedText,
              provider: "openai",
            });
          }
        } else {
          const errData = await response.text();
          console.warn("OpenAI translation response not OK (fallback activated):", response.status, errData);
        }
      } catch (openAiErr) {
        console.warn("Error calling OpenAI (fallback activated):", openAiErr);
      }
    }

    // 4. Fallback automático mediante MyMemory (libre de límites)
    const memoryTranslation = await translateWithMyMemory(trimmedText, targetLang);
    if (memoryTranslation) {
      return NextResponse.json({
        success: true,
        translatedText: memoryTranslation,
        provider: "mymemory",
      });
    }

    // 5. Último recurso: diccionario o texto original
    if (dictMatch) {
      return NextResponse.json({
        success: true,
        translatedText: dictMatch,
        provider: "dictionary",
      });
    }

    return NextResponse.json({
      success: true,
      translatedText: trimmedText,
      provider: "raw",
    });
  } catch (error: any) {
    console.error("Error en endpoint /api/translate:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error?.message },
      { status: 500 }
    );
  }
}
