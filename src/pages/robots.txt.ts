import { isPlaceholderSite, resolveSiteOrigin } from "@/config/site";
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const origin = resolveSiteOrigin(site);
  const body = isPlaceholderSite(origin)
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", origin).href}\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
