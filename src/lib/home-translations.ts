export type Language = "es" | "en";

export interface HomeTranslations {
  nav: {
    dashboard: string;
    catalog: string;
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
    phoneBadge1: string;
    phoneBadge2: string;
    phoneBadge3: string;
    openEnvelopePrompt: string;
    envelopeOpenedMsg: string;
    fullscreenDemo: string;
    trustBar: string[];
    metrics: { value: string; label: string }[];
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
      compare: "Comparativa",
      pricing: "Tarifas",
      createBtn: "Crear Invitación",
    },
    hero: {
      pill: "Papelería Digital de Alta Costura",
      title1: "Invitaciones digitales interactivas para tu boda o quinceañera",
      title2: "con confirmación por WhatsApp en tiempo real.",
      subtitle:
        "Olvídate de perseguir invitados por teléfono para saber si van a asistir. Diseños de gala con sobre 3D, música envolvente y control de aforo al instante.",
      ctaCatalog: "Ver Catálogo de Plantillas",
      ctaDemo: "Explorar Invitación Demo",
      phoneBadge1: "SMS Twilio • Confirmado",
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
        { value: "< 1.2s", label: "Carga Ultrarrápida en 4G/5G" },
        { value: "0", label: "Contraseñas Requeridas" },
        { value: "+1,200", label: "Eventos Inolvidables" },
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
      viewDemo: "Ver Demo en Vivo",
      items: [
        {
          id: "butterfly",
          title: "Blue Butterfly Collection",
          subtitle: "Acuarela celeste, destellos de oro y mariposas etéreas",
          tag: "XV Años & Gala",
          description:
            "Nuestra colección más icónica. Mariposas interactivas, sobre con sello de cera, música orquestal y confirmación por WhatsApp en tiempo real.",
          slug: "mariposas-xv",
          image: "/assets/template-butterfly/foto-columpio-portada.png",
          features: ["Sobre 3D con sello de cera", "Música de fondo", "RSVP por WhatsApp y SMS"],
        },
        {
          id: "rose",
          title: "Blush Rose Filmstrip",
          subtitle: "Gala romántica y efectos de celuloide cinematográfico",
          tag: "Alta Costura XV",
          description:
            "Estética editorial rosa empolvada y oro champán. Tira fotográfica interactiva de infancia a señorita, itinerario detallado y dress code.",
          slug: "isabella-xv",
          image: "/assets/template-rose/51d8fb6fdca05936497b8c7f02e14280.png",
          features: ["Tira de película interactiva", "Itinerario por fases", "Dress code con paleta"],
        },
        {
          id: "ivory",
          title: "Elegant Ivory & Château",
          subtitle: "Bodas de gala, minimalismo romano y tipografía editorial",
          tag: "Bodas Exclusivas",
          description:
            "La máxima expresión de sofisticación nupcial. Acabados marfil perla, monogramas entrelazados, mapa satelital interactivo y mesa de regalos.",
          slug: "emma-and-lucas",
          image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          features: ["Monograma personalizado", "Mesa de regalos Zelle/Amazon", "Google Maps en 1 clic"],
        },
      ],
    },
    techAutomation: {
      pill: "Confirmación Inteligente",
      title: "Control total de confirmaciones sin perseguir a nadie",
      subtitle:
        "Olvídate de mandar mensajes uno por uno o llamar familiares. Nuestra plataforma automatiza cada confirmación y actualiza tu lista en tiempo real.",
      pillars: [
        {
          title: "Cero contraseñas ni descargas",
          description:
            "Tus invitados jamás tendrán que crearse cuentas ni descargar aplicaciones pesadas. Un toque al enlace recibido en WhatsApp y acceden de inmediato.",
          highlight: "Fricción cero = Máxima tasa de respuesta en las primeras 48 horas.",
          badge: "Acceso Instantáneo",
        },
        {
          title: "Confirmación SMS instantánea vía Twilio",
          description:
            "Al confirmar asistencia, el invitado recibe automáticamente un mensaje SMS oficial con su número de pases y botón para agendar en su calendario.",
          highlight: "Evita ausencias de última hora y asegura el conteo de tu salón.",
          badge: "Twilio Cloud SMS",
        },
        {
          title: "Panel privado en tiempo real para la familia",
          description:
            "Los anfitriones reciben un enlace privado exclusivo para consultar al instante quién asiste, cuántos pases están confirmados y descargar la lista en Excel.",
          highlight: "Exportación a Excel en un clic para entregar a tu salón o banquete.",
          badge: "Magic Link Seguro",
        },
      ],
    },
    calculator: {
      pill: "Calculadora de Aforo & Ahorro",
      title: "Ahorra tiempo y evita pagar platos de invitados que no asisten",
      subtitle:
        "Calcula con exactitud cuántas horas de llamadas te ahorras y cuánto dinero proteges al evitar pagar banquetes por invitados que no asisten.",
      guestsLabel: "Número estimado de invitados:",
      stat1Label: "Horas de WhatsApp Ahorradas",
      stat1Desc: "Sin enviar recordatorios manuales uno por uno ni perseguir confirmaciones.",
      stat2Label: "Ahorro en Papelería Impresa",
      stat2Desc: "Ahorro directo en impresión de tarjetas físicas, caligrafía y envíos.",
      stat3Label: "Tasa de Respuesta Confirmada",
      stat3Desc: "Frente al 48% habitual de las invitaciones en papel tradicionales.",
      stat4Label: "Control de Mesas en 1 Clic",
      stat4Desc: "Descarga la lista oficial de catering en formato Excel (.CSV) en cualquier momento.",
      venuesNote: "¿Administras un salón de banquetes o eres Wedding Planner profesional?",
      venuesLink: "Conoce nuestro programa especial de licencias y alianzas para salones",
    },
    comparison: {
      pill: "Comparativa Directa",
      title: "Método Tradicional vs. Click & Love",
      subtitle:
        "Compara la experiencia y el ahorro que ofrece nuestra plataforma frente a los métodos convencionales.",
      colCompetitors: "Invitaciones en Papel / Tradicional",
      colClickAndLove: "Click & Love (Invitación Digital)",
      rows: [
        {
          feature: "Costo de Impresión y Envíos",
          competitors: "Gastos elevados en papel, caligrafía, sobres y envíos postales",
          clickAndLove: "Un solo pago accesible con envíos ilimitados por WhatsApp",
        },
        {
          feature: "Confirmación en Tiempo Real",
          competitors: "Llamar a cada invitado o esperar respuestas manuales dispersas",
          clickAndLove: "Confirmación en 1 clic con conteo automático de pases en vivo",
        },
        {
          feature: "Cambios de Último Minuto",
          competitors: "Imposible modificar horarios o direcciones sin reimprimir",
          clickAndLove: "Edición instantánea de horarios, mapa y datos sin costo extra",
        },
        {
          feature: "Fotos y Recuerdos Compartidos",
          competitors: "Fotos dispersas en chats familiares que se pierden con el tiempo",
          clickAndLove: "Álbum colaborativo donde los invitados suben fotos de la fiesta",
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
      pill: "Tarifas Transparentes",
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
      compare: "Comparison",
      pricing: "Pricing",
      createBtn: "Create Invitation",
    },
    hero: {
      pill: "Haute Couture Digital Stationery",
      title1: "Your celebration deserves",
      title2: "a triumphal entrance.",
      subtitle:
        "Luxury web invitations with real-time RSVP confirmation and shared guest photo albums.",
      ctaCatalog: "Explore Collections",
      ctaDemo: "Test Interactive Demo",
      phoneBadge1: "Twilio SMS • Confirmed",
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
        { value: "< 1.2s", label: "Ultra-fast 4G/5G Load Time" },
        { value: "0", label: "Passwords Required" },
        { value: "+1,200", label: "Celebrated Events" },
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
      viewDemo: "View Live Demo",
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
      pill: "Technical Infrastructure",
      title: "Highlighting Technical Automation, Not Basic Icons",
      subtitle:
        "Competitors list generic icons for photos and maps. We deliver modern SaaS engineering so your celebration operates effortlessly.",
      pillars: [
        {
          title: "Zero Passwords for Guests",
          description:
            "Guests never need to download heavy applications, create accounts, or remember passwords. A single tap on the link received via WhatsApp or SMS opens the full experience.",
          highlight: "Zero friction = Maximum RSVP confirmation rate within the first 48 hours.",
          badge: "Instant Access",
        },
        {
          title: "Instant SMS Confirmation via Twilio",
          description:
            "Upon RSVP confirmation, each guest immediately receives an official SMS message summarizing their passes and a button to add the event to Google Calendar or Apple Calendar (.ics).",
          highlight: "Reduces absentminded guests by 94% on the day of the celebration.",
          badge: "Twilio Cloud SMS",
        },
        {
          title: "Private Real-Time Dashboard with Magic Link",
          description:
            "Hosts and families receive an encrypted Magic Link. Monitor live confirmations, guest counts (adults & children), and dietary preferences from any device.",
          highlight: "1-Click Excel export and zero repetitive phone calls asking who is attending.",
          badge: "Secure Magic Link",
        },
      ],
    },
    calculator: {
      pill: "Capacity & ROI Calculator",
      title: "Accurate Table Control and Zero Phone Calls",
      subtitle:
        "See the direct savings in planning hours, physical stationery costs, and guest coordination for your celebration or event venue.",
      guestsLabel: "Estimated number of guests:",
      stat1Label: "WhatsApp Hours Saved",
      stat1Desc: "No more sending manual reminders one-by-one or chasing down RSVPs.",
      stat2Label: "Physical Stationery Savings",
      stat2Desc: "Direct savings on paper card printing, calligraphy, postage, and envelopes.",
      stat3Label: "Confirmed Response Rate",
      stat3Desc: "Compared to the typical 48% response rate of traditional paper stationery.",
      stat4Label: "1-Click Table Seating Export",
      stat4Desc: "Download the official catering list as an Excel (.CSV) spreadsheet anytime.",
      venuesNote: "Are you an event venue manager or a professional Wedding Planner?",
      venuesLink: "Learn about our volume partner packages for banquet halls & venues",
    },
    comparison: {
      pill: "Head-to-Head Comparison",
      title: "Traditional Method vs. Click & Love",
      subtitle:
        "Contrast the outdated workflow of standard solutions with the bespoke luxury of our digital platform.",
      colCompetitors: "Traditional Method / Competitors",
      colClickAndLove: "Click & Love (Haute Couture)",
      rows: [
        {
          feature: "Print & Shipping Costs",
          competitors: "$300 - $600 USD in paper printing, envelopes, and manual courier deliveries",
          clickAndLove: "One-time digital fee, unlimited guests, zero paper waste, and instant delivery",
        },
        {
          feature: "Real-Time RSVP Confirmation",
          competitors: "Chasing down each guest by phone or waiting for scattered text messages",
          clickAndLove: "1-Click confirmation with live automated headcount and pass counter",
        },
        {
          feature: "Last-Minute Schedule Changes",
          competitors: "Impossible to change schedules or addresses without costly reprints",
          clickAndLove: "Instant edits to schedules, map pins, and dress code at zero extra cost",
        },
        {
          feature: "Shared Photo Memories",
          competitors: "Photos lost across private chat threads that disappear over time",
          clickAndLove: "Collaborative live album where guests upload real-time party memories",
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
