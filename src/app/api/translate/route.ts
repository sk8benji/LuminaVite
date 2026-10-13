import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang = "en" } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ translatedText: "" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no configurada en las variables de entorno." },
        { status: 500 }
      );
    }

    const targetLanguageName = targetLang === "es" ? "Spanish (Español latinoamericano cálido y elegante)" : "English (Natural, elegant invitation tone)";

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
          { role: "user", content: text.trim() },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("Error respuesta OpenAI:", errData);
      return NextResponse.json(
        { error: "Error al comunicarse con OpenAI", details: errData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const translatedText = data?.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({
      success: true,
      translatedText,
    });
  } catch (error: any) {
    console.error("Error en endpoint /api/translate:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error?.message },
      { status: 500 }
    );
  }
}
