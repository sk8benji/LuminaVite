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
