import { describe, expect, it } from "vitest";
import { parseList } from "../parse-list";

const options = {
  trimWhitespace: true,
  ignoreEmptyLines: true,
  ignoreCase: false,
};

describe("parseList", () => {
  it("returns zero items for an empty input with ignoreEmptyLines on", () => {
    expect(parseList("", options)).toEqual([]);
  });

  it("returns zero items for an empty input with ignoreEmptyLines off", () => {
    expect(parseList("", { ...options, ignoreEmptyLines: false })).toEqual([]);
  });

  it("splits on LF", () => {
    const items = parseList("a\nb\nc", options);

    expect(items).toEqual([
      { raw: "a", key: "a", index: 0 },
      { raw: "b", key: "b", index: 1 },
      { raw: "c", key: "c", index: 2 },
    ]);
  });

  it("splits on CRLF", () => {
    const items = parseList("a\r\nb\r\nc", options);

    expect(items).toEqual([
      { raw: "a", key: "a", index: 0 },
      { raw: "b", key: "b", index: 1 },
      { raw: "c", key: "c", index: 2 },
    ]);
  });

  it("handles mixed LF and CRLF separators", () => {
    const items = parseList("a\r\nb\nc\r\nd", options);

    expect(items).toEqual([
      { raw: "a", key: "a", index: 0 },
      { raw: "b", key: "b", index: 1 },
      { raw: "c", key: "c", index: 2 },
      { raw: "d", key: "d", index: 3 },
    ]);
  });

  it("does not treat a lone CR as a separator", () => {
    const items = parseList("a\rb", options);

    expect(items).toEqual([{ raw: "a\rb", key: "a\rb", index: 0 }]);
  });

  it("keeps a trailing lone CR as data", () => {
    const items = parseList("a\r", {
      trimWhitespace: false,
      ignoreEmptyLines: true,
      ignoreCase: false,
    });

    expect(items).toEqual([{ raw: "a\r", key: "a\r", index: 0 }]);
  });

  it("does not treat commas, semicolons or tabs as separators", () => {
    const items = parseList("a,b;c\td", options);

    expect(items).toEqual([{ raw: "a,b;c\td", key: "a,b;c\td", index: 0 }]);
  });

  it("does not treat U+2028 or U+2029 as separators", () => {
    const items = parseList("a\u2028b\u2029c", options);

    expect(items).toEqual([
      { raw: "a\u2028b\u2029c", key: "a\u2028b\u2029c", index: 0 },
    ]);
  });

  it("preserves Unicode values in raw and key", () => {
    const items = parseList("привет\n世界", options);

    expect(items).toEqual([
      { raw: "привет", key: "привет", index: 0 },
      { raw: "世界", key: "世界", index: 1 },
    ]);
  });

  it("preserves raw whitespace when trim is off", () => {
    const items = parseList(" A \nB", { ...options, trimWhitespace: false });

    expect(items[0]).toEqual({ raw: " A ", key: " A ", index: 0 });
  });

  it("trims keys but preserves raw values when trim is on", () => {
    const items = parseList(" A \nB", options);

    expect(items[0]).toEqual({ raw: " A ", key: "A", index: 0 });
    expect(items[1]).toEqual({ raw: "B", key: "B", index: 1 });
  });

  it("lowercases keys when ignoreCase is on", () => {
    const items = parseList("ABC\ndef", { ...options, ignoreCase: true });

    expect(items[0]).toEqual({ raw: "ABC", key: "abc", index: 0 });
    expect(items[1]).toEqual({ raw: "def", key: "def", index: 1 });
  });

  it("combines trim and ignore case", () => {
    const items = parseList(" A \nB", {
      trimWhitespace: true,
      ignoreEmptyLines: true,
      ignoreCase: true,
    });

    expect(items[0]).toEqual({ raw: " A ", key: "a", index: 0 });
  });

  it("turns 'I' into 'i' without locale-dependent rules", () => {
    const items = parseList("I", {
      trimWhitespace: true,
      ignoreEmptyLines: true,
      ignoreCase: true,
    });

    expect(items[0]).toEqual({ raw: "I", key: "i", index: 0 });
  });

  it("drops whitespace-only lines when trim and ignoreEmptyLines are on", () => {
    const items = parseList("a\n \nb", options);

    expect(items).toEqual([
      { raw: "a", key: "a", index: 0 },
      { raw: "b", key: "b", index: 2 },
    ]);
  });

  it("keeps whitespace-only lines as data when trim is off", () => {
    const items = parseList("a\n \nb", {
      trimWhitespace: false,
      ignoreEmptyLines: true,
      ignoreCase: false,
    });

    expect(items).toEqual([
      { raw: "a", key: "a", index: 0 },
      { raw: " ", key: " ", index: 1 },
      { raw: "b", key: "b", index: 2 },
    ]);
  });

  it("keeps whitespace-only lines as data when ignoreEmptyLines is off", () => {
    const items = parseList("a\n \nb", {
      trimWhitespace: true,
      ignoreEmptyLines: false,
      ignoreCase: false,
    });

    expect(items).toEqual([
      { raw: "a", key: "a", index: 0 },
      { raw: " ", key: "", index: 1 },
      { raw: "b", key: "b", index: 2 },
    ]);
  });

  it("drops inner empty lines and keeps physical indexes", () => {
    const items = parseList("x\n\ny", options);

    expect(items).toEqual([
      { raw: "x", key: "x", index: 0 },
      { raw: "y", key: "y", index: 2 },
    ]);
  });

  it("keeps inner empty lines as data when ignoreEmptyLines is off", () => {
    const items = parseList("x\n\ny", { ...options, ignoreEmptyLines: false });

    expect(items).toEqual([
      { raw: "x", key: "x", index: 0 },
      { raw: "", key: "", index: 1 },
      { raw: "y", key: "y", index: 2 },
    ]);
  });

  it("keeps the trailing empty line from a final LF as data", () => {
    const items = parseList("a\n", { ...options, ignoreEmptyLines: false });

    expect(items).toEqual([
      { raw: "a", key: "a", index: 0 },
      { raw: "", key: "", index: 1 },
    ]);
  });

  it("drops the trailing empty line from a final LF when ignoreEmptyLines is on", () => {
    const items = parseList("a\n", options);

    expect(items).toEqual([{ raw: "a", key: "a", index: 0 }]);
  });

  it("keeps the trailing empty line from a final CRLF as data", () => {
    const items = parseList("a\r\n", { ...options, ignoreEmptyLines: false });

    expect(items).toEqual([
      { raw: "a", key: "a", index: 0 },
      { raw: "", key: "", index: 1 },
    ]);
  });

  it("matches the documented example for 'a\\n'", () => {
    const items = parseList("a\n", {
      trimWhitespace: true,
      ignoreEmptyLines: false,
      ignoreCase: false,
    });

    expect(items).toEqual([
      { raw: "a", key: "a", index: 0 },
      { raw: "", key: "", index: 1 },
    ]);
  });

  it("matches the documented example for ' A \\n\\nb'", () => {
    const items = parseList(" A \n\nb", {
      trimWhitespace: true,
      ignoreEmptyLines: true,
      ignoreCase: true,
    });

    expect(items).toEqual([
      { raw: " A ", key: "a", index: 0 },
      { raw: "b", key: "b", index: 2 },
    ]);
  });

  it("keeps duplicate values as separate items", () => {
    const items = parseList("a\na\na", options);

    expect(items).toEqual([
      { raw: "a", key: "a", index: 0 },
      { raw: "a", key: "a", index: 1 },
      { raw: "a", key: "a", index: 2 },
    ]);
  });

  it("handles a single line of 100_000 characters", () => {
    const longLine = "x".repeat(100_000);
    const items = parseList(longLine, options);

    expect(items).toHaveLength(1);
    expect(items[0].raw).toHaveLength(100_000);
    expect(items[0].key).toHaveLength(100_000);
    expect(items[0].index).toBe(0);
  });

  it("does not mutate the input string", () => {
    const input = " A \r\n\nb ";

    parseList(input, { ...options, ignoreEmptyLines: false });

    expect(input).toBe(" A \r\n\nb ");
  });
});
