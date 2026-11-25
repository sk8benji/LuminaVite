import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Click & Love • Papelería Digital de Alta Costura",
  description:
    "Invitaciones interactivas de lujo con sobre 3D, música envolvente, confirmación SMS vía Twilio y panel de control con Magic Link.",
  verification: {
    google: "m15lN16vqwM9NHyXz9Y3_sDZzHsyTCPUSzq-ByfbNtg",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // lang por ruta (SEO home, nov 2026): el middleware pone x-locale ("es" en
  // /es/*, "en" en el resto). Default "en" si el header no viene (p. ej. el
  // rewrite interno del admin a /dashboard).
  const locale = (await headers()).get("x-locale") === "es" ? "es" : "en";
  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Marcellus&family=Montserrat:wght@300;400;500;600;700&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Prata&display=swap"
          rel="stylesheet"
        />
        {/* Medición (REGLA Tag Manager, 25 nov 2026): SOLO el snippet de GTM en la web — GA4, Meta Pixel, Clarity y todos los eventos se agregan desde Tag Manager, nunca directos en el código. */}
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N2QKK445');`,
          }}
        />
        {/* Organization schema (Mes 9): marca, logo, área de servicio. Sin sameAs: el sitio no tiene perfiles sociales oficiales todavía. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Click & Love",
              url: "https://clickandlove.app/",
              logo: "https://clickandlove.app/logo.png",
              telephone: "+1-818-918-2519",
              areaServed: [
                { "@type": "AdministrativeArea", name: "Los Angeles" },
                { "@type": "AdministrativeArea", name: "Southern California" },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased bg-[#FAF8F5] min-h-screen text-[#2C1F1B] selection:bg-[#C5A059]/30 selection:text-[#2C1F1B]">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N2QKK445"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
