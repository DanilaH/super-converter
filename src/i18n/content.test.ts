import { describe, expect, it } from "vitest";
import { ACTIVE_LOCALES } from "./locales";
import { contentFor } from "./content";

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

  it("preserves support-page metadata and labels", () => {
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

describe("localized content", () => {
  it("provides complete content for every active locale", () => {
    for (const locale of ACTIVE_LOCALES) {
      const content = contentFor(locale);
      expect(content.siteName).toBe("ListContrast");
      expect(content.home.heading.length).toBeGreaterThan(0);
      expect(content.alphabetizeList.tool.example.length).toBeGreaterThan(0);
      expect(content.header.language.length).toBeGreaterThan(0);
      expect(content.metadata.privacy.description.length).toBeGreaterThan(0);
    }
  });

  it("uses the approved Russian acquisition wording", () => {
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
    expect(content.alphabetizeList.tool.items).toBe("элем.");
    expect(content.randomizeList.tool.items).toBe("элем.");
    expect(content.removeDuplicateLines.tool.items).toBe("элем.");
  });
});
