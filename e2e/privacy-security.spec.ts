import { expect, test } from "@playwright/test";

// Unique synthetic marker with an HTML payload: if it were ever parsed as
// HTML, an element with data-cl033-probe would appear and the onerror flag
// would be set.
const MARKER =
  '<img src="https://cl033-probe.invalid/1.png" data-cl033-probe onerror="window.__cl033Probe = 1">';

test("privacy: list content stays in memory only", async ({ page }) => {
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

  await page.goto("/");

  await page.getByLabel("List A").fill(`alpha\n${MARKER}`);
  await page.getByLabel("List B").fill("beta");

  const viewer = page.locator("[data-result-viewer]");
  await expect(viewer).toContainText(MARKER);
  await expect(page.locator("[data-cl033-probe]")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => (window as unknown as Record<string, unknown>).__cl033Probe,
    ),
  ).toBeUndefined();

  const serializedRequests = JSON.stringify([...requests, ...requestBodies]);
  expect(serializedRequests).not.toContain("cl033-probe");
  expect(serializedRequests).not.toContain(MARKER);

  expect(page.url()).not.toContain(MARKER);

  const stored = await page.evaluate(() => ({
    local: { ...localStorage },
    session: { ...sessionStorage },
    cookie: document.cookie,
  }));
  expect(JSON.stringify(stored)).not.toContain(MARKER);
  expect(JSON.stringify(await page.context().cookies())).not.toContain(MARKER);

  expect(JSON.stringify(consoleText)).not.toContain(MARKER);
  expect(JSON.stringify(pageErrors)).not.toContain(MARKER);

  await page.getByRole("tab", { name: "Only B" }).click();
  await expect(page.getByRole("tab", { name: "Only B" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.reload();
  await expect(page.getByLabel("List A")).toHaveValue("");
  await expect(page.getByLabel("List B")).toHaveValue("");

  await page.getByLabel("List A").fill("x");
  await page.getByLabel("List B").fill("y");
  await expect(page.getByRole("tab", { name: "Differences" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
