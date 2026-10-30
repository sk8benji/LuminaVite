import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://clickandlove.app";
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/`,
          es: `${baseUrl}/es/`,
          "x-default": `${baseUrl}/`,
        },
      },
    },
    {
      url: `${baseUrl}/es/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/`,
          es: `${baseUrl}/es/`,
          "x-default": `${baseUrl}/`,
        },
      },
    },
    {
      url: `${baseUrl}/demo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/demo`,
          es: `${baseUrl}/es/demo`,
          "x-default": `${baseUrl}/demo`,
        },
      },
    },
    {
      url: `${baseUrl}/es/demo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/demo`,
          es: `${baseUrl}/es/demo`,
          "x-default": `${baseUrl}/demo`,
        },
      },
    },
    // Landings transaccionales (estrategia de contenido 2026-10-30)
    {
      url: `${baseUrl}/quince-invitations`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/quince-invitations`,
          es: `${baseUrl}/es/invitaciones-de-quinceanera`,
          "x-default": `${baseUrl}/quince-invitations`,
        },
      },
    },
    {
      url: `${baseUrl}/es/invitaciones-de-quinceanera`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/quince-invitations`,
          es: `${baseUrl}/es/invitaciones-de-quinceanera`,
          "x-default": `${baseUrl}/quince-invitations`,
        },
      },
    },
    {
      url: `${baseUrl}/text-message-invitations`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rsvp-tracking`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/whatsapp-invitations`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wedding-invitations-los-angeles`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
