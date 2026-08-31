import { expect, test } from "@playwright/test";

const MARKER =
  '<img src="https://cl041-probe.invalid/1.png" data-cl041-probe onerror="window.__cl041Probe = 1">';
const TOKEN = "cl041-probe";

test("randomizes only on explicit action and invalidates stale results", async ({
  page,
}) => {
  await page.goto("/randomize-list");

  await expect(
    page.getByRole("heading", { level: 1, name: "List Randomizer" }),
  ).toBeVisible();

  const input = page.getByRole("textbox", { name: "List", exact: true });
  const viewer = page.locator("[data-result-viewer]");
  const randomize = page.getByRole("button", {
    name: "Randomize",
    exact: true,
  });

  await input.fill("Alpha\nBravo\nCharlie\nDelta");
  await expect(viewer).toBeHidden();
  await expect(page.getByRole("button", { name: "Copy" })).toBeDisabled();
  await randomize.click();

  await expect(viewer).toBeVisible();
  const resultItems = (await viewer.textContent())?.split("\n") ?? [];
  expect([...resultItems].sort()).toEqual(
    ["Alpha", "Bravo", "Charlie", "Delta"].sort(),
  );
  await expect(
    page.getByRole("button", { name: "Randomize again" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy" })).toBeEnabled();

  await input.fill("Alpha\nBravo\nCharlie\nDelta\nEcho");
  await expect(viewer).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Randomize", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy" })).toBeDisabled();
});

test("Try example fills input but does not shuffle automatically", async ({
  page,
}) => {
  await page.goto("/randomize-list");

  await page.getByRole("button", { name: "Try example" }).click();

  await expect(
    page.getByRole("textbox", { name: "List", exact: true }),
  ).toHaveValue(/Charlie/);
  await expect(page.locator("[data-result-viewer]")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Randomize", exact: true }),
  ).toBeEnabled();
  await expect(page.getByRole("button", { name: "Copy" })).toBeDisabled();
});

test("Randomizer exposes canonical metadata and stable download filename", async ({
  page,
}) => {
  await page.goto("/randomize-list");

  await expect(page).toHaveTitle(
    "List Randomizer — Randomize a List Online | ListContrast",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://listcontrast.com/randomize-list",
  );

  await page
    .getByRole("textbox", { name: "List", exact: true })
    .fill("A\nB\nC");
  await page.getByRole("button", { name: "Randomize", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("randomized-list.txt");
});

test("privacy: Randomizer content stays local and renders as text", async ({
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

  await page.goto("/randomize-list");
  await page
    .getByRole("textbox", { name: "List", exact: true })
    .fill(`Alpha\n${MARKER}\nBravo`);
  await page.getByRole("button", { name: "Randomize", exact: true }).click();

  const viewer = page.locator("[data-result-viewer]");
  await expect(viewer).toContainText(MARKER);
  await expect(page.locator("[data-cl041-probe]")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => (window as unknown as Record<string, unknown>).__cl041Probe,
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
