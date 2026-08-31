import { expect, test } from "@playwright/test";

test.describe("Compare Lists narrow result navigation", () => {
  test.use({
    viewport: { width: 320, height: 812 },
    isMobile: true,
    hasTouch: true,
  });

  test("keeps every result tab discoverable without horizontal page overflow", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("List A").fill("alpha\nbeta");
    await page.getByLabel("List B").fill("beta\ngamma");

    const tablist = page.locator("[data-result-tabs]");
    await expect(tablist).toBeVisible();

    const tablistBox = await tablist.boundingBox();
    expect(tablistBox).not.toBeNull();
    expect(tablistBox!.height).toBeGreaterThan(44);

    const tabs = tablist.getByRole("tab");
    await expect(tabs).toHaveCount(5);
    for (let index = 0; index < 5; index += 1) {
      const box = await tabs.nth(index).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    }

    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe("homepage WebSite structured data", () => {
  test("publishes one production WebSite entity only on the homepage", async ({
    page,
  }) => {
    await page.goto("/");

    const schemas = page.locator('script[type="application/ld+json"]');
    await expect(schemas).toHaveCount(1);
    const raw = await schemas.first().textContent();
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: "https://listcontrast.com/",
      name: "ListContrast",
    });

    await page.goto("/alphabetize-list");
    await expect(
      page.locator('script[type="application/ld+json"]'),
    ).toHaveCount(0);
  });
});
