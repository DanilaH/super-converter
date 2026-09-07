import { describe, expect, it } from "vitest";
import { ACTIVE_LOCALES, LOCALE_CONFIGS } from "./locales";
import { activeIndexablePaths, ROUTES, routeFor } from "./routes";
import { PAGE_KEYS } from "./types";

describe("localization foundation", () => {
  it("keeps only English active during L10N-1", () => {
    expect(ACTIVE_LOCALES).toEqual(["en"]);
    expect(activeIndexablePaths()).toEqual([
      "/",
      "/alphabetize-list",
      "/randomize-list",
      "/remove-duplicate-lines",
      "/tools",
      "/about",
      "/privacy",
    ]);
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

  it("has a complete and collision-free planned route matrix", () => {
    const allPaths = Object.values(ROUTES).flatMap((routes) =>
      PAGE_KEYS.map((pageKey) => routes[pageKey]),
    );

    expect(allPaths).toHaveLength(35);
    expect(new Set(allPaths).size).toBe(35);

    for (const routes of Object.values(ROUTES)) {
      for (const pageKey of PAGE_KEYS) {
        expect(routes[pageKey]).toBeTruthy();
      }
    }
  });

  it("uses language-only DE/FR/ES and regional PT-BR targeting", () => {
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
  });
});
