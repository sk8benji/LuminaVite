import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, getAdminPassword, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, "admin-login", RATE_LIMITS.login);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { password } = body;

    const expectedPassword = getAdminPassword();

    if (!password || String(password).trim() !== expectedPassword.trim()) {
      return NextResponse.json(
        { error: "Contraseña incorrecta. Por favor intenta de nuevo." },
        { status: 401 }
      );
    }

    const token = await createAdminToken();

    const response = NextResponse.json({
      success: true,
      message: "Autenticación exitosa",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 14 * 24 * 60 * 60, // 14 días
    });

    return response;
  } catch (err: any) {
    console.error("Error en admin login:", err);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
