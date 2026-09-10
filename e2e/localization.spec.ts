import { expect, test } from "@playwright/test";

type RouteIdentity =
  | "home"
  | "alphabetizeList"
  | "randomizeList"
  | "removeDuplicateLines"
  | "tools"
  | "about"
  | "privacy"
  | "randomTeamGenerator"
  | "randomPairGenerator"
  | "removeLineBreaks"
  | "columnToCommaSeparatedList";

type RouteExpectation = {
  pageKey: RouteIdentity;
  path: string;
  heading?: string;
};

type LocaleExpectation = {
  code: string;
  htmlLang: string;
  hreflang: string;
  collatorLocale: string;
  routes: readonly RouteExpectation[];
};

const LOCALES: readonly LocaleExpectation[] = [
  {
    code: "en",
    htmlLang: "en",
    hreflang: "en",
    collatorLocale: "en",
    routes: [
      { pageKey: "home", path: "/", heading: "Compare Lists Online" },
      {
        pageKey: "alphabetizeList",
        path: "/alphabetize-list",
        heading: "Alphabetize a List Online",
      },
      {
        pageKey: "randomizeList",
        path: "/randomize-list",
        heading: "List Randomizer",
      },
      {
        pageKey: "removeDuplicateLines",
        path: "/remove-duplicate-lines",
        heading: "Remove Duplicate Lines",
      },
      { pageKey: "tools", path: "/tools" },
      { pageKey: "about", path: "/about" },
      { pageKey: "privacy", path: "/privacy" },
      {
        pageKey: "randomTeamGenerator",
        path: "/random-team-generator",
        heading: "Random Team & Group Generator",
      },
      {
        pageKey: "randomPairGenerator",
        path: "/random-pair-generator",
        heading: "Random Pair Generator",
      },
      {
        pageKey: "removeLineBreaks",
        path: "/remove-line-breaks",
        heading: "Remove Line Breaks",
      },
      {
        pageKey: "columnToCommaSeparatedList",
        path: "/column-to-comma-separated-list",
        heading: "Column to Comma Separated List",
      },
    ],
  },
  {
    code: "de",
    htmlLang: "de",
    hreflang: "de",
    collatorLocale: "de",
    routes: [
      { pageKey: "home", path: "/de/", heading: "Listen online vergleichen" },
      {
        pageKey: "alphabetizeList",
        path: "/de/liste-alphabetisch-sortieren",
        heading: "Liste online alphabetisch sortieren",
      },
      {
        pageKey: "randomizeList",
        path: "/de/liste-zufaellig-mischen",
        heading: "Liste zufällig mischen",
      },
      {
        pageKey: "removeDuplicateLines",
        path: "/de/duplikate-aus-liste-entfernen",
        heading: "Doppelte Zeilen online entfernen",
      },
      { pageKey: "tools", path: "/de/werkzeuge" },
      { pageKey: "about", path: "/de/ueber" },
      { pageKey: "privacy", path: "/de/datenschutz" },
      {
        pageKey: "randomTeamGenerator",
        path: "/de/zufaelliger-teamgenerator",
        heading: "Zufälliger Teamgenerator",
      },
      {
        pageKey: "randomPairGenerator",
        path: "/de/zufaellige-paare-bilden",
        heading: "Zufällige Paare bilden",
      },
      {
        pageKey: "removeLineBreaks",
        path: "/de/zeilenumbrueche-entfernen",
        heading: "Zeilenumbrüche entfernen",
      },
      {
        pageKey: "columnToCommaSeparatedList",
        path: "/de/spalte-in-kommagetrennte-liste",
        heading: "Spalte in kommagetrennte Liste",
      },
    ],
  },
  {
    code: "fr",
    htmlLang: "fr",
    hreflang: "fr",
    collatorLocale: "fr",
    routes: [
      {
        pageKey: "home",
        path: "/fr/",
        heading: "Comparer deux listes en ligne",
      },
      {
        pageKey: "alphabetizeList",
        path: "/fr/trier-liste-ordre-alphabetique",
        heading: "Trier une liste par ordre alphabétique en ligne",
      },
      {
        pageKey: "randomizeList",
        path: "/fr/melanger-liste",
        heading: "Mélanger une liste en ligne",
      },
      {
        pageKey: "removeDuplicateLines",
        path: "/fr/supprimer-doublons-liste",
        heading: "Supprimer les lignes en double en ligne",
      },
      { pageKey: "tools", path: "/fr/outils" },
      { pageKey: "about", path: "/fr/a-propos" },
      { pageKey: "privacy", path: "/fr/confidentialite" },
      {
        pageKey: "randomTeamGenerator",
        path: "/fr/generateur-equipes-aleatoires",
        heading: "Générateur d’équipes aléatoires",
      },
      {
        pageKey: "randomPairGenerator",
        path: "/fr/generateur-paires-aleatoires",
        heading: "Générateur de paires aléatoires",
      },
      {
        pageKey: "removeLineBreaks",
        path: "/fr/supprimer-sauts-de-ligne",
        heading: "Supprimer les sauts de ligne",
      },
      {
        pageKey: "columnToCommaSeparatedList",
        path: "/fr/colonne-liste-separee-par-virgules",
        heading: "Convertir une colonne en liste séparée par des virgules",
      },
    ],
  },
  {
    code: "es",
    htmlLang: "es",
    hreflang: "es",
    collatorLocale: "es",
    routes: [
      { pageKey: "home", path: "/es/", heading: "Comparar dos listas online" },
      {
        pageKey: "alphabetizeList",
        path: "/es/ordenar-lista-alfabeticamente",
        heading: "Ordenar una lista alfabéticamente online",
      },
      {
        pageKey: "randomizeList",
        path: "/es/mezclar-lista",
        heading: "Aleatorizar una lista online",
      },
      {
        pageKey: "removeDuplicateLines",
        path: "/es/eliminar-lineas-duplicadas",
        heading: "Eliminar líneas duplicadas online",
      },
      { pageKey: "tools", path: "/es/herramientas" },
      { pageKey: "about", path: "/es/acerca-de" },
      { pageKey: "privacy", path: "/es/privacidad" },
      {
        pageKey: "randomTeamGenerator",
        path: "/es/generador-equipos-aleatorios",
        heading: "Generador de equipos aleatorios",
      },
      {
        pageKey: "randomPairGenerator",
        path: "/es/generador-parejas-aleatorias",
        heading: "Generador de parejas aleatorias",
      },
      {
        pageKey: "removeLineBreaks",
        path: "/es/eliminar-saltos-de-linea",
        heading: "Eliminar saltos de línea",
      },
      {
        pageKey: "columnToCommaSeparatedList",
        path: "/es/columna-lista-separada-por-comas",
        heading: "Columna a lista separada por comas",
      },
    ],
  },
  {
    code: "pt-br",
    htmlLang: "pt-BR",
    hreflang: "pt-BR",
    collatorLocale: "pt-BR",
    routes: [
      { pageKey: "home", path: "/pt-br/", heading: "Comparar listas online" },
      {
        pageKey: "alphabetizeList",
        path: "/pt-br/ordem-alfabetica",
        heading: "Colocar lista em ordem alfabética online",
      },
      {
        pageKey: "randomizeList",
        path: "/pt-br/embaralhar-lista",
        heading: "Embaralhar lista online",
      },
      {
        pageKey: "removeDuplicateLines",
        path: "/pt-br/remover-linhas-duplicadas",
        heading: "Remover linhas duplicadas online",
      },
      { pageKey: "tools", path: "/pt-br/ferramentas" },
      { pageKey: "about", path: "/pt-br/sobre" },
      { pageKey: "privacy", path: "/pt-br/privacidade" },
      {
        pageKey: "randomTeamGenerator",
        path: "/pt-br/sorteador-de-times",
        heading: "Sorteador de Times e Equipes",
      },
      {
        pageKey: "randomPairGenerator",
        path: "/pt-br/sorteador-de-duplas",
        heading: "Sorteador de Duplas",
      },
      {
        pageKey: "removeLineBreaks",
        path: "/pt-br/remover-quebras-de-linha",
        heading: "Remover Quebras de Linha",
      },
      {
        pageKey: "columnToCommaSeparatedList",
        path: "/pt-br/coluna-lista-separada-por-virgulas",
        heading: "Coluna para Lista Separada por Vírgulas",
      },
    ],
  },
  {
    code: "ru",
    htmlLang: "ru",
    hreflang: "ru",
    collatorLocale: "ru",
    routes: [
      { pageKey: "home", path: "/ru/", heading: "Сравнить два списка онлайн" },
      {
        pageKey: "alphabetizeList",
        path: "/ru/sortirovat-spisok-po-alfavitu",
        heading: "Сортировать список по алфавиту онлайн",
      },
      {
        pageKey: "randomizeList",
        path: "/ru/peremeshat-spisok",
        heading: "Перемешать список онлайн",
      },
      {
        pageKey: "removeDuplicateLines",
        path: "/ru/udalit-dublikaty-strok",
        heading: "Удалить дубликаты строк онлайн",
      },
      { pageKey: "tools", path: "/ru/instrumenty" },
      { pageKey: "about", path: "/ru/o-proekte" },
      { pageKey: "privacy", path: "/ru/konfidencialnost" },
      {
        pageKey: "randomTeamGenerator",
        path: "/ru/generator-sluchaynyh-komand",
        heading: "Генератор случайных команд",
      },
      {
        pageKey: "randomPairGenerator",
        path: "/ru/generator-sluchaynyh-par",
        heading: "Генератор случайных пар",
      },
      {
        pageKey: "removeLineBreaks",
        path: "/ru/ubrat-perenosy-strok",
        heading: "Убрать переносы строк",
      },
      {
        pageKey: "columnToCommaSeparatedList",
        path: "/ru/stolbec-v-spisok-cherez-zapyatuyu",
        heading: "Столбец в список через запятую",
      },
    ],
  },
] as const;

const EXPECTED_HREFLANGS = ["de", "en", "es", "fr", "pt-BR", "ru", "x-default"];

function routeFor(
  localeCode: string,
  pageKey: RouteIdentity,
): RouteExpectation {
  const locale = LOCALES.find((candidate) => candidate.code === localeCode);
  const route = locale?.routes.find(
    (candidate) => candidate.pageKey === pageKey,
  );
  if (!route) {
    throw new Error(`Missing ${localeCode}/${pageKey} route in E2E contract`);
  }
  return route;
}

test("publishes the complete 66-route localization matrix with reciprocal SEO signals", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "matrix contract runs once",
  );

  expect(LOCALES.flatMap((locale) => locale.routes)).toHaveLength(66);

  for (const locale of LOCALES) {
    for (const route of locale.routes) {
      const response = await page.goto(route.path);
      expect(response?.status(), `${locale.code} ${route.path}`).toBe(200);

      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        locale.htmlLang,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new URL(route.path, "https://listcontrast.com").href,
      );

      const alternates = page.locator('link[rel="alternate"][hreflang]');
      await expect(alternates).toHaveCount(7);
      const hreflangs = await alternates.evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("hreflang"))
          .filter((value): value is string => value !== null)
          .sort(),
      );
      expect(hreflangs).toEqual(EXPECTED_HREFLANGS);

      await expect(
        page.locator('link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveAttribute(
        "href",
        new URL(routeFor("en", route.pageKey).path, "https://listcontrast.com")
          .href,
      );

      const currentLanguageLink = page.locator(
        '.language-switcher a[aria-current="page"]',
      );
      await expect(currentLanguageLink).toHaveCount(1);
      await expect(currentLanguageLink).toHaveAttribute("href", route.path);
      await expect(currentLanguageLink).toHaveAttribute(
        "hreflang",
        locale.hreflang,
      );

      if (route.heading) {
        await expect(page.locator("h1")).toHaveText(route.heading);
      }

      if (route.pageKey === "alphabetizeList") {
        await expect(page.locator("[data-alphabetize-tool]")).toHaveAttribute(
          "data-collator-locale",
          locale.collatorLocale,
        );
      }

      if (route.pageKey === "home") {
        const schemas = page.locator('script[type="application/ld+json"]');
        await expect(schemas).toHaveCount(locale.code === "en" ? 1 : 0);
      }
    }
  }
});

test("wires Russian browser behavior to localized examples and collation", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "behavior contract runs once",
  );

  await page.goto("/ru/sortirovat-spisok-po-alfavitu");
  await expect(page.locator("[data-alphabetize-tool]")).toHaveAttribute(
    "data-collator-locale",
    "ru",
  );
  await page.locator("[data-alphabetize-tool] [data-load-example]").click();
  await expect(
    page.locator("[data-alphabetize-tool] [data-list-input]"),
  ).toHaveValue("Ёлка\nАрбуз\nЯблоко\nБерёза\nЭлемент 10\nЭлемент 2");

  await page.goto("/ru/peremeshat-spisok");
  await page.locator("[data-randomize-tool] [data-load-example]").click();
  await expect(
    page.locator("[data-randomize-tool] [data-list-input]"),
  ).toHaveValue("Анна\nБорис\nВера\nГлеб\nДарья");

  await page.goto("/ru/udalit-dublikaty-strok");
  await page
    .locator("[data-remove-duplicate-lines-tool] [data-load-example]")
    .click();
  await expect(
    page.locator("[data-remove-duplicate-lines-tool] [data-list-input]"),
  ).toHaveValue("Москва\nКазань\nМосква\nПермь\nказань");
});

test("keeps the localized language switcher usable without narrow-page overflow", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-chromium",
    "narrow-layout contract runs once",
  );

  await page.goto("/ru/generator-sluchaynyh-komand");
  const summary = page.locator(".language-switcher summary");
  await expect(summary).toBeVisible();
  await summary.click();
  await expect(page.locator(".language-switcher nav a")).toHaveCount(6);

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
