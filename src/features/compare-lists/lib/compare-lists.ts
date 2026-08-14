import type { CompareOptions, CompareResult, ListItem } from "../model/types";
import { parseList } from "./parse-list";

export function compareLists(
  rawA: string,
  rawB: string,
  options: CompareOptions,
): CompareResult {
  const parseOptions = {
    trimWhitespace: options.trimWhitespace,
    ignoreEmptyLines: options.ignoreEmptyLines,
    ignoreCase: options.ignoreCase,
  };

  const aItems = parseList(rawA, parseOptions);
  const bItems = parseList(rawB, parseOptions);

  if (options.removeDuplicates) {
    return compareAsSets(aItems, bItems);
  }

  return compareAsMultisets(aItems, bItems);
}

function compareAsSets(aItems: ListItem[], bItems: ListItem[]): CompareResult {
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

function compareAsMultisets(
  aItems: ListItem[],
  bItems: ListItem[],
): CompareResult {
  const countA = new Map<string, number>();
  for (const item of aItems) {
    countA.set(item.key, (countA.get(item.key) ?? 0) + 1);
  }

  const countB = new Map<string, number>();
  for (const item of bItems) {
    countB.set(item.key, (countB.get(item.key) ?? 0) + 1);
  }

  const matchedB = new Map(countB);

  const matches: string[] = [];
  const onlyA: string[] = [];
  for (const item of aItems) {
    const remaining = matchedB.get(item.key) ?? 0;
    if (remaining > 0) {
      matchedB.set(item.key, remaining - 1);
      matches.push(item.raw);
    } else {
      onlyA.push(item.raw);
    }
  }

  const onlyB: string[] = [];
  const union: string[] = [];
  for (const item of aItems) {
    union.push(item.raw);
  }
  const seenB = new Map<string, number>();
  for (const item of bItems) {
    const occurrence = seenB.get(item.key) ?? 0;
    seenB.set(item.key, occurrence + 1);
    if (occurrence >= (countA.get(item.key) ?? 0)) {
      onlyB.push(item.raw);
      union.push(item.raw);
    }
  }

  return {
    onlyA,
    onlyB,
    matches,
    union,
    differences: [...onlyA, ...onlyB],
    stats: {
      rowsA: aItems.length,
      rowsB: bItems.length,
      uniqueA: countA.size,
      uniqueB: countB.size,
      onlyA: onlyA.length,
      onlyB: onlyB.length,
      matches: matches.length,
    },
  };
}
