import { expect, test } from "@playwright/test";

function sorted(values: string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

test.describe("Expansion V2 tools", () => {
  test("Random Team Generator balances by team count and target size", async ({
    page,
  }) => {
    await page.goto("/random-team-generator");
    const input = page.getByRole("textbox", { name: "Participants or items" });
    const names = Array.from(
      { length: 10 },
      (_, index) => `Person ${index + 1}`,
    );
    await input.fill(names.join("\n"));

    const value = page.getByRole("spinbutton", { name: "Number of teams" });
    await value.fill("3");
    await page.getByRole("button", { name: "Generate teams" }).click();

    const viewer = page.locator("[data-random-team-tool] [data-result-viewer]");
    await expect(viewer).toBeVisible();
    const teamCountText = await viewer.innerText();
    const teamBlocks = teamCountText.split("\n\n");
    expect(teamBlocks).toHaveLength(3);
    expect(
      teamBlocks.map((block) => block.split("\n").slice(1).length),
    ).toEqual([4, 3, 3]);
    expect(
      sorted(teamBlocks.flatMap((block) => block.split("\n").slice(1))),
    ).toEqual(sorted(names));

    await page.getByRole("radio", { name: "People per team" }).check();
    await expect(
      page.getByRole("spinbutton", { name: "People per team" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Generate teams" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Generate teams" }).click();
    const targetText = await viewer.innerText();
    const targetBlocks = targetText.split("\n\n");
    expect(targetBlocks).toHaveLength(4);
    expect(
      targetBlocks.map((block) => block.split("\n").slice(1).length),
    ).toEqual([3, 3, 2, 2]);
    expect(
      sorted(targetBlocks.flatMap((block) => block.split("\n").slice(1))),
    ).toEqual(sorted(names));
  });

  test("Random Team Generator rejects impossible team counts cleanly", async ({
    page,
  }) => {
    await page.goto("/random-team-generator");
    await page
      .getByRole("textbox", { name: "Participants or items" })
      .fill("A\nB\nC");
    await page
      .getByRole("spinbutton", { name: "Number of teams" })
      .fill("4");
    await page.getByRole("button", { name: "Generate teams" }).click();
    await expect(page.locator("[data-validation]")).toHaveText(
      "The number of teams cannot be greater than the number of items.",
    );
    await expect(
      page.locator("[data-random-team-tool] [data-result-viewer]"),
    ).toBeHidden();
  });

  test("Random Pair Generator keeps every occurrence and exposes the odd item", async ({
    page,
  }) => {
    await page.goto("/random-pair-generator");
    const names = ["Alex", "Blair", "Alex", "Drew", "Emery"];
    await page
      .getByRole("textbox", { name: "Participants or items" })
      .fill(names.join("\n"));
    await page.getByRole("button", { name: "Generate pairs" }).click();

    const text = await page
      .locator("[data-random-pair-tool] [data-result-viewer]")
      .innerText();
    expect(text.match(/^Pair \d+$/gm)).toHaveLength(2);
    expect(text).toContain("Unpaired");
    const values = text
      .split("\n")
      .filter(
        (line) =>
          line !== "" && !/^Pair \d+$/.test(line) && line !== "Unpaired",
      );
    expect(sorted(values)).toEqual(sorted(names));
  });

  test("Remove Line Breaks joins hard wraps while preserving paragraphs by default", async ({
    page,
  }) => {
    await page.goto("/remove-line-breaks");
    const input = page.getByRole("textbox", { name: "Text" });
    await input.fill(
      "First line\nsecond line\n\nNext paragraph\ncontinues here",
    );

    const viewer = page.locator(
      "[data-remove-line-breaks-tool] [data-result-viewer]",
    );
    await expect(viewer).toHaveText(
      "First line second line\n\nNext paragraph continues here",
    );

    await page
      .getByRole("checkbox", { name: "Keep paragraph breaks" })
      .uncheck();
    await expect(viewer).toHaveText(
      "First line second line Next paragraph continues here",
    );

    await page
      .getByRole("combobox", { name: "Replace line breaks with" })
      .selectOption("commaSpace");
    await expect(viewer).toHaveText(
      "First line, second line, Next paragraph, continues here",
    );
  });

  test("Column converter trims, ignores blanks, preserves duplicates and switches delimiter", async ({
    page,
  }) => {
    await page.goto("/column-to-comma-separated-list");
    const input = page.getByRole("textbox", { name: "Column" });
    await input.fill(" apple \n\nbanana\n apple ");

    const viewer = page.locator(
      "[data-column-to-comma-tool] [data-result-viewer]",
    );
    await expect(viewer).toHaveText("apple, banana, apple");
    await expect(
      page.locator("[data-column-to-comma-tool] [data-result-count]"),
    ).toHaveText("3 items");

    await page
      .getByRole("combobox", { name: "Separator" })
      .selectOption("pipe");
    await expect(viewer).toHaveText("apple|banana|apple");

    await page
      .getByRole("combobox", { name: "Separator" })
      .selectOption("custom");
    const custom = page.getByRole("textbox", { name: "Custom separator" });
    await custom.fill(" / ");
    await expect(viewer).toHaveText("apple / banana / apple");
  });

  test("custom separator controls stay hidden until Custom is selected", async ({
    page,
  }) => {
    for (const route of [
      "/remove-line-breaks",
      "/column-to-comma-separated-list",
    ]) {
      await page.goto(route);
      const customRow = page.locator("[data-custom-row]");
      await expect(customRow).toBeHidden();
      await page.locator("[data-separator]").selectOption("custom");
      await expect(customRow).toBeVisible();
    }
  });

  test("result viewers keep list outputs unwrapped and prose output wrapped", async ({
    page,
  }) => {
    for (const route of [
      "/random-team-generator",
      "/random-pair-generator",
      "/column-to-comma-separated-list",
    ]) {
      await page.goto(route);
      await expect(page.locator("[data-result-viewer]")).toHaveCSS(
        "white-space",
        "pre",
      );
    }

    await page.goto("/remove-line-breaks");
    await expect(page.locator("[data-result-viewer]")).toHaveCSS(
      "white-space",
      "pre-wrap",
    );
  });

  test("Random Pair Generator keeps its action row compact", async ({
    page,
  }) => {
    await page.goto("/random-pair-generator");
    const controls = page.locator("[data-random-pair-tool] .controls");
    await expect(controls).toHaveCSS("padding-left", "0px");
    await expect(
      page.locator("[data-random-pair-tool] .validation-message"),
    ).toBeHidden();
  });

  test("localized expansion tool ships localized controls rather than English fallback", async ({
    page,
  }) => {
    await page.goto("/ru/generator-sluchaynyh-par");
    await expect(page.locator("h1")).toHaveText("Генератор случайных пар");
    await page.locator("[data-random-pair-tool] [data-load-example]").click();
    await expect(
      page.locator("[data-random-pair-tool] [data-list-input]"),
    ).not.toHaveValue("");
    await expect(
      page.locator("[data-random-pair-tool] [data-generate]"),
    ).not.toHaveText("Generate pairs");
  });
});
