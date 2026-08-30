import { describe, expect, it } from "vitest";
import { randomizeList, shuffleItems } from "../randomize-list";

function sequenceRandom(values: readonly number[]): () => number {
  let index = 0;
  return () => values[index++] ?? 0;
}

describe("shuffleItems", () => {
  it("uses deterministic Fisher-Yates swaps with an injected random source", () => {
    expect(shuffleItems(["A", "B", "C", "D"], sequenceRandom([0, 0, 0]))).toEqual([
      "B",
      "C",
      "D",
      "A",
    ]);
  });

  it("preserves every occurrence including duplicates", () => {
    const result = shuffleItems(
      ["A", "A", "B", "C"],
      sequenceRandom([0.5, 0.5, 0.5]),
    );
    expect([...result].sort()).toEqual(["A", "A", "B", "C"]);
  });

  it("allows a valid shuffle to equal the source order", () => {
    expect(shuffleItems(["A", "B", "C"], sequenceRandom([0.99, 0.99]))).toEqual([
      "A",
      "B",
      "C",
    ]);
  });

  it("does not mutate the source array", () => {
    const source = ["A", "B", "C"];
    shuffleItems(source, sequenceRandom([0, 0]));
    expect(source).toEqual(["A", "B", "C"]);
  });
});

describe("randomizeList", () => {
  it("applies transform preprocessing before shuffling and serializing", () => {
    expect(
      randomizeList(
        "  A  \n\nB\nA",
        { trimWhitespace: true, ignoreEmptyLines: true },
        sequenceRandom([0, 0]),
      ),
    ).toEqual({
      items: ["B", "A", "A"],
      text: "B\nA\nA",
    });
  });

  it("treats untouched empty input as zero items", () => {
    expect(
      randomizeList(
        "",
        { trimWhitespace: false, ignoreEmptyLines: false },
        sequenceRandom([]),
      ),
    ).toEqual({ items: [], text: "" });
  });
});
