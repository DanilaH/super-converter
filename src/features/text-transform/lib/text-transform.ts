import { processListInput } from "../../list-transform/lib/process-list";
import type { TransformListOptions } from "../../list-transform/model/types";

export type LineBreakOptions = {
  replacement: string;
  keepParagraphs: boolean;
  trimEachLine: boolean;
  collapseSpaces: boolean;
};

export function normalizeLineEndings(input: string): string {
  return input.replace(/\r\n?/g, "\n");
}

function normalizeOutputSpaces(value: string, collapse: boolean): string {
  return collapse ? value.replace(/[\t ]+/g, " ") : value;
}

function prepareLine(line: string, trimEachLine: boolean): string {
  return trimEachLine ? line.trim() : line;
}

export function removeLineBreaks(
  input: string,
  options: LineBreakOptions,
): string {
  if (input === "") {
    return "";
  }

  const normalized = normalizeLineEndings(input);

  if (!options.keepParagraphs) {
    const lines = normalized
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => prepareLine(line, options.trimEachLine));
    return normalizeOutputSpaces(
      lines.join(options.replacement),
      options.collapseSpaces,
    );
  }

  const paragraphs: string[] = [];
  let currentLines: string[] = [];

  const flushParagraph = (): void => {
    if (currentLines.length === 0) {
      return;
    }
    paragraphs.push(
      normalizeOutputSpaces(
        currentLines.join(options.replacement),
        options.collapseSpaces,
      ),
    );
    currentLines = [];
  };

  for (const rawLine of normalized.split("\n")) {
    if (rawLine.trim() === "") {
      flushParagraph();
      continue;
    }
    currentLines.push(prepareLine(rawLine, options.trimEachLine));
  }
  flushParagraph();

  return paragraphs.join("\n\n");
}

export function joinColumnItems(
  input: string,
  options: TransformListOptions,
  delimiter: string,
): { items: string[]; text: string } {
  const items = processListInput(normalizeLineEndings(input), options);
  return {
    items,
    text: items.join(delimiter),
  };
}
