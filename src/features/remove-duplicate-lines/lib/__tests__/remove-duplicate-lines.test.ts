import { describe, expect, it } from "vitest";
import { removeDuplicateLines } from "../remove-duplicate-lines";

describe("removeDuplicateLines", () => {
  it("keeps the first occurrence and preserves source order", () => {
    expect(
      removeDuplicateLines("B\nA\nB\nC\nA", {
        trimWhitespace: true,
        ignoreEmptyLines: true,
        ignoreCase: false,
      }),
    ).toEqual({
      items: ["B", "A", "C"],
      text: "B\nA\nC",
      stats: { input: 5, unique: 3, removed: 2 },
    });
  });

  it("uses the processed first occurrence as emitted text", () => {
    expect(
      removeDuplicateLines("  Apple  \nApple", {
        trimWhitespace: true,
        ignoreEmptyLines: true,
        ignoreCase: false,
      }).items,
    ).toEqual(["Apple"]);
  });

  it("builds case identity from the already trimmed processed value", () => {
    expect(
      removeDuplicateLines("  Apple  \napple\n APPLE ", {
        trimWhitespace: true,
        ignoreEmptyLines: true,
        ignoreCase: true,
      }),
    ).toEqual({
      items: ["Apple"],
      text: "Apple",
      stats: { input: 3, unique: 1, removed: 2 },
    });
  });

  it("uses English-facing lowercase identity without rewriting output", () => {
    expect(
      removeDuplicateLines("Apple\napple\nAPPLE\nrésumé\nresume", {
        trimWhitespace: true,
        ignoreEmptyLines: true,
        ignoreCase: true,
      }),
    ).toEqual({
      items: ["Apple", "résumé", "resume"],
      text: "Apple\nrésumé\nresume",
      stats: { input: 5, unique: 3, removed: 2 },
    });
  });

  it("counts after preprocessing and before deduplication", () => {
    expect(
      removeDuplicateLines(" A \n\nA\n B ", {
        trimWhitespace: true,
        ignoreEmptyLines: true,
        ignoreCase: false,
      }).stats,
    ).toEqual({ input: 3, unique: 2, removed: 1 });
  });

  it("keeps intentional empty items when empty-line filtering is off", () => {
    expect(
      removeDuplicateLines("   \n\nA", {
        trimWhitespace: true,
        ignoreEmptyLines: false,
        ignoreCase: false,
      }),
    ).toEqual({
      items: ["", "A"],
      text: "\nA",
      stats: { input: 3, unique: 2, removed: 1 },
    });
  });

  it("treats untouched empty input as zero items", () => {
    expect(
      removeDuplicateLines("", {
        trimWhitespace: false,
        ignoreEmptyLines: false,
        ignoreCase: false,
      }),
    ).toEqual({
      items: [],
      text: "",
      stats: { input: 0, unique: 0, removed: 0 },
    });
  });
});
