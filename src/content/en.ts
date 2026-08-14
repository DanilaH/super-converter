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

export type EditorialResultsItem = {
  term: string;
  description: string;
};

export type EditorialFaqItem = {
  question: string;
  answer: string;
};

export type EditorialContent = {
  howToHeading: string;
  howToSteps: readonly string[];
  resultsHeading: string;
  resultsIntro: string;
  resultsItems: readonly EditorialResultsItem[];
  commonUsesHeading: string;
  commonUsesIntro: string;
  commonUsesItems: readonly string[];
  dataHeading: string;
  dataParagraph: string;
  dataItems: readonly string[];
  dataLinkLabel: string;
  faqHeading: string;
  faqItems: readonly EditorialFaqItem[];
};

export type AboutContent = {
  heading: string;
  paragraphs: readonly string[];
  toolLinkLabel: string;
};

export type PrivacySection = {
  heading: string;
  paragraphs: readonly string[];
};

export type PrivacyContent = {
  heading: string;
  intro: string;
  sections: readonly PrivacySection[];
  toolLinkLabel: string;
};

export type FooterContent = {
  ariaLabel: string;
  tool: string;
  about: string;
  privacy: string;
};

export type EnglishContent = {
  siteName: string;
  home: {
    heading: string;
    description: string;
    privacy: string;
  };
  compare: CompareMessages;
  editorial: EditorialContent;
  about: AboutContent;
  privacy: PrivacyContent;
  footer: FooterContent;
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
  editorial: {
    howToHeading: "How to compare two lists",
    howToSteps: [
      "Paste the first list into List A.",
      "Paste the second list into List B.",
      "Adjust the comparison options if needed.",
      "Review Differences, Only A, Only B, Matches or All, then copy or download the result you need.",
    ],
    resultsHeading: "What the comparison results mean",
    resultsIntro:
      "The tabs show the same comparison from different angles. Results keep the order of the original lists and are never sorted automatically.",
    resultsItems: [
      {
        term: "Differences",
        description: "items that remain in only one of the two lists.",
      },
      {
        term: "Only A",
        description:
          "items or occurrences from List A that have no pair in List B.",
      },
      {
        term: "Only B",
        description:
          "items or occurrences from List B that have no pair in List A.",
      },
      {
        term: "Matches",
        description: "items found in both lists, shown in List A order.",
      },
      {
        term: "All",
        description:
          "List A, followed by values from List B that are not already represented.",
      },
    ],
    commonUsesHeading: "Common ways to compare lists",
    commonUsesIntro: "People use this tool for everyday list tasks such as:",
    commonUsesItems: [
      "email addresses",
      "customer or order IDs",
      "URLs",
      "product or SKU lists",
      "keywords and names",
      "columns copied from Excel or Google Sheets",
    ],
    dataHeading: "How your data is processed",
    dataParagraph:
      "The comparison runs entirely in your browser. Raw lists and result content are never uploaded to a server.",
    dataItems: [
      "Copy uses the Clipboard API only after you click the button.",
      "Download creates a local text file on your device.",
      "The site does not save your lists in cookies, localStorage or sessionStorage.",
      "Raw input and results are not included in analytics or logging.",
    ],
    dataLinkLabel: "See the Privacy page for the full details.",
    faqHeading: "Frequently asked questions",
    faqItems: [
      {
        question: "Can I compare two lists with duplicates?",
        answer:
          "Yes. Remove duplicates is enabled by default, so each list is compared as a set of unique values. Turn it off to compare repeated occurrences in each list.",
      },
      {
        question: "Is the comparison case-sensitive?",
        answer:
          "Yes, by default. The Ignore case option changes the comparison key but not your raw text, so both spellings can match while the original input stays unchanged.",
      },
      {
        question: "Can I compare columns from Excel or Google Sheets?",
        answer:
          "Yes. Copy a column and paste it into List A or List B. Each cell becomes one line, one item per line.",
      },
      {
        question: "Are my lists uploaded to a server?",
        answer:
          "No. The comparison runs locally in your browser. Your list content is not uploaded to a server, not sent in network requests and not saved by the site. Copy and Download export the result only after you click the button.",
      },
      {
        question: "What does “Only A” mean?",
        answer:
          "Only A shows the values or occurrences that exist in List A without a pair in List B, based on your current comparison options.",
      },
    ],
  },
  about: {
    heading: "About Compare Lists",
    paragraphs: [
      "Compare Lists is a small browser utility for finding differences, matches and unique values between two lists.",
      "Paste two lists, choose your comparison options, and review the result as Differences, Only A, Only B, Matches or All — then copy or download what you need.",
      "The tool deliberately requires no account and processes all list content locally in your browser. Your lists are not uploaded to a server, not sent in network requests and not saved by the site. Results leave the page only when you copy or download them yourself.",
    ],
    toolLinkLabel: "Compare two lists",
  },
  privacy: {
    heading: "Privacy",
    intro:
      "This page describes how Compare Lists handles data. It reflects the current version of the site and will be updated before any privacy-relevant service is enabled.",
    sections: [
      {
        heading: "List content",
        paragraphs: [
          "Raw List A and List B text, and the results produced from it, are processed entirely in your browser. List content never enters network requests and is not stored in a database, cookies, localStorage or sessionStorage.",
          "Copy places the selected result on the system clipboard only after you click the button. Download creates a local text file on your device only after you click the button.",
        ],
      },
      {
        heading: "Website requests",
        paragraphs: [
          "Like any website, Compare Lists is served by a static host. When you open a page, the host may receive ordinary request metadata: your IP address, user agent and the requested path. List content is not part of these requests.",
        ],
      },
      {
        heading: "Advertising and analytics",
        paragraphs: [
          "The current version does not use advertising scripts, session replay or a production product-analytics provider. Raw list input and results are never included in analytics events.",
        ],
      },
      {
        heading: "Changes to this page",
        paragraphs: [
          "If privacy-relevant services are added later, this page will be updated before they are enabled.",
        ],
      },
    ],
    toolLinkLabel: "Return to Compare Lists",
  },
  footer: {
    ariaLabel: "Footer",
    tool: "Tool",
    about: "About",
    privacy: "Privacy",
  },
} satisfies EnglishContent;
