import { describe, expect, it } from "vitest";
import { normalizeItem } from "../normalize-item";

describe("normalizeItem", () => {
  it("returns the input unchanged when both options are off", () => {
    expect(
      normalizeItem("  Hello  ", {
        trimWhitespace: false,
        ignoreCase: false,
      }),
    ).toBe("  Hello  ");
  });

  it("trims leading and trailing whitespace when trimWhitespace is on", () => {
    expect(
      normalizeItem("  Hello  ", {
        trimWhitespace: true,
        ignoreCase: false,
      }),
    ).toBe("Hello");
  });

  it("does not alter internal whitespace", () => {
    expect(
      normalizeItem("a  b", { trimWhitespace: true, ignoreCase: false }),
    ).toBe("a  b");
  });

  it("keeps whitespace-only input unchanged when trim is off", () => {
    expect(
      normalizeItem("   ", { trimWhitespace: false, ignoreCase: false }),
    ).toBe("   ");
  });

  it("lowercases when ignoreCase is on", () => {
    expect(
      normalizeItem("MiXeD CaSe", {
        trimWhitespace: false,
        ignoreCase: true,
      }),
    ).toBe("mixed case");
  });

  it("turns 'I' into 'i' without locale-dependent rules", () => {
    expect(
      normalizeItem("I", { trimWhitespace: false, ignoreCase: true }),
    ).toBe("i");
  });

  it("combines trim and ignore case", () => {
    expect(
      normalizeItem("  HeLLo  ", { trimWhitespace: true, ignoreCase: true }),
    ).toBe("hello");
  });

  it("keeps Unicode characters", () => {
    expect(
      normalizeItem("Привет!", { trimWhitespace: false, ignoreCase: true }),
    ).toBe("привет!");
  });

  it("does not mutate the raw string argument", () => {
    const raw = "  Hello  ";

    normalizeItem(raw, { trimWhitespace: true, ignoreCase: true });

    expect(raw).toBe("  Hello  ");
  });
});
