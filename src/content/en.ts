export type CompareMessages = {
  heading: string;
  listA: string;
  listB: string;
  pastePlaceholder: string;
  clear: string;
  swap: string;
  loadExample: string;
  comparisonOptions: string;
  trimWhitespace: string;
  ignoreEmptyLines: string;
  ignoreCase: string;
  removeDuplicates: string;
  results: string;
  rows: string;
  items: string;
  differences: string;
  onlyA: string;
  onlyB: string;
  matches: string;
  all: string;
  noscript: string;
  copy: string;
  copied: string;
  download: string;
};

export type EnglishContent = {
  siteName: string;
  home: {
    heading: string;
    description: string;
    privacy: string;
  };
  compare: CompareMessages;
};

export const englishContent = {
  siteName: "Compare Lists",
  home: {
    heading: "Compare Two Lists Online",
    description:
      "Find differences, matches and unique values between two lists instantly.",
    privacy:
      "Your lists are processed locally in your browser and are never uploaded to our servers.",
  },
  compare: {
    heading: "Compare lists",
    listA: "List A",
    listB: "List B",
    pastePlaceholder: "Paste one item per line",
    clear: "Clear",
    swap: "Swap",
    loadExample: "Load example",
    comparisonOptions: "Comparison options",
    trimWhitespace: "Trim whitespace",
    ignoreEmptyLines: "Ignore empty lines",
    ignoreCase: "Ignore case",
    removeDuplicates: "Remove duplicates",
    results: "Results",
    rows: "rows",
    items: "items",
    differences: "Differences",
    onlyA: "Only A",
    onlyB: "Only B",
    matches: "Matches",
    all: "All",
    noscript:
      "JavaScript is required to compare lists. Your list content is processed locally in your browser and never uploaded.",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
  },
} satisfies EnglishContent;
