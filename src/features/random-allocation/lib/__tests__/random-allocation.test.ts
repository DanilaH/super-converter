import { describe, expect, it } from "vitest";
import {
  pairRandomly,
  splitIntoBalancedGroups,
} from "../random-allocation";

const fixedRandom = () => 0;

function sorted(items: readonly string[]): string[] {
  return [...items].sort();
}

describe("splitIntoBalancedGroups", () => {
  it("balances 10 items across 3 teams as 4,3,3", () => {
    const items = Array.from({ length: 10 }, (_, index) => `p${index}`);
    const groups = splitIntoBalancedGroups(
      items,
      { mode: "teamCount", value: 3 },
      fixedRandom,
    );

    expect(groups.map((group) => group.length)).toEqual([4, 3, 3]);
    expect(sorted(groups.flat())).toEqual(sorted(items));
  });

  it("treats target size as a maximum target and balances derived groups", () => {
    const items = Array.from({ length: 10 }, (_, index) => `p${index}`);
    const groups = splitIntoBalancedGroups(
      items,
      { mode: "targetSize", value: 3 },
      fixedRandom,
    );

    expect(groups.map((group) => group.length)).toEqual([3, 3, 2, 2]);
    expect(sorted(groups.flat())).toEqual(sorted(items));
  });

  it("preserves repeated identical occurrences", () => {
    const items = ["Alex", "Alex", "Sam", "Lee"];
    const groups = splitIntoBalancedGroups(
      items,
      { mode: "teamCount", value: 2 },
      fixedRandom,
    );

    expect(groups.flat()).toHaveLength(4);
    expect(groups.flat().filter((item) => item === "Alex")).toHaveLength(2);
    expect(sorted(groups.flat())).toEqual(sorted(items));
  });

  it("returns no groups for empty input with a valid config", () => {
    expect(
      splitIntoBalancedGroups([], { mode: "teamCount", value: 2 }, fixedRandom),
    ).toEqual([]);
  });

  it.each([0, -1, 1.5])("rejects invalid group values: %s", (value) => {
    expect(() =>
      splitIntoBalancedGroups(
        ["a", "b"],
        { mode: "teamCount", value },
        fixedRandom,
      ),
    ).toThrow(RangeError);
  });

  it("rejects more teams than items", () => {
    expect(() =>
      splitIntoBalancedGroups(
        ["a", "b"],
        { mode: "teamCount", value: 3 },
        fixedRandom,
      ),
    ).toThrow(/cannot exceed/i);
  });
});

describe("pairRandomly", () => {
  it("creates four pairs from eight items", () => {
    const items = Array.from({ length: 8 }, (_, index) => `p${index}`);
    const result = pairRandomly(items, fixedRandom);

    expect(result.pairs).toHaveLength(4);
    expect(result.unpaired).toBeNull();
    expect(sorted(result.pairs.flat())).toEqual(sorted(items));
  });

  it("creates three pairs and one unpaired item from seven items", () => {
    const items = Array.from({ length: 7 }, (_, index) => `p${index}`);
    const result = pairRandomly(items, fixedRandom);
    const occurrences = [
      ...result.pairs.flat(),
      ...(result.unpaired === null ? [] : [result.unpaired]),
    ];

    expect(result.pairs).toHaveLength(3);
    expect(result.unpaired).not.toBeNull();
    expect(sorted(occurrences)).toEqual(sorted(items));
  });

  it("preserves duplicate occurrences and handles a single item", () => {
    const duplicateResult = pairRandomly(
      ["Alex", "Alex", "Sam", "Lee"],
      fixedRandom,
    );
    expect(
      duplicateResult.pairs.flat().filter((item) => item === "Alex"),
    ).toHaveLength(2);

    expect(pairRandomly(["Only"], fixedRandom)).toEqual({
      pairs: [],
      unpaired: "Only",
    });
  });
});
