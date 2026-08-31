import { expect, test } from "@playwright/test";

const MARKER =
  '<img src="https://cl042-probe.invalid/1.png" data-cl042-probe onerror="window.__cl042Probe = 1">';
const TOKEN = "cl042-probe";

test("removes duplicate lines live and updates case identity", async ({
  page,
}) => {
  await page.goto("/remove-duplicate-lines");

  await expect(
    page.getByRole("heading", { level: 1, name: "Remove Duplicate Lines" }),
  ).toBeVisible();

  const input = page.getByRole("textbox", { name: "List", exact: true });
  const viewer = page.locator("[data-result-viewer]");

  await input.fill("Apple\napple\nApple\nBanana");
  await expect(viewer).toHaveText("Apple\napple\nBanana");
  await expect(page.locator("[data-summary-input]")).toHaveText("Input: 4");
  await expect(page.locator("[data-summary-unique]")).toHaveText("Unique: 3");
  await expect(page.locator("[data-summary-removed]")).toHaveText("Removed: 1");

  await page.getByRole("checkbox", { name: "Ignore case" }).check();
  await expect(viewer).toHaveText("Apple\nBanana");
  await expect(page.locator("[data-summary-unique]")).toHaveText("Unique: 2");
  await expect(page.locator("[data-summary-removed]")).toHaveText("Removed: 2");
});

test("Dedupe metadata, canonical and download filename are stable", async ({
  page,
}) => {
  await page.goto("/remove-duplicate-lines");

  await expect(page).toHaveTitle(
    "Remove Duplicate Lines Online | ListContrast",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://listcontrast.com/remove-duplicate-lines",
  );

  await page
    .getByRole("textbox", { name: "List", exact: true })
    .fill("B\nA\nB");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("unique-lines.txt");
});

test("privacy: Dedupe content stays local and renders as text", async ({
  page,
}) => {
  const requests: string[] = [];
  const requestBodies: string[] = [];
  const consoleText: string[] = [];
  const pageErrors: string[] = [];

  page.on("request", (request) => {
    requests.push(request.url());
    const body = request.postData();
    if (body !== null) {
      requestBodies.push(body);
    }
  });
  page.on("console", (message) => consoleText.push(message.text()));
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/remove-duplicate-lines");
  await page
    .getByRole("textbox", { name: "List", exact: true })
    .fill(`Alpha\n${MARKER}\nAlpha`);

  const viewer = page.locator("[data-result-viewer]");
  await expect(viewer).toContainText(MARKER);
  await expect(page.locator("[data-cl042-probe]")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => (window as unknown as Record<string, unknown>).__cl042Probe,
    ),
  ).toBeUndefined();

  const storage = await page.evaluate(() => ({
    local: JSON.stringify({ ...localStorage }),
    session: JSON.stringify({ ...sessionStorage }),
    cookie: document.cookie,
  }));
  const sources = {
    "request urls": JSON.stringify(requests),
    "request bodies": JSON.stringify(requestBodies),
    "page url": page.url(),
    "local storage": storage.local,
    "session storage": storage.session,
    "cookies (document)": storage.cookie,
    "cookies (context)": JSON.stringify(await page.context().cookies()),
    console: JSON.stringify(consoleText),
    "page errors": JSON.stringify(pageErrors),
  };
  for (const [label, value] of Object.entries(sources)) {
    expect(value, label).not.toContain(TOKEN);
    expect(value, label).not.toContain(MARKER);
  }

  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "List", exact: true }),
  ).toHaveValue("");
});
