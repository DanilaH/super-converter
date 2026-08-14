import { describe, expect, it } from "vitest";
import type { CompareResult } from "../../model/types";
import { formatResult } from "../format-result";

function makeResult(overrides: Partial<CompareResult> = {}): CompareResult {
  return {
    onlyA: [],
    onlyB: [],
    matches: [],
    union: [],
    differences: [],
    stats: {
      rowsA: 0,
      rowsB: 0,
      uniqueA: 0,
      uniqueB: 0,
      onlyA: 0,
      onlyB: 0,
      matches: 0,
    },
    ...overrides,
  };
}

describe("formatResult", () => {
  it("formats an empty array as an empty string", () => {
    const result = makeResult();

    expect(formatResult(result, "onlyA").text).toBe("");
    expect(formatResult(result, "onlyB").text).toBe("");
    expect(formatResult(result, "matches").text).toBe("");
    expect(formatResult(result, "all").text).toBe("");
  });

  it("formats a single value", () => {
    const result = makeResult({ onlyA: ["x"] });

    expect(formatResult(result, "onlyA").text).toBe("x");
  });

  it("joins multiple values with newlines and no trailing newline", () => {
    const result = makeResult({ onlyA: ["a", "b", "c"] });

    expect(formatResult(result, "onlyA").text).toBe("a\nb\nc");
  });

  it("keeps Unicode values and whitespace inside values", () => {
    const result = makeResult({ onlyB: [" Привет ", "мир"] });

    expect(formatResult(result, "onlyB").text).toBe(" Привет \nмир");
  });

  it("uses union for the all type", () => {
    const result = makeResult({ union: ["a", "b", "b"] });

    expect(formatResult(result, "all").text).toBe("a\nb\nb");
  });

  it("builds the differences text with exact headers and section order", () => {
    const result = makeResult({ onlyA: ["a", "b"], onlyB: ["x"] });

    expect(formatResult(result, "differences").text).toBe(
      "ONLY IN LIST A\na\nb\n\nONLY IN LIST B\nx",
    );
  });

  it("keeps the empty section separator when onlyA is empty", () => {
    const result = makeResult({ onlyA: [], onlyB: ["x"] });

    expect(formatResult(result, "differences").text).toBe(
      "ONLY IN LIST A\n\nONLY IN LIST B\nx",
    );
  });

  it("keeps the empty section separator when onlyB is empty", () => {
    const result = makeResult({ onlyA: ["a"], onlyB: [] });

    expect(formatResult(result, "differences").text).toBe(
      "ONLY IN LIST A\na\n\nONLY IN LIST B",
    );
  });

  it("never adds a trailing newline", () => {
    const result = makeResult({
      onlyA: ["a", "b"],
      onlyB: ["x", "y"],
      matches: ["a"],
      union: ["a", "b", "x", "y"],
    });

    for (const type of [
      "differences",
      "onlyA",
      "onlyB",
      "matches",
      "all",
    ] as const) {
      expect(formatResult(result, type).text.endsWith("\n")).toBe(false);
    }
  });

  it("uses the fixed filenames for every type", () => {
    const result = makeResult({ onlyA: ["a"], onlyB: ["b"] });

    expect(formatResult(result, "differences").filename).toBe(
      "compare-lists-differences.txt",
    );
    expect(formatResult(result, "onlyA").filename).toBe(
      "compare-lists-only-a.txt",
    );
    expect(formatResult(result, "onlyB").filename).toBe(
      "compare-lists-only-b.txt",
    );
    expect(formatResult(result, "matches").filename).toBe(
      "compare-lists-matches.txt",
    );
    expect(formatResult(result, "all").filename).toBe("compare-lists-all.txt");
  });

  it("does not mutate the result", () => {
    const result = makeResult({
      onlyA: ["a", "b"],
      onlyB: ["x"],
      matches: ["a"],
      union: ["a", "b", "x"],
      differences: ["a", "b", "x"],
    });
    const snapshot = JSON.stringify(result);

    for (const type of [
      "differences",
      "onlyA",
      "onlyB",
      "matches",
      "all",
    ] as const) {
      formatResult(result, type);
    }

    expect(JSON.stringify(result)).toBe(snapshot);
  });
});
