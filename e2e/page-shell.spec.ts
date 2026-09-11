import { expect, test } from "@playwright/test";

test("desktop page shell keeps its layout constraints", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto("/");

  const shell = page.locator("body.shell");
  const header = page.locator("header.header");
  const main = page.locator("main.main");

  await expect(shell).toHaveCSS("display", "flex");
  await expect(shell).toHaveCSS("flex-direction", "column");
  await expect(header).toHaveCSS("display", "flex");
  await expect(header).toHaveCSS("justify-content", "space-between");
  await expect(main).toHaveCSS("max-width", "1200px");
  await expect(main).toHaveCSS("padding-left", "32px");
  await expect(main).toHaveCSS("padding-right", "32px");
});
