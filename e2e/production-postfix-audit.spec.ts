import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const axeSource = readFileSync("node_modules/axe-core/axe.min.js", "utf8");

const ROUTES = [
  "/",
  "/alphabetize-list",
  "/randomize-list",
  "/remove-duplicate-lines",
  "/random-team-generator",
  "/random-pair-generator",
  "/remove-line-breaks",
  "/column-to-comma-separated-list",
  "/tools",
  "/about",
  "/privacy",
] as const;

const HREFLANGS = ["en", "de", "fr", "es", "pt-BR", "ru", "x-default"];

function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

async function checkMetadata(page: Page, route: string) {
  const expectedCanonical = new URL(route, "https://listcontrast.com").href;
  const metadata = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    h1: document.querySelectorAll("h1").length,
    descriptions: document.querySelectorAll('meta[name="description"]').length,
    canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? null,
    ogUrl: document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.content ?? null,
    robots: document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content ?? "",
    hreflangs: Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]'))
      .map((node) => node.hreflang)
      .sort(),
    websiteJsonLd: Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'))
      .filter((node) => node.textContent?.includes('"@type":"WebSite"')).length,
  }));

  expect(metadata.lang).toBe("en");
  expect(metadata.h1).toBe(1);
  expect(metadata.descriptions).toBe(1);
  expect(metadata.canonical).toBe(expectedCanonical);
  expect(metadata.ogUrl).toBe(expectedCanonical);
  expect(metadata.robots.toLowerCase()).not.toContain("noindex");
  expect(metadata.hreflangs).toEqual([...HREFLANGS].sort());
  expect(metadata.websiteJsonLd).toBe(route === "/" ? 1 : 0);
}

async function checkNoOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
}

test.describe("production desktop shell and SEO", () => {
  test.use({ viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false });

  for (const route of ROUTES) {
    test(`${route} keeps the restored desktop shell`, async ({ page }, testInfo) => {
      const errors = collectPageErrors(page);
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await checkMetadata(page, route);
      await checkNoOverflow(page);

      const shell = await page.evaluate(() => {
        const main = document.querySelector<HTMLElement>("main.main")!;
        const header = document.querySelector<HTMLElement>("header.header")!;
        const mainRect = main.getBoundingClientRect();
        const headerStyle = getComputedStyle(header);
        const mainStyle = getComputedStyle(main);
        return {
          mainX: mainRect.x,
          mainWidth: mainRect.width,
          mainPaddingLeft: mainStyle.paddingLeft,
          mainPaddingRight: mainStyle.paddingRight,
          headerDisplay: headerStyle.display,
          headerJustify: headerStyle.justifyContent,
        };
      });

      expect(shell.mainWidth).toBeGreaterThan(1100);
      expect(shell.mainWidth).toBeLessThanOrEqual(1200.5);
      expect(shell.mainX).toBeGreaterThanOrEqual(39);
      expect(shell.mainPaddingLeft).toBe("32px");
      expect(shell.mainPaddingRight).toBe("32px");
      expect(shell.headerDisplay).toBe("flex");
      expect(shell.headerJustify).toBe("space-between");
      expect(errors, errors.join("\n")).toEqual([]);

      await page.screenshot({ path: testInfo.outputPath("desktop-viewport.png"), fullPage: false });
    });
  }
});

test.describe("production mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  for (const route of ROUTES) {
    test(`${route} has no mobile document overflow`, async ({ page }, testInfo) => {
      const errors = collectPageErrors(page);
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await checkMetadata(page, route);
      await checkNoOverflow(page);

      const padding = await page.locator("main.main").evaluate((node) => getComputedStyle(node).paddingLeft);
      expect(padding).toBe("16px");
      expect(errors, errors.join("\n")).toEqual([]);

      await page.screenshot({ path: testInfo.outputPath("mobile-viewport.png"), fullPage: false });
    });
  }
});

test("production security headers are present and nginx version is hidden", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  const headers = response!.headers();
  expect(headers["strict-transport-security"]).toBe("max-age=31536000");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["permissions-policy"]).toContain("geolocation=()");
  expect(headers["permissions-policy"]).toContain("microphone=()");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers.server).toBe("nginx");
  expect(headers.server).not.toMatch(/nginx\//i);
});

for (const route of ["/", "/random-team-generator", "/remove-line-breaks"] as const) {
  test(`axe A/AA sanity: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.addScriptTag({ content: axeSource });
    const violations = await page.evaluate(async () => {
      const axe = (window as typeof window & { axe: any }).axe;
      const result = await axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      });
      return result.violations.map((violation: any) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.length,
      }));
    });
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}
