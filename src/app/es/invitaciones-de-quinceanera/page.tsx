import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Invitaciones de Quinceañera en Los Ángeles | Click & Love",
  description:
    "Invitaciones de quinceañera en Los Ángeles con sobre 3D, música y RSVP por SMS. Ve las demos en vivo, elige tu plantilla y comparte el link. Asistido $99. VIP $199.",
  metadataBase: new URL("https://clickandlove.app"),
  alternates: {
    canonical: "https://clickandlove.app/es/invitaciones-de-quinceanera",
    languages: {
      en: "https://clickandlove.app/quince-invitations",
      es: "https://clickandlove.app/es/invitaciones-de-quinceanera",
      "x-default": "https://clickandlove.app/quince-invitations",
    },
  },
  openGraph: {
    title: "Invitaciones de Quinceañera en Los Ángeles | Click & Love",
    description:
      "Invitaciones de quinceañera en Los Ángeles con sobre 3D, música y RSVP por SMS. Ve las demos en vivo, elige tu plantilla y comparte el link. Asistido $99. VIP $199.",
    url: "https://clickandlove.app/es/invitaciones-de-quinceanera",
    siteName: "Click & Love",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "https://clickandlove.app/assets/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Click & Love Invitaciones Digitales - Los Ángeles",
        type: "image/png",
      },
    ],
  },
};

export default function Page() {
  return (
    <LandingPage
      lang="es"
      canonical="https://clickandlove.app/es/invitaciones-de-quinceanera"
      homeUrl="https://clickandlove.app/es"
      pageSlug="es-invitaciones-de-quinceanera"
      h1="Invitaciones de Quinceañera en Los Ángeles | Click and Love"
      intro="Click and Love crea invitaciones de quinceañera para familias en Los Ángeles. Tu invitación vive en un link que compartes por mensaje. Tus invitados la abren en su teléfono, disfrutan el sobre 3D y la música, y confirman por SMS sin instalar una app. Tú ves cada confirmación en el panel del anfitrión."
      sections={[
        {
          heading: "Por qué elegir invitaciones de quinceañera de Click and Love",
          paragraphs: [
            "Una invitación de quinceañera debe sentirse como la fiesta: elegante, personal y fácil de compartir. Nuestras invitaciones digitales abren con un sobre 3D interactivo, suenan con tu música y llevan cada dato que tus invitados necesitan, de la misa a la recepción.",
          ],
          bullets: [
            "Sin publicidad de terceros dentro de tu invitación, nunca.",
            "Sobre 3D interactivo con animación, no un PDF estático.",
            "Confirmación por SMS, para que tus invitados respondan desde su teléfono.",
            "Panel del anfitrión sin cobros por invitado adicional.",
            "Secciones para foto de portada, fecha, lugar con mapa, cuenta regresiva y confirmación.",
          ],
        },
        {
          heading: "Cuándo conviene una invitación digital de XV",
          paragraphs: [],
          bullets: [
            "Ya apartaste la fecha y el salón, y necesitas avisar a tus invitados con algo que se vea bien y que puedas compartir hoy mismo.",
            "Tu lista de invitados está lista y necesitas saber quién va y cuántas personas confirma cada invitado.",
            "Quieres dejar el papel: imprimir, repartir y perseguir respuestas en papel cuesta tiempo y dinero, y un link llega a todos en minutos.",
            "Tus invitados viven lejos: familia en otras ciudades o en otros estados abre el mismo link que tus invitados locales.",
            "Necesitas control de pases: cada invitado confirma a sus acompañantes, y tú planeas mesas y comida con números reales.",
          ],
        },
        {
          heading: "Cómo funciona",
          paragraphs: [
            "De la plantilla al link compartido, el proceso sigue seis pasos simples.",
          ],
          bullets: [
            "Eliges una plantilla del catálogo y ves su demo en vivo.",
            "Personalizas los datos de tu quinceañera: nombres, fecha, lugar, fotos y secciones.",
            "Revisas tu invitación antes de compartirla.",
            "Compartes el link por mensaje con tus invitados.",
            "Tus invitados confirman por SMS con su nombre y su teléfono.",
            "Cada confirmación llega al panel del anfitrión, donde ves quién va y cuántos pases confirmó.",
          ],
        },
        {
          heading: "Qué trae tu invitación",
          paragraphs: [
            "Cada plantilla trae secciones para foto de portada, fecha, lugar, cuenta regresiva y confirmación de asistencia. El diseño se adapta al teléfono de tus invitados, que es donde la van a abrir. El panel del anfitrión se abre con un link por evento, sin cuentas ni contraseñas que tus invitados deban recordar.",
          ],
        },
      ]}
      faqs={[
        {
          q: "¿Cuánto cuesta una invitación de XV en Los Ángeles?",
          a: "El paquete Asistido cuesta $99 y el paquete VIP cuesta $199. El botón Comprar cobra el precio del home. Si prefieres pagar con Zelle, manda un texto al (818) 299-4882 y te atienden por ese canal sin cambiar el precio base.",
        },
        {
          q: "¿Mis invitados necesitan una app para confirmar?",
          a: "No. Tus invitados abren el link de tu invitación y confirman por SMS con su nombre y su teléfono. No instalan nada y no crean cuentas. El proceso funciona en cualquier teléfono con mensajes de texto, y cada respuesta aparece en tu panel.",
        },
        {
          q: "¿Cómo sé quién confirmó asistencia?",
          a: "Cada confirmación llega al panel del anfitrión de tu evento. Ahí ves el nombre de cada invitado y cuántas personas confirmó. El panel se abre con un link, sin login, para que lo revises cuando quieras desde tu teléfono.",
        },
        {
          q: "¿Puedo ver la invitación antes de comprar?",
          a: "Sí. El catálogo trae demos en vivo de cada plantilla. Abre la demo, navega sus secciones y revisa cómo se ve en tu teléfono. Cuando una plantilla te guste, llama al (818) 299-4882 o compra el paquete desde precios.",
        },
      ]}
      faqTitle="Preguntas frecuentes sobre invitaciones de quinceañera en Los Ángeles"
      serviceName="Invitaciones de quinceañera en Los Ángeles"
      serviceDescription="Invitaciones digitales de quinceañera en Los Ángeles con sobre 3D, música y RSVP por SMS, más panel del anfitrión para confirmaciones."
      packagesTitle="Paquetes y precios"
      assistedName="Asistido"
      assistedText="Invitación digital con RSVP por SMS y panel del anfitrión."
      vipName="VIP"
      vipText="Servicio VIP Los Ángeles con atención completa del equipo, RSVP por SMS y panel del anfitrión."
      zelleNote="El botón Comprar cobra el precio del home. Si prefieres pagar con Zelle, manda un texto al (818) 299-4882 y te atienden por ese canal."
      demosTitle="Ve las plantillas en vivo"
      demosText="Abre el catálogo y navega cada demo en vivo desde tu teléfono antes de comprar. Elegant Rose y Beauty Quince son dos de las plantillas de quinceañera más pedidas."
      demoCatalogUrl="/es/demo"
      demoCatalogLabel="Ver el catálogo"
      finalTitle="Llama y aparta tu fecha"
      finalText="¿Necesitas invitaciones de quinceañera en Los Ángeles? Llama al (818) 299-4882 para confirmar disponibilidad y resolver tus dudas. Atendemos toda el área de Los Ángeles, incluyendo Glendale, Burbank, Pasadena y el Valle de San Fernando."
      callLabel="Llamar al (818) 299-4882"
      smsLabel="Escríbenos por SMS"
      smsBody="Hola, quiero invitaciones de quinceañera en Los Ángeles para mi evento"
      pricingLabel="Ver paquetes"
      pricingUrl="/es#precios"
      breadcrumbHome="Inicio"
      breadcrumbCurrent="Invitaciones de Quinceañera"
    />
  );
}
