import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: [
    "compare-lists.spec.ts",
    "expansion-v2.spec.ts",
    "final-hardening.spec.ts",
    "page-shell.spec.ts",
    "privacy-security.spec.ts",
    "responsive-layout.spec.ts",
    "tool-workspace-consistency.spec.ts",
    "production-postfix-audit.spec.ts",
  ],
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  outputDir: "test-results/production-audit",
  use: {
    baseURL: "https://listcontrast.com",
    browserName: "chromium",
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure",
    video: "off",
    trace: "retain-on-failure",
  },
});
