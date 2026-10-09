import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Click & Love • Papelería Digital de Alta Costura",
  description:
    "Invitaciones interactivas de lujo con sobre 3D, música envolvente, confirmación SMS vía Twilio y panel de control con Magic Link.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:wght@300;400;500;600;700&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Prata&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FAF8F5] min-h-screen text-[#2C1F1B] selection:bg-[#C5A059]/30 selection:text-[#2C1F1B]">
        {children}
      </body>
    </html>
  );
}
