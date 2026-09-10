import { describe, expect, it } from "vitest";
import { ACTIVE_LOCALES, type ActiveLocale } from "./locales";
import { contentFor } from "./content";
import { SITE_TOOL_PAGE_KEYS } from "./types";

describe("English localization baseline", () => {
  const content = contentFor("en");

  it("uses the approved Expansion V2 homepage acquisition copy", () => {
    expect(content.metadata.home.title).toBe(
      "Compare Lists Online — List Difference & Matches | ListContrast",
    );
    expect(content.metadata.home.description).toContain("list differences");
    expect(content.home.heading).toBe("Compare Lists Online");
    expect(content.home.description).toContain("Compare two lists");
    expect(content.home.description).toContain("intersection and union");
  });

  it("keeps mathematical result terminology conditional on deduplicated mode", () => {
    expect(content.editorial.resultsHeading).toBe(
      "List comparison results explained",
    );
    expect(content.editorial.resultsIntro).toContain(
      "With Remove duplicates enabled",
    );
    expect(content.editorial.resultsIntro).toContain("multiset");
    expect(
      content.editorial.resultsItems.find((item) => item.term === "Matches")
        ?.description,
    ).toContain("with duplicates removed, this is the intersection");
    expect(
      content.editorial.resultsItems.find((item) => item.term === "All")
        ?.description,
    ).toContain("with duplicates removed, this is the union");
  });

  it("preserves the shipped acquisition titles and headings for existing secondary tools", () => {
    expect(content.metadata.alphabetizeList.title).toBe(
      "Alphabetizer — Alphabetize a List Online | ListContrast",
    );
    expect(content.alphabetizeList.page.heading).toBe(
      "Alphabetize a List Online",
    );
    expect(content.metadata.randomizeList.title).toBe(
      "List Randomizer — Randomize a List Online | ListContrast",
    );
    expect(content.randomizeList.page.heading).toBe("List Randomizer");
    expect(content.metadata.removeDuplicateLines.title).toBe(
      "Remove Duplicate Lines Online | ListContrast",
    );
    expect(content.removeDuplicateLines.page.heading).toBe(
      "Remove Duplicate Lines",
    );
  });

  it("publishes all eight tools and current About copy", () => {
    expect(SITE_TOOL_PAGE_KEYS).toHaveLength(8);
    expect(Object.keys(content.toolsPage.items)).toHaveLength(8);
    expect(content.toolsPage.items.randomTeamGenerator.label).toBe(
      "Random Team Generator",
    );
    expect(content.toolsPage.items.removeLineBreaks.label).toBe(
      "Remove Line Breaks",
    );
    expect(content.about.paragraphs.join(" ")).toContain(
      "balanced team generation",
    );
    expect(content.about.paragraphs.join(" ")).toContain(
      "column-to-delimiter conversion",
    );
  });

  it("preserves support-page metadata and privacy labels", () => {
    expect(content.metadata.tools.title).toBe("List Tools | ListContrast");
    expect(content.toolsPage.heading).toBe("List tools");
    expect(content.about.heading).toBe("About ListContrast");
    expect(content.privacy.heading).toBe("Privacy");
    expect(content.header).toEqual({
      ariaLabel: "Primary",
      tools: "Tools",
      about: "About",
      language: "Language",
    });
  });

  it("preserves the existing privacy claim boundary", () => {
    expect(content.home.privacy).toBe("Processed locally in your browser.");
    expect(content.privacy.sections[2]?.heading).toBe(
      "Advertising and analytics",
    );
    expect(content.privacy.sections[2]?.paragraphs[0]).toContain(
      "does not use advertising scripts",
    );
  });
});

const EXPANSION_HEADINGS = {
  en: [
    "Random Team & Group Generator",
    "Random Pair Generator",
    "Remove Line Breaks",
    "Column to Comma Separated List",
  ],
  de: [
    "Zufälliger Teamgenerator",
    "Zufällige Paare bilden",
    "Zeilenumbrüche entfernen",
    "Spalte in kommagetrennte Liste",
  ],
  fr: [
    "Générateur d’équipes aléatoires",
    "Générateur de paires aléatoires",
    "Supprimer les sauts de ligne",
    "Convertir une colonne en liste séparée par des virgules",
  ],
  es: [
    "Generador de equipos aleatorios",
    "Generador de parejas aleatorias",
    "Eliminar saltos de línea",
    "Columna a lista separada por comas",
  ],
  "pt-br": [
    "Sorteador de Times e Equipes",
    "Sorteador de Duplas",
    "Remover Quebras de Linha",
    "Coluna para Lista Separada por Vírgulas",
  ],
  ru: [
    "Генератор случайных команд",
    "Генератор случайных пар",
    "Убрать переносы строк",
    "Столбец в список через запятую",
  ],
} as const satisfies Record<ActiveLocale, readonly string[]>;

describe("localized content", () => {
  it("provides complete core and expansion content for every active locale", () => {
    for (const locale of ACTIVE_LOCALES) {
      const content = contentFor(locale);
      expect(content.siteName).toBe("ListContrast");
      expect(content.home.heading.length).toBeGreaterThan(0);
      expect(content.alphabetizeList.tool.example.length).toBeGreaterThan(0);
      expect(content.randomTeamGenerator.tool.example.length).toBeGreaterThan(0);
      expect(content.randomPairGenerator.tool.example.length).toBeGreaterThan(0);
      expect(content.removeLineBreaks.tool.example.length).toBeGreaterThan(0);
      expect(content.columnToCommaSeparatedList.tool.example.length).toBeGreaterThan(0);
      expect(content.header.language.length).toBeGreaterThan(0);
      expect(content.metadata.privacy.description.length).toBeGreaterThan(0);
      expect(Object.keys(content.toolsPage.items)).toHaveLength(8);
    }
  });

  it("uses the approved localized Expansion V2 acquisition headings", () => {
    for (const locale of ACTIVE_LOCALES) {
      const content = contentFor(locale);
      expect([
        content.randomTeamGenerator.page.heading,
        content.randomPairGenerator.page.heading,
        content.removeLineBreaks.page.heading,
        content.columnToCommaSeparatedList.page.heading,
      ]).toEqual(EXPANSION_HEADINGS[locale]);
    }
  });

  it("uses the approved Russian core acquisition wording", () => {
    const content = contentFor("ru");
    expect(content.home.heading).toBe("Сравнить два списка онлайн");
    expect(content.alphabetizeList.page.heading).toBe(
      "Сортировать список по алфавиту онлайн",
    );
    expect(content.randomizeList.page.heading).toBe("Перемешать список онлайн");
    expect(content.removeDuplicateLines.page.heading).toBe(
      "Удалить дубликаты строк онлайн",
    );
    expect(content.compare.rows).toBe("стр.");
    expect(content.compare.items).toBe("элем.");
  });
});
