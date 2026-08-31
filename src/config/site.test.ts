import { describe, expect, it } from "vitest";
import {
  INDEXABLE_PATHS,
  absoluteUrl,
  canonicalPathFor,
  isPlaceholderSite,
  resolveSiteOrigin,
} from "./site";

describe("site origin", () => {
  it("throws when the site is missing", () => {
    expect(() => resolveSiteOrigin(undefined)).toThrow(
      /Site origin is missing/,
    );
  });

  it("rejects an HTTP origin", () => {
    expect(() => resolveSiteOrigin(new URL("http://example.com"))).toThrow(
      /must use https/,
    );
  });

  it("rejects credentials", () => {
    expect(() =>
      resolveSiteOrigin(new URL("https://user:pass@example.com")),
    ).toThrow(/credentials/);
  });

  it("rejects a non-root pathname", () => {
    expect(() => resolveSiteOrigin(new URL("https://example.com/foo"))).toThrow(
      /root path/,
    );
  });

  it("rejects a query string", () => {
    expect(() =>
      resolveSiteOrigin(new URL("https://example.com/?a=1")),
    ).toThrow(/query/);
  });

  it("rejects a hash", () => {
    expect(() =>
      resolveSiteOrigin(new URL("https://example.com/#top")),
    ).toThrow(/hash/);
  });

  it("accepts a valid HTTPS root origin", () => {
    const site = resolveSiteOrigin(new URL("https://example.com"));
    expect(site.href).toBe("https://example.com/");
  });

  it("detects the placeholder host", () => {
    expect(isPlaceholderSite(new URL("https://example.com"))).toBe(true);
    expect(isPlaceholderSite(new URL("https://real-origin.example"))).toBe(
      false,
    );
  });

  it("builds stable absolute URLs from a validated site", () => {
    const site = resolveSiteOrigin(new URL("https://example.com"));
    expect(absoluteUrl(site, "/").href).toBe("https://example.com/");
    expect(absoluteUrl(site, "/alphabetize-list").href).toBe(
      "https://example.com/alphabetize-list",
    );
    expect(absoluteUrl(site, "/randomize-list").href).toBe(
      "https://example.com/randomize-list",
    );
    expect(absoluteUrl(site, "/remove-duplicate-lines").href).toBe(
      "https://example.com/remove-duplicate-lines",
    );
    expect(absoluteUrl(site, "/tools").href).toBe("https://example.com/tools");
    expect(absoluteUrl(site, "/about").href).toBe("https://example.com/about");
    expect(absoluteUrl(site, "/privacy").href).toBe(
      "https://example.com/privacy",
    );
  });

  it("maps indexable metadata keys to fixed paths", () => {
    expect(canonicalPathFor("home")).toBe("/");
    expect(canonicalPathFor("alphabetizeList")).toBe("/alphabetize-list");
    expect(canonicalPathFor("randomizeList")).toBe("/randomize-list");
    expect(canonicalPathFor("removeDuplicateLines")).toBe(
      "/remove-duplicate-lines",
    );
    expect(canonicalPathFor("tools")).toBe("/tools");
    expect(canonicalPathFor("about")).toBe("/about");
    expect(canonicalPathFor("privacy")).toBe("/privacy");
  });

  it("exposes the exact indexable paths list", () => {
    expect(INDEXABLE_PATHS).toEqual([
      "/",
      "/alphabetize-list",
      "/randomize-list",
      "/remove-duplicate-lines",
      "/tools",
      "/about",
      "/privacy",
    ]);
  });
});
