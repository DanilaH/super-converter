import type { EditorialContent } from "./en";

export type RemoveDuplicateLinesMessages = {
  heading: string;
  listLabel: string;
  pastePlaceholder: string;
  clear: string;
  loadExample: string;
  replaceExampleConfirmation: string;
  options: string;
  trimWhitespace: string;
  ignoreEmptyLines: string;
  ignoreCase: string;
  resultLabel: string;
  item: string;
  items: string;
  emptyResult: string;
  noEffectiveItems: string;
  input: string;
  unique: string;
  removed: string;
  copy: string;
  copied: string;
  download: string;
  copyError: string;
  noscript: string;
};

export const removeDuplicateLinesContent = {
  page: {
    heading: "Remove Duplicate Lines",
    description:
      "Remove repeated lines while keeping the first occurrence and original order.",
    privacy: "Processed locally in your browser.",
  },
  tool: {
    heading: "Remove duplicate lines",
    listLabel: "List",
    pastePlaceholder: "Paste one item per line",
    clear: "Clear",
    loadExample: "Try example",
    replaceExampleConfirmation:
      "Load the example and replace your current text? Your current input will be lost.",
    options: "Options",
    trimWhitespace: "Trim surrounding whitespace",
    ignoreEmptyLines: "Ignore empty lines",
    ignoreCase: "Ignore case",
    resultLabel: "Unique lines",
    item: "item",
    items: "items",
    emptyResult: "Paste text or a list to remove duplicate lines.",
    noEffectiveItems: "No lines remain with the current options.",
    input: "Input",
    unique: "Unique",
    removed: "Removed",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    copyError: "Couldn’t copy. Select the result manually.",
    noscript:
      "JavaScript is required to remove duplicate lines. Your content is processed locally in your browser and never uploaded for deduplication.",
  } satisfies RemoveDuplicateLinesMessages,
  editorial: {
    howToHeading: "How to remove duplicate lines",
    howToSteps: [
      "Paste text or a list with one item per line.",
      "Adjust surrounding-whitespace, empty-line or case handling if needed.",
      "Duplicate lines are removed automatically while the first occurrence stays in place.",
      "Review the unique lines, then copy or download the result.",
    ],
    resultsHeading: "How duplicate removal works",
    resultsIntro:
      "The tool processes lines from top to bottom and keeps the first occurrence of each duplicate identity. It does not sort the result, so unique lines remain in their original order.",
    resultsItems: [
      {
        term: "Input",
        description:
          "counts lines after the current whitespace and empty-line options, before duplicate removal.",
      },
      {
        term: "Unique",
        description: "counts the first occurrences emitted in the result.",
      },
      {
        term: "Removed",
        description: "is the processed input count minus the unique count.",
      },
    ],
    commonUsesHeading: "Common ways to remove duplicate lines",
    commonUsesIntro: "Duplicate-line removal is useful for data such as:",
    commonUsesItems: [
      "keywords and search terms",
      "IDs and reference values",
      "URLs and domains",
      "names and labels",
      "columns copied from Excel or Google Sheets",
    ],
    dataHeading: "How your data is processed",
    dataParagraph:
      "Duplicate removal happens entirely in your browser. The pasted lines and unique result are not uploaded for tool processing.",
    dataItems: [
      "Trim surrounding whitespace removes spaces and tabs from the beginning and end of emitted lines before duplicate matching. When it is off, lines that differ only by surrounding whitespace remain distinct.",
      "Ignore empty lines removes empty processed items when enabled.",
      "Ignore case changes duplicate identity only; it does not lowercase the retained line.",
      "Copy and Download export the result only after you activate those actions.",
    ],
    dataLinkLabel: "See the Privacy page for the full details.",
    faqHeading: "Frequently asked questions",
    faqItems: [
      {
        question: "Which duplicate line is kept?",
        answer:
          "The first occurrence is kept. Later lines with the same duplicate identity are removed, and the remaining lines keep their original order.",
      },
      {
        question: "Can duplicate matching ignore uppercase and lowercase?",
        answer:
          "Yes. Turn on Ignore case to treat case variants such as Apple and apple as duplicates while preserving the text of the first retained occurrence.",
      },
      {
        question:
          "Why can two lines that look the same remain when trimming is off?",
        answer:
          "Spaces or tabs at the beginning or end of a line are part of that line when Trim surrounding whitespace is off, so visually similar lines can still be distinct.",
      },
      {
        question: "Does the tool sort the unique lines?",
        answer:
          "No. Duplicate removal preserves first-occurrence order. Use the Alphabetizer separately if you also want alphabetical sorting.",
      },
      {
        question: "Can I remove duplicate lines from a spreadsheet column?",
        answer:
          "Yes. Paste one column with one value per line. Each line is processed as one item.",
      },
      {
        question: "Is my text uploaded?",
        answer:
          "No. Duplicate removal runs locally in your browser. Your pasted lines are not sent to a backend for processing or saved by the site.",
      },
    ],
  } satisfies EditorialContent,
} as const;
