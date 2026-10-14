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
  footer: {
    brandSubtitle: string;
    rights: string;
    adminLink: string;
    privacy: string;
    terms: string;
    whatsappSupport: string;
  };
}

export const translations: Record<Language, HomeTranslations> = {
  es: {
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
        "Invitaciones web para bodas y quinceañeras con confirmación por SMS, asignación de mesas y GPS para tus invitados.",
      ctaCatalog: "Ver Catálogo de Plantillas",
      ctaDemo: "Ver demo en vivo",
      ctaCreate: "Crear mi invitación",
      multiChannelTitle: "Envía tus invitaciones por:",
      channels: [
        "WhatsApp",
        "Mensaje de Texto (SMS)",
        "Instagram / Messenger",
        "Código QR",
      ],
      phoneBadge1: "Confirmación recibida hace 2 min por SMS",
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
        { value: "98.7%", label: "Tasa de Asistencia Confirmada" },
        { value: "100%", label: "Personalizado a tu Temática" },
        { value: "0", label: "Contraseñas Requeridas" },
        { value: "+1,200", label: "Eventos Inolvidables" },
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
      viewDemo: "Ver ejemplo interactivo",
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
        "Calcula con exactitud cuántas horas de llamadas te ahorras y cuánto dinero proteges al evitar pagar banquetes por invitados que no asisten.",
      guestsLabel: "Número estimado de invitados:",
      stat1Label: "horas ahorradas",
      stat1Desc: "en llamadas manuales",
      stat2Label: "USD ahorrados",
      stat2Desc: "en platos no desperdiciados",
      stat3Label: "control de pases",
      stat3Desc: "sin invitados sorpresa",
      stat4Label: "impresiones desechadas",
      stat4Desc: "cero gasto en reimpresión",
      venuesNote: "¿Administras un salón de banquetes o eres Wedding Planner profesional?",
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
        "Parejas y familias que ahorraron tiempo, evitaron pagar platillos extra y sorprendieron a sus invitados desde el primer clic.",
      items: [
        {
          name: "Sofía & Alejandro",
          role: "Novios",
          event: "Boda en Hacienda Montecristo • 180 invitados",
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
          event: "XV Años de Isabella • 240 invitados",
          quote:
            "“Todos los invitados quedaron maravillados al abrir el sobre con la música. El control de pases por familia evitó que vinieran personas de más y todo estuvo súper ordenado.”",
          avatar: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
          metric: "Cero pases duplicados",
          demoSlug: "isabella-xv",
          demoBtnText: "Probar Invitación de XV Años",
        },
        {
          name: "Valeria Morales & Familia",
          role: "Quinceañera y Familia",
          event: "XV Años Valeria • Salón Las Rosas • 160 invitados",
          quote:
            "“Mandar la invitación por WhatsApp y ver las confirmaciones en vivo en nuestro celular fue la mejor inversión de la fiesta. Mis amigas amaron el sobre interactivo y las mariposas.”",
          avatar: "/assets/template-butterfly/foto-columpio-portada.png",
          metric: "100% mesas organizadas",
          demoSlug: "mariposas-xv",
          demoBtnText: "Probar Invitación Mariposas",
        },
      ],
    },
    pricing: {
      pill: "Precios Transparentes",
      title: "Un Solo Pago por Evento",
      subtitle:
        "Sin mensualidades ni costos ocultos. Tu invitación interactiva activa y lista para compartir hasta el día de la celebración.",
      singlePayment: "USD / Pago Único",
      recommended: "Recomendado",
      choosePlan: "Elegir",
      plans: [
        {
          badge: "Esencial",
          typeTag: "Auto-gestionable",
          name: "Digital Basic",
          description: "Diseño interactivo de gala para compartir en redes y controlar la asistencia base.",
          price: "$49",
          currency: "USD / Pago Único",
          cta: "Elegir Digital Basic",
          features: [
            { text: "Plantilla de gala interactiva a elección", included: true },
            { text: "Sobre virtual con música de fondo", included: true },
            { text: "Enlace público optimizado para WhatsApp", included: true },
            { text: "Formulario RSVP en tiempo real", included: true },
            { text: "Magic Link privado para la familia", included: true },
            { text: "Ubicación GPS interactiva", included: true },
            { text: "Confirmación por SMS vía Twilio", included: false },
            { text: "Álbum colaborativo de fotos", included: false },
          ],
        },
        {
          badge: "Experiencia Total",
          typeTag: "Más Popular",
          name: "Signature VIP",
          description: "Control total de aforo por SMS, recordatorios y álbum digital de fotos para los invitados.",
          price: "$89",
          currency: "USD / Pago Único",
          highlighted: true,
          cta: "Elegir Signature VIP",
          features: [
            { text: "Todo lo incluido en Digital Basic", included: true, isBold: true },
            { text: "150 SMS de confirmación directa vía Twilio", included: true, isBold: true },
            { text: "Álbum de fotos compartido: los invitados suben fotos", included: true, isBold: true },
            { text: "Descarga de fotos en archivo ZIP en el panel", included: true },
            { text: "Botón interactivo 'Agendar en Calendario' (.ics)", included: true },
            { text: "Exportación de lista a Excel (.CSV) para el salón", included: true },
            { text: "Notificación inmediata por email tras cada RSVP", included: true },
          ],
        },
        {
          badge: "Llave en Mano",
          typeTag: "Asistencia VIP",
          name: "Concierge",
          description: "Nosotros nos encargamos de todo. Solo envíanos las fotos y datos por WhatsApp.",
          price: "$149",
          currency: "USD / Pago Único",
          cta: "Elegir Concierge",
          features: [
            { text: "Todo lo incluido en Signature VIP", included: true, isBold: true },
            { text: "Montaje y maquetación completa por nuestro equipo", included: true, isBold: true },
            { text: "Retoque y encuadre fotográfico profesional", included: true },
            { text: "300 SMS de confirmación incluidos", included: true, isBold: true },
            { text: "Diseño de código QR para mesas listo para imprimir", included: true, isBold: true },
            { text: "Soporte prioritario y cambios hasta el día de la fiesta", included: true },
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
    },
  },
  en: {
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
        "Web invitations for weddings and quinceañeras with SMS confirmation, seating charts, and direct GPS navigation for your guests.",
      ctaCatalog: "Explore Collections",
      ctaDemo: "See live demo",
      ctaCreate: "Create my invitation",
      multiChannelTitle: "Send your invitations via:",
      channels: [
        "WhatsApp",
        "Text Message (SMS)",
        "Instagram / Messenger",
        "QR Code",
      ],
      phoneBadge1: "RSVP received 2 min ago via SMS",
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
        { value: "98.7%", label: "Confirmed Guest Attendance" },
        { value: "100%", label: "Tailored to Your Theme" },
        { value: "0", label: "Passwords Required" },
        { value: "+1,200", label: "Celebrated Events" },
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
      viewDemo: "View interactive sample",
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
        "Calculate the exact hours and money you protect by avoiding catering charges for guests who don't attend.",
      guestsLabel: "Estimated number of guests:",
      stat1Label: "hours saved",
      stat1Desc: "on manual calls",
      stat2Label: "USD saved",
      stat2Desc: "on wasted catering plates",
      stat3Label: "pass control",
      stat3Desc: "zero surprise uninvited guests",
      stat4Label: "wasted paper prints",
      stat4Desc: "zero reprinting fees",
      venuesNote: "Are you an event venue manager or a professional Wedding Planner?",
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
        "Couples and families who saved hours, avoided paying for empty plates, and wowed their guests from the very first tap.",
      items: [
        {
          name: "Sofia & Alejandro",
          role: "Bride & Groom",
          event: "Montecristo Hacienda Wedding • 180 Guests",
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
          event: "Isabella's XV Birthday Gala • 240 Guests",
          quote:
            "“Our guests were blown away when the 3D envelope opened with background music. Controlled passes per family kept everything organized with zero unexpected crashers.”",
          avatar: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
          metric: "Zero duplicate passes",
          demoSlug: "isabella-xv",
          demoBtnText: "Try Quinceañera Invitation",
        },
        {
          name: "Valeria Morales & Family",
          role: "Quinceañera & Family",
          event: "Valeria XV Gala • Las Rosas Ballroom • 160 Guests",
          quote:
            "“Sending the invitation via WhatsApp and watching live RSVPs appear on our phone was our best celebration investment. My friends loved the floating butterflies and wax seal!”",
          avatar: "/assets/template-butterfly/foto-columpio-portada.png",
          metric: "100% seating tables ready",
          demoSlug: "mariposas-xv",
          demoBtnText: "Try Butterfly Invitation",
        },
      ],
    },
    pricing: {
      pill: "Transparent Pricing",
      title: "One Single Payment per Event",
      subtitle:
        "No recurring fees, no hidden costs. Your interactive invitation remains live and ready to share through the day of your event.",
      singlePayment: "USD / One-Time Payment",
      recommended: "Recommended",
      choosePlan: "Choose",
      plans: [
        {
          badge: "Essential",
          typeTag: "Self-Managed",
          name: "Digital Basic",
          description: "Interactive gala design to share across messaging apps and manage baseline attendance.",
          price: "$49",
          currency: "USD / One-Time",
          cta: "Choose Digital Basic",
          features: [
            { text: "Interactive gala template of your choice", included: true },
            { text: "Virtual envelope with background music", included: true },
            { text: "Public link optimized for WhatsApp & iMessage", included: true },
            { text: "Real-time RSVP form", included: true },
            { text: "Private family Magic Link dashboard", included: true },
            { text: "Interactive GPS location", included: true },
            { text: "SMS confirmation via Twilio", included: false },
            { text: "Shared collaborative photo album", included: false },
          ],
        },
        {
          badge: "Full Experience",
          typeTag: "Most Popular",
          name: "Signature VIP",
          description: "Comprehensive capacity control via SMS, calendar reminders, and guest photo gallery.",
          price: "$89",
          currency: "USD / One-Time",
          highlighted: true,
          cta: "Choose Signature VIP",
          features: [
            { text: "Everything included in Digital Basic", included: true, isBold: true },
            { text: "150 Direct SMS confirmations via Twilio", included: true, isBold: true },
            { text: "Shared guest photo album: guests upload party photos", included: true, isBold: true },
            { text: "Download all guest photos in a single ZIP file", included: true },
            { text: "Interactive 'Add to Calendar' button (.ics)", included: true },
            { text: "Export guest list to Excel (.CSV) for catering", included: true },
            { text: "Instant email notification after every RSVP", included: true },
          ],
        },
        {
          badge: "Turnkey VIP",
          typeTag: "Concierge Care",
          name: "Concierge",
          description: "We handle everything for you. Simply send us your photos and details via WhatsApp.",
          price: "$149",
          currency: "USD / One-Time",
          cta: "Choose Concierge",
          features: [
            { text: "Everything included in Signature VIP", included: true, isBold: true },
            { text: "Full typesetting and composition by our design team", included: true, isBold: true },
            { text: "Professional photo retouching and framing", included: true },
            { text: "300 SMS confirmations included", included: true, isBold: true },
            { text: "Print-ready QR code table cards design", included: true, isBold: true },
            { text: "Priority support and revisions until the party day", included: true },
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
    },
  },
};
