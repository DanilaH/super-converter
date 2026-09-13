import { expect, test } from "@playwright/test";

const INDEXNOW_KEY = "7f03778ac87cd20aed1fda50f491df61";

test("serves the IndexNow ownership key from the site root", async ({
  request,
}) => {
  const response = await request.get(`/${INDEXNOW_KEY}.txt`);

  expect(response.status()).toBe(200);
  expect((await response.text()).trim()).toBe(INDEXNOW_KEY);
});
