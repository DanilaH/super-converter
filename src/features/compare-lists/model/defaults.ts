import type { CompareOptions } from "./types";

// Values are defined in PRODUCT.md, section 5.4.
export const DEFAULT_COMPARE_OPTIONS: CompareOptions = {
  trimWhitespace: true,
  ignoreEmptyLines: true,
  ignoreCase: false,
  removeDuplicates: true,
};
