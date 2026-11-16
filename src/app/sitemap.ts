import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";

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
    // Pricing (landing /pricing + /es/precios, keyword research 2026-11-15)
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/pricing`,
          es: `${baseUrl}/es/precios`,
          "x-default": `${baseUrl}/pricing`,
        },
      },
    },
    {
      url: `${baseUrl}/es/precios`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/pricing`,
          es: `${baseUrl}/es/precios`,
          "x-default": `${baseUrl}/pricing`,
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
    {
      url: `${baseUrl}/wedding-invitations-las-vegas`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Blog (arquitectura 2026-11-02)
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...BLOG_POSTS.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.datePublished),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
