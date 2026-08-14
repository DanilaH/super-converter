import type { CompareOptions } from "../model/types";

export function normalizeItem(
  raw: string,
  options: Pick<CompareOptions, "trimWhitespace" | "ignoreCase">,
): string {
  let key = options.trimWhitespace ? raw.trim() : raw;

  if (options.ignoreCase) {
    key = key.toLowerCase();
  }

  return key;
}
