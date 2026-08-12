import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/elves",
    "/kid/login",
    "/kid/register",
    "/parent/login",
    "/parent/register",
    "/safety",
  ];
  return pages.map((path) => ({
    url: path || "/",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
