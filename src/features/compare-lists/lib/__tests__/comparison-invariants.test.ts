import { describe, expect, it } from "vitest";
import type { CompareOptions } from "../../model/types";
import { compareLists } from "../compare-lists";
import { parseList } from "../parse-list";

type Token = {
  key: string;
  raw: string;
};

const sequences: string[][] = [
  [],
  ["a"],
  ["a", "b", "c", "d"],
  ["b", "a", "b", "c"],
  [" A ", "a", " b", "B", "a"],
  ["a", "", "a"],
  ["x", "y", "z"],
];

function tokens(rawLines: string[], options: CompareOptions): Token[] {
  return parseList(rawLines.join("\n"), {
    trimWhitespace: options.trimWhitespace,
    ignoreEmptyLines: options.ignoreEmptyLines,
    ignoreCase: options.ignoreCase,
  }).map((item) => ({ key: item.key, raw: item.raw }));
}

function countKeys(items: Token[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.key, (counts.get(item.key) ?? 0) + 1);
  }
  return counts;
}

function keyOfRaw(a: Token[], b: Token[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const item of [...a, ...b]) {
    if (!map.has(item.raw)) {
      map.set(item.raw, item.key);
    }
  }
  return map;
}

function countKeyOccurrences(
  raws: string[],
  key: string,
  lookup: Map<string, string>,
): number {
  return raws.reduce(
    (total, raw) => total + ((lookup.get(raw) ?? raw) === key ? 1 : 0),
    0,
  );
}

describe("comparison invariants", () => {
  const optionCombos: CompareOptions[] = [];
  for (const trimWhitespace of [false, true]) {
    for (const ignoreEmptyLines of [false, true]) {
      for (const ignoreCase of [false, true]) {
        for (const removeDuplicates of [false, true]) {
          optionCombos.push({
            trimWhitespace,
            ignoreEmptyLines,
            ignoreCase,
            removeDuplicates,
          });
        }
      }
    }
  }

  it("holds for every fixed input pair and option combination", () => {
    for (const options of optionCombos) {
      for (const aLines of sequences) {
        for (const bLines of sequences) {
          const aTokens = tokens(aLines, options);
          const bTokens = tokens(bLines, options);
          const result = compareLists(
            aLines.join("\n"),
            bLines.join("\n"),
            options,
          );

          expect(result.differences).toEqual([
            ...result.onlyA,
            ...result.onlyB,
          ]);

          expect(result.stats.rowsA).toBe(aTokens.length);
          expect(result.stats.rowsB).toBe(bTokens.length);
          expect(result.stats.uniqueA).toBe(
            new Set(aTokens.map((t) => t.key)).size,
          );
          expect(result.stats.uniqueB).toBe(
            new Set(bTokens.map((t) => t.key)).size,
          );
          expect(result.stats.onlyA).toBe(result.onlyA.length);
          expect(result.stats.onlyB).toBe(result.onlyB.length);
          expect(result.stats.matches).toBe(result.matches.length);

          const expected = expectedResult(aTokens, bTokens, options);
          expect(result.onlyA).toEqual(expected.onlyA);
          expect(result.onlyB).toEqual(expected.onlyB);
          expect(result.matches).toEqual(expected.matches);
          expect(result.union).toEqual(expected.union);
        }
      }
    }
  });

  it("set mode: each key lands in exactly one category with union completeness and key symmetry", () => {
    const aLines = [" A ", "a", "b", "b", "c"];
    const bLines = ["a", "B", "c", "d", "d"];
    const options: CompareOptions = {
      trimWhitespace: true,
      ignoreEmptyLines: true,
      ignoreCase: true,
      removeDuplicates: true,
    };
    const aTokens = tokens(aLines, options);
    const bTokens = tokens(bLines, options);
    const result = compareLists(aLines.join("\n"), bLines.join("\n"), options);

    const keysA = new Set(aTokens.map((t) => t.key));
    const keysB = new Set(bTokens.map((t) => t.key));
    const lookup = keyOfRaw(aTokens, bTokens);

    const categoryOf = new Map<string, string>();
    const register = (raws: string[], category: string): void => {
      for (const raw of raws) {
        const key = lookup.get(raw) ?? raw;
        expect(categoryOf.has(key)).toBe(false);
        categoryOf.set(key, category);
      }
    };

    register(result.matches, "matches");
    register(result.onlyA, "onlyA");
    register(result.onlyB, "onlyB");

    const allKeys = new Set([...keysA, ...keysB]);
    for (const key of allKeys) {
      expect(categoryOf.has(key)).toBe(true);
      if (keysA.has(key) && keysB.has(key)) {
        expect(categoryOf.get(key)).toBe("matches");
      } else if (keysA.has(key)) {
        expect(categoryOf.get(key)).toBe("onlyA");
      } else {
        expect(categoryOf.get(key)).toBe("onlyB");
      }
    }

    const unionKeys = result.union.map((raw) => lookup.get(raw) ?? raw);
    expect(new Set(unionKeys)).toEqual(allKeys);
    expect(result.union).toHaveLength(allKeys.size);
  });

  it("multiset mode: per-key counts follow the min/max formulas", () => {
    const aLines = ["a", "b", "a", "c", "b"];
    const bLines = ["a", "b", "b", "d", "a", "d"];
    const options: CompareOptions = {
      trimWhitespace: true,
      ignoreEmptyLines: true,
      ignoreCase: false,
      removeDuplicates: false,
    };
    const aTokens = tokens(aLines, options);
    const bTokens = tokens(bLines, options);
    const result = compareLists(aLines.join("\n"), bLines.join("\n"), options);

    const countA = countKeys(aTokens);
    const countB = countKeys(bTokens);
    const lookup = keyOfRaw(aTokens, bTokens);

    const allKeys = new Set([...countA.keys(), ...countB.keys()]);
    for (const key of allKeys) {
      const cA = countA.get(key) ?? 0;
      const cB = countB.get(key) ?? 0;

      expect(countKeyOccurrences(result.matches, key, lookup)).toBe(
        Math.min(cA, cB),
      );
      expect(countKeyOccurrences(result.onlyA, key, lookup)).toBe(
        Math.max(cA - cB, 0),
      );
      expect(countKeyOccurrences(result.onlyB, key, lookup)).toBe(
        Math.max(cB - cA, 0),
      );
      expect(countKeyOccurrences(result.union, key, lookup)).toBe(
        Math.max(cA, cB),
      );
    }
  });

  it("keeps stable order and raw representatives", () => {
    const aLines = [" A ", "a", "b", "b"];
    const bLines = ["a", "B", "b", "b"];
    const options: CompareOptions = {
      trimWhitespace: true,
      ignoreEmptyLines: true,
      ignoreCase: true,
      removeDuplicates: false,
    };
    const result = compareLists(aLines.join("\n"), bLines.join("\n"), options);

    expect(result.matches).toEqual([" A ", "b", "b"]);
    expect(result.onlyA).toEqual(["a"]);
    expect(result.onlyB).toEqual(["b"]);
    expect(result.union).toEqual([" A ", "a", "b", "b", "b"]);
  });

  it("stays correct on 10_000 lines per side", () => {
    const aLines = Array.from({ length: 10_000 }, (_, i) => "k" + (i % 1000));
    const bLines = Array.from({ length: 10_000 }, (_, i) => "k" + (i % 997));
    const options: CompareOptions = {
      trimWhitespace: true,
      ignoreEmptyLines: true,
      ignoreCase: false,
      removeDuplicates: false,
    };
    const result = compareLists(aLines.join("\n"), bLines.join("\n"), options);

    const countA = countKeys(tokens(aLines, options));
    const countB = countKeys(tokens(bLines, options));

    let expectedMatches = 0;
    let expectedOnlyA = 0;
    let expectedOnlyB = 0;
    let expectedUnion = 0;
    for (const key of new Set([...countA.keys(), ...countB.keys()])) {
      const cA = countA.get(key) ?? 0;
      const cB = countB.get(key) ?? 0;
      expectedMatches += Math.min(cA, cB);
      expectedOnlyA += Math.max(cA - cB, 0);
      expectedOnlyB += Math.max(cB - cA, 0);
      expectedUnion += Math.max(cA, cB);
    }

    expect(result.stats.rowsA).toBe(10_000);
    expect(result.stats.rowsB).toBe(10_000);
    expect(result.stats.uniqueA).toBe(1000);
    expect(result.stats.uniqueB).toBe(997);
    expect(result.matches).toHaveLength(expectedMatches);
    expect(result.onlyA).toHaveLength(expectedOnlyA);
    expect(result.onlyB).toHaveLength(expectedOnlyB);
    expect(result.union).toHaveLength(expectedUnion);
    expect(result.differences).toEqual([...result.onlyA, ...result.onlyB]);
  });
});

function expectedResult(
  a: Token[],
  b: Token[],
  options: CompareOptions,
): { onlyA: string[]; onlyB: string[]; matches: string[]; union: string[] } {
  if (options.removeDuplicates) {
    return expectedSet(a, b);
  }
  return expectedMultiset(a, b);
}

function expectedSet(
  a: Token[],
  b: Token[],
): { onlyA: string[]; onlyB: string[]; matches: string[]; union: string[] } {
  const firstA = new Map<string, string>();
  for (const item of a) {
    if (!firstA.has(item.key)) {
      firstA.set(item.key, item.raw);
    }
  }
  const firstB = new Map<string, string>();
  for (const item of b) {
    if (!firstB.has(item.key)) {
      firstB.set(item.key, item.raw);
    }
  }

  const matches: string[] = [];
  const onlyA: string[] = [];
  for (const [key, raw] of firstA) {
    if (firstB.has(key)) {
      matches.push(raw);
    } else {
      onlyA.push(raw);
    }
  }

  const onlyB: string[] = [];
  const union = [...firstA.values()];
  for (const [key, raw] of firstB) {
    if (!firstA.has(key)) {
      onlyB.push(raw);
      union.push(raw);
    }
  }

  return { onlyA, onlyB, matches, union };
}

function expectedMultiset(
  a: Token[],
  b: Token[],
): { onlyA: string[]; onlyB: string[]; matches: string[]; union: string[] } {
  const countA = countKeys(a);
  const countB = countKeys(b);

  const minPerKey = new Map<string, number>();
  for (const key of new Set([...countA.keys(), ...countB.keys()])) {
    minPerKey.set(key, Math.min(countA.get(key) ?? 0, countB.get(key) ?? 0));
  }

  const seenA = new Map<string, number>();
  const matches: string[] = [];
  const onlyA: string[] = [];
  for (const item of a) {
    const occurrence = seenA.get(item.key) ?? 0;
    seenA.set(item.key, occurrence + 1);
    if (occurrence < (minPerKey.get(item.key) ?? 0)) {
      matches.push(item.raw);
    } else {
      onlyA.push(item.raw);
    }
  }

  const seenB = new Map<string, number>();
  const onlyB: string[] = [];
  for (const item of b) {
    const occurrence = seenB.get(item.key) ?? 0;
    seenB.set(item.key, occurrence + 1);
    if (occurrence >= (minPerKey.get(item.key) ?? 0)) {
      onlyB.push(item.raw);
    }
  }

  const union = [...a.map((item) => item.raw), ...onlyB];

  return { onlyA, onlyB, matches, union };
}
