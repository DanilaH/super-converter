export type CompareMessages = {
  listA: string;
  listB: string;
  pastePlaceholder: string;
  trimWhitespace: string;
  ignoreEmptyLines: string;
  ignoreCase: string;
  removeDuplicates: string;
  differences: string;
  onlyA: string;
  onlyB: string;
  matches: string;
  all: string;
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
    toolPlaceholder: {
      heading: string;
      description: string;
    };
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
    toolPlaceholder: {
      heading: "Compare tool",
      description: "The interactive comparison workspace will appear here.",
    },
  },
  compare: {
    listA: "List A",
    listB: "List B",
    pastePlaceholder: "Paste one item per line",
    trimWhitespace: "Trim whitespace",
    ignoreEmptyLines: "Ignore empty lines",
    ignoreCase: "Ignore case",
    removeDuplicates: "Remove duplicates",
    differences: "Differences",
    onlyA: "Only A",
    onlyB: "Only B",
    matches: "Matches",
    all: "All",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
  },
} satisfies EnglishContent;
