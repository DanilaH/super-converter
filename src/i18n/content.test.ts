import { describe, expect, it } from "vitest";
import { contentFor } from "./content";

describe("English localization baseline", () => {
  const content = contentFor("en");

  it("preserves acquisition titles and headings", () => {
    expect(content.metadata.home.title).toBe(
      "Compare Two Lists Online — Find Differences & Matches",
    );
    expect(content.home.heading).toBe("Compare Lists Online");

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
