import type { CompareOptions, ListItem } from "../model/types";
import { normalizeItem } from "./normalize-item";

export function parseList(
  input: string,
  options: Pick<
    CompareOptions,
    "trimWhitespace" | "ignoreEmptyLines" | "ignoreCase"
  >,
): ListItem[] {
  if (input === "") {
    return [];
  }

  const items: ListItem[] = [];
  let index = 0;

  for (const line of input.split(/\r?\n/)) {
    const trimmed = options.trimWhitespace ? line.trim() : line;

    if (options.ignoreEmptyLines && trimmed === "") {
      index += 1;
      continue;
    }

    items.push({
      raw: line,
      key: normalizeItem(line, {
        trimWhitespace: options.trimWhitespace,
        ignoreCase: options.ignoreCase,
      }),
      index,
    });
    index += 1;
  }

  return items;
}
