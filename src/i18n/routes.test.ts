import { describe, expect, it } from "vitest";
import { ACTIVE_LOCALES, LOCALE_CONFIGS } from "./locales";
import { activeIndexablePaths, ROUTES, routeFor } from "./routes";
import { PAGE_KEYS } from "./types";

describe("localization routes", () => {
  it("activates the complete six-locale surface", () => {
    expect(ACTIVE_LOCALES).toEqual(["en", "de", "fr", "es", "pt-br", "ru"]);
    expect(PAGE_KEYS).toHaveLength(11);
    expect(activeIndexablePaths()).toHaveLength(66);
  });

  it("preserves the existing English route matrix", () => {
    expect(routeFor("en", "home")).toBe("/");
    expect(routeFor("en", "alphabetizeList")).toBe("/alphabetize-list");
    expect(routeFor("en", "randomizeList")).toBe("/randomize-list");
    expect(routeFor("en", "removeDuplicateLines")).toBe(
      "/remove-duplicate-lines",
    );
    expect(routeFor("en", "tools")).toBe("/tools");
    expect(routeFor("en", "about")).toBe("/about");
    expect(routeFor("en", "privacy")).toBe("/privacy");
  });

  it("maps the four Expansion V2 English intents to one canonical route each", () => {
    expect(routeFor("en", "randomTeamGenerator")).toBe(
      "/random-team-generator",
    );
    expect(routeFor("en", "randomPairGenerator")).toBe(
      "/random-pair-generator",
    );
    expect(routeFor("en", "removeLineBreaks")).toBe("/remove-line-breaks");
    expect(routeFor("en", "columnToCommaSeparatedList")).toBe(
      "/column-to-comma-separated-list",
    );
  });

  it("has a complete and collision-free route matrix", () => {
    const allPaths = Object.values(ROUTES).flatMap((routes) =>
      PAGE_KEYS.map((pageKey) => routes[pageKey]),
    );

    expect(allPaths).toHaveLength(66);
    expect(new Set(allPaths).size).toBe(66);

    for (const routes of Object.values(ROUTES)) {
      for (const pageKey of PAGE_KEYS) {
        expect(routes[pageKey]).toBeTruthy();
      }
    }
  });

  it("uses language-only DE/FR/ES/RU and regional PT-BR targeting", () => {
    expect(LOCALE_CONFIGS.de).toMatchObject({
      htmlLang: "de",
      hreflang: "de",
      collatorLocale: "de",
    });
    expect(LOCALE_CONFIGS.fr).toMatchObject({
      htmlLang: "fr",
      hreflang: "fr",
      collatorLocale: "fr",
    });
    expect(LOCALE_CONFIGS.es).toMatchObject({
      htmlLang: "es",
      hreflang: "es",
      collatorLocale: "es",
    });
    expect(LOCALE_CONFIGS["pt-br"]).toMatchObject({
      htmlLang: "pt-BR",
      hreflang: "pt-BR",
      collatorLocale: "pt-BR",
    });
    expect(LOCALE_CONFIGS.ru).toMatchObject({
      htmlLang: "ru",
      hreflang: "ru",
      collatorLocale: "ru",
    });
  });

  it("uses the approved localized Expansion V2 route registry", () => {
    expect(routeFor("de", "randomTeamGenerator")).toBe(
      "/de/zufaelliger-teamgenerator",
    );
    expect(routeFor("fr", "randomPairGenerator")).toBe(
      "/fr/generateur-paires-aleatoires",
    );
    expect(routeFor("es", "removeLineBreaks")).toBe(
      "/es/eliminar-saltos-de-linea",
    );
    expect(routeFor("pt-br", "columnToCommaSeparatedList")).toBe(
      "/pt-br/coluna-lista-separada-por-virgulas",
    );
    expect(routeFor("ru", "randomTeamGenerator")).toBe(
      "/ru/generator-sluchaynyh-komand",
    );
  });

  it("does not create rejected synonym routes", () => {
    const paths = activeIndexablePaths();
    expect(paths).not.toContain("/compare-lists");
    expect(paths).not.toContain("/list-diff");
    expect(paths).not.toContain("/random-group-generator");
    expect(paths).not.toContain("/remove-newlines");
    expect(paths).not.toContain("/new-line-remover");
  });
});
