import {
  processListInput,
  serializeList,
} from "../../list-transform/lib/process-list";
import type {
  RandomizeOptions,
  RandomizeResult,
  RandomSource,
} from "../model/types";

export function shuffleItems(
  items: readonly string[],
  random: RandomSource = Math.random,
): string[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function randomizeList(
  input: string,
  options: RandomizeOptions,
  random: RandomSource = Math.random,
): RandomizeResult {
  const items = shuffleItems(processListInput(input, options), random);
  return {
    items,
    text: serializeList(items),
  };
}
