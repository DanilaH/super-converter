import { expect, test } from "@playwright/test";

const SINGLE_LIST_ROUTES = [
  "/alphabetize-list",
  "/randomize-list",
  "/remove-duplicate-lines",
] as const;

test.describe("desktop page shell", () => {
  test.use({
    viewport: { width: 1600, height: 900 },
    isMobile: false,
    hasTouch: false,
  });

  test("keeps the site centered with the intended max width and gutters", async ({
    page,
  }) => {
    await page.goto("/");

    const header = await page.locator("header.header").boundingBox();
    const main = await page.locator("main.main").boundingBox();

    expect(header).not.toBeNull();
    expect(main).not.toBeNull();
    expect(header!.width).toBe(1200);
    expect(main!.width).toBe(1200);
    expect(header!.x).toBe(200);
    expect(main!.x).toBe(200);

    const shellStyles = await page.locator("body.shell").evaluate((element) => {
      const shell = getComputedStyle(element);
      const header = getComputedStyle(document.querySelector("header.header")!);

      return {
        shellDisplay: shell.display,
        shellDirection: shell.flexDirection,
        headerDisplay: header.display,
        headerJustify: header.justifyContent,
      };
    });

    expect(shellStyles).toEqual({
      shellDisplay: "flex",
      shellDirection: "column",
      headerDisplay: "flex",
      headerJustify: "space-between",
    });
  });
});

test.describe("narrow single-list result toolbars", () => {
  test.use({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });

  for (const route of SINGLE_LIST_ROUTES) {
    test(`${route} keeps the result label above export actions`, async ({
      page,
    }) => {
      await page.goto(route);

      const title = page.locator("[data-result-count]").locator("..");
      const actions = page.locator("[data-copy-result]").locator("..");
      const titleBox = await title.boundingBox();
      const actionsBox = await actions.boundingBox();

      expect(titleBox).not.toBeNull();
      expect(actionsBox).not.toBeNull();
      expect(titleBox!.width).toBeGreaterThan(250);
      expect(actionsBox!.y).toBeGreaterThanOrEqual(
        titleBox!.y + titleBox!.height,
      );

      const hasHorizontalOverflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect(hasHorizontalOverflow).toBe(false);
    });
  }
});

test.describe("Compare Lists narrow-tablet layout", () => {
  test.use({
    viewport: { width: 700, height: 800 },
    isMobile: false,
    hasTouch: true,
  });

  test("keeps both inputs side by side with usable touch controls", async ({
    page,
  }) => {
    await page.goto("/");

    const listA = await page.getByLabel("List A").boundingBox();
    const listB = await page.getByLabel("List B").boundingBox();
    const example = await page
      .getByRole("button", { name: "Try example" })
      .boundingBox();

    expect(listA).not.toBeNull();
    expect(listB).not.toBeNull();
    expect(example).not.toBeNull();
    expect(Math.abs(listA!.y - listB!.y)).toBeLessThan(1);
    expect(listA!.width).toBeGreaterThan(260);
    expect(listB!.width).toBeGreaterThan(260);
    expect(listB!.x).toBeGreaterThan(listA!.x + listA!.width);
    expect(example!.height).toBeGreaterThanOrEqual(44);

    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe("Compare Lists upper narrow-tablet edge", () => {
  test.use({
    viewport: { width: 759, height: 800 },
    isMobile: false,
    hasTouch: false,
  });

  test("keeps both input fields aligned before the desktop breakpoint", async ({
    page,
  }) => {
    await page.goto("/");

    const listA = await page.getByLabel("List A").boundingBox();
    const listB = await page.getByLabel("List B").boundingBox();

    expect(listA).not.toBeNull();
    expect(listB).not.toBeNull();
    expect(Math.abs(listA!.y - listB!.y)).toBeLessThan(1);

    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe("Compare Lists below the narrow-tablet breakpoint", () => {
  test.use({
    viewport: { width: 679, height: 800 },
    isMobile: false,
    hasTouch: true,
  });

  test("stacks the two source lists vertically", async ({ page }) => {
    await page.goto("/");

    const listA = await page.getByLabel("List A").boundingBox();
    const listB = await page.getByLabel("List B").boundingBox();

    expect(listA).not.toBeNull();
    expect(listB).not.toBeNull();
    expect(listB!.y).toBeGreaterThan(listA!.y + listA!.height);
  });
});
