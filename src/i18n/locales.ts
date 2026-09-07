export type Locale = "en" | "de" | "fr" | "es" | "pt-br";

export type LocaleConfig = {
  htmlLang: "en" | "de" | "fr" | "es" | "pt-BR";
  hreflang: "en" | "de" | "fr" | "es" | "pt-BR";
  label: string;
  collatorLocale: "en" | "de" | "fr" | "es" | "pt-BR";
};

export const LOCALE_CONFIGS = {
  en: {
    htmlLang: "en",
    hreflang: "en",
    label: "English",
    collatorLocale: "en",
  },
  de: {
    htmlLang: "de",
    hreflang: "de",
    label: "Deutsch",
    collatorLocale: "de",
  },
  fr: {
    htmlLang: "fr",
    hreflang: "fr",
    label: "Français",
    collatorLocale: "fr",
  },
  es: {
    htmlLang: "es",
    hreflang: "es",
    label: "Español",
    collatorLocale: "es",
  },
  "pt-br": {
    htmlLang: "pt-BR",
    hreflang: "pt-BR",
    label: "Português (Brasil)",
    collatorLocale: "pt-BR",
  },
} as const satisfies Record<Locale, LocaleConfig>;

// L10N-1 intentionally exposes only the existing English surface.
// L10N-2 expands this list atomically once every localized route is ready.
export const ACTIVE_LOCALES = ["en"] as const satisfies readonly Locale[];
export type ActiveLocale = (typeof ACTIVE_LOCALES)[number];

export const DEFAULT_LOCALE: ActiveLocale = "en";

export function localeConfigFor(locale: Locale): LocaleConfig {
  return LOCALE_CONFIGS[locale];
}

export function isActiveLocale(locale: Locale): locale is ActiveLocale {
  return (ACTIVE_LOCALES as readonly Locale[]).includes(locale);
}
