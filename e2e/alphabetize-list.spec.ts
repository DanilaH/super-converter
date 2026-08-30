import { expect, test } from "@playwright/test";

test("alphabetizes a list live and changes order", async ({ page }) => {
  await page.goto("/alphabetize-list");

  await expect(
    page.getByRole("heading", { level: 1, name: "Alphabetize a List Online" }),
  ).toBeVisible();

  const input = page.getByLabel("List");
  const viewer = page.locator("[data-result-viewer]");

  await input.fill("item 10\nBanana\nitem 2\napple");
  await expect(viewer).toHaveText("apple\nBanana\nitem 2\nitem 10");

  await page.getByLabel("Order").selectOption("desc");
  await expect(viewer).toHaveText("item 10\nitem 2\nBanana\napple");

  await expect(page.getByRole("button", { name: "Copy" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Download" })).toBeEnabled();
});

test("new tool routes and navigation are crawlable without horizontal overflow", async ({
  page,
}) => {
  for (const path of ["/", "/alphabetize-list", "/tools", "/about", "/privacy"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  }

  await page.goto("/tools");
  await expect(page.getByRole("link", { name: "Compare Lists" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(page.getByRole("link", { name: "Alphabetizer" })).toHaveAttribute(
    "href",
    "/alphabetize-list",
  );
});

test("alphabetizer exposes canonical metadata and download filename", async ({ page }) => {
  await page.goto("/alphabetize-list");

  await expect(page).toHaveTitle(
    "Alphabetizer — Alphabetize a List Online | ListContrast",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/alphabetize-list$/,
  );

  await page.getByLabel("List").fill("B\nA");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("alphabetized-list.txt");
});
