import { expect, test } from "@playwright/test";

const SINGLE_LIST_ROUTES = [
  "/alphabetize-list",
  "/randomize-list",
  "/remove-duplicate-lines",
] as const;

test.describe("single-list workspace consistency", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const route of SINGLE_LIST_ROUTES) {
    test(`${route} keeps input geometry stable and places results below controls`, async ({
      page,
    }) => {
      await page.goto(route);

      const input = page.getByRole("textbox", { name: "List", exact: true });
      const example = page.getByRole("button", { name: "Try example" });
      const clear = page.getByRole("button", { name: "Clear" });
      const options = page.locator(".controls");
      const resultSection = page.locator(".result-section");

      const inputBefore = await input.boundingBox();
      const exampleBox = await example.boundingBox();
      const clearBox = await clear.boundingBox();
      const optionsBox = await options.boundingBox();
      const resultBox = await resultSection.boundingBox();

      expect(inputBefore).not.toBeNull();
      expect(exampleBox).not.toBeNull();
      expect(clearBox).not.toBeNull();
      expect(optionsBox).not.toBeNull();
      expect(resultBox).not.toBeNull();
      expect(Math.abs(exampleBox!.y - clearBox!.y)).toBeLessThan(1);
      expect(optionsBox!.y).toBeGreaterThanOrEqual(
        inputBefore!.y + inputBefore!.height,
      );
      expect(resultBox!.y).toBeGreaterThanOrEqual(
        optionsBox!.y + optionsBox!.height,
      );

      if (route === "/randomize-list") {
        await input.fill("Alpha\nBravo\nCharlie");
        await page
          .getByRole("button", { name: "Randomize", exact: true })
          .click();
      } else {
        await example.click();
      }

      const inputAfter = await input.boundingBox();
      expect(inputAfter).not.toBeNull();
      expect(Math.abs(inputAfter!.x - inputBefore!.x)).toBeLessThan(1);
      expect(Math.abs(inputAfter!.y - inputBefore!.y)).toBeLessThan(1);
      expect(Math.abs(inputAfter!.width - inputBefore!.width)).toBeLessThan(1);
      expect(Math.abs(inputAfter!.height - inputBefore!.height)).toBeLessThan(
        1,
      );

      const hasHorizontalOverflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect(hasHorizontalOverflow).toBe(false);
    });
  }

  test("Randomize keeps the same label and width after every shuffle", async ({
    page,
  }) => {
    await page.goto("/randomize-list");
    await page
      .getByRole("textbox", { name: "List", exact: true })
      .fill("Alpha\nBravo\nCharlie\nDelta");

    const action = page.getByRole("button", {
      name: "Randomize",
      exact: true,
    });
    const before = await action.boundingBox();
    expect(before).not.toBeNull();

    await action.click();
    await expect(action).toHaveText("Randomize");
    const afterFirst = await action.boundingBox();
    expect(afterFirst).not.toBeNull();
    expect(Math.abs(afterFirst!.width - before!.width)).toBeLessThan(1);

    await action.click();
    await expect(action).toHaveText("Randomize");
    const afterSecond = await action.boundingBox();
    expect(afterSecond).not.toBeNull();
    expect(Math.abs(afterSecond!.width - before!.width)).toBeLessThan(1);
  });
});

test("Compare ignores surrounding whitespace for both lists while preserving raw result text", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("checkbox", { name: "Ignore surrounding whitespace" }),
  ).toBeChecked();

  await page.getByLabel("List A").fill("Cherry");
  await page.getByLabel("List B").fill("   Cherry   ");

  await expect(page.locator("[data-summary-matches]")).toHaveText("1");
  await expect(page.locator("[data-summary-only-a]")).toHaveText("0");
  await expect(page.locator("[data-summary-only-b]")).toHaveText("0");

  await page.getByRole("tab", { name: "Matches" }).click();
  await expect(page.locator("[data-result-viewer]")).toHaveText("Cherry");

  await page
    .getByRole("checkbox", { name: "Ignore surrounding whitespace" })
    .uncheck();

  await expect(page.locator("[data-summary-matches]")).toHaveText("0");
  await expect(page.locator("[data-summary-only-a]")).toHaveText("1");
  await expect(page.locator("[data-summary-only-b]")).toHaveText("1");
});

test("duplicate removal treats surrounding whitespace as identity only when trimming is off", async ({
  page,
}) => {
  await page.goto("/remove-duplicate-lines");
  const input = page.getByRole("textbox", { name: "List", exact: true });
  const trim = page.getByRole("checkbox", {
    name: "Trim surrounding whitespace",
  });

  await input.fill("Cherry\n   Cherry   ");
  await expect(page.locator("[data-summary-unique]")).toHaveText("Unique: 1");
  await expect(page.locator("[data-result-viewer]")).toHaveText("Cherry");

  await trim.uncheck();
  await expect(page.locator("[data-summary-unique]")).toHaveText("Unique: 2");
  await expect(page.locator("[data-result-viewer]")).toHaveText(
    "Cherry\n   Cherry   ",
  );
});
