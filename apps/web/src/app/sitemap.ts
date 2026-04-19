import type { MetadataRoute } from "next";

import { siteConfig } from "@/shared/config/site";

const routes = [
  "",
  "/search",
  "/guide",
  "/tv",
  "/regions",
  "/partner",
  "/login",
  "/signup"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7
  }));
}

