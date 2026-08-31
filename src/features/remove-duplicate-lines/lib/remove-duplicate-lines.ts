import {
  processListInput,
  serializeList,
} from "../../list-transform/lib/process-list";
import type {
  RemoveDuplicateLinesOptions,
  RemoveDuplicateLinesResult,
} from "../model/types";

export function removeDuplicateLines(
  input: string,
  options: RemoveDuplicateLinesOptions,
): RemoveDuplicateLinesResult {
  const processedItems = processListInput(input, options);
  const seen = new Set<string>();
  const items: string[] = [];

  for (const value of processedItems) {
    const key = options.ignoreCase ? value.toLocaleLowerCase("en") : value;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    items.push(value);
  }

  return {
    items,
    text: serializeList(items),
    stats: {
      input: processedItems.length,
      unique: items.length,
      removed: processedItems.length - items.length,
    },
  };
}
