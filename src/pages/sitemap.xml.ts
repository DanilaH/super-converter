import { INDEXABLE_PATHS, resolveSiteOrigin } from "@/config/site";
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const origin = resolveSiteOrigin(site);
  const urls = INDEXABLE_PATHS.map(
    (path) => `  <url>\n    <loc>${new URL(path, origin).href}</loc>\n  </url>`,
  ).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
