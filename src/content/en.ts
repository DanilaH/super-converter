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
  emptyResults: string;
  noDifferences: string;
  sameValues: string;
  noMatches: string;
  onlyInA: string;
  inBoth: string;
  onlyInB: string;
  row: string;
  rows: string;
  item: string;
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
  copyError: string;
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
    emptyResults: "Paste two lists above to see their differences and matches.",
    noDifferences: "No differences found.",
    sameValues:
      "Both lists contain the same values with the current comparison settings.",
    noMatches: "No matching values.",
    onlyInA: "Only in A",
    inBoth: "In both",
    onlyInB: "Only in B",
    row: "row",
    rows: "rows",
    item: "item",
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
    copyError: "Couldn’t copy. Select the result manually.",
  },
} satisfies EnglishContent;
