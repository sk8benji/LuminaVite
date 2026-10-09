import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const host = (request.headers.get("host") || "").toLowerCase();

  // 1. Excluir recursos estáticos, imágenes, fuentes y APIs públicas
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api/rsvp") ||
    pathname.startsWith("/api/og") ||
    pathname.startsWith("/api/s3") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Permitir siempre endpoints de autenticación administrativa
  if (
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  // 3. Detectar si la petición proviene del subdominio admin (admin.clickandlove.app o admin.localhost)
  const isAdminSubdomain =
    host.startsWith("admin.clickandlove.app") ||
    host.startsWith("admin.") ||
    host.startsWith("admin.localhost");

  // Obtener y verificar el token de sesión
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = await verifyAdminToken(token);

  // ──────────────────────────────────────────────────────────
  // CASO A: PETICIÓN EN EL SUBDOMINIO ADMIN (admin.clickandlove.app)
  // ──────────────────────────────────────────────────────────
  if (isAdminSubdomain) {
    // Si NO está autenticado
    if (!isAuthenticated) {
      if (pathname === "/login") {
        return NextResponse.next();
      }
      // Redirigir al formulario de acceso
      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/" && pathname !== "/dashboard") {
        loginUrl.searchParams.set("next", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // Si ya está autenticado y accede a /login, enviarlo a la raíz del panel
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // En la raíz "/" de admin.clickandlove.app, reescribir internamente a /dashboard
    // manteniendo la URL limpia https://admin.clickandlove.app/ en el navegador
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/dashboard", request.url));
    }

    // Permitir cualquier otra ruta dentro de admin
    return NextResponse.next();
  }

  // ──────────────────────────────────────────────────────────
  // CASO B: PETICIÓN EN EL DOMINIO PRINCIPAL (clickandlove.app o localhost)
  // ──────────────────────────────────────────────────────────
  const isAdminPath =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/eventos/nuevo" ||
    pathname.startsWith("/eventos/nuevo");

  if (isAdminPath) {
    // Si estamos en producción sobre el dominio clickandlove.app y no es el subdominio admin:
    // Redirigir hacia el subdominio administrativo oficial
    if (host.includes("clickandlove.app")) {
      const targetPath = pathname === "/dashboard" ? "/" : pathname;
      const targetUrl = new URL(targetPath, "https://admin.clickandlove.app");
      return NextResponse.redirect(targetUrl);
    }

    // En desarrollo local (localhost:3000), proteger con contraseña sin forzar subdominio
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si intenta ir a /login en el dominio principal y ya está autenticado
  if (pathname === "/login" && isAuthenticated) {
    if (host.includes("clickandlove.app")) {
      return NextResponse.redirect(new URL("/", "https://admin.clickandlove.app"));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
