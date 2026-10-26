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
  ];
}
