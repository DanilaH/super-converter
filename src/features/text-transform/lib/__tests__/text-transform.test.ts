import { describe, expect, it } from "vitest";
import {
  joinColumnItems,
  normalizeLineEndings,
  removeLineBreaks,
} from "../text-transform";

const baseLineBreakOptions = {
  replacement: " ",
  keepParagraphs: false,
  trimEachLine: false,
  collapseSpaces: false,
} as const;

describe("normalizeLineEndings", () => {
  it("normalizes LF, CRLF and bare CR to LF", () => {
    expect(normalizeLineEndings("a\nb\r\nc\rd")).toBe("a\nb\nc\nd");
  });
});

describe("removeLineBreaks", () => {
  it.each(["a\nb", "a\r\nb", "a\rb"])(
    "joins common line endings with the default space for %j",
    (input) => {
      expect(removeLineBreaks(input, baseLineBreakOptions)).toBe("a b");
    },
  );

  it("preserves paragraph boundaries while joining hard wraps", () => {
    expect(
      removeLineBreaks("a\nb\n\nc\nd", {
        ...baseLineBreakOptions,
        keepParagraphs: true,
      }),
    ).toBe("a b\n\nc d");
  });

  it("treats whitespace-only blank lines as paragraph boundaries", () => {
    expect(
      removeLineBreaks("a\n  \nb", {
        ...baseLineBreakOptions,
        keepParagraphs: true,
      }),
    ).toBe("a\n\nb");
  });

  it("drops blank paragraph separator lines when paragraph preservation is disabled", () => {
    expect(
      removeLineBreaks("a\nb\n\n  \nc\nd", {
        ...baseLineBreakOptions,
        replacement: ", ",
      }),
    ).toBe("a, b, c, d");
  });

  it.each([
    ["", "ab"],
    [",", "a,b"],
    [", ", "a, b"],
    [";", "a;b"],
    [" / ", "a / b"],
  ])("supports replacement %j", (replacement, expected) => {
    expect(
      removeLineBreaks("a\nb", {
        ...baseLineBreakOptions,
        replacement,
      }),
    ).toBe(expected);
  });

  it("can trim lines and collapse repeated horizontal whitespace", () => {
    expect(
      removeLineBreaks("  alpha   one  \n beta   two ", {
        ...baseLineBreakOptions,
        trimEachLine: true,
        collapseSpaces: true,
      }),
    ).toBe("alpha one beta two");
  });

  it("returns an empty string for untouched empty input", () => {
    expect(removeLineBreaks("", baseLineBreakOptions)).toBe("");
  });
});

describe("joinColumnItems", () => {
  const defaults = { trimWhitespace: true, ignoreEmptyLines: true } as const;

  it("serializes a one-item-per-line column with comma and space", () => {
    expect(joinColumnItems("apple\nbanana\ncherry", defaults, ", ")).toEqual({
      items: ["apple", "banana", "cherry"],
      text: "apple, banana, cherry",
    });
  });

  it("supports CR input, blank filtering and trimming", () => {
    expect(joinColumnItems(" apple \r\r banana ", defaults, "|")).toEqual({
      items: ["apple", "banana"],
      text: "apple|banana",
    });
  });

  it.each([
    [",", "a,b"],
    [";", "a;b"],
    ["|", "a|b"],
    ["\t", "a\tb"],
    ["::", "a::b"],
  ])("supports delimiter %j", (delimiter, expected) => {
    expect(joinColumnItems("a\nb", defaults, delimiter).text).toBe(expected);
  });

  it("preserves duplicates and Unicode", () => {
    expect(joinColumnItems("ёж\n猫\nёж", defaults, ", ").items).toEqual([
      "ёж",
      "猫",
      "ёж",
    ]);
  });

  it("respects trim and empty-line options when disabled", () => {
    expect(
      joinColumnItems(
        " a \n\n b ",
        { trimWhitespace: false, ignoreEmptyLines: false },
        ",",
      ),
    ).toEqual({
      items: [" a ", "", " b "],
      text: " a ,, b ",
    });
  });
});
