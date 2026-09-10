import { test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("audit-screenshots");

async function shot(page: import("@playwright/test").Page, project: string, name: string) {
  await fs.mkdir(path.join(outDir, project), { recursive: true });
  await page.screenshot({
    path: path.join(outDir, project, `${name}.png`),
    fullPage: true,
  });
}

test.describe("temporary rendered audit", () => {
  test("homepage and tools hub", async ({ page }, testInfo) => {
    await page.goto("/");
    await shot(page, testInfo.project.name, "home");

    await page.goto("/tools");
    await shot(page, testInfo.project.name, "tools");
  });

  test("new tools with useful result states", async ({ page }, testInfo) => {
    await page.goto("/random-team-generator");
    await page.locator("[data-random-team-tool] [data-load-example]").click();
    await page.locator("[data-random-team-tool] [data-generate]").click();
    await shot(page, testInfo.project.name, "random-team-result");

    await page.goto("/random-pair-generator");
    await page.locator("[data-random-pair-tool] [data-load-example]").click();
    await page.locator("[data-random-pair-tool] [data-generate]").click();
    await shot(page, testInfo.project.name, "random-pair-result");

    await page.goto("/remove-line-breaks");
    await page.locator("[data-remove-line-breaks-tool] [data-load-example]").click();
    await shot(page, testInfo.project.name, "remove-line-breaks-result");

    await page.goto("/column-to-comma-separated-list");
    await page.locator("[data-column-to-comma-tool] [data-load-example]").click();
    await shot(page, testInfo.project.name, "column-to-comma-result");
  });

  test("localized representative pages", async ({ page }, testInfo) => {
    await page.goto("/ru/generator-sluchaynyh-komand");
    await shot(page, testInfo.project.name, "ru-random-team");

    await page.goto("/pt-br/remover-quebras-de-linha");
    await shot(page, testInfo.project.name, "ptbr-remove-line-breaks");
  });
});
