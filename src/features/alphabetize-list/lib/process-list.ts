import type { TransformListOptions } from "../model/types";

export function processListInput(
  input: string,
  options: TransformListOptions,
): string[] {
  if (input === "") {
    return [];
  }

  const items: string[] = [];

  for (const line of input.split(/\r?\n/)) {
    const processed = options.trimWhitespace ? line.trim() : line;
    if (options.ignoreEmptyLines && processed === "") {
      continue;
    }
    items.push(processed);
  }

  return items;
}

export function serializeList(items: readonly string[]): string {
  return items.join("\n");
}
