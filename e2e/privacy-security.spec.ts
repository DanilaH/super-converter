import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const MARKER =
  '<img src="https://cl033-probe.invalid/1.png" data-cl033-probe onerror="window.__cl033Probe = 1">';
const TOKEN = "cl033-probe";

function assertNoLeak(sources: Record<string, string>): void {
  for (const [label, value] of Object.entries(sources)) {
    expect(value, label).not.toContain(TOKEN);
    expect(value, label).not.toContain(MARKER);
  }
}

async function collectStorage(page: Page): Promise<{
  local: string;
  session: string;
  cookie: string;
}> {
  return page.evaluate(() => ({
    local: JSON.stringify({ ...localStorage }),
    session: JSON.stringify({ ...sessionStorage }),
    cookie: document.cookie,
  }));
}

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

  const storageBefore = await collectStorage(page);
  assertNoLeak({
    "request urls": JSON.stringify(requests),
    "request bodies": JSON.stringify(requestBodies),
    "page url": page.url(),
    "local storage": storageBefore.local,
    "session storage": storageBefore.session,
    "cookies (document)": storageBefore.cookie,
    "cookies (context)": JSON.stringify(await page.context().cookies()),
    console: JSON.stringify(consoleText),
    "page errors": JSON.stringify(pageErrors),
  });

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

  const storageAfter = await collectStorage(page);
  assertNoLeak({
    "request urls": JSON.stringify(requests),
    "request bodies": JSON.stringify(requestBodies),
    "page url": page.url(),
    "local storage": storageAfter.local,
    "session storage": storageAfter.session,
    "cookies (document)": storageAfter.cookie,
    "cookies (context)": JSON.stringify(await page.context().cookies()),
    console: JSON.stringify(consoleText),
    "page errors": JSON.stringify(pageErrors),
  });
});

test("privacy: alphabetizer content stays local and is rendered as text", async ({
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

  await page.goto("/alphabetize-list");
  await page
    .getByRole("textbox", { name: "List", exact: true })
    .fill(`zeta\n${MARKER}\nalpha`);

  const viewer = page.locator("[data-result-viewer]");
  await expect(viewer).toContainText(MARKER);
  await expect(page.locator("[data-cl033-probe]")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => (window as unknown as Record<string, unknown>).__cl033Probe,
    ),
  ).toBeUndefined();

  const storage = await collectStorage(page);
  assertNoLeak({
    "request urls": JSON.stringify(requests),
    "request bodies": JSON.stringify(requestBodies),
    "page url": page.url(),
    "local storage": storage.local,
    "session storage": storage.session,
    "cookies (document)": storage.cookie,
    "cookies (context)": JSON.stringify(await page.context().cookies()),
    console: JSON.stringify(consoleText),
    "page errors": JSON.stringify(pageErrors),
  });

  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "List", exact: true }),
  ).toHaveValue("");
});
