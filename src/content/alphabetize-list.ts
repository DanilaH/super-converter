import type { EditorialContent } from "./en";

export type AlphabetizeMessages = {
  heading: string;
  listLabel: string;
  pastePlaceholder: string;
  clear: string;
  loadExample: string;
  replaceExampleConfirmation: string;
  options: string;
  trimWhitespace: string;
  ignoreEmptyLines: string;
  order: string;
  ascending: string;
  descending: string;
  resultLabel: string;
  item: string;
  items: string;
  emptyResult: string;
  noEffectiveItems: string;
  copy: string;
  copied: string;
  download: string;
  copyError: string;
  noscript: string;
};

export const alphabetizeListContent = {
  page: {
    heading: "Alphabetize a List Online",
    description:
      "Sort names, words or any line-based list into alphabetical order.",
    privacy: "Processed locally in your browser.",
  },
  tool: {
    heading: "Alphabetize list",
    listLabel: "List",
    pastePlaceholder: "Paste one item per line",
    clear: "Clear",
    loadExample: "Try example",
    replaceExampleConfirmation:
      "Load the example and replace your current list? Your current input will be lost.",
    options: "Options",
    trimWhitespace: "Trim whitespace",
    ignoreEmptyLines: "Ignore empty lines",
    order: "Order",
    ascending: "A → Z",
    descending: "Z → A",
    resultLabel: "Alphabetized list",
    item: "item",
    items: "items",
    emptyResult: "Paste a list to see the alphabetized result.",
    noEffectiveItems: "No items remain with the current options.",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    copyError: "Couldn’t copy. Select the result manually.",
    noscript:
      "JavaScript is required to alphabetize a list. Your list content is processed locally in your browser and never uploaded for sorting.",
  } satisfies AlphabetizeMessages,
  editorial: {
    howToHeading: "How to alphabetize a list",
    howToSteps: [
      "Paste one item per line into the List field.",
      "Keep A → Z selected, or switch the order to Z → A.",
      "Adjust whitespace or empty-line handling if needed.",
      "Review the sorted list, then copy or download the result.",
    ],
    resultsHeading: "How the alphabetical order works",
    resultsIntro:
      "The Alphabetizer uses a fixed English-facing browser collation with case-insensitive grouping and numeric-aware ordering. Duplicate items stay in the result and original casing is preserved.",
    resultsItems: [
      {
        term: "A → Z",
        description:
          "sorts the processed list in ascending alphabetical order.",
      },
      {
        term: "Z → A",
        description: "sorts the same processed values in descending order.",
      },
      {
        term: "Numeric text",
        description:
          "common mixed values sort naturally, so item 2 comes before item 10.",
      },
    ],
    commonUsesHeading: "Common ways to use an alphabetizer",
    commonUsesIntro: "This is useful for line-based data such as:",
    commonUsesItems: [
      "names and attendee lists",
      "words and vocabulary lists",
      "keywords and tags",
      "product names or labels",
      "columns copied from Excel or Google Sheets",
    ],
    dataHeading: "How your data is processed",
    dataParagraph:
      "Alphabetizing happens entirely in your browser. The pasted list and sorted result are not uploaded for tool processing.",
    dataItems: [
      "Trim whitespace changes emitted values when the option is enabled.",
      "Ignore empty lines removes empty processed items when enabled.",
      "Copy uses the Clipboard API only after you click Copy.",
      "Download creates a local text file only after you click Download.",
    ],
    dataLinkLabel: "See the Privacy page for the full details.",
    faqHeading: "Frequently asked questions",
    faqItems: [
      {
        question: "Does the Alphabetizer remove duplicates?",
        answer:
          "No. Repeated lines remain in the sorted result. Remove duplicates separately if you need a unique list.",
      },
      {
        question: "Is alphabetical sorting case-sensitive?",
        answer:
          "Uppercase and lowercase versions are grouped case-insensitively for ordering, while the original letter casing is kept in the result.",
      },
      {
        question: "Can it sort numbers inside text?",
        answer:
          "Yes. Numeric-aware ordering handles common mixed strings such as item 2 and item 10 in the expected numeric order.",
      },
      {
        question: "Can I alphabetize names or words copied from a spreadsheet?",
        answer:
          "Yes. Paste a single spreadsheet column with one value per line. Each line is treated as one list item.",
      },
      {
        question: "Is my list uploaded?",
        answer:
          "No. Sorting runs locally in your browser. Your pasted lines are not sent to a backend for processing or saved by the site.",
      },
    ],
  } satisfies EditorialContent,
} as const;
