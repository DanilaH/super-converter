import { describe, expect, it } from "vitest";
import { ACTIVE_LOCALES, LOCALE_CONFIGS } from "./locales";
import { activeIndexablePaths, ROUTES, routeFor } from "./routes";
import { PAGE_KEYS } from "./types";

describe("localization routes", () => {
  it("activates the complete Localization V1 locale set", () => {
    expect(ACTIVE_LOCALES).toEqual(["en", "de", "fr", "es", "pt-br", "ru"]);
    expect(activeIndexablePaths()).toHaveLength(42);
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

  it("has a complete and collision-free route matrix", () => {
    const allPaths = Object.values(ROUTES).flatMap((routes) =>
      PAGE_KEYS.map((pageKey) => routes[pageKey]),
    );

    expect(allPaths).toHaveLength(42);
    expect(new Set(allPaths).size).toBe(42);

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

  it("maps Russian acquisition pages to one canonical intent URL each", () => {
    expect(routeFor("ru", "home")).toBe("/ru/");
    expect(routeFor("ru", "alphabetizeList")).toBe(
      "/ru/sortirovat-spisok-po-alfavitu",
    );
    expect(routeFor("ru", "randomizeList")).toBe("/ru/peremeshat-spisok");
    expect(routeFor("ru", "removeDuplicateLines")).toBe(
      "/ru/udalit-dublikaty-strok",
    );
  });
});
