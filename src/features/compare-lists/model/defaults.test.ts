import { describe, expect, it } from "vitest";
import { DEFAULT_COMPARE_OPTIONS } from "./defaults";

describe("DEFAULT_COMPARE_OPTIONS", () => {
  it("contains exactly the defaults from PRODUCT.md section 5.4", () => {
    expect(DEFAULT_COMPARE_OPTIONS).toEqual({
      trimWhitespace: true,
      ignoreEmptyLines: true,
      ignoreCase: false,
      removeDuplicates: true,
    });
  });
});
