import { ACTIVE_LOCALES, type ActiveLocale, type Locale } from "./locales";
import { PAGE_KEYS, type PageKey } from "./types";

export const ROUTES = {
  en: {
    home: "/",
    alphabetizeList: "/alphabetize-list",
    randomizeList: "/randomize-list",
    removeDuplicateLines: "/remove-duplicate-lines",
    tools: "/tools",
    about: "/about",
    privacy: "/privacy",
  },
  de: {
    home: "/de/",
    alphabetizeList: "/de/liste-alphabetisch-sortieren",
    randomizeList: "/de/liste-zufaellig-mischen",
    removeDuplicateLines: "/de/duplikate-aus-liste-entfernen",
    tools: "/de/werkzeuge",
    about: "/de/ueber",
    privacy: "/de/datenschutz",
  },
  fr: {
    home: "/fr/",
    alphabetizeList: "/fr/trier-liste-ordre-alphabetique",
    randomizeList: "/fr/melanger-liste",
    removeDuplicateLines: "/fr/supprimer-doublons-liste",
    tools: "/fr/outils",
    about: "/fr/a-propos",
    privacy: "/fr/confidentialite",
  },
  es: {
    home: "/es/",
    alphabetizeList: "/es/ordenar-lista-alfabeticamente",
    randomizeList: "/es/mezclar-lista",
    removeDuplicateLines: "/es/eliminar-lineas-duplicadas",
    tools: "/es/herramientas",
    about: "/es/acerca-de",
    privacy: "/es/privacidad",
  },
  "pt-br": {
    home: "/pt-br/",
    alphabetizeList: "/pt-br/ordem-alfabetica",
    randomizeList: "/pt-br/embaralhar-lista",
    removeDuplicateLines: "/pt-br/remover-linhas-duplicadas",
    tools: "/pt-br/ferramentas",
    about: "/pt-br/sobre",
    privacy: "/pt-br/privacidade",
  },
} as const satisfies Record<Locale, Record<PageKey, string>>;

export function routeFor(locale: Locale, pageKey: PageKey): string {
  return ROUTES[locale][pageKey];
}

export function activeIndexablePaths(): readonly string[] {
  return ACTIVE_LOCALES.flatMap((locale) =>
    PAGE_KEYS.map((pageKey) => routeFor(locale, pageKey)),
  );
}

export function routesFor(locale: ActiveLocale): Record<PageKey, string> {
  return ROUTES[locale];
}
