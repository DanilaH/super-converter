import { expect, test } from "@playwright/test";

const LIST_A = "Alpha\nBeta\nonly-a";
const LIST_B = "alpha\nBeta\nonly-b";

test("compares two lists with live option update and result navigation", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Compare Lists Online" }),
  ).toBeVisible();
  await expect(page.getByLabel("List A")).toBeVisible();
  await expect(page.getByLabel("List B")).toBeVisible();

  await page.getByLabel("List A").fill(LIST_A);
  await page.getByLabel("List B").fill(LIST_B);

  const viewer = page.locator('[role="tabpanel"] pre');
  const differencesTab = page.getByRole("tab", { name: "Differences" });

  await expect(differencesTab).toHaveAttribute("aria-selected", "true");
  await expect(viewer).toContainText("ONLY IN LIST A");
  await expect(viewer).toContainText("ONLY IN LIST B");
  await expect(viewer).toContainText("Alpha");
  await expect(viewer).toContainText("only-a");
  await expect(viewer).toContainText("alpha");
  await expect(viewer).toContainText("only-b");

  await page.getByRole("checkbox", { name: "Ignore case" }).check();

  await expect(viewer).not.toContainText("Alpha");
  await expect(viewer).not.toContainText("alpha");
  await expect(viewer).toHaveText(
    "ONLY IN LIST A\nonly-a\n\nONLY IN LIST B\nonly-b",
  );

  await page.getByRole("tab", { name: "Only A" }).click();

  await expect(page.getByRole("tab", { name: "Only A" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(viewer).toHaveText("only-a");

  const copy = page.getByRole("button", { name: "Copy" });
  const download = page.getByRole("button", { name: "Download" });

  await expect(copy).toBeVisible();
  await expect(copy).toBeEnabled();
  await expect(download).toBeVisible();
  await expect(download).toBeEnabled();
});
