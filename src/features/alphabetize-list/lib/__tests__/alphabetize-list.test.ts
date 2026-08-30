import { describe, expect, it } from "vitest";
import { alphabetizeList } from "../alphabetize-list";

const DEFAULTS = {
  trimWhitespace: true,
  ignoreEmptyLines: true,
  order: "asc" as const,
};

describe("alphabetizeList", () => {
  it("sorts A to Z without changing original casing", () => {
    expect(alphabetizeList("banana\nApple\ncherry", DEFAULTS).items).toEqual([
      "Apple",
      "banana",
      "cherry",
    ]);
  });

  it("sorts Z to A", () => {
    expect(
      alphabetizeList("banana\nApple\ncherry", {
        ...DEFAULTS,
        order: "desc",
      }).items,
    ).toEqual(["cherry", "banana", "Apple"]);
  });

  it("uses numeric-aware ordering", () => {
    expect(alphabetizeList("item 10\nitem 2\nitem 1", DEFAULTS).items).toEqual([
      "item 1",
      "item 2",
      "item 10",
    ]);
  });

  it("keeps case-equivalent items stable", () => {
    expect(alphabetizeList("apple\nApple\nAPPLE", DEFAULTS).items).toEqual([
      "apple",
      "Apple",
      "APPLE",
    ]);
  });

  it("keeps accent differences significant while ignoring case", () => {
    const result = alphabetizeList("résumé\nresume\nResume\nresumé", DEFAULTS);
    expect(result.items).toEqual(["resume", "Resume", "resumé", "résumé"]);
  });

  it("keeps collator-equivalent items stable in descending order too", () => {
    expect(
      alphabetizeList("apple\nApple\nAPPLE", {
        ...DEFAULTS,
        order: "desc",
      }).items,
    ).toEqual(["apple", "Apple", "APPLE"]);
  });

  it("preserves duplicates", () => {
    expect(alphabetizeList("B\nA\nB", DEFAULTS).items).toEqual(["A", "B", "B"]);
  });

  it("emits normalized values and exact serialization", () => {
    const result = alphabetizeList("  B  \r\n\r\n A ", DEFAULTS);
    expect(result.items).toEqual(["A", "B"]);
    expect(result.text).toBe("A\nB");
  });

  it("keeps Unicode input intact", () => {
    const result = alphabetizeList("Яблоко\nÄpfel\n東京", DEFAULTS);
    expect(result.items).toHaveLength(3);
    expect(new Set(result.items)).toEqual(new Set(["Яблоко", "Äpfel", "東京"]));
  });
});
