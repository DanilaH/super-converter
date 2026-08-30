import { processListInput, serializeList } from "../../list-transform/lib/process-list";
import type {
  AlphabetizeOptions,
  AlphabetizeResult,
} from "../model/types";

const ENGLISH_COLLATOR = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "accent",
});

export function alphabetizeList(
  input: string,
  options: AlphabetizeOptions,
): AlphabetizeResult {
  const processedItems = processListInput(input, options);
  const items = processedItems
    .map((value, index) => ({ value, index }))
    .sort((a, b) => {
      const comparison = ENGLISH_COLLATOR.compare(a.value, b.value);
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
