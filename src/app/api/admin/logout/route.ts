import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";
import { getSiteUrl } from "@/lib/url-safety";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Sesión cerrada" });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

export async function GET(req: NextRequest) {
  const loginUrl = new URL("/login", getSiteUrl());
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
