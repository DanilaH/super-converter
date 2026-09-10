export const CORE_PAGE_KEYS = [
  "home",
  "alphabetizeList",
  "randomizeList",
  "removeDuplicateLines",
  "tools",
  "about",
  "privacy",
] as const;

export const EXPANSION_PAGE_KEYS = [
  "randomTeamGenerator",
  "randomPairGenerator",
  "removeLineBreaks",
  "columnToCommaSeparatedList",
] as const;

export const PAGE_KEYS = [...CORE_PAGE_KEYS, ...EXPANSION_PAGE_KEYS] as const;

export type CorePageKey = (typeof CORE_PAGE_KEYS)[number];
export type ExpansionPageKey = (typeof EXPANSION_PAGE_KEYS)[number];
export type PageKey = (typeof PAGE_KEYS)[number];
export type CoreMetadataKey = CorePageKey | "notFound";
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
  language: string;
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

/** Core content shape retained so the already-shipped locale dictionaries remain valid. */
export type MetadataContent = Record<CoreMetadataKey, PageMetadata>;
export type SiteMetadataContent = Record<MetadataKey, PageMetadata>;

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
  example: string;
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
  example: string;
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
  example: string;
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

export type RandomTeamMessages = {
  heading: string;
  listLabel: string;
  pastePlaceholder: string;
  clear: string;
  loadExample: string;
  example: string;
  replaceExampleConfirmation: string;
  participant: string;
  participants: string;
  modeLabel: string;
  numberOfTeams: string;
  peoplePerTeam: string;
  valueLabel: string;
  generate: string;
  reroll: string;
  resultLabel: string;
  team: string;
  copy: string;
  copied: string;
  download: string;
  copyError: string;
  emptyResult: string;
  invalidValue: string;
  tooManyTeams: string;
  noscript: string;
};

export type RandomPairMessages = {
  heading: string;
  listLabel: string;
  pastePlaceholder: string;
  clear: string;
  loadExample: string;
  example: string;
  replaceExampleConfirmation: string;
  item: string;
  items: string;
  generate: string;
  reroll: string;
  resultLabel: string;
  pair: string;
  unpaired: string;
  copy: string;
  copied: string;
  download: string;
  copyError: string;
  emptyResult: string;
  noscript: string;
};

export type RemoveLineBreaksMessages = {
  heading: string;
  textLabel: string;
  pastePlaceholder: string;
  clear: string;
  loadExample: string;
  example: string;
  replaceExampleConfirmation: string;
  options: string;
  replaceWith: string;
  separatorSpace: string;
  separatorNothing: string;
  separatorComma: string;
  separatorCommaSpace: string;
  separatorSemicolon: string;
  separatorCustom: string;
  customSeparator: string;
  keepParagraphs: string;
  trimEachLine: string;
  collapseSpaces: string;
  resultLabel: string;
  emptyResult: string;
  copy: string;
  copied: string;
  download: string;
  copyError: string;
  noscript: string;
};

export type ColumnToCommaMessages = {
  heading: string;
  listLabel: string;
  pastePlaceholder: string;
  clear: string;
  loadExample: string;
  example: string;
  replaceExampleConfirmation: string;
  options: string;
  trimWhitespace: string;
  ignoreEmptyLines: string;
  separator: string;
  separatorCommaSpace: string;
  separatorComma: string;
  separatorSemicolon: string;
  separatorPipe: string;
  separatorTab: string;
  separatorCustom: string;
  customSeparator: string;
  resultLabel: string;
  item: string;
  items: string;
  emptyResult: string;
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

export type RandomTeamPageContent = {
  page: ToolPageIntro;
  tool: RandomTeamMessages;
  editorial: EditorialContent;
};

export type RandomPairPageContent = {
  page: ToolPageIntro;
  tool: RandomPairMessages;
  editorial: EditorialContent;
};

export type RemoveLineBreaksPageContent = {
  page: ToolPageIntro;
  tool: RemoveLineBreaksMessages;
  editorial: EditorialContent;
};

export type ColumnToCommaPageContent = {
  page: ToolPageIntro;
  tool: ColumnToCommaMessages;
  editorial: EditorialContent;
};

/** Existing four tool identities; retained for the shipped locale source files. */
export type ToolPageKey =
  "home" | "alphabetizeList" | "randomizeList" | "removeDuplicateLines";

export type ExpansionToolPageKey = ExpansionPageKey;
export type SiteToolPageKey = ToolPageKey | ExpansionToolPageKey;

export const SITE_TOOL_PAGE_KEYS = [
  "home",
  "alphabetizeList",
  "randomizeList",
  "removeDuplicateLines",
  ...EXPANSION_PAGE_KEYS,
] as const satisfies readonly SiteToolPageKey[];

export type RelatedToolItem = {
  pageKey: ToolPageKey;
  label: string;
  description: string;
};

export type SiteRelatedToolItem = {
  pageKey: SiteToolPageKey;
  label: string;
  description: string;
};

export type RelatedToolsContent = {
  heading: string;
  byPage: Record<ToolPageKey, readonly RelatedToolItem[]>;
};

export type SiteRelatedToolsContent = {
  heading: string;
  byPage: Record<SiteToolPageKey, readonly SiteRelatedToolItem[]>;
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

export type SiteToolsPageContent = Omit<ToolsPageContent, "items"> & {
  items: Record<SiteToolPageKey, ToolsPageItem>;
};

/** Existing locale dictionaries implement this stable core shape. */
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

export type SiteLocaleContent = Omit<
  LocaleContent,
  "metadata" | "toolsPage" | "relatedTools"
> & {
  randomTeamGenerator: RandomTeamPageContent;
  randomPairGenerator: RandomPairPageContent;
  removeLineBreaks: RemoveLineBreaksPageContent;
  columnToCommaSeparatedList: ColumnToCommaPageContent;
  metadata: SiteMetadataContent;
  toolsPage: SiteToolsPageContent;
  relatedTools: SiteRelatedToolsContent;
};
