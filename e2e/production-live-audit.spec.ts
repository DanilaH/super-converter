import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const PROD = "https://listcontrast.com";
const EXPECTED_HREFLANGS = ["de", "en", "es", "fr", "pt-BR", "ru", "x-default"];
const EN_TOOL_PATHS = [
  "/",
  "/alphabetize-list",
  "/randomize-list",
  "/remove-duplicate-lines",
  "/random-team-generator",
  "/random-pair-generator",
  "/remove-line-breaks",
  "/column-to-comma-separated-list",
] as const;
const EN_SITE_PATHS = [...EN_TOOL_PATHS, "/tools", "/about", "/privacy"] as const;
const SCREENSHOT_PATHS = EN_TOOL_PATHS;

const axeSource = readFileSync("node_modules/axe-core/axe.min.js", "utf8");

type PageSeo = {
  url: string;
  lang: string;
  title: string;
  description: string;
  canonical: string;
  ogUrl: string;
  robots: string;
  h1Count: number;
  h1Text: string;
  alternates: Record<string, string>;
  internalLinks: string[];
  mixedAssets: string[];
  hasWebsiteJsonLd: boolean;
};

type AxeViolation = {
  id: string;
  impact: string | null;
  help: string;
  nodes: Array<{ target: string[] }>;
};

function expectedLang(url: string): string {
  const pathname = new URL(url).pathname;
  if (pathname.startsWith("/de/")) return "de";
  if (pathname.startsWith("/fr/")) return "fr";
  if (pathname.startsWith("/es/")) return "es";
  if (pathname.startsWith("/pt-br/")) return "pt-BR";
  if (pathname.startsWith("/ru/")) return "ru";
  return "en";
}

function sitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function readSeo(page: Page, url: string): Promise<PageSeo> {
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  expect(response, url).not.toBeNull();
  expect(response!.status(), url).toBe(200);

  return page.evaluate((currentUrl) => {
    const canonical = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'),
    );
    const descriptions = Array.from(
      document.querySelectorAll<HTMLMetaElement>('meta[name="description"]'),
    );
    const ogUrls = Array.from(
      document.querySelectorAll<HTMLMetaElement>('meta[property="og:url"]'),
    );
    const robots = Array.from(
      document.querySelectorAll<HTMLMetaElement>('meta[name="robots"]'),
    );
    const h1s = Array.from(document.querySelectorAll<HTMLHeadingElement>("h1"));
    const alternates = Object.fromEntries(
      Array.from(
        document.querySelectorAll<HTMLLinkElement>(
          'link[rel="alternate"][hreflang]',
        ),
      ).map((link) => [link.hreflang, link.href]),
    );
    const internalLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a[href]"),
    )
      .map((link) => link.href)
      .filter((href) => href.startsWith("https://listcontrast.com/"));
    const mixedAssets = Array.from(
      document.querySelectorAll<HTMLElement>("script[src],link[href],img[src]"),
    )
      .map(
        (element) =>
          element.getAttribute("src") ?? element.getAttribute("href") ?? "",
      )
      .filter((value) => value.startsWith("http://"));
    const jsonLd = Array.from(
      document.querySelectorAll<HTMLScriptElement>(
        'script[type="application/ld+json"]',
      ),
    ).map((script) => script.textContent ?? "");

    if (canonical.length !== 1)
      throw new Error(`${currentUrl}: canonical count ${canonical.length}`);
    if (descriptions.length !== 1)
      throw new Error(
        `${currentUrl}: description count ${descriptions.length}`,
      );
    if (ogUrls.length !== 1)
      throw new Error(`${currentUrl}: og:url count ${ogUrls.length}`);
    if (robots.length > 1)
      throw new Error(`${currentUrl}: robots meta count ${robots.length}`);

    return {
      url: currentUrl,
      lang: document.documentElement.lang,
      title: document.title,
      description: descriptions[0].content,
      canonical: canonical[0].href,
      ogUrl: ogUrls[0].content,
      robots: robots[0]?.content ?? "",
      h1Count: h1s.length,
      h1Text: h1s[0]?.textContent?.trim() ?? "",
      alternates,
      internalLinks,
      mixedAssets,
      hasWebsiteJsonLd: jsonLd.some((value) => value.includes('"WebSite"')),
    };
  }, url);
}

test.describe("live production infrastructure + SEO", () => {
  test("66 canonical URLs, headers, robots, redirects and 404 are healthy", async ({
    request,
  }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"));

    const sitemap = await request.get(`${PROD}/sitemap.xml`);
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    const urls = sitemapUrls(xml);
    expect(urls).toHaveLength(66);
    expect(new Set(urls).size).toBe(66);

    for (const url of urls) {
      const response = await request.get(url);
      expect(response.status(), url).toBe(200);
      const headers = response.headers();
      expect(headers["content-type"], url).toContain("text/html");
      expect(headers["x-content-type-options"], url).toBe("nosniff");
      expect(headers["referrer-policy"], url).toBe(
        "strict-origin-when-cross-origin",
      );
      expect(headers["x-robots-tag"] ?? "", url).not.toMatch(/noindex/i);
    }

    const robots = await request.get(`${PROD}/robots.txt`);
    expect(robots.status()).toBe(200);
    const robotsText = await robots.text();
    expect(robotsText).toContain("User-agent: *");
    expect(robotsText).toContain("Allow: /");
    expect(robotsText).toContain(`Sitemap: ${PROD}/sitemap.xml`);

    const missing = await request.get(`${PROD}/__production-audit-missing__`);
    expect(missing.status()).toBe(404);
    const missingHtml = await missing.text();
    expect(missingHtml).toMatch(/name=["']robots["'][^>]+noindex,nofollow/i);
    expect(missingHtml).not.toMatch(/rel=["']canonical["']/i);
    expect(missingHtml).not.toMatch(/property=["']og:url["']/i);

    const www = await request.get("https://www.listcontrast.com/a-test-path", {
      maxRedirects: 0,
    });
    expect([301, 308]).toContain(www.status());
    expect(www.headers().location).toBe(`${PROD}/a-test-path`);

    const http = await request.get(
      "http://listcontrast.com/random-team-generator",
      {
        maxRedirects: 0,
      },
    );
    expect([301, 308]).toContain(http.status());
    expect(http.headers().location).toBe(`${PROD}/random-team-generator`);

    const home = await request.get(`${PROD}/`);
    const securityHeaders = home.headers();
    console.log(
      "PROD_SECURITY_HEADERS",
      JSON.stringify({
        server: securityHeaders.server ?? null,
        hsts: securityHeaders["strict-transport-security"] ?? null,
        csp: securityHeaders["content-security-policy"] ?? null,
        permissionsPolicy: securityHeaders["permissions-policy"] ?? null,
        coop: securityHeaders["cross-origin-opener-policy"] ?? null,
      }),
    );
  });

  test("all 66 pages have exact self-canonical SEO and reciprocal hreflang", async ({
    page,
    request,
  }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"));

    const sitemap = await request.get(`${PROD}/sitemap.xml`);
    const urls = sitemapUrls(await sitemap.text());
    const metadata = new Map<string, PageSeo>();
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error")
        consoleErrors.push(`${page.url()}: ${message.text()}`);
    });
    page.on("pageerror", (error) =>
      pageErrors.push(`${page.url()}: ${error.message}`),
    );

    for (const url of urls) {
      const seo = await readSeo(page, url);
      metadata.set(url, seo);
      expect(seo.lang, url).toBe(expectedLang(url));
      expect(seo.title.trim().length, url).toBeGreaterThan(10);
      expect(seo.description.trim().length, url).toBeGreaterThan(60);
      expect(seo.canonical, url).toBe(url);
      expect(seo.ogUrl, url).toBe(url);
      expect(seo.robots, url).not.toMatch(/noindex/i);
      expect(seo.h1Count, url).toBe(1);
      expect(seo.h1Text.length, url).toBeGreaterThan(2);
      expect(Object.keys(seo.alternates).sort(), url).toEqual(
        EXPECTED_HREFLANGS,
      );
      expect(seo.mixedAssets, url).toEqual([]);
      expect(JSON.stringify(seo), url).not.toMatch(
        /example\.com|preview\.listcontrast\.com/,
      );
    }

    const titles = [...metadata.values()].map((item) => item.title);
    const descriptions = [...metadata.values()].map((item) => item.description);
    expect(new Set(titles).size).toBe(66);
    expect(new Set(descriptions).size).toBe(66);

    for (const [url, seo] of metadata) {
      const currentLang = expectedLang(url);
      for (const [hreflang, target] of Object.entries(seo.alternates)) {
        expect(metadata.has(target), `${url} -> ${hreflang} ${target}`).toBe(
          true,
        );
        const targetSeo = metadata.get(target)!;
        expect(
          targetSeo.alternates[currentLang],
          `${target} back to ${url}`,
        ).toBe(url);
      }
    }

    const websiteJsonLdPages = [...metadata.values()]
      .filter((item) => item.hasWebsiteJsonLd)
      .map((item) => item.url);
    expect(websiteJsonLdPages).toEqual([`${PROD}/`]);

    const longTitles = [...metadata.values()]
      .filter((item) => item.title.length > 65)
      .map((item) => `${item.title.length} ${item.url} :: ${item.title}`);
    const unusualDescriptions = [...metadata.values()]
      .filter(
        (item) =>
          item.description.length < 110 || item.description.length > 170,
      )
      .map((item) => `${item.description.length} ${item.url}`);
    console.log("PROD_LONG_TITLES", JSON.stringify(longTitles));
    console.log(
      "PROD_UNUSUAL_DESCRIPTIONS",
      JSON.stringify(unusualDescriptions),
    );

    expect(consoleErrors, "browser console errors across 66 pages").toEqual([]);
    expect(pageErrors, "page errors across 66 pages").toEqual([]);
  });

  test("every internal link discovered across all 66 pages resolves", async ({
    page,
    request,
  }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"));

    const sitemap = await request.get(`${PROD}/sitemap.xml`);
    const urls = sitemapUrls(await sitemap.text());
    const links = new Set<string>();

    for (const url of urls) {
      const seo = await readSeo(page, url);
      for (const link of seo.internalLinks) {
        const parsed = new URL(link);
        parsed.hash = "";
        links.add(parsed.href);
      }
    }

    for (const url of [...links].sort()) {
      const response = await request.get(url);
      expect(response.status(), url).toBeLessThan(400);
    }

    console.log("PROD_INTERNAL_LINKS_CHECKED", links.size);
  });
});

test.describe("live production functional QA", () => {
  test("Compare and original utilities work", async ({ page }) => {
    await page.goto(`${PROD}/`);
    await expect(page.locator("h1")).toHaveText("Compare Lists Online");
    await expect(page).toHaveTitle(/List Difference/);
    await page.getByLabel("List A").fill("Alpha\nBeta\nonly-a");
    await page.getByLabel("List B").fill("alpha\nBeta\nonly-b");
    await page.getByRole("checkbox", { name: "Ignore case" }).check();
    await expect(page.locator("[data-summary-matches]")).toHaveText("2");
    await expect(page.locator("[data-summary-only-a]")).toHaveText("1");
    await expect(page.locator("[data-summary-only-b]")).toHaveText("1");

    await page.goto(`${PROD}/alphabetize-list`);
    const alphabetizeInput = page.getByRole("textbox", {
      name: "List",
      exact: true,
    });
    await alphabetizeInput.fill("zeta\nitem 10\nAlpha\nitem 2");
    await expect(page.locator("[data-result-viewer]")).toHaveText(
      "Alpha\nitem 2\nitem 10\nzeta",
    );

    await page.goto(`${PROD}/randomize-list`);
    const randomizeInput = page.getByRole("textbox", {
      name: "List",
      exact: true,
    });
    await randomizeInput.fill("A\nB\nC\nD");
    await page.getByRole("button", { name: "Randomize", exact: true }).click();
    const randomized = (
      await page.locator("[data-result-viewer]").innerText()
    ).split("\n");
    expect([...randomized].sort()).toEqual(["A", "B", "C", "D"]);

    await page.goto(`${PROD}/remove-duplicate-lines`);
    const dedupeInput = page.getByRole("textbox", {
      name: "List",
      exact: true,
    });
    await dedupeInput.fill("A\nA\nB\nA");
    await expect(page.locator("[data-result-viewer]")).toHaveText("A\nB");
    await expect(page.locator("[data-summary-removed]")).toHaveText(
      "Removed: 2",
    );
  });

  test("all four Expansion V2 tools pass main and edge flows", async ({
    page,
  }) => {
    await page.goto(`${PROD}/random-team-generator`);
    const teamNames = Array.from(
      { length: 10 },
      (_, index) => `Person ${index + 1}`,
    );
    await page
      .getByRole("textbox", { name: "Participants or items" })
      .fill(teamNames.join("\n"));
    await page.getByRole("spinbutton", { name: "Number of teams" }).fill("3");
    await page.getByRole("button", { name: "Generate teams" }).click();
    const teams = (
      await page.locator("[data-result-viewer]").innerText()
    ).split("\n\n");
    expect(teams).toHaveLength(3);
    expect(teams.map((block) => block.split("\n").slice(1).length)).toEqual([
      4, 3, 3,
    ]);
    await page.getByRole("radio", { name: "People per team" }).check();
    await expect(
      page.getByRole("spinbutton", { name: "People per team" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Generate teams" }).click();
    const targetTeams = (
      await page.locator("[data-result-viewer]").innerText()
    ).split("\n\n");
    expect(
      targetTeams.map((block) => block.split("\n").slice(1).length),
    ).toEqual([3, 3, 2, 2]);

    await page.getByRole("radio", { name: "Number of teams" }).check();
    await page.getByRole("spinbutton", { name: "Number of teams" }).fill("11");
    await page.getByRole("button", { name: "Generate teams" }).click();
    await expect(page.locator("[data-validation]")).toContainText(
      "cannot be greater",
    );

    await page.goto(`${PROD}/random-pair-generator`);
    await page
      .getByRole("textbox", { name: "Participants or items" })
      .fill("A\nA\nB\nC\nD");
    await page.getByRole("button", { name: "Generate pairs" }).click();
    const pairs = await page.locator("[data-result-viewer]").innerText();
    expect(pairs).toMatch(/Pair 1:/);
    expect(pairs).toMatch(/Unpaired:/);
    expect(pairs.match(/\bA\b/g)?.length).toBe(2);

    await page.goto(`${PROD}/remove-line-breaks`);
    const lineInput = page.getByRole("textbox", { name: "Text" });
    await lineInput.fill(
      "First line\r\nsecond line\r\n\r\nNext paragraph\rcontinues here",
    );
    const lineViewer = page.locator("[data-result-viewer]");
    await expect(lineViewer).toHaveText(
      "First line second line\n\nNext paragraph continues here",
    );
    await page.locator("[data-separator]").selectOption("custom");
    const lineCustom = page.getByRole("textbox", { name: "Custom separator" });
    await expect(lineCustom).toBeVisible();
    await lineCustom.fill(" / ");
    await page
      .getByRole("checkbox", { name: "Keep paragraph breaks" })
      .uncheck();
    await expect(lineViewer).toHaveText(
      "First line / second line / Next paragraph / continues here",
    );

    await page.goto(`${PROD}/column-to-comma-separated-list`);
    await page
      .getByRole("textbox", { name: "Column" })
      .fill(" alpha \n\nbeta\nalpha");
    const columnViewer = page.locator("[data-result-viewer]");
    await expect(columnViewer).toHaveText("alpha, beta, alpha");
    await page.locator("[data-separator]").selectOption("custom");
    await page.getByRole("textbox", { name: "Custom separator" }).fill(" | ");
    await expect(columnViewer).toHaveText("alpha | beta | alpha");
  });

  test("new tools support example, copy, download and clear", async ({
    page,
  }) => {
    await page
      .context()
      .grantPermissions(["clipboard-read", "clipboard-write"], {
        origin: PROD,
      });

    for (const path of [
      "/random-team-generator",
      "/random-pair-generator",
      "/remove-line-breaks",
      "/column-to-comma-separated-list",
    ]) {
      await page.goto(`${PROD}${path}`);
      const example = page.getByRole("button", { name: "Try example" });
      await expect(example).toBeVisible();
      await example.click();

      const generate = page.locator("[data-generate]");
      if (await generate.count()) await generate.click();

      const viewer = page.locator("[data-result-viewer]");
      await expect(viewer).not.toBeEmpty();
      const expected = await viewer.innerText();

      await page.locator("[data-copy-result]").click();
      const clipboard = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      expect(clipboard).toBe(expected);

      const downloadPromise = page.waitForEvent("download");
      await page.locator("[data-download-result]").click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.txt$/);

      await page.getByRole("button", { name: "Clear" }).click();
      await expect(viewer).toBeEmpty();
    }
  });
});

test.describe("live production privacy and XSS", () => {
  test("raw input never leaks into requests, URL, cookies or storage", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"));

    const probes = [
      { path: "/", inputName: "List A" },
      { path: "/alphabetize-list", inputName: "List" },
      { path: "/randomize-list", inputName: "List", trigger: "Randomize" },
      { path: "/remove-duplicate-lines", inputName: "List" },
      {
        path: "/random-team-generator",
        inputName: "Participants or items",
        trigger: "Generate teams",
      },
      {
        path: "/random-pair-generator",
        inputName: "Participants or items",
        trigger: "Generate pairs",
      },
      { path: "/remove-line-breaks", inputName: "Text" },
      { path: "/column-to-comma-separated-list", inputName: "Column" },
    ];

    for (const probe of probes) {
      const marker = `prod-audit-secret-${Date.now()}-${probe.path}`;
      await page.goto(`${PROD}${probe.path}`);
      const interactionRequests: string[] = [];
      const requestBodies: string[] = [];
      const listener = (request: { url(): string; postData(): string | null }) => {
        interactionRequests.push(request.url());
        requestBodies.push(request.postData() ?? "");
      };
      page.on("request", listener);

      const input = page.getByRole("textbox", {
        name: probe.inputName,
        exact: true,
      });
      await input.fill(`${marker}\nAlpha\nBeta`);
      if (probe.trigger) {
        await page
          .getByRole("button", { name: probe.trigger, exact: true })
          .click();
      }
      await page.waitForTimeout(150);
      page.off("request", listener);

      expect(JSON.stringify(interactionRequests), probe.path).not.toContain(
        marker,
      );
      expect(JSON.stringify(requestBodies), probe.path).not.toContain(marker);
      expect(page.url(), probe.path).not.toContain(marker);

      const storage = await page.evaluate(() => ({
        localStorage: { ...localStorage },
        sessionStorage: { ...sessionStorage },
        cookie: document.cookie,
      }));
      expect(JSON.stringify(storage), probe.path).not.toContain(marker);
      expect(
        JSON.stringify(await page.context().cookies()),
        probe.path,
      ).not.toContain(marker);

      await page.reload();
      await expect(
        page.getByRole("textbox", { name: probe.inputName, exact: true }),
      ).toHaveValue("");
    }
  });

  test("pasted HTML is rendered as text, never executed", async ({ page }) => {
    const marker =
      '<img src="https://prod-audit.invalid/probe.png" data-prod-audit-probe onerror="window.__prodAuditProbe=1">';
    await page.goto(`${PROD}/column-to-comma-separated-list`);
    await page
      .getByRole("textbox", { name: "Column" })
      .fill(`${marker}\nplain`);
    await expect(page.locator("[data-result-viewer]")).toContainText(marker);
    await expect(page.locator("[data-prod-audit-probe]")).toHaveCount(0);
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { __prodAuditProbe?: number }).__prodAuditProbe,
      ),
    ).toBeUndefined();
  });
});

test.describe("live production responsive and visual consistency", () => {
  for (const path of EN_SITE_PATHS) {
    test(`${path} has no document-level horizontal overflow`, async ({
      page,
    }) => {
      await page.goto(`${PROD}${path}`);
      await expect(page.locator("h1")).toBeVisible();
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
      );
      expect(overflow, path).toBe(false);
    });
  }

  test("the shipped Expansion V2 UI hardening is present", async ({ page }) => {
    for (const path of [
      "/remove-line-breaks",
      "/column-to-comma-separated-list",
    ]) {
      await page.goto(`${PROD}${path}`);
      const customRow = page.locator("[data-custom-row]");
      await expect(customRow).toBeHidden();
      await page.locator("[data-separator]").selectOption("custom");
      await expect(customRow).toBeVisible();
    }

    for (const path of [
      "/random-team-generator",
      "/random-pair-generator",
      "/column-to-comma-separated-list",
    ]) {
      await page.goto(`${PROD}${path}`);
      await expect(page.locator("[data-result-viewer]")).toHaveCSS(
        "white-space",
        "pre",
      );
    }
    await page.goto(`${PROD}/remove-line-breaks`);
    await expect(page.locator("[data-result-viewer]")).toHaveCSS(
      "white-space",
      "pre-wrap",
    );
  });

  for (const path of SCREENSHOT_PATHS) {
    test(`capture populated ${path} screenshot`, async ({
      page,
    }, testInfo) => {
      await page.goto(`${PROD}${path}`);
      const example = page.getByRole("button", { name: "Try example" });
      if (await example.count()) await example.click();
      const generate = page.locator("[data-generate]");
      if (await generate.count()) await generate.click();
      const randomize = page.getByRole("button", {
        name: "Randomize",
        exact: true,
      });
      if (await randomize.count()) await randomize.click();

      const slug = path === "/" ? "compare" : path.slice(1);
      await page.screenshot({
        path: `test-results/prod-audit/${testInfo.project.name}/${slug}.png`,
        fullPage: true,
      });
    });
  }
});

test.describe("live production accessibility", () => {
  for (const path of [
    "/",
    "/random-team-generator",
    "/random-pair-generator",
    "/remove-line-breaks",
    "/column-to-comma-separated-list",
  ]) {
    test(`${path} has no serious or critical WCAG axe violations`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name.includes("mobile"));
      await page.goto(`${PROD}${path}`);
      await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async () => {
        const axe = (window as unknown as {
          axe: {
            run(options: unknown): Promise<{ violations: AxeViolation[] }>;
          };
        }).axe;
        return (
          await axe.run({
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
            },
          })
        ).violations;
      });
      if (violations.length) {
        console.log(`PROD_AXE ${path}`, JSON.stringify(violations));
      }
      const blocking = violations.filter(
        (violation) =>
          violation.impact === "critical" || violation.impact === "serious",
      );
      expect(blocking).toEqual([]);
    });
  }
});
