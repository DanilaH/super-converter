import type { EditorialContent } from "./en";

export type RandomizeMessages = {
  heading: string;
  listLabel: string;
  pastePlaceholder: string;
  clear: string;
  loadExample: string;
  replaceExampleConfirmation: string;
  options: string;
  trimWhitespace: string;
  ignoreEmptyLines: string;
  randomize: string;
  randomizeAgain: string;
  resultLabel: string;
  item: string;
  items: string;
  emptyResult: string;
  readyResult: string;
  noEffectiveItems: string;
  copy: string;
  copied: string;
  download: string;
  copyError: string;
  noscript: string;
};

export const randomizeListContent = {
  page: {
    heading: "List Randomizer",
    description: "Shuffle names, words or any line-based list into a random order.",
    privacy: "Processed locally in your browser.",
  },
  tool: {
    heading: "Randomize list",
    listLabel: "List",
    pastePlaceholder: "Paste one item per line",
    clear: "Clear",
    loadExample: "Try example",
    replaceExampleConfirmation:
      "Load the example and replace your current list? Your current input will be lost.",
    options: "Options",
    trimWhitespace: "Trim whitespace",
    ignoreEmptyLines: "Ignore empty lines",
    randomize: "Randomize",
    randomizeAgain: "Randomize again",
    resultLabel: "Randomized list",
    item: "item",
    items: "items",
    emptyResult: "Paste a list to create a randomized result.",
    readyResult: "Select Randomize to shuffle the current list.",
    noEffectiveItems: "No items remain with the current options.",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    copyError: "Couldn’t copy. Select the result manually.",
    noscript:
      "JavaScript is required to randomize a list. Your list content is processed locally in your browser and never uploaded for shuffling.",
  } satisfies RandomizeMessages,
  editorial: {
    howToHeading: "How to randomize a list",
    howToSteps: [
      "Paste one item per line into the List field.",
      "Adjust whitespace or empty-line handling if needed.",
      "Select Randomize to shuffle the processed items.",
      "Select Randomize again for another order, then copy or download the result you want.",
    ],
    resultsHeading: "How list randomization works",
    resultsIntro:
      "The tool uses an in-browser Fisher–Yates shuffle. Every processed occurrence stays in the result, including duplicates, and each randomization is triggered only when you select Randomize.",
    resultsItems: [
      {
        term: "Randomize",
        description: "creates one shuffled permutation of the current processed list.",
      },
      {
        term: "Randomize again",
        description: "runs a fresh shuffle without changing your source list.",
      },
      {
        term: "Repeated items",
        description: "remain as separate occurrences and are not removed automatically.",
      },
    ],
    commonUsesHeading: "Common ways to use a list randomizer",
    commonUsesIntro: "Random order is useful for line-based data such as:",
    commonUsesItems: [
      "names and participant lists",
      "questions or prompts",
      "tasks and activities",
      "words and vocabulary lists",
      "columns copied from Excel or Google Sheets",
    ],
    dataHeading: "How your data is processed",
    dataParagraph:
      "Randomizing happens entirely in your browser. The pasted list and shuffled result are not uploaded for tool processing.",
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
        question: "Does the List Randomizer remove duplicates?",
        answer:
          "No. Repeated lines remain as separate occurrences in the randomized result.",
      },
      {
        question: "Will every shuffle look different?",
        answer:
          "Not necessarily. A random shuffle can occasionally produce the same order as the source or a previous result, especially for short lists.",
      },
      {
        question: "Does the list reshuffle while I type?",
        answer:
          "No. Randomization only runs when you select Randomize. Editing the source list or its processing options invalidates the old result until you randomize again.",
      },
      {
        question: "Can I randomize names copied from a spreadsheet?",
        answer:
          "Yes. Paste one spreadsheet column with one value per line. Each line is treated as one list item.",
      },
      {
        question: "Is my list uploaded?",
        answer:
          "No. Shuffling runs locally in your browser. Your pasted lines are not sent to a backend for processing or saved by the site.",
      },
    ],
  } satisfies EditorialContent,
} as const;
