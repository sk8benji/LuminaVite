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
    colCompetitors: string;
    colClickAndLove: string;
    rows: {
      feature: string;
      competitors: string;
      clickAndLove: string;
    }[];
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
    }[];
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
        "La plataforma creada en Los Ángeles para bodas y quinceañeras con confirmación directa, control de aforo y navegación al salón.",
      ctaCatalog: "Ver Catálogo de Plantillas",
      ctaDemo: "Ver ejemplo en vivo",
      ctaCreate: "Crear mi invitación",
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
          image: "/assets/template-butterfly/foto-columpio-portada.png",
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
          image: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
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
      pill: "Comparativa Directa",
      title: "Método Tradicional vs. Click & Love",
      subtitle:
        "Compara la experiencia y el control que ofrece nuestra plataforma frente a los métodos convencionales.",
      colCompetitors: "Invitación en Papel Tradicional",
      colClickAndLove: "Click & Love",
      rows: [
        {
          feature: "Confirmación de asistencia",
          competitors: "Manual por llamada o mensaje",
          clickAndLove: "Automática en tiempo real",
        },
        {
          feature: "Pases y acompañantes",
          competitors: "Difícil de limitar",
          clickAndLove: "Control exacto por familia",
        },
        {
          feature: "Ubicación y llegada",
          competitors: "Dirección escrita estática",
          clickAndLove: "Ruta directa con Waze y Google Maps",
        },
        {
          feature: "Cambios de horario o salón",
          competitors: "Requiere reimpresión",
          clickAndLove: "Actualización instantánea en el enlace",
        },
      ],
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
          avatar: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
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
          avatar: "/assets/template-butterfly/foto-columpio-portada.png",
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
          badge: "El Estándar",
          typeTag: "Listo para Compartir",
          name: "Digital Asistido",
          description: "Tú nos mandas la información por WhatsApp y nosotros la dejamos lista.",
          price: "$99",
          currency: "USD / Pago Único",
          cta: "Comenzar por WhatsApp",
          whatsappMessage: "Hola, quiero ordenar el paquete Digital Asistido ($99) para mi evento en Los Ángeles.",
          features: [
            { text: "Sin usar computadora: envíanos los detalles por WhatsApp y nosotros armamos todo", included: true, isBold: true },
            { text: "Configuración completa de la invitación por nuestro equipo", included: true, isBold: true },
            { text: "150 SMS de confirmación interactiva incluidos", included: true },
            { text: "Ubicación con GPS y botón directo a Waze / Google Maps", included: true },
            { text: "Sobre virtual interactivo con música de fondo", included: true },
            { text: "Enlace privado exclusivo para la familia y panel en tiempo real", included: true },
            { text: "Botón para guardar en el calendario del teléfono", included: true },
            { text: "1 ronda de cambios incluida antes del envío", included: true },
          ],
        },
        {
          badge: "Recomendado",
          typeTag: "El más elegido para Quinceañeras y Bodas",
          name: "Servicio VIP Los Ángeles",
          description: "Cero complicaciones. Nos encargamos de todo de inicio a fin.",
          price: "$199",
          currency: "USD / Pago Único",
          highlighted: true,
          cta: "Ordenar mi Invitación VIP",
          whatsappMessage: "Hola, quiero ordenar el paquete VIP Los Ángeles ($199) para una quinceañera/boda en Los Ángeles.",
          features: [
            { text: "Sin usar computadora: envíanos los detalles por WhatsApp y nosotros armamos todo", included: true, isBold: true },
            { text: "Todo lo incluido en el plan Digital Asistido", included: true, isBold: true },
            { text: "Carga manual de toda tu lista de invitados desde fotos de papel o notas", included: true, isBold: true },
            { text: "Retoque fotográfico profesional para la portada y galería", included: true, isBold: true },
            { text: "300 SMS de confirmación directa incluidos", included: true, isBold: true },
            { text: "Diseño de código QR personalizado listo para imprimir en mesas", included: true, isBold: true },
            { text: "Álbum digital interactivo: tus invitados suben sus fotos durante la fiesta", included: true, isBold: true },
            { text: "Soporte prioritario por WhatsApp y cambios ilimitados hasta el evento", included: true, isBold: true },
          ],
        },
      ],
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
        "The Los Angeles-crafted platform for weddings and quinceañeras with direct RSVP, capacity control, and GPS navigation to the venue.",
      ctaCatalog: "Explore Collections",
      ctaDemo: "Live Sample Preview",
      ctaCreate: "Create my invitation",
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
          image: "/assets/template-butterfly/foto-columpio-portada.png",
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
          image: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
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
      pill: "Head-to-Head Comparison",
      title: "Traditional Method vs. Click & Love",
      subtitle:
        "Contrast the outdated workflow of standard solutions with the bespoke luxury of our digital platform.",
      colCompetitors: "Traditional Paper Invitation",
      colClickAndLove: "Click & Love",
      rows: [
        {
          feature: "Attendance confirmation",
          competitors: "Manual via calls or texts",
          clickAndLove: "Automatic in real-time",
        },
        {
          feature: "Passes & plus-ones",
          competitors: "Hard to limit",
          clickAndLove: "Exact control per family",
        },
        {
          feature: "Location & directions",
          competitors: "Static printed address",
          clickAndLove: "Direct route with Waze and Google Maps",
        },
        {
          feature: "Time or venue changes",
          competitors: "Requires reprinting",
          clickAndLove: "Instant link update with zero cost",
        },
      ],
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
          avatar: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
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
          avatar: "/assets/template-butterfly/foto-columpio-portada.png",
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
          badge: "The Standard",
          typeTag: "Ready to Share",
          name: "Assisted Digital",
          description: "Send us your event information via WhatsApp and we'll leave it ready to impress.",
          price: "$99",
          currency: "USD / One-Time",
          cta: "Start via WhatsApp",
          whatsappMessage: "Hi, I'd like to order the Assisted Digital package ($99) for my event in Los Angeles.",
          features: [
            { text: "No computer needed: send us your details via WhatsApp and we set up everything", included: true, isBold: true },
            { text: "Full invitation design setup by our local design team", included: true, isBold: true },
            { text: "150 Direct SMS interactive RSVP confirmations included", included: true },
            { text: "GPS location button with direct navigation to Waze & Google Maps", included: true },
            { text: "Interactive virtual envelope with background music", included: true },
            { text: "Private family link with real-time live RSVP dashboard", included: true },
            { text: "One-tap button to save the date on phone calendars", included: true },
            { text: "1 revision round included prior to sending", included: true },
          ],
        },
        {
          badge: "Recommended",
          typeTag: "Top Choice for Weddings & Quinceañeras",
          name: "Los Angeles VIP Service",
          description: "Zero hassle. We handle everything from beginning to end.",
          price: "$199",
          currency: "USD / One-Time",
          highlighted: true,
          cta: "Order VIP Invitation",
          whatsappMessage: "Hi, I'd like to order the Los Angeles VIP Service package ($199) for our celebration.",
          features: [
            { text: "No computer needed: send us your details via WhatsApp and we set up everything", included: true, isBold: true },
            { text: "Everything included in the Assisted Digital plan", included: true, isBold: true },
            { text: "Manual guest list loading directly from paper list photos or WhatsApp notes", included: true, isBold: true },
            { text: "Professional photo retouching and framing for cover & gallery", included: true, isBold: true },
            { text: "300 Direct SMS RSVP confirmations included", included: true, isBold: true },
            { text: "Custom printable QR code cards designed for your reception tables", included: true, isBold: true },
            { text: "Interactive live photo album: guests upload their party photos in real time", included: true, isBold: true },
            { text: "Priority WhatsApp concierge support & unlimited revisions until event day", included: true, isBold: true },
          ],
        },
      ],
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
