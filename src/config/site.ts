export const INDEXABLE_PATHS = [
  "/",
  "/alphabetize-list",
  "/tools",
  "/about",
  "/privacy",
] as const;

export type IndexableMetadataKey =
  | "home"
  | "alphabetizeList"
  | "tools"
  | "about"
  | "privacy";

export type SiteMetadataKey = IndexableMetadataKey | "notFound";

const PLACEHOLDER_HOST = "example.com";

export function resolveSiteOrigin(site: URL | undefined): URL {
  if (site === undefined) {
    throw new Error("Site origin is missing. Set `site` in astro.config.mjs.");
  }
  if (site.protocol !== "https:") {
    throw new Error(`Site origin must use https: ${site.href}`);
  }
  if (site.username !== "" || site.password !== "") {
    throw new Error("Site origin must not include credentials.");
  }
  if (site.search !== "") {
    throw new Error("Site origin must not include a query string.");
  }
  if (site.hash !== "") {
    throw new Error("Site origin must not include a hash.");
  }
  if (site.pathname !== "/") {
    throw new Error(`Site origin must use the root path: ${site.pathname}`);
  }
  return site;
}

export function isPlaceholderSite(site: URL): boolean {
  return site.hostname === PLACEHOLDER_HOST;
}

export function absoluteUrl(site: URL, path: string): URL {
  return new URL(path, site);
}

export function canonicalPathFor(key: IndexableMetadataKey): string {
  switch (key) {
    case "home":
      return "/";
    case "alphabetizeList":
      return "/alphabetize-list";
    case "tools":
      return "/tools";
    case "about":
      return "/about";
    case "privacy":
      return "/privacy";
  }
}
