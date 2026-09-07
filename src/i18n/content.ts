import { alphabetizeListContent } from "../content/alphabetize-list";
import { englishContent } from "../content/en";
import { randomizeListContent } from "../content/randomize-list";
import { removeDuplicateLinesContent } from "../content/remove-duplicate-lines";
import type { ActiveLocale } from "./locales";
import type { LocaleContent, ToolPageKey } from "./types";

const englishToolItems = {
  home: {
    label: "Compare Lists",
    description:
      "Find differences, matches and unique values between two lists.",
  },
  alphabetizeList: {
    label: "Alphabetizer",
    description: "Sort a list alphabetically in A–Z or Z–A order.",
  },
  randomizeList: {
    label: "List Randomizer",
    description: "Shuffle a line-based list into a random order on demand.",
  },
  removeDuplicateLines: {
    label: "Remove Duplicate Lines",
    description: "Remove repeated lines while keeping the first occurrence.",
  },
} as const satisfies Record<
  ToolPageKey,
  { label: string; description: string }
>;

const related = (pageKey: ToolPageKey, label: string, description: string) =>
  ({ pageKey, label, description }) as const;

export const englishLocaleContent = {
  ...englishContent,
  alphabetizeList: alphabetizeListContent,
  randomizeList: randomizeListContent,
  removeDuplicateLines: removeDuplicateLinesContent,
  toolsPage: {
    heading: "List tools",
    intro:
      "Focused browser tools for comparing, sorting, randomizing and cleaning line-based lists.",
    ariaLabel: "Available list tools",
    items: englishToolItems,
  },
  relatedTools: {
    heading: "Related tools",
    byPage: {
      home: [
        related(
          "alphabetizeList",
          "Alphabetizer",
          "Sort a list alphabetically.",
        ),
        related(
          "randomizeList",
          "List Randomizer",
          "Shuffle a list into a random order.",
        ),
        related(
          "removeDuplicateLines",
          "Remove Duplicate Lines",
          "Keep the first occurrence of repeated lines.",
        ),
      ],
      alphabetizeList: [
        related(
          "home",
          "Compare Lists",
          "Find differences, matches and unique values between two lists.",
        ),
        related(
          "randomizeList",
          "List Randomizer",
          "Shuffle a list into a random order.",
        ),
        related(
          "removeDuplicateLines",
          "Remove Duplicate Lines",
          "Keep the first occurrence of repeated lines.",
        ),
      ],
      randomizeList: [
        related(
          "home",
          "Compare Lists",
          "Find differences, matches and unique values between two lists.",
        ),
        related(
          "alphabetizeList",
          "Alphabetizer",
          "Sort a list alphabetically in A–Z or Z–A order.",
        ),
        related(
          "removeDuplicateLines",
          "Remove Duplicate Lines",
          "Keep the first occurrence of repeated lines.",
        ),
      ],
      removeDuplicateLines: [
        related(
          "home",
          "Compare Lists",
          "Find differences, matches and unique values between two lists.",
        ),
        related(
          "alphabetizeList",
          "Alphabetizer",
          "Sort a list alphabetically in A–Z or Z–A order.",
        ),
        related(
          "randomizeList",
          "List Randomizer",
          "Shuffle a list into a random order.",
        ),
      ],
    },
  },
} satisfies LocaleContent;

const ACTIVE_CONTENT = {
  en: englishLocaleContent,
} as const satisfies Record<ActiveLocale, LocaleContent>;

export function contentFor(locale: ActiveLocale): LocaleContent {
  return ACTIVE_CONTENT[locale];
}
