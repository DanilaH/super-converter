import {
  processListInput,
  serializeList,
} from "../../list-transform/lib/process-list";
import type { AlphabetizeOptions, AlphabetizeResult } from "../model/types";

const collators = new Map<string, Intl.Collator>();

function collatorFor(locale: string): Intl.Collator {
  const cached = collators.get(locale);
  if (cached) {
    return cached;
  }

  const collator = new Intl.Collator(locale, {
    numeric: true,
    sensitivity: "accent",
  });
  collators.set(locale, collator);
  return collator;
}

export function alphabetizeList(
  input: string,
  options: AlphabetizeOptions,
  collatorLocale = "en",
): AlphabetizeResult {
  const collator = collatorFor(collatorLocale);
  const processedItems = processListInput(input, options);
  const items = processedItems
    .map((value, index) => ({ value, index }))
    .sort((a, b) => {
      const comparison = collator.compare(a.value, b.value);
      if (comparison === 0) {
        return a.index - b.index;
      }
      return options.order === "asc" ? comparison : -comparison;
    })
    .map(({ value }) => value);

  return {
    items,
    text: serializeList(items),
  };
}
