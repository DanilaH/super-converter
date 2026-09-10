import { shuffleItems } from "../../randomize-list/lib/randomize-list";
import type { RandomSource } from "../../randomize-list/model/types";

export type TeamSplitConfig =
  | { mode: "teamCount"; value: number }
  | { mode: "targetSize"; value: number };

export type PairResult = {
  pairs: Array<readonly [string, string]>;
  unpaired: string | null;
};

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive integer`);
  }
}

export function splitIntoBalancedGroups(
  items: readonly string[],
  config: TeamSplitConfig,
  random: RandomSource = Math.random,
): string[][] {
  assertPositiveInteger(config.value, "Group value");

  if (items.length === 0) {
    return [];
  }

  const groupCount =
    config.mode === "teamCount"
      ? config.value
      : Math.ceil(items.length / config.value);

  if (groupCount > items.length) {
    throw new RangeError("Team count cannot exceed item count");
  }

  const shuffled = shuffleItems(items, random);
  const baseSize = Math.floor(shuffled.length / groupCount);
  const remainder = shuffled.length % groupCount;
  const groups: string[][] = [];
  let offset = 0;

  for (let index = 0; index < groupCount; index += 1) {
    const size = baseSize + (index < remainder ? 1 : 0);
    groups.push(shuffled.slice(offset, offset + size));
    offset += size;
  }

  return groups;
}

export function pairRandomly(
  items: readonly string[],
  random: RandomSource = Math.random,
): PairResult {
  const shuffled = shuffleItems(items, random);
  const pairs: Array<readonly [string, string]> = [];
  const pairedLength = shuffled.length - (shuffled.length % 2);

  for (let index = 0; index < pairedLength; index += 2) {
    pairs.push([shuffled[index]!, shuffled[index + 1]!]);
  }

  return {
    pairs,
    unpaired: shuffled.length % 2 === 1 ? shuffled.at(-1)! : null,
  };
}
