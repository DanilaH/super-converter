export const PAGE_KEYS = [
  "home",
  "alphabetizeList",
  "randomizeList",
  "removeDuplicateLines",
  "tools",
  "about",
  "privacy",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];
export type MetadataKey = PageKey | "notFound";

export type CompareMessages = {
  heading: string;
  listA: string;
  listB: string;
  pastePlaceholder: string;
  clear: string;
  swap: string;
  loadExample: string;
  replaceExampleConfirmation: string;
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

export type HeaderContent = {
  ariaLabel: string;
  tools: string;
  about: string;
};

export type FooterContent = {
  ariaLabel: string;
  compareLists: string;
  alphabetizer: string;
  randomizer: string;
  duplicateLines: string;
  about: string;
  privacy: string;
};

export type PageMetadata = {
  title: string;
  description: string;
};

export type MetadataContent = Record<MetadataKey, PageMetadata>;

export type NotFoundPageContent = {
  heading: string;
  explanation: string;
  toolLinkLabel: string;
};

export type ToolPageIntro = {
  heading: string;
  description: string;
  privacy: string;
};

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

export type AlphabetizePageContent = {
  page: ToolPageIntro;
  tool: AlphabetizeMessages;
  editorial: EditorialContent;
};

export type RandomizePageContent = {
  page: ToolPageIntro;
  tool: RandomizeMessages;
  editorial: EditorialContent;
};

export type RemoveDuplicateLinesPageContent = {
  page: ToolPageIntro;
  tool: RemoveDuplicateLinesMessages;
  editorial: EditorialContent;
};

export type ToolPageKey =
  "home" | "alphabetizeList" | "randomizeList" | "removeDuplicateLines";

export type RelatedToolItem = {
  pageKey: ToolPageKey;
  label: string;
  description: string;
};

export type RelatedToolsContent = {
  heading: string;
  byPage: Record<ToolPageKey, readonly RelatedToolItem[]>;
};

export type ToolsPageItem = {
  label: string;
  description: string;
};

export type ToolsPageContent = {
  heading: string;
  intro: string;
  ariaLabel: string;
  items: Record<ToolPageKey, ToolsPageItem>;
};

export type LocaleContent = {
  siteName: string;
  home: {
    heading: string;
    description: string;
    privacy: string;
  };
  compare: CompareMessages;
  alphabetizeList: AlphabetizePageContent;
  randomizeList: RandomizePageContent;
  removeDuplicateLines: RemoveDuplicateLinesPageContent;
  header: HeaderContent;
  editorial: EditorialContent;
  about: AboutContent;
  privacy: PrivacyContent;
  footer: FooterContent;
  metadata: MetadataContent;
  notFoundPage: NotFoundPageContent;
  toolsPage: ToolsPageContent;
  relatedTools: RelatedToolsContent;
};
