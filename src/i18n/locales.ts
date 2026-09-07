export type Locale = "en" | "de" | "fr" | "es" | "pt-br" | "ru";

export type LocaleConfig = {
  htmlLang: "en" | "de" | "fr" | "es" | "pt-BR" | "ru";
  hreflang: "en" | "de" | "fr" | "es" | "pt-BR" | "ru";
  label: string;
  shortLabel: string;
  collatorLocale: "en" | "de" | "fr" | "es" | "pt-BR" | "ru";
};

export const LOCALE_CONFIGS = {
  en: {
    htmlLang: "en",
    hreflang: "en",
    label: "English",
    shortLabel: "EN",
    collatorLocale: "en",
  },
  de: {
    htmlLang: "de",
    hreflang: "de",
    label: "Deutsch",
    shortLabel: "DE",
    collatorLocale: "de",
  },
  fr: {
    htmlLang: "fr",
    hreflang: "fr",
    label: "Français",
    shortLabel: "FR",
    collatorLocale: "fr",
  },
  es: {
    htmlLang: "es",
    hreflang: "es",
    label: "Español",
    shortLabel: "ES",
    collatorLocale: "es",
  },
  "pt-br": {
    htmlLang: "pt-BR",
    hreflang: "pt-BR",
    label: "Português (Brasil)",
    shortLabel: "PT-BR",
    collatorLocale: "pt-BR",
  },
  ru: {
    htmlLang: "ru",
    hreflang: "ru",
    label: "Русский",
    shortLabel: "RU",
    collatorLocale: "ru",
  },
} as const satisfies Record<Locale, LocaleConfig>;

// Localization V1 releases every approved locale atomically.
export const ACTIVE_LOCALES = [
  "en",
  "de",
  "fr",
  "es",
  "pt-br",
  "ru",
] as const satisfies readonly Locale[];
export type ActiveLocale = (typeof ACTIVE_LOCALES)[number];

export const DEFAULT_LOCALE: ActiveLocale = "en";

export function localeConfigFor(locale: Locale): LocaleConfig {
  return LOCALE_CONFIGS[locale];
}

export function isActiveLocale(locale: Locale): locale is ActiveLocale {
  return (ACTIVE_LOCALES as readonly Locale[]).includes(locale);
}
