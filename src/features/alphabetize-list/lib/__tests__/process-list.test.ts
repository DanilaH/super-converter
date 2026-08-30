import { describe, expect, it } from "vitest";
import { processListInput, serializeList } from "../process-list";

describe("processListInput", () => {
  it("treats an untouched empty input as zero items", () => {
    expect(
      processListInput("", {
        trimWhitespace: false,
        ignoreEmptyLines: false,
      }),
    ).toEqual([]);
  });

  it("trims before empty-line filtering", () => {
    expect(
      processListInput("  Apple  \n   \nBanana", {
        trimWhitespace: true,
        ignoreEmptyLines: true,
      }),
    ).toEqual(["Apple", "Banana"]);
  });

  it("preserves whitespace-only lines when trim is off", () => {
    expect(
      processListInput("A\n   \nB", {
        trimWhitespace: false,
        ignoreEmptyLines: true,
      }),
    ).toEqual(["A", "   ", "B"]);
  });

  it("accepts CRLF input", () => {
    expect(
      processListInput("A\r\nB", {
        trimWhitespace: true,
        ignoreEmptyLines: true,
      }),
    ).toEqual(["A", "B"]);
  });
});

describe("serializeList", () => {
  it("uses exact LF join serialization", () => {
    expect(serializeList(["A", "B"])).toBe("A\nB");
    expect(serializeList(["A", ""])).toBe("A\n");
    expect(serializeList([""])).toBe("");
  });
});
