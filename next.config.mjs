/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // H5: no anunciar el stack
  poweredByHeader: false,
  images: {
    // H6: solo dominios propios y CDNs conocidos (antes: ** = proxy abierto)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    // H5: headers de seguridad
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            // CSP: scripts propios + YouTube/Google Maps; imágenes de CDNs permitidos
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.amazonaws.com https://*.cloudfront.net https://images.unsplash.com",
              "media-src 'self' blob: https://*.amazonaws.com https://*.cloudfront.net https://cdn.pixabay.com",
              "frame-src 'self' https://www.youtube.com https://www.google.com https://maps.google.com",
              "connect-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // Arte de plantillas y assets estáticos: caché largo en el navegador
        // (antes max-age=0 por defecto: cada visita re-descargaba varios MB).
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // template-baby-blue: nombres sin hash -> TTL corto (7 dias) para que una portada
        // cambiada en el editor no quede un mes en cache.
        source: "/assets/template-baby-blue/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // template-blush: nombres sin hash -> TTL corto (7 dias) para que una portada
        // cambiada en el editor no quede un mes en cache.
        source: "/assets/template-blush/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // template-butterfly: nombres sin hash -> TTL corto (7 dias) para que una portada
        // cambiada en el editor no quede un mes en cache.
        source: "/assets/template-butterfly/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // template-era-pink: nombres sin hash -> TTL corto (7 dias) para que una portada
        // cambiada en el editor no quede un mes en cache.
        source: "/assets/template-era-pink/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // template-miss15: nombres sin hash -> TTL corto (7 dias) para que una portada
        // cambiada en el editor no quede un mes en cache.
        source: "/assets/template-miss15/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // template-quince-rosado: nombres sin hash -> TTL corto (7 dias) para que una portada
        // cambiada en el editor no quede un mes en cache.
        source: "/assets/template-quince-rosado/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // template-rose: nombres sin hash -> TTL corto (7 dias) para que una portada
        // cambiada en el editor no quede un mes en cache.
        source: "/assets/template-rose/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/invitacion/:slug",
        destination: "/:slug",
      },
    ];
  },
};

export default nextConfig;
