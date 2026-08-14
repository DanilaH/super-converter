import { describe, expect, it } from "vitest";
import { compareLists } from "../compare-lists";

const baseOptions = {
  trimWhitespace: true,
  ignoreEmptyLines: true,
  ignoreCase: false,
  removeDuplicates: true,
};

describe("compareLists", () => {
  it("returns empty results when both inputs are empty", () => {
    const result = compareLists("", "", baseOptions);

    expect(result).toEqual({
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
    });
  });

  it("keeps everything in onlyA when only A is filled", () => {
    const result = compareLists("a\nb", "", baseOptions);

    expect(result.onlyA).toEqual(["a", "b"]);
    expect(result.onlyB).toEqual([]);
    expect(result.matches).toEqual([]);
    expect(result.union).toEqual(["a", "b"]);
    expect(result.stats.rowsA).toBe(2);
    expect(result.stats.rowsB).toBe(0);
    expect(result.stats.uniqueA).toBe(2);
  });

  it("keeps everything in onlyB when only B is filled", () => {
    const result = compareLists("", "x\ny", baseOptions);

    expect(result.onlyA).toEqual([]);
    expect(result.onlyB).toEqual(["x", "y"]);
    expect(result.matches).toEqual([]);
    expect(result.union).toEqual(["x", "y"]);
    expect(result.stats.rowsB).toBe(2);
    expect(result.stats.uniqueB).toBe(2);
  });

  it("puts all values in matches on a full overlap", () => {
    const result = compareLists("a\nb\nc", "a\nb\nc", baseOptions);

    expect(result.onlyA).toEqual([]);
    expect(result.onlyB).toEqual([]);
    expect(result.matches).toEqual(["a", "b", "c"]);
    expect(result.differences).toEqual([]);
  });

  it("splits values correctly on a partial overlap", () => {
    const result = compareLists("a\nb\nc", "b\nc\nd", baseOptions);

    expect(result.onlyA).toEqual(["a"]);
    expect(result.onlyB).toEqual(["d"]);
    expect(result.matches).toEqual(["b", "c"]);
  });

  it("keeps everything separated when there are no matches", () => {
    const result = compareLists("a\nb", "x\ny", baseOptions);

    expect(result.matches).toEqual([]);
    expect(result.onlyA).toEqual(["a", "b"]);
    expect(result.onlyB).toEqual(["x", "y"]);
  });

  it("deduplicates repeated keys inside A and B", () => {
    const result = compareLists("b\na\nb\nc", "a\nd\nb\ne\nd", baseOptions);

    expect(result.onlyA).toEqual(["c"]);
    expect(result.matches).toEqual(["b", "a"]);
    expect(result.onlyB).toEqual(["d", "e"]);
    expect(result.union).toEqual(["b", "a", "c", "d", "e"]);
    expect(result.differences).toEqual(["c", "d", "e"]);
  });

  it("reports rows and unique stats under duplicates", () => {
    const result = compareLists("b\na\nb\nc", "a\nd\nb\ne\nd", baseOptions);

    expect(result.stats).toEqual({
      rowsA: 4,
      rowsB: 5,
      uniqueA: 3,
      uniqueB: 4,
      onlyA: 1,
      onlyB: 2,
      matches: 2,
    });
  });

  it("matches on trimmed keys but keeps the first raw from A", () => {
    const result = compareLists(" p \np\nq", "p\nq ", baseOptions);

    expect(result.matches).toEqual([" p ", "q"]);
    expect(result.onlyA).toEqual([]);
    expect(result.onlyB).toEqual([]);
    expect(result.stats.uniqueA).toBe(2);
  });

  it("matches case-insensitively and keeps the first raw from A", () => {
    const result = compareLists("A\nb\nC", "a\nB\nd", {
      ...baseOptions,
      ignoreCase: true,
    });

    expect(result.matches).toEqual(["A", "b"]);
    expect(result.onlyA).toEqual(["C"]);
    expect(result.onlyB).toEqual(["d"]);
  });

  it("handles Unicode values", () => {
    const result = compareLists("Привет\nмир", "ПРИВЕТ\nмир", {
      ...baseOptions,
      ignoreCase: true,
    });

    expect(result.matches).toEqual(["Привет", "мир"]);
    expect(result.onlyA).toEqual([]);
    expect(result.onlyB).toEqual([]);
  });

  it("keeps onlyA, matches and onlyB in first-appearance order", () => {
    const result = compareLists("z\na\nm\na\nz", "a\nz\nq", baseOptions);

    expect(result.onlyA).toEqual(["m"]);
    expect(result.matches).toEqual(["z", "a"]);
    expect(result.onlyB).toEqual(["q"]);
  });

  it("keeps union in first-appearance order of A then unseen B", () => {
    const result = compareLists("b\na\nc", "a\nd\nb\ne", baseOptions);

    expect(result.union).toEqual(["b", "a", "c", "d", "e"]);
  });

  it("produces differences as onlyA followed by onlyB", () => {
    const result = compareLists("a\nb\nc", "b\nc\nd\ne", baseOptions);

    expect(result.onlyA).toEqual(["a"]);
    expect(result.onlyB).toEqual(["d", "e"]);
    expect(result.differences).toEqual([...result.onlyA, ...result.onlyB]);
  });

  it("uses the first A representation for matches and union", () => {
    const result = compareLists(" a \na\nb\nb", "a\n b ", baseOptions);

    expect(result.matches).toEqual([" a ", "b"]);
    expect(result.union).toEqual([" a ", "b"]);
  });

  it("uses the first B representation for onlyB and the B-only part of union", () => {
    const result = compareLists("a", " X \nX\n y ", baseOptions);

    expect(result.onlyB).toEqual([" X ", " y "]);
    expect(result.union).toEqual(["a", " X ", " y "]);
  });

  it("treats empty lines as data when ignoreEmptyLines is off", () => {
    const result = compareLists("x\n", "", {
      ...baseOptions,
      ignoreEmptyLines: false,
    });

    expect(result.onlyA).toEqual(["x", ""]);
    expect(result.stats.rowsA).toBe(2);
    expect(result.stats.uniqueA).toBe(2);
  });

  it("does not sort results", () => {
    const result = compareLists("5\n1\n4\n2\n3", "9\n7\n8", baseOptions);

    expect(result.onlyA).toEqual(["5", "1", "4", "2", "3"]);
    expect(result.onlyB).toEqual(["9", "7", "8"]);
    expect(result.union).toEqual(["5", "1", "4", "2", "3", "9", "7", "8"]);
  });

  it("throws the exact error when removeDuplicates is off", () => {
    expect(() =>
      compareLists("a", "a", { ...baseOptions, removeDuplicates: false }),
    ).toThrow("Multiset comparison is not implemented yet");
  });

  it("does not mutate the raw strings or the options object", () => {
    const rawA = " A \nB";
    const rawB = "b\n C ";
    const options = { ...baseOptions, ignoreCase: true };

    compareLists(rawA, rawB, options);

    expect(rawA).toBe(" A \nB");
    expect(rawB).toBe("b\n C ");
    expect(options).toEqual({ ...baseOptions, ignoreCase: true });
  });
});
