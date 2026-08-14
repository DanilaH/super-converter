import type { CompareOptions, CompareResult } from "../model/types";
import { parseList } from "./parse-list";

export function compareLists(
  rawA: string,
  rawB: string,
  options: CompareOptions,
): CompareResult {
  if (!options.removeDuplicates) {
    throw new Error("Multiset comparison is not implemented yet");
  }

  const parseOptions = {
    trimWhitespace: options.trimWhitespace,
    ignoreEmptyLines: options.ignoreEmptyLines,
    ignoreCase: options.ignoreCase,
  };

  const aItems = parseList(rawA, parseOptions);
  const bItems = parseList(rawB, parseOptions);

  const firstA = new Map<string, string>();
  for (const item of aItems) {
    if (!firstA.has(item.key)) {
      firstA.set(item.key, item.raw);
    }
  }

  const firstB = new Map<string, string>();
  for (const item of bItems) {
    if (!firstB.has(item.key)) {
      firstB.set(item.key, item.raw);
    }
  }

  const onlyA: string[] = [];
  const matches: string[] = [];
  for (const [key, raw] of firstA) {
    if (firstB.has(key)) {
      matches.push(raw);
    } else {
      onlyA.push(raw);
    }
  }

  const onlyB: string[] = [];
  const union = new Map<string, string>();
  for (const [key, raw] of firstA) {
    union.set(key, raw);
  }
  for (const [key, raw] of firstB) {
    if (!firstA.has(key)) {
      onlyB.push(raw);
      union.set(key, raw);
    }
  }

  return {
    onlyA,
    onlyB,
    matches,
    union: [...union.values()],
    differences: [...onlyA, ...onlyB],
    stats: {
      rowsA: aItems.length,
      rowsB: bItems.length,
      uniqueA: firstA.size,
      uniqueB: firstB.size,
      onlyA: onlyA.length,
      onlyB: onlyB.length,
      matches: matches.length,
    },
  };
}
