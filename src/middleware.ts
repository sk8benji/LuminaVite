import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

// Idioma del <html lang> por ruta (SEO home, nov 2026): /es/* -> "es",
// todo lo demás -> "en". El root layout lee este header vía headers().
// Se pasa en TODOS los next() porque el layout raíz es compartido (admin
// incluido); las rutas que no renderizan layout simplemente lo ignoran.
// También se pasa x-pathname para que el layout decida si la ruta lleva el
// header/footer compartidos (allowlist de marketing) o va pelada (app,
// invitaciones, demos, admin).
function nextWithLocale(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const host = (request.headers.get("host") || "").toLowerCase();

  // 1. Excluir recursos estáticos, imágenes, fuentes, health y APIs públicas
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api/rsvp") ||
    pathname.startsWith("/api/og") ||
    pathname.startsWith("/api/s3") ||
    pathname === "/api/health" ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname.includes(".")
  ) {
    return nextWithLocale(request);
  }

  // 2. Permitir siempre endpoints de autenticación administrativa
  if (
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return nextWithLocale(request);
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
    // Si intenta acceder a una ruta pública (demo, save-the-date, invitaciones públicas)
    // en el subdominio admin, redirigir al dominio público principal sin pedir contraseña
    if (
      pathname.startsWith("/save-the-date") ||
      pathname.startsWith("/demo")
    ) {
      if (host.includes("clickandlove.app")) {
        const publicUrl = new URL(pathname + url.search, "https://clickandlove.app");
        return NextResponse.redirect(publicUrl);
      }
      return nextWithLocale(request);
    }

    // Si NO está autenticado
    if (!isAuthenticated) {
      if (pathname === "/login") {
        return nextWithLocale(request);
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
    return nextWithLocale(request);
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

  // /login en el dominio principal -> subdominio admin (decisión Abraham,
  // nov 2026): el SaaS vive solo en admin.clickandlove.app. Redirect 301
  // permanente, conservando el query string (?next=...). Solo afecta al
  // dominio principal: en el subdominio admin este bloque no se alcanza
  // (Caso A ya devolvió antes), así que admin.clickandlove.app/login nunca
  // se redirige a sí mismo.
  if (pathname === "/login" && host.includes("clickandlove.app")) {
    return NextResponse.redirect(
      new URL("/login" + url.search, "https://admin.clickandlove.app"),
      301
    );
  }

  // Si intenta ir a /login en el dominio principal y ya está autenticado
  if (pathname === "/login" && isAuthenticated) {
    if (host.includes("clickandlove.app")) {
      return NextResponse.redirect(new URL("/", "https://admin.clickandlove.app"));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return nextWithLocale(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
