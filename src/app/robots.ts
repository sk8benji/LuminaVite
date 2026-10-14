import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://clickandlove.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/es", "/demo", "/demo/*"],
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/eventos",
          "/eventos/*",
          "/api",
          "/api/*",
          "/m",
          "/m/*",
          "/*?*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/es", "/demo", "/demo/*"],
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/eventos",
          "/eventos/*",
          "/api",
          "/api/*",
          "/m",
          "/m/*",
          "/*?*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
