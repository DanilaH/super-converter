import type { ActiveLocale } from "../../i18n/locales";
import { germanExpansionContent } from "./de";
import { englishExpansionContent } from "./en";
import { spanishExpansionContent } from "./es";
import { frenchExpansionContent } from "./fr";
import { brazilianPortugueseExpansionContent } from "./pt-br";
import { russianExpansionContent } from "./ru";
import type { ExpansionLocaleContent } from "./types";

const EXPANSION_CONTENT = {
  en: englishExpansionContent,
  de: germanExpansionContent,
  fr: frenchExpansionContent,
  es: spanishExpansionContent,
  "pt-br": brazilianPortugueseExpansionContent,
  ru: russianExpansionContent,
} as const satisfies Record<ActiveLocale, ExpansionLocaleContent>;

export function expansionContentFor(
  locale: ActiveLocale,
): ExpansionLocaleContent {
  return EXPANSION_CONTENT[locale];
}
