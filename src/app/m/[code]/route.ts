import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> | { code: string } }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const code = (resolvedParams?.code || "").trim();

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const shortLink = await prisma.shortLink.findUnique({
      where: { code },
    });

    if (!shortLink?.url) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.redirect(shortLink.url, 302);
  } catch (err) {
    console.warn("Error en redirección de ShortLink:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
