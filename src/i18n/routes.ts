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
    randomTeamGenerator: "/random-team-generator",
    randomPairGenerator: "/random-pair-generator",
    removeLineBreaks: "/remove-line-breaks",
    columnToCommaSeparatedList: "/column-to-comma-separated-list",
  },
  de: {
    home: "/de/",
    alphabetizeList: "/de/liste-alphabetisch-sortieren",
    randomizeList: "/de/liste-zufaellig-mischen",
    removeDuplicateLines: "/de/duplikate-aus-liste-entfernen",
    tools: "/de/werkzeuge",
    about: "/de/ueber",
    privacy: "/de/datenschutz",
    randomTeamGenerator: "/de/zufaelliger-teamgenerator",
    randomPairGenerator: "/de/zufaellige-paare-bilden",
    removeLineBreaks: "/de/zeilenumbrueche-entfernen",
    columnToCommaSeparatedList: "/de/spalte-in-kommagetrennte-liste",
  },
  fr: {
    home: "/fr/",
    alphabetizeList: "/fr/trier-liste-ordre-alphabetique",
    randomizeList: "/fr/melanger-liste",
    removeDuplicateLines: "/fr/supprimer-doublons-liste",
    tools: "/fr/outils",
    about: "/fr/a-propos",
    privacy: "/fr/confidentialite",
    randomTeamGenerator: "/fr/generateur-equipes-aleatoires",
    randomPairGenerator: "/fr/generateur-paires-aleatoires",
    removeLineBreaks: "/fr/supprimer-sauts-de-ligne",
    columnToCommaSeparatedList: "/fr/colonne-liste-separee-par-virgules",
  },
  es: {
    home: "/es/",
    alphabetizeList: "/es/ordenar-lista-alfabeticamente",
    randomizeList: "/es/mezclar-lista",
    removeDuplicateLines: "/es/eliminar-lineas-duplicadas",
    tools: "/es/herramientas",
    about: "/es/acerca-de",
    privacy: "/es/privacidad",
    randomTeamGenerator: "/es/generador-equipos-aleatorios",
    randomPairGenerator: "/es/generador-parejas-aleatorias",
    removeLineBreaks: "/es/eliminar-saltos-de-linea",
    columnToCommaSeparatedList: "/es/columna-lista-separada-por-comas",
  },
  "pt-br": {
    home: "/pt-br/",
    alphabetizeList: "/pt-br/ordem-alfabetica",
    randomizeList: "/pt-br/embaralhar-lista",
    removeDuplicateLines: "/pt-br/remover-linhas-duplicadas",
    tools: "/pt-br/ferramentas",
    about: "/pt-br/sobre",
    privacy: "/pt-br/privacidade",
    randomTeamGenerator: "/pt-br/sorteador-de-times",
    randomPairGenerator: "/pt-br/sorteador-de-duplas",
    removeLineBreaks: "/pt-br/remover-quebras-de-linha",
    columnToCommaSeparatedList: "/pt-br/coluna-lista-separada-por-virgulas",
  },
  ru: {
    home: "/ru/",
    alphabetizeList: "/ru/sortirovat-spisok-po-alfavitu",
    randomizeList: "/ru/peremeshat-spisok",
    removeDuplicateLines: "/ru/udalit-dublikaty-strok",
    tools: "/ru/instrumenty",
    about: "/ru/o-proekte",
    privacy: "/ru/konfidencialnost",
    randomTeamGenerator: "/ru/generator-sluchaynyh-komand",
    randomPairGenerator: "/ru/generator-sluchaynyh-par",
    removeLineBreaks: "/ru/ubrat-perenosy-strok",
    columnToCommaSeparatedList: "/ru/stolbec-v-spisok-cherez-zapyatuyu",
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
