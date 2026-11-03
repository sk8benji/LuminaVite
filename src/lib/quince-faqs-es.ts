// Preguntas del acordeón de la landing XV en español. Fuente única: la usa
// el componente cliente (acordeón) y page.tsx (server, schema FAQPage).
// Traducción de src/lib/quince-faqs.ts.

export interface FaqItemEs {
  question: string;
  answer: string;
}

export const FAQS_LIST_ES: FaqItemEs[] = [
  {
    question: "¿Nuestros invitados necesitan descargar una app o registrarse para ver la invitación?",
    answer:
      "Cero descargas. Tus invitados solo tocan un link privado enviado por texto, WhatsApp o DM de Instagram. La invitación abre al instante en Safari, Chrome o cualquier navegador del teléfono, con animaciones en alta definición, música y navegación GPS.",
  },
  {
    question: "¿Cómo funciona el control estricto de pases por familia?",
    answer:
      "A diferencia de las invitaciones de papel, donde los invitados asumen que pueden llevar acompañantes sin invitación, nuestra plataforma fija el RSVP al número exacto de pases que asignas (por ejemplo, 'Familia Morales · 4 pases asignados'). Al confirmar, solo pueden confirmar hasta ese límite, ahorrándote miles en el banquete.",
  },
  {
    question: "¿Qué pasa si la hora de la misa, el horario de la cena o el salón cambian a último minuto?",
    answer:
      "Como tu invitación es software en vivo en la nube, nuestro equipo local de Los Ángeles actualiza tu horario o salón al instante. Tus invitados siempre verán la información 100% correcta sin que tengas que reimprimir nada.",
  },
  {
    question: "¿Están en Los Ángeles? ¿Podemos hablar con una persona real?",
    answer:
      "¡Sí! Estamos con orgullo en el Sur de California, sirviendo al Valle de San Fernando, Glendale, Burbank, Pasadena, Downtown LA y Orange County. Puedes llamarnos o mandarnos un texto cuando quieras al (818) 299-4882 o escribirnos por WhatsApp.",
  },
  {
    question: "¿Podemos incluir el vals favorito de mi hija o su canción de entrada?",
    answer:
      "Claro que sí. Puedes subir cualquier archivo de canción (.mp3, .m4a) o elegir de nuestra biblioteca de valses románticos y éxitos pop. En cuanto tu invitado toca el sobre para abrirlo, la música suena automáticamente en audio de alta fidelidad.",
  },
  {
    question: "¿Qué tan rápido entregan después de hacer mi pedido?",
    answer:
      "Nuestro equipo crea y entrega tu link personalizado en 24 a 48 horas. Si eliges el paquete VIP Los Ángeles, la entrega urgente en 24 horas y el apoyo prioritario por WhatsApp están incluidos sin costo extra.",
  },
  {
    question: "¿Pueden manejar una celebración bilingüe para invitados de inglés y español?",
    answer:
      "¡Sí! Nuestras plantillas Asistido y VIP tienen opción bilingüe, así que los abuelitos y las tías pueden leer en español, mientras primos y compañeros leen en inglés con un solo toque.",
  },
];
