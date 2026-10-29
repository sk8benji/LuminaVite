export type Language = "es" | "en";

export interface HomeTranslations {
  nav: {
    dashboard: string;
    catalog: string;
    features: string;
    howItWorks: string;
    compare: string;
    pricing: string;
    createBtn: string;
  };
  hero: {
    pill: string;
    title1: string;
    title2: string;
    subtitle: string;
    ctaCatalog: string;
    ctaDemo: string;
    ctaCreate: string;
    multiChannelTitle: string;
    channels: string[];
    phoneBadge1: string;
    phoneBadge2: string;
    phoneBadge3: string;
    openEnvelopePrompt: string;
    envelopeOpenedMsg: string;
    fullscreenDemo: string;
    trustBar: string[];
    metrics: { value: string; label: string }[];
  };
  agitation: {
    pill: string;
    title: string;
    subtitle: string;
    cards: {
      title: string;
      text: string;
    }[];
  };
  interactiveDemoBanner: {
    pill: string;
    title: string;
    description: string;
    ctaBtn: string;
    feature1: string;
    feature2: string;
    feature3: string;
  };
  collections: {
    pill: string;
    title: string;
    subtitle: string;
    viewDemo: string;
    items: {
      id: string;
      title: string;
      subtitle: string;
      tag: string;
      description: string;
      slug: string;
      image: string;
      features: string[];
    }[];
  };
  techAutomation: {
    pill: string;
    title: string;
    subtitle: string;
    pillars: {
      title: string;
      description: string;
      highlight: string;
      badge: string;
    }[];
  };
  calculator: {
    pill: string;
    title: string;
    subtitle: string;
    guestsLabel: string;
    stat1Label: string;
    stat1Desc: string;
    stat2Label: string;
    stat2Desc: string;
    stat3Label: string;
    stat3Desc: string;
    stat4Label: string;
    stat4Desc: string;
    venuesNote: string;
    venuesLink: string;
  };
  comparison: {
    pill: string;
    title: string;
    subtitle: string;
    cards: {
      tag: string;
      title: string;
      canvaProblemLabel: string;
      canvaProblem: string;
      solutionLabel: string;
      solution: string;
    }[];
    ctaBox: {
      title: string;
      desc: string;
      btn: string;
    };
  };
  testimonials: {
    pill: string;
    title: string;
    subtitle: string;
    items: {
      name: string;
      role: string;
      event: string;
      quote: string;
      avatar: string;
      metric: string;
      demoSlug: string;
      demoBtnText: string;
    }[];
  };
  pricing: {
    pill: string;
    title: string;
    subtitle: string;
    singlePayment: string;
    recommended: string;
    choosePlan: string;
    plans: {
      planKey: "assisted" | "vip";
      badge: string;
      typeTag: string;
      name: string;
      description: string;
      price: string;
      currency: string;
      features: { text: string; included: boolean; isBold?: boolean }[];
      cta: string;
      highlighted?: boolean;
      whatsappMessage?: string;
      secondaryActionText: string;
      secondaryActionMessage: string;
    }[];
    trustBadgesText: string;
    venueFaqText: string;
    venueFaqLink: string;
  };
  modal: {
    title: string;
    subtitle: string;
    openFull: string;
    close: string;
    changeDemo: string;
  };
  brand: {
    topbar: string;
    navLiveDemo: string;
    navTemplates: string;
    navReviews: string;
    createBtn: string;
    heroEyebrow: string;
    heroSubtitle: string;
    heroCtaDemo: string;
    heroCtaPricing: string;
    heroNote: string;
    shareLabel: string;
    shareChannels: string[];
    strip: string[];
    compScript: string;
    rosterTitle: string;
    rosterLive: string;
    rosterConfirmed: string;
    rosterDeclined: string;
    rosterPending: string;
    rosterGuest1Sub: string;
    rosterGuest1Chip: string;
    rosterGuest2Sub: string;
    rosterGuest2Chip: string;
    smsTitle: string;
    smsFrom: string;
    smsWhen: string;
    smsBody: string;
    reviewsScript: string;
    verifiedLabel: string;
    catalogLink: string;
    howScript: string;
    howTitle: string;
    steps: { title: string; line1: string; line2: string }[];
    tplScript: string;
    tplTitle: string;
    tplViewDemo: string;
    tplCards: { name: string; desc: string; tag: string; bullets: string[]; image: string; slug: string; imgPos?: string }[];
    pricingTitle: string;
    pricingSubtitle: string;
    pricingFavorite: string;
    pricingPerNote: string;
    pricingCta: string;
    pricingSecondaryText: string;
    planFeatures: { assisted: string[]; vip: string[] };
    contactTitle: string;
    contactText: string;
    contactCall: string;
    contactSms: string;
    footerLine: string;
  };
  announcementBar: string;
  footer: {
    brandSubtitle: string;
    rights: string;
    adminLink: string;
    privacy: string;
    terms: string;
    whatsappSupport: string;
    localOrigin: string;
  };
}

export const translations: Record<Language, HomeTranslations> = {
  es: {
    brand: {
      topbar: "Los Angeles · Invitaciones digitales con RSVP por SMS · (818) 299-4882",
      navLiveDemo: "Demo en vivo",
      navTemplates: "Plantillas",
      navReviews: "Opiniones",
      createBtn: "Crear mi invitación",
      heroEyebrow: "Invitaciones web que tus invitados sí abren",
      heroSubtitle:
        "Invitaciones digitales hechas por nuestro equipo en Los Ángeles. Tus invitados confirman por texto (SMS) y tú ves cada respuesta en vivo desde tu teléfono. Sin apps, sin contraseñas.",
      heroCtaDemo: "Ver la demo en vivo",
      heroCtaPricing: "Ver precios",
      heroNote: "Quinceañeras · Bodas · Cumpleaños — en inglés y español",
      shareLabel: "Envía tu invitación por:",
      shareChannels: ["Mensaje de Texto (SMS)", "Código QR", "Instagram / Messenger", "WhatsApp"],
      strip: ["RSVP por SMS", "Panel en vivo", "Mapas con un toque", "Música", "Cuenta regresiva"],
      compScript: "La diferencia",
      rosterTitle: "Panel en tu celular",
      rosterLive: "En vivo",
      rosterConfirmed: "Confirmados",
      rosterDeclined: "Cancelados",
      rosterPending: "Pendientes",
      rosterGuest1Sub: "4 pases asignados · Mesa 7",
      rosterGuest1Chip: "✓ Asistirán (4)",
      rosterGuest2Sub: "2 pases asignados",
      rosterGuest2Chip: "✕ No asisten",
      smsTitle: "SMS recibido por invitado",
      smsFrom: "Click & Love · Sofia & Mateo",
      smsWhen: "SMS · Ahora",
      smsBody: "¡Hola Familia Ramos! Confirmaron 3 pases para la Boda. Mesa #7 asignada. Tu pase y ruta GPS:",
      reviewsScript: "Familias reales",
      verifiedLabel: "Verificado",
      catalogLink: "Ver el catálogo completo",
      howScript: "Así de fácil",
      howTitle: "Tú disfrutas tu evento. Nosotros hacemos la invitación.",
      steps: [
        { title: "Nos mandas tus fotos", line1: "y los datos de tu evento por texto.", line2: "Sin computadoras ni formularios" },
        { title: "Creamos tu invitación", line1: "en 24–48 horas, lista para compartir.", line2: "Diseño profesional, tu estilo" },
        { title: "Compartes el link", line1: "y ves cada RSVP en vivo en tu panel.", line2: "Confirmaciones por SMS reales" },
      ],
      tplScript: "Plantillas reales",
      tplTitle: "Cada una con su demo en vivo para probarla",
      tplViewDemo: "Ver demo",
      tplCards: [
        {
          name: "Vintage Quinceanera",
          desc: "Gala romántica en rosa empolvado con galería estilo tira de fotos y el cronograma completo de la fiesta.",
          tag: "Alta Costura XV",
          bullets: ["Galería interactiva tira de fotos", "Cronograma por fases", "Dress code con paleta"],
          image: "/assets/home-real/elegant-rose-real.jpg",
          slug: "isabella-xv",
          imgPos: "50% 35%",
        },
        {
          name: "Celestial Butterfly",
          desc: "Acuarela celeste, destellos de oro y mariposas etéreas que se mueven al tocar la pantalla.",
          tag: "XV Años & Gala",
          bullets: ["Sobre 3D con sello lacrado", "Pista de música de fondo", "RSVP por SMS y WhatsApp"],
          image: "/assets/home-real/blue-butterfly-real.jpg",
          slug: "mariposas-xv",
          imgPos: "50% 20%",
        },
        {
          name: "Blush Princess",
          desc: "Romance suave en rosa empolvado con retratos elegantes y un aire editorial de ensueño.",
          tag: "XV Rosa Romántico",
          bullets: ["Diseño romántico rosa empolvado", "Galería elegante de fotos", "RSVP por SMS y WhatsApp"],
          image: "/assets/template-blush/foto-1.webp",
          slug: "blush-princess-xv",
          imgPos: "50% 20%",
        },
        {
          name: "Quince Pink",
          desc: "Rosa moderno y audaz con sobre 3D real y una atmósfera de gala glamorosa.",
          tag: "Gala Rosa Moderna",
          bullets: ["Sobre 3D con sello lacrado", "Diseño moderno de gala rosa", "RSVP por SMS y WhatsApp"],
          image: "/assets/template-era-pink/foto-sentada.webp",
          slug: "era-pink-xv",
          imgPos: "50% 20%",
        },
        {
          name: "Mis 15 Cream & Gold",
          desc: "Elegancia cálida en crema y dorado con un aire atemporal y refinado.",
          tag: "XV Crema & Dorado",
          bullets: ["Paleta crema y dorado", "Galería elegante de fotos", "RSVP por SMS y WhatsApp"],
          image: "/assets/template-miss15/foto-columpio.webp",
          slug: "miss-15-xv",
          imgPos: "50% 20%",
        },
        {
          name: "Garden Baby Blue",
          desc: "Encanto de jardín en azul suave con retratos frescos al aire libre y un aire ligero.",
          tag: "XV Jardín Azul",
          bullets: ["Tema de jardín azul suave", "Galería elegante de fotos", "RSVP por SMS y WhatsApp"],
          image: "/assets/template-baby-blue/foto-gazebo.webp",
          slug: "baby-blue-xv",
          imgPos: "50% 20%",
        },
      ],
      pricingTitle: "Precios claros, sin sorpresas",
      pricingSubtitle: "Un solo pago. Nosotros hacemos todo.",
      pricingFavorite: "El favorito",
      pricingPerNote: "USD · pago único",
      pricingCta: "Empezar ahora",
      pricingSecondaryText: "¿Prefieres pagar con Zelle? Mándanos un texto",
      planFeatures: {
        assisted: [
          "Montaje completo por nuestro equipo",
          "200 confirmaciones SMS incluidas",
          "Botón de mapas (Waze y Google Maps)",
          "Panel en vivo de invitados",
          "1 ronda de cambios",
        ],
        vip: [
          "Todo lo del plan Asistido",
          "350 confirmaciones SMS incluidas",
          "Retoque de fotos para portada",
          "Tarjetas QR listas para tus mesas",
          "Cambios ilimitados hasta el evento",
        ],
      },
      contactTitle: "¿Lista para la tuya?",
      contactText: "Llámanos o mándanos un texto — te respondemos hoy mismo.",
      contactCall: "Llamar",
      contactSms: "Texto SMS",
      footerLine: "Click and Love · Hecho en Los Ángeles, California · clickandlove.app",
    },
    announcementBar:
      "Atención y soporte local en Los Ángeles, CA · Diseñado para salones y eventos en el Sur de California",
    nav: {
      dashboard: "Panel Familiar",
      catalog: "Colecciones",
      features: "Funciones",
      howItWorks: "Cómo funciona",
      compare: "Comparativa",
      pricing: "Precios",
      createBtn: "Crear Invitación",
    },
    hero: {
      pill: "Invitaciones Digitales Interactivas",
      title1: "Deja de perseguir a tus invitados",
      title2: "para saber si van a asistir",
      subtitle:
        "Invitaciones interactivas armadas por nuestro equipo en Los Ángeles con confirmación por SMS, control de mesas y panel en vivo para tu celular.",
      ctaCatalog: "Ver Catálogo de Plantillas",
      ctaDemo: "Ver Ejemplo en Vivo",
      ctaCreate: "Ver Precios",
      multiChannelTitle: "Envía tus invitaciones por:",
      channels: [
        "WhatsApp",
        "Mensaje de Texto (SMS)",
        "Instagram / Messenger",
        "Código QR",
      ],
      phoneBadge1: "Más de 1,200 familias confirmadas este mes en Los Ángeles y San Fernando Valley",
      phoneBadge2: "RSVP en vivo • 98% aforo",
      phoneBadge3: "Cero contraseñas • 1 Clic",
      openEnvelopePrompt: "Toca para abrir el sobre",
      envelopeOpenedMsg: "¡Sobre abierto! Disfruta la música",
      fullscreenDemo: "Probar a pantalla completa",
      trustBar: [
        "RSVP instantáneo",
        "Confirmación por SMS",
        "Cero descargas",
        "Compatible con todos los teléfonos",
      ],
      metrics: [
        { value: "98%", label: "Confirmación en las primeras 48 horas" },
        { value: "0", label: "Llamadas para perseguir invitados" },
        { value: "$850+", label: "Ahorro promedio vs. imprentas físicas en LA" },
        { value: "+1,200", label: "Familias en el Sur de California" },
      ],
    },
    agitation: {
      pill: "El Costo Oculto",
      title: "El alto costo del método tradicional",
      subtitle:
        "Organizar tu evento con invitaciones en papel genera estrés, descontrol y pérdidas de dinero antes del gran día.",
      cards: [
        {
          title: "Dinero perdido en el banquete",
          text: "Pagas platos y bebidas por invitados que confirman de palabra pero no asisten o cancelan a última hora.",
        },
        {
          title: "Semanas perdiendo tiempo",
          text: "Llamadas telefónicas y cadenas interminables de mensajes para saber quién asiste con cuántos acompañantes.",
        },
        {
          title: "Cambios de última hora imposibles",
          text: "Si cambia la hora de la misa, el salón o la mesa, las invitaciones de papel ya no sirven y causan confusión.",
        },
      ],
    },
    interactiveDemoBanner: {
      pill: "Experiencia en Vivo",
      title: "Prueba la experiencia de un invitado en 1 clic",
      description:
        "Prueba el flujo completo sin intermediarios. Abre una invitación interactiva real con sobre virtual 3D, música envolvente y confirmación inteligente ahora mismo.",
      ctaBtn: "Probar Invitación en Vivo",
      feature1: "Sobre virtual 3D con sello de cera",
      feature2: "Música ambiental sincronizada",
      feature3: "Formulario RSVP inteligente con pases",
    },
    collections: {
      pill: "Colecciones de Autor",
      title: "Colecciones Exclusivas de Alta Costura",
      subtitle:
        "Cada diseño es una experiencia interactiva optimizada milimétricamente para pantallas móviles en proporción 9:16.",
      viewDemo: "Ver invitación de muestra",
      items: [
        {
          id: "butterfly",
          title: "Jardín de Mariposas Celestes",
          subtitle: "Acuarela celeste, destellos de oro y mariposas etéreas",
          tag: "XV Años & Gala",
          description:
            "Efecto de mariposas 3D, sobre virtual con sello lacrado y tonos celestes con detalles dorados.",
          slug: "mariposas-xv",
          image: "/assets/template-butterfly/foto-columpio-portada.webp",
          features: ["Efecto de mariposas 3D", "Sobre virtual con sello lacrado", "RSVP por WhatsApp y SMS"],
        },
        {
          id: "rose",
          title: "Romance Vintage en Película",
          subtitle: "Gala romántica y efectos de celuloide cinematográfico",
          tag: "Alta Costura XV",
          description:
            "Galería interactiva estilo tira de fotos, tonos rosa empolvado y cronograma detallado del evento.",
          slug: "isabella-xv",
          image: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.webp",
          features: ["Galería interactiva tira de fotos", "Cronograma por fases", "Dress code con paleta"],
        },
        {
          id: "ivory",
          title: "Castillo de Cuento de Hadas",
          subtitle: "Bodas de gala, minimalismo romano y tipografía editorial",
          tag: "Bodas Exclusivas",
          description:
            "Monogramas personalizados para los novios, tonos marfil perla y diseño para bodas de etiqueta.",
          slug: "emma-and-lucas",
          image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          features: ["Monogramas personalizados", "Mesa de regalos Zelle/Amazon", "Google Maps en 1 clic"],
        },
      ],
    },
    techAutomation: {
      pill: "Solución completa",
      title: "Todo el control de tu evento en un solo enlace inteligente",
      subtitle: "Confirmaciones automáticas y organización sin esfuerzo",
      pillars: [
        {
          title: "RSVP y Pases Asignados",
          description:
            "Cada invitado recibe un enlace con el número exacto de asientos permitidos.",
          highlight: "Control exacto por familia sin invitados sorpresa ni colados.",
          badge: "Pases Asignados",
        },
        {
          title: "Ruta directa en Maps y Waze",
          description:
            "El invitado toca un botón y abre la navegación paso a paso hacia la iglesia o el salón.",
          highlight: "Navegación GPS paso a paso directa sin perderse en el camino.",
          badge: "Maps & Waze",
        },
        {
          title: "Organización de Mesas en Vivo",
          description:
            "Sabes en tiempo real qué mesas están llenas y cuáles quedan libres.",
          highlight: "Conteo en vivo y lista descargable en Excel para el banquete.",
          badge: "Mesas en Vivo",
        },
      ],
    },
    calculator: {
      pill: "Calculadora de Aforo & Ahorro",
      title: "Ahorra tiempo y evita pagar platos de invitados que no asisten",
      subtitle:
        "Ahorra frente al costo promedio de imprenta en Los Ángeles ($600 - $1,200 en invitaciones físicas de papel + timbres postales) y evita pagar banquetes por invitados que no asisten.",
      guestsLabel: "Número estimado de invitados:",
      stat1Label: "horas ahorradas",
      stat1Desc: "en llamadas manuales",
      stat2Label: "USD ahorrados",
      stat2Desc: "en platos no desperdiciados",
      stat3Label: "control de pases",
      stat3Desc: "sin invitados sorpresa",
      stat4Label: "impresiones desechadas",
      stat4Desc: "cero gasto en reimpresión",
      venuesNote: "¿Administras un salón de banquetes o eres Wedding Planner en el Sur de California?",
      venuesLink: "Conoce nuestro programa especial de licencias y alianzas para salones",
    },
    comparison: {
      pill: "No es una plantilla de Canva",
      title: "No es una plantilla de Canva. Es un servicio completo con panel real.",
      subtitle:
        "Mucho más que una simple imagen: así funciona tu evento sin estrés ni descontrol.",
      cards: [
        {
          tag: "Cero Trabajo Para Ti",
          title: "Nosotros la armamos completa",
          canvaProblemLabel: "En Canva o imagen estática:",
          canvaProblem:
            "En Canva te entregan una plantilla vacía y tú tienes que aprender a editar textos, acomodar fotos y pelear con el diseño.",
          solutionLabel: "Lo que tú resuelves con Click & Love:",
          solution:
            "Tú no tocas ninguna computadora. Nos mandas las fotos y los datos del evento por WhatsApp y nuestro equipo en Los Ángeles te entrega la invitación lista para enviar.",
        },
        {
          tag: "Control de Aforo Blindado",
          title: "Panel privado con confirmados en vivo",
          canvaProblemLabel: "En Canva o imagen estática:",
          canvaProblem:
            "Una imagen de Canva no te dice quién va a ir; terminas anotando respuestas en servilletas o chats sueltos y persiguiendo invitados.",
          solutionLabel: "Lo que tú resuelves con Click & Love:",
          solution:
            "Cada invitado busca su nombre y confirma sus pases exactos. Tú entras a tu propio panel desde el celular y ves al instante cuántos adultos y niños confirmaron y quiénes cancelaron.",
        },
        {
          tag: "Llegada Directa al Salón",
          title: "Mensajes SMS directos al celular",
          canvaProblemLabel: "En Canva o imagen estática:",
          canvaProblem:
            "Los enlaces y fotos sueltas se pierden en los chats familiares y los invitados terminan llamando perdidos en el tráfico de LA.",
          solutionLabel: "Lo que tú resuelves con Click & Love:",
          solution:
            "Tus invitados reciben confirmación y recordatorio automático por mensaje de texto SMS con el mapa para llegar con un solo toque en Waze o Google Maps.",
        },
      ],
      ctaBox: {
        title: "¿Quieres tu invitación lista sin tocar una computadora?",
        desc: "Envíanos tus fotos y textos por WhatsApp. Nuestro equipo en Los Ángeles te entrega tu invitación interactiva y panel en tiempo récord.",
        btn: "✦ Ver Diseños y Precios ($99 / $199) ✦",
      },
    },
    testimonials: {
      pill: "Experiencias Reales",
      title: "Lo que Dicen Quienes Ya Celebraron con Click & Love",
      subtitle:
        "Parejas y familias de Los Ángeles y el Sur de California que ahorraron tiempo, protegieron su presupuesto y sorprendieron a sus invitados.",
      items: [
        {
          name: "Sofía & Alejandro",
          role: "Novios",
          event: "Boda en Renaissance Banquet Hall • Glendale, CA",
          quote:
            "“Ningún invitado se quedó sin confirmar. Nos ahorramos semanas llamando a familiares y evitamos pagar 22 platillos de personas que nos avisaron a tiempo que no iban a asistir.”",
          avatar: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
          metric: "99% confirmación a tiempo",
          demoSlug: "emma-and-lucas",
          demoBtnText: "Probar Invitación de Boda",
        },
        {
          name: "Familia Cordero",
          role: "Papás de Isabella",
          event: "XV Años de Isabella • Hello Banquet Hall • Van Nuys, CA",
          quote:
            "“Todos los invitados quedaron maravillados al abrir el sobre con la música. El control de pases por familia evitó que vinieran personas de más y todo estuvo súper ordenado en el salón.”",
          avatar: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.webp",
          metric: "Cero pases duplicados",
          demoSlug: "isabella-xv",
          demoBtnText: "Probar Invitación de XV Años",
        },
        {
          name: "Camila & Mateo",
          role: "Novios",
          event: "Recepción en The Castaway • Burbank, CA",
          quote:
            "“Mandar la invitación por WhatsApp y ver las confirmaciones en vivo en nuestro celular fue la mejor inversión de la boda. Los invitados llegaron directo con el GPS a The Castaway sin perderse.”",
          avatar: "/assets/template-butterfly/foto-columpio-portada.webp",
          metric: "100% mesas organizadas",
          demoSlug: "mariposas-xv",
          demoBtnText: "Probar Invitación de Gala",
        },
      ],
    },
    pricing: {
      pill: "Servicio Asistido & VIP",
      title: "Tú disfruta de tu evento, nosotros preparamos tu invitación.",
      subtitle:
        "Sin usar computadora ni programas complicados. Solo envíanos las fotos y datos por WhatsApp y nuestro equipo en Los Ángeles deja todo listo.",
      singlePayment: "USD / Pago Único",
      recommended: "Recomendado",
      choosePlan: "Elegir",
      plans: [
        {
          planKey: "assisted",
          badge: "El Estándar",
          typeTag: "Listo para Compartir",
          name: "Digital Asistido",
          description: "Tú nos mandas la información por WhatsApp y nosotros la dejamos lista.",
          price: "$99",
          currency: "USD / Pago Único",
          cta: "Pagar y Comenzar ($99)",
          whatsappMessage: "Hola, quiero ordenar el paquete Digital Asistido ($99) para mi evento en Los Ángeles.",
          secondaryActionText: "¿Prefieres pagar con Zelle o por WhatsApp? Toca aquí",
          secondaryActionMessage: "Hola, quiero pagar el paquete Asistido de $99 por Zelle o necesito ayuda.",
          features: [
            { text: "Sin usar computadora: envíanos los detalles por WhatsApp y nosotros armamos todo", included: true, isBold: true },
            { text: "Configuración completa por nuestro equipo", included: true, isBold: true },
            { text: "200 SMS interactivos incluidos", included: true },
            { text: "Ubicación GPS con botón directo a Waze / Google Maps", included: true },
            { text: "Sobre virtual interactivo con música de fondo", included: true },
            { text: "Enlace familiar con panel en tiempo real", included: true },
            { text: "Guardado en calendario del teléfono", included: true },
            { text: "1 ronda de cambios incluida", included: true },
          ],
        },
        {
          planKey: "vip",
          badge: "Recomendado",
          typeTag: "El más elegido para Quinceañeras y Bodas",
          name: "Servicio VIP Los Ángeles",
          description: "Cero complicaciones. Nos encargamos de todo de inicio a fin.",
          price: "$199",
          currency: "USD / Pago Único",
          highlighted: true,
          cta: "✦ Ordenar Servicio VIP ($199) ✦",
          whatsappMessage: "Hola, me interesa el paquete VIP de $199 para mi evento en Los Ángeles. ¿Me pueden dar detalles?",
          secondaryActionText: "¿Preguntas o pago con Zelle? Escríbenos por WhatsApp",
          secondaryActionMessage: "Hola, me interesa el paquete VIP de $199 para mi evento en Los Ángeles. ¿Me pueden dar detalles?",
          features: [
            { text: "Sin usar computadora: envíanos los detalles por WhatsApp y nosotros armamos todo", included: true, isBold: true },
            { text: "Todo lo del Digital Asistido", included: true, isBold: true },
            { text: "Retoque fotográfico para portada y galería", included: true, isBold: true },
            { text: "350 SMS de confirmación incluidos", included: true, isBold: true },
            { text: "Diseño de código QR listo para imprimir en mesas", included: true, isBold: true },
            { text: "Soporte prioritario con cambios ilimitados hasta el evento", included: true, isBold: true },
          ],
        },
      ],
      trustBadgesText: "Pago 100% seguro con tarjeta de crédito/débito, Apple Pay, Google Pay o Zelle",
      venueFaqText: "¿Tienes un salón de eventos o eres wedding planner?",
      venueFaqLink: "Conoce nuestros paquetes por volumen para salones",
    },
    modal: {
      title: "Invitación Interactiva en Vivo",
      subtitle: "Prueba el sobre animado, música envolvente y confirmación digital.",
      openFull: "Abrir en Pantalla Completa",
      close: "Cerrar",
      changeDemo: "Cambiar Plantilla",
    },
    footer: {
      brandSubtitle: "Papelería Digital de Alta Costura para Eventos Inolvidables",
      rights: "Todos los derechos reservados.",
      adminLink: "Acceso al Panel Administrativo",
      privacy: "Privacidad",
      terms: "Términos del Servicio",
      whatsappSupport: "Asesoría Concierge por WhatsApp",
      localOrigin: "Hecho en Los Ángeles, California · Teléfono/WhatsApp: +1 (818) 299-4882",
    },
  },
  en: {
    brand: {
      topbar: "Los Angeles · Digital invitations with SMS RSVP · (818) 299-4882",
      navLiveDemo: "Live demo",
      navTemplates: "Templates",
      navReviews: "Reviews",
      createBtn: "Create my invitation",
      heroEyebrow: "Website invitations your guests actually open",
      heroSubtitle:
        "Digital invitations made by our Los Angeles team. Your guests confirm by text (SMS) and you watch every reply live from your phone. No apps, no passwords.",
      heroCtaDemo: "Watch the live demo",
      heroCtaPricing: "See pricing",
      heroNote: "Quinceañeras · Weddings · Birthdays — in English & Spanish",
      shareLabel: "Share your invitation via:",
      shareChannels: ["Text Message (SMS)", "QR Code", "Instagram / Messenger", "WhatsApp"],
      strip: ["SMS RSVP", "Live dashboard", "One-tap maps", "Music", "Countdown"],
      compScript: "The difference",
      rosterTitle: "Host Mobile Roster",
      rosterLive: "Live Sync",
      rosterConfirmed: "Confirmed",
      rosterDeclined: "Declined",
      rosterPending: "Pending",
      rosterGuest1Sub: "4 assigned passes · Table 7",
      rosterGuest1Chip: "✓ Attending (4)",
      rosterGuest2Sub: "2 assigned passes",
      rosterGuest2Chip: "✕ Not attending",
      smsTitle: "Guest SMS Notification",
      smsFrom: "Click & Love · Sofia & Mateo",
      smsWhen: "SMS · Now",
      smsBody: "Hi Ramos Family! 3 passes confirmed for the Wedding. Table #7 reserved. Your pass & GPS route:",
      reviewsScript: "Real families",
      verifiedLabel: "Verified",
      catalogLink: "Browse the full catalog",
      howScript: "So easy",
      howTitle: "You enjoy your event. We make the invitation.",
      steps: [
        { title: "You send us your photos", line1: "and your event details by text.", line2: "No computers, no forms" },
        { title: "We create your invitation", line1: "in 24–48 hours, ready to share.", line2: "Professional design, your style" },
        { title: "You share the link", line1: "and watch every RSVP live in your dashboard.", line2: "Real SMS confirmations" },
      ],
      tplScript: "Real templates",
      tplTitle: "Each one with a live demo to try",
      tplViewDemo: "View demo",
      tplCards: [
        {
          name: "Vintage Quinceanera",
          desc: "Romantic blush-pink gala with a filmstrip photo gallery and the full party timeline built in.",
          tag: "Haute Couture XV",
          bullets: ["Interactive filmstrip timeline", "Phased itinerary", "Dress code palette"],
          image: "/assets/home-real/elegant-rose-real.jpg",
          slug: "isabella-xv",
          imgPos: "50% 35%",
        },
        {
          name: "Celestial Butterfly",
          desc: "Sky watercolor, gold foil accents, and ethereal butterflies that animate on touch.",
          tag: "Quinceañera & Gala",
          bullets: ["3D envelope with wax seal", "Background audio track", "WhatsApp & SMS RSVP"],
          image: "/assets/home-real/blue-butterfly-real.jpg",
          slug: "mariposas-xv",
          imgPos: "50% 20%",
        },
        {
          name: "Blush Princess",
          desc: "Soft blush romance with elegant portraits and a dreamy, editorial feel for her day.",
          tag: "Romantic Blush XV",
          bullets: ["Romantic blush-pink design", "Elegant photo gallery", "WhatsApp & SMS RSVP"],
          image: "/assets/template-blush/foto-1.webp",
          slug: "blush-princess-xv",
          imgPos: "50% 20%",
        },
        {
          name: "Quince Pink",
          desc: "Bold modern pink with a real 3D envelope and a glamorous gala atmosphere.",
          tag: "Modern Pink Gala",
          bullets: ["3D envelope with wax seal", "Modern pink gala design", "WhatsApp & SMS RSVP"],
          image: "/assets/template-era-pink/foto-sentada.webp",
          slug: "era-pink-xv",
          imgPos: "50% 20%",
        },
        {
          name: "Mis 15 Cream & Gold",
          desc: "Warm cream and gold elegance with a timeless, refined celebration feel.",
          tag: "Cream & Gold XV",
          bullets: ["Cream & gold palette", "Elegant photo gallery", "WhatsApp & SMS RSVP"],
          image: "/assets/template-miss15/foto-columpio.webp",
          slug: "miss-15-xv",
          imgPos: "50% 20%",
        },
        {
          name: "Garden Baby Blue",
          desc: "Soft blue garden charm with fresh outdoor portraits and a light, airy feel.",
          tag: "Garden & Blue XV",
          bullets: ["Soft blue garden theme", "Elegant photo gallery", "WhatsApp & SMS RSVP"],
          image: "/assets/template-baby-blue/foto-gazebo.webp",
          slug: "baby-blue-xv",
          imgPos: "50% 20%",
        },
      ],
      pricingTitle: "Clear pricing, no surprises",
      pricingSubtitle: "One single payment. We do everything.",
      pricingFavorite: "Most popular",
      pricingPerNote: "USD · one-time payment",
      pricingCta: "Get started",
      pricingSecondaryText: "Prefer to pay with Zelle? Text us",
      planFeatures: {
        assisted: [
          "Full setup by our team",
          "200 SMS confirmations included",
          "Maps button (Waze & Google Maps)",
          "Live guest dashboard",
          "1 round of changes included",
        ],
        vip: [
          "Everything in the Assisted plan",
          "350 SMS confirmations included",
          "Photo retouching for your cover",
          "Print-ready QR cards for your tables",
          "Unlimited changes until your event",
        ],
      },
      contactTitle: "Ready for yours?",
      contactText: "Call us or send us a text — we'll reply today.",
      contactCall: "Call",
      contactSms: "Text us",
      footerLine: "Click and Love · Made in Los Angeles, California · clickandlove.app",
    },
    announcementBar:
      "Los Angeles Based & Local Support · Tailored for Southern California Venues & Celebrations",
    nav: {
      dashboard: "Family Portal",
      catalog: "Collections",
      features: "Features",
      howItWorks: "How it works",
      compare: "Comparison",
      pricing: "Pricing",
      createBtn: "Create Invitation",
    },
    hero: {
      pill: "Interactive Digital Invitations",
      title1: "Stop chasing your guests",
      title2: "to find out if they will attend",
      subtitle:
        "Interactive invitations custom-built by our Los Angeles team with SMS RSVPs, guest capacity control, and live phone dashboard.",
      ctaCatalog: "Explore Collections",
      ctaDemo: "View Live Demo",
      ctaCreate: "View Pricing",
      multiChannelTitle: "Send your invitations via:",
      channels: [
        "WhatsApp",
        "Text Message (SMS)",
        "Instagram / Messenger",
        "QR Code",
      ],
      phoneBadge1: "Over 1,200 families confirmed this month across Los Angeles & San Fernando Valley",
      phoneBadge2: "Live RSVP • 98% confirmed",
      phoneBadge3: "Zero Passwords • 1 Click",
      openEnvelopePrompt: "Tap to open the envelope",
      envelopeOpenedMsg: "Envelope opened! Enjoy the music",
      fullscreenDemo: "Test full screen experience",
      trustBar: [
        "Instant RSVP",
        "SMS Confirmation",
        "Zero Downloads",
        "Compatible with All Smartphones",
      ],
      metrics: [
        { value: "98%", label: "Confirmed in the first 48 hours" },
        { value: "0", label: "Phone calls chasing guests" },
        { value: "$850+", label: "Average savings vs. LA print shops" },
        { value: "+1,200", label: "Families in Southern California" },
      ],
    },
    agitation: {
      pill: "The Hidden Cost",
      title: "The high cost of the traditional method",
      subtitle:
        "Planning your celebration with paper invitations causes stress, chaos, and wasted budget before your big day.",
      cards: [
        {
          title: "Money wasted on catering",
          text: "You pay for meals and drinks for guests who verbally confirm but don't show up or cancel last minute.",
        },
        {
          title: "Weeks wasted on the phone",
          text: "Endless phone calls and texting chains just to know who is attending and with how many plus-ones.",
        },
        {
          title: "Impossible last-minute changes",
          text: "If the ceremony time, venue, or table changes, paper invitations are useless and cause confusion.",
        },
      ],
    },
    interactiveDemoBanner: {
      pill: "Live Guest Experience",
      title: "Test the guest experience in 1 click",
      description:
        "No competitor lets you test the complete flow without texting them first on WhatsApp. Open our live invitation with 3D envelope opening, immersive music, and real RSVP right now.",
      ctaBtn: "Test the guest experience in 1 click",
      feature1: "3D virtual envelope with wax seal",
      feature2: "Synchronized ambient audio",
      feature3: "Smart RSVP with pass allocation",
    },
    collections: {
      pill: "Signature Collections",
      title: "Bento Luxury Collections",
      subtitle:
        "Each design is an interactive digital artwork engineered pixel-perfect for vertical 9:16 smartphone displays.",
      viewDemo: "View Sample Invitation",
      items: [
        {
          id: "butterfly",
          title: "Blue Butterfly Collection",
          subtitle: "Sky watercolor, gold foil accents, and ethereal butterflies",
          tag: "Quinceañera & Gala",
          description:
            "Our signature piece. Butterflies that animate on touch, soft watercolor skies, orchestral music, and an interactive envelope with royal blue wax seal.",
          slug: "mariposas-xv",
          image: "/assets/template-butterfly/foto-columpio-portada.webp",
          features: ["3D envelope with wax seal", "Background audio track", "WhatsApp & SMS RSVP"],
        },
        {
          id: "rose",
          title: "Blush Rose Filmstrip",
          subtitle: "Romantic gala and cinematic celluloid memory strip",
          tag: "Haute Couture XV",
          description:
            "Blush pink and champagne gold editorial aesthetic. Features an interactive timeline filmstrip, multi-stage itinerary, and shared guest photo album.",
          slug: "isabella-xv",
          image: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.webp",
          features: ["Interactive filmstrip timeline", "Phased itinerary", "Dress code palette"],
        },
        {
          id: "ivory",
          title: "Elegant Ivory & Château",
          subtitle: "Gala weddings, Roman minimalism, and Cinzel typography",
          tag: "Exclusive Weddings",
          description:
            "The pinnacle of bridal elegance. Pearl ivory tones, interlocking monograms, 1-tap satellite navigation, and digital gift registry.",
          slug: "emma-and-lucas",
          image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          features: ["Custom monogram", "Zelle/Amazon gift registry", "1-Tap Google Maps GPS"],
        },
      ],
    },
    techAutomation: {
      pill: "Complete Solution",
      title: "Full control of your event in one smart link",
      subtitle: "Automatic RSVPs and effortless guest management",
      pillars: [
        {
          title: "RSVP & Assigned Passes",
          description:
            "Each guest receives a link with the exact number of allocated seats.",
          highlight: "Exact guest count with zero uninvited plus-ones.",
          badge: "Assigned Passes",
        },
        {
          title: "Direct Route on Maps & Waze",
          description:
            "Guests tap one button to open step-by-step navigation to the church or banquet hall.",
          highlight: "1-tap step-by-step navigation directly to the exact venue.",
          badge: "Maps & Waze",
        },
        {
          title: "Live Table Seating Management",
          description:
            "Know in real time which tables are filled and which seats remain free.",
          highlight: "Live count and 1-click Excel export for your catering staff.",
          badge: "Live Tables",
        },
      ],
    },
    calculator: {
      pill: "Capacity & ROI Calculator",
      title: "Save time and stop paying for no-show guest plates",
      subtitle:
        "Save vs. average print shop costs in Los Angeles ($600 - $1,200 for physical paper invitations + postage stamps) and protect your catering budget.",
      guestsLabel: "Estimated number of guests:",
      stat1Label: "hours saved",
      stat1Desc: "on manual calls",
      stat2Label: "USD saved",
      stat2Desc: "on wasted catering plates",
      stat3Label: "pass control",
      stat3Desc: "zero surprise uninvited guests",
      stat4Label: "wasted paper prints",
      stat4Desc: "zero reprinting fees",
      venuesNote: "Are you an event venue manager or a Wedding Planner in Southern California?",
      venuesLink: "Learn about our volume partner packages for banquet halls & venues",
    },
    comparison: {
      pill: "Not a Canva Template",
      title: "Not a Canva template. A complete service with a live dashboard.",
      subtitle:
        "Far more than a simple image: this is how your celebration stays effortless and organized.",
      cards: [
        {
          tag: "Zero Work For You",
          title: "We build everything from scratch",
          canvaProblemLabel: "With Canva or static images:",
          canvaProblem:
            "In Canva you receive an empty template and you have to learn editing tools, crop photos, and fight with fonts and formatting.",
          solutionLabel: "What you get with Click & Love:",
          solution:
            "You don't touch any computer. Send us your photos and event details via WhatsApp and our Los Angeles team delivers your invitation ready to share.",
        },
        {
          tag: "Ironclad Capacity Control",
          title: "Private dashboard with live RSVPs",
          canvaProblemLabel: "With Canva or static images:",
          canvaProblem:
            "A Canva image doesn't tell you who is attending; you end up writing names on napkins or chasing scattered family group chats.",
          solutionLabel: "What you get with Click & Love:",
          solution:
            "Each guest looks up their name and confirms exact reserved seats. Access your dashboard from your phone and instantly see adult/child counts and cancellations.",
        },
        {
          tag: "Turn-by-Turn Arrival",
          title: "Direct SMS text messages to guest phones",
          canvaProblemLabel: "With Canva or static images:",
          canvaProblem:
            "Loose links and images get buried deep in group chats and guests end up calling lost in Southern California traffic.",
          solutionLabel: "What you get with Click & Love:",
          solution:
            "Your guests receive automated SMS confirmations and reminders with a 1-tap route map straight to the venue on Waze or Google Maps.",
        },
      ],
      ctaBox: {
        title: "Want your invitation ready without touching a computer?",
        desc: "Send us your photos and text via WhatsApp. Our Los Angeles design team delivers your interactive invitation and host roster in record time.",
        btn: "✦ View Designs & Pricing ($99 / $199) ✦",
      },
    },
    testimonials: {
      pill: "Real Experiences",
      title: "Loved by Couples & Families Celebrating with Click & Love",
      subtitle:
        "Couples and families across Los Angeles who saved weeks of effort, protected their budget, and amazed their guests.",
      items: [
        {
          name: "Sofia & Alejandro",
          role: "Bride & Groom",
          event: "Wedding at Renaissance Banquet Hall • Glendale, CA",
          quote:
            "“Not a single guest went unconfirmed. We saved weeks of calling relatives and avoided paying for 22 plates of guests who notified us in advance that they couldn't make it.”",
          avatar: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
          metric: "99% on-time RSVP rate",
          demoSlug: "emma-and-lucas",
          demoBtnText: "Try Wedding Invitation",
        },
        {
          name: "The Cordero Family",
          role: "Parents of Isabella",
          event: "Isabella's XV Gala • Hello Banquet Hall • Van Nuys, CA",
          quote:
            "“Our guests were blown away when the 3D envelope opened with background music. Controlled passes per family kept everything organized with zero unexpected crashers.”",
          avatar: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.webp",
          metric: "Zero duplicate passes",
          demoSlug: "isabella-xv",
          demoBtnText: "Try Quinceañera Invitation",
        },
        {
          name: "Camila & Mateo",
          role: "Bride & Groom",
          event: "Reception at The Castaway • Burbank, CA",
          quote:
            "“Sending the invitation via WhatsApp and watching live RSVPs appear on our phone was our best celebration investment. Guests drove straight into The Castaway via GPS without getting lost!”",
          avatar: "/assets/template-butterfly/foto-columpio-portada.webp",
          metric: "100% seating tables ready",
          demoSlug: "mariposas-xv",
          demoBtnText: "Try Gala Invitation",
        },
      ],
    },
    pricing: {
      pill: "Assisted & VIP Service",
      title: "You enjoy your event, we build your invitation.",
      subtitle:
        "No computer skills or complicated software needed. Just send your photos and event details via WhatsApp, and our Los Angeles team takes care of everything.",
      singlePayment: "USD / One-Time Payment",
      recommended: "Recommended",
      choosePlan: "Choose",
      plans: [
        {
          planKey: "assisted",
          badge: "The Standard",
          typeTag: "Ready to Share",
          name: "Assisted Digital",
          description: "Send us your event information via WhatsApp and we'll leave it ready to impress.",
          price: "$99",
          currency: "USD / One-Time",
          cta: "Pay & Get Started ($99)",
          whatsappMessage: "Hi, I'd like to order the Assisted Digital package ($99) for my event in Los Angeles.",
          secondaryActionText: "Prefer to pay with Zelle or via WhatsApp? Tap here",
          secondaryActionMessage: "Hi, I'd like to pay the $99 Assisted package via Zelle or need assistance.",
          features: [
            { text: "No computer needed: send us your details via WhatsApp and we set up everything", included: true, isBold: true },
            { text: "Full setup by our team", included: true, isBold: true },
            { text: "200 Interactive SMS RSVP confirmations included", included: true },
            { text: "GPS location button with direct navigation to Waze & Google Maps", included: true },
            { text: "Interactive virtual envelope with background music", included: true },
            { text: "Family private link with real-time live dashboard", included: true },
            { text: "Save directly to phone calendar", included: true },
            { text: "1 revision round included", included: true },
          ],
        },
        {
          planKey: "vip",
          badge: "Recommended",
          typeTag: "Top Choice for Weddings & Quinceañeras",
          name: "Los Angeles VIP Service",
          description: "Zero hassle. We handle everything from beginning to end.",
          price: "$199",
          currency: "USD / One-Time",
          highlighted: true,
          cta: "✦ Order VIP Service ($199) ✦",
          whatsappMessage: "Hi, I'm interested in the $199 VIP package for my event in Los Angeles. Could you share more details?",
          secondaryActionText: "Questions or Zelle payment? Chat on WhatsApp",
          secondaryActionMessage: "Hi, I'm interested in the $199 VIP package for my event in Los Angeles. Could you share more details?",
          features: [
            { text: "No computer needed: send us your details via WhatsApp and we set up everything", included: true, isBold: true },
            { text: "Everything included in the Assisted Digital plan", included: true, isBold: true },
            { text: "Photo retouching for cover and gallery", included: true, isBold: true },
            { text: "350 SMS confirmations included", included: true, isBold: true },
            { text: "Print-ready QR code card design for tables", included: true, isBold: true },
            { text: "Priority support with unlimited revisions until event day", included: true, isBold: true },
          ],
        },
      ],
      trustBadgesText: "100% Secure Checkout with Credit/Debit Card, Apple Pay, Google Pay or Zelle",
      venueFaqText: "Do you own an event hall or work as a wedding planner?",
      venueFaqLink: "Discover our volume packages for venues and planners",
    },
    modal: {
      title: "Live Interactive Invitation",
      subtitle: "Test the 3D envelope opening, music, and digital RSVP.",
      openFull: "Open in Full Screen",
      close: "Close",
      changeDemo: "Change Template",
    },
    footer: {
      brandSubtitle: "Haute Couture Digital Stationery for Unforgettable Celebrations",
      rights: "All rights reserved.",
      adminLink: "Admin Dashboard Access",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      whatsappSupport: "Concierge WhatsApp Support",
      localOrigin: "Crafted in Los Angeles, California · Phone/WhatsApp: +1 (818) 299-4882",
    },
  },
};
