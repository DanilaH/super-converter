import type {
  EditorialContent,
  ExpansionToolPageKey,
  PageMetadata,
  RandomPairPageContent,
  RandomTeamPageContent,
  RemoveLineBreaksPageContent,
  ColumnToCommaPageContent,
  ToolsPageItem,
} from "../../i18n/types";

export type HomepageExpansionPatch = {
  description: string;
  metadata: PageMetadata;
  editorial: Pick<
    EditorialContent,
    "resultsHeading" | "resultsIntro" | "resultsItems" | "commonUsesItems"
  >;
};

export type ExpansionLocaleContent = {
  homePatch?: HomepageExpansionPatch;
  randomTeamGenerator: RandomTeamPageContent;
  randomPairGenerator: RandomPairPageContent;
  removeLineBreaks: RemoveLineBreaksPageContent;
  columnToCommaSeparatedList: ColumnToCommaPageContent;
  metadata: Record<ExpansionToolPageKey, PageMetadata>;
  toolsPageItems: Record<ExpansionToolPageKey, ToolsPageItem>;
  aboutParagraphs: readonly string[];
};
