import { contentFor } from "./content";
import type { ActiveLocale } from "./locales";
import { routeFor } from "./routes";
import type { ToolPageKey } from "./types";

export type ResolvedRelatedTool = {
  href: string;
  label: string;
  description: string;
};

export function relatedToolsFor(
  locale: ActiveLocale,
  pageKey: ToolPageKey,
): readonly ResolvedRelatedTool[] {
  return contentFor(locale).relatedTools.byPage[pageKey].map((item) => ({
    href: routeFor(locale, item.pageKey),
    label: item.label,
    description: item.description,
  }));
}
