import type { ExpansionLocaleContent } from "./types";

const privacy = "Processed locally in your browser.";
const dataItems = [
  "Pasted input is not uploaded for tool processing.",
  "Copy accesses the clipboard only after you click it.",
  "Download creates a local text file only after you click it.",
] as const;

export const englishExpansionContent = {
  randomTeamGenerator: {
    page: {
      heading: "Random Team & Group Generator",
      description:
        "Paste names, choose the number of teams or people per team, and split the list into balanced random groups.",
      privacy,
    },
    tool: {
      heading: "Generate random teams",
      listLabel: "Participants or items",
      pastePlaceholder: "One participant or item per line",
      clear: "Clear",
      loadExample: "Try example",
      example: "Alex\nBlair\nCasey\nDrew\nEmery\nFinley\nGray\nHarper",
      replaceExampleConfirmation:
        "Load the example and replace the current list? Your current input will be lost.",
      participant: "participant",
      participants: "participants",
      modeLabel: "Group setup",
      numberOfTeams: "Number of teams",
      peoplePerTeam: "People per team",
      valueLabel: "Value",
      generate: "Generate teams",
      reroll: "Generate again",
      resultLabel: "Random teams",
      team: "Team",
      copy: "Copy all",
      copied: "Copied",
      download: "Download",
      copyError: "Could not copy. Select the result manually.",
      emptyResult: "Add at least two items to generate random teams.",
      invalidValue: "Enter a positive whole number.",
      tooManyTeams: "The number of teams cannot be greater than the number of items.",
      noscript:
        "JavaScript is required to generate teams. Your list is processed locally in your browser.",
    },
    editorial: {
      howToHeading: "How to generate random teams",
      howToSteps: [
        "Paste one name or item per line.",
        "Choose Number of teams or People per team.",
        "Enter a positive whole number and select Generate teams.",
        "Copy the groups or generate again for a new random split.",
      ],
      resultsHeading: "How balanced random groups work",
      resultsIntro:
        "The list is shuffled in your browser, then distributed as evenly as possible. Every valid input occurrence is assigned exactly once.",
      resultsItems: [
        {
          term: "Number of teams",
          description:
            "creates that many groups, with group sizes differing by at most one.",
        },
        {
          term: "People per team",
          description:
            "uses the value as a target maximum, derives the needed number of groups, then balances them.",
        },
        {
          term: "Repeated names",
          description:
            "stay as separate occurrences because two different people can have the same name.",
        },
      ],
      commonUsesHeading: "Common uses",
      commonUsesIntro: "Random balanced groups are useful for:",
      commonUsesItems: [
        "classroom teams and study groups",
        "workshops and breakout groups",
        "games and casual sports teams",
        "office exercises and event activities",
      ],
      dataHeading: "Private browser-side team generation",
      dataParagraph:
        "The shuffle and group allocation run entirely in your browser.",
      dataItems,
      dataLinkLabel: "Read more on the Privacy page.",
      faqHeading: "Frequently asked questions",
      faqItems: [
        {
          question: "Are the teams equally sized?",
          answer:
            "They are balanced as evenly as possible. When the list does not divide evenly, team sizes differ by at most one.",
        },
        {
          question: "Can I choose group size instead of team count?",
          answer:
            "Yes. Choose People per team and the tool derives enough groups to keep each group at or below that target size.",
        },
        {
          question: "Can two people have the same name?",
          answer:
            "Yes. Repeated lines are kept as separate participant occurrences.",
        },
        {
          question: "Are the names uploaded?",
          answer: "No. Team generation runs locally in your browser.",
        },
      ],
    },
  },
  randomPairGenerator: {
    page: {
      heading: "Random Pair Generator",
      description:
        "Paste names or list items and create random pairs instantly, with odd-sized lists handled clearly.",
      privacy,
    },
    tool: {
      heading: "Create random pairs",
      listLabel: "Participants or items",
      pastePlaceholder: "One participant or item per line",
      clear: "Clear",
      loadExample: "Try example",
      example: "Alex\nBlair\nCasey\nDrew\nEmery\nFinley\nGray",
      replaceExampleConfirmation:
        "Load the example and replace the current list? Your current input will be lost.",
      item: "item",
      items: "items",
      generate: "Generate pairs",
      reroll: "Generate again",
      resultLabel: "Random pairs",
      pair: "Pair",
      unpaired: "Unpaired",
      copy: "Copy all",
      copied: "Copied",
      download: "Download",
      copyError: "Could not copy. Select the result manually.",
      emptyResult: "Add at least one item to generate random pairs.",
      noscript:
        "JavaScript is required to generate pairs. Your list is processed locally in your browser.",
    },
    editorial: {
      howToHeading: "How to create random pairs",
      howToSteps: [
        "Paste one name or item per line.",
        "Select Generate pairs.",
        "Review the pairs and any Unpaired item.",
        "Copy the result or generate again for a new pairing.",
      ],
      resultsHeading: "How random pairing works",
      resultsIntro:
        "The tool shuffles every valid occurrence and takes the shuffled list two at a time.",
      resultsItems: [
        {
          term: "Even list",
          description: "every item is placed into a pair.",
        },
        {
          term: "Odd list",
          description:
            "creates as many pairs as possible and shows one explicit Unpaired item.",
        },
        {
          term: "Repeated names",
          description: "remain separate occurrences and are not silently removed.",
        },
      ],
      commonUsesHeading: "Common uses",
      commonUsesIntro: "Random pairs work well for:",
      commonUsesItems: [
        "study partners",
        "workshop exercises",
        "interview or review pairs",
        "games and practice activities",
      ],
      dataHeading: "Private browser-side pairing",
      dataParagraph: "Pair generation runs entirely in your browser.",
      dataItems,
      dataLinkLabel: "Read more on the Privacy page.",
      faqHeading: "Frequently asked questions",
      faqItems: [
        {
          question: "What happens with an odd number of names?",
          answer:
            "The tool creates as many pairs as possible and labels the remaining item as Unpaired.",
        },
        {
          question: "Does reroll avoid previous pairs?",
          answer:
            "No. Each generation is independent and does not store pairing history.",
        },
        {
          question: "Are repeated names removed?",
          answer: "No. Every valid input occurrence is kept.",
        },
        {
          question: "Are my names uploaded?",
          answer: "No. Pair generation runs locally in your browser.",
        },
      ],
    },
  },
  removeLineBreaks: {
    page: {
      heading: "Remove Line Breaks",
      description:
        "Remove unwanted line breaks and newlines, keep paragraph breaks, or replace each break with your own separator.",
      privacy,
    },
    tool: {
      heading: "Remove or replace line breaks",
      textLabel: "Text",
      pastePlaceholder: "Paste text with unwanted line breaks",
      clear: "Clear",
      loadExample: "Try example",
      example:
        "This paragraph was copied\nwith hard line breaks that\nshould become normal spaces.\n\nThis second paragraph\nshould stay separate.",
      replaceExampleConfirmation:
        "Load the example and replace the current text? Your current input will be lost.",
      options: "Options",
      replaceWith: "Replace line breaks with",
      separatorSpace: "Space",
      separatorNothing: "Nothing",
      separatorComma: "Comma",
      separatorCommaSpace: "Comma + space",
      separatorSemicolon: "Semicolon",
      separatorCustom: "Custom",
      customSeparator: "Custom separator",
      keepParagraphs: "Keep paragraph breaks",
      trimEachLine: "Trim each line",
      collapseSpaces: "Collapse repeated spaces",
      resultLabel: "Cleaned text",
      emptyResult: "Paste text to see the cleaned result.",
      copy: "Copy",
      copied: "Copied",
      download: "Download",
      copyError: "Could not copy. Select the result manually.",
      noscript:
        "JavaScript is required to remove line breaks. Your text is processed locally in your browser.",
    },
    editorial: {
      howToHeading: "How to remove line breaks",
      howToSteps: [
        "Paste text containing unwanted hard line breaks.",
        "Choose what should replace each line break.",
        "Keep paragraph breaks if blank lines should separate paragraphs.",
        "Copy or download the cleaned text.",
      ],
      resultsHeading: "Line breaks, newlines and paragraphs",
      resultsIntro:
        "The tool normalizes Windows, Unix and old-style carriage-return line endings before applying the selected replacement.",
      resultsItems: [
        {
          term: "Space",
          description:
            "is the safe default for reflowing wrapped prose without joining neighboring words.",
        },
        {
          term: "Keep paragraph breaks",
          description:
            "joins single hard wraps inside a paragraph while preserving blank-line-separated blocks.",
        },
        {
          term: "Custom",
          description: "lets you replace newlines with any short separator you need.",
        },
      ],
      commonUsesHeading: "Common uses",
      commonUsesIntro: "Line-break cleanup is useful for text copied from:",
      commonUsesItems: [
        "PDF documents",
        "email and web pages",
        "Word documents and comments",
        "OCR or text extraction output",
      ],
      dataHeading: "Private browser-side text cleanup",
      dataParagraph: "The text transformation runs entirely in your browser.",
      dataItems,
      dataLinkLabel: "Read more on the Privacy page.",
      faqHeading: "Frequently asked questions",
      faqItems: [
        {
          question: "Can I remove newlines without removing paragraphs?",
          answer:
            "Yes. Enable Keep paragraph breaks to preserve blank-line-separated paragraphs.",
        },
        {
          question: "Can I replace newlines with commas?",
          answer:
            "Yes. Choose Comma or Comma + space, or enter a custom separator.",
        },
        {
          question: "Does it handle Windows and Unix line endings?",
          answer: "Yes. LF, CRLF and bare CR line endings are normalized first.",
        },
        {
          question: "Is my text uploaded?",
          answer: "No. The transformation runs locally in your browser.",
        },
      ],
    },
  },
  columnToCommaSeparatedList: {
    page: {
      heading: "Column to Comma Separated List",
      description:
        "Convert one-item-per-line columns into a comma-separated list or choose another delimiter.",
      privacy,
    },
    tool: {
      heading: "Convert a column to a delimited list",
      listLabel: "Column",
      pastePlaceholder: "One item per line",
      clear: "Clear",
      loadExample: "Try example",
      example: "apple\nbanana\ncherry",
      replaceExampleConfirmation:
        "Load the example and replace the current column? Your current input will be lost.",
      options: "Options",
      trimWhitespace: "Trim surrounding whitespace",
      ignoreEmptyLines: "Ignore empty lines",
      separator: "Separator",
      separatorCommaSpace: "Comma + space",
      separatorComma: "Comma",
      separatorSemicolon: "Semicolon",
      separatorPipe: "Pipe",
      separatorTab: "Tab",
      separatorCustom: "Custom",
      customSeparator: "Custom separator",
      resultLabel: "Converted list",
      item: "item",
      items: "items",
      emptyResult: "Paste a column to see the converted list.",
      copy: "Copy",
      copied: "Copied",
      download: "Download",
      copyError: "Could not copy. Select the result manually.",
      noscript:
        "JavaScript is required to convert the column. Your list is processed locally in your browser.",
    },
    editorial: {
      howToHeading: "How to convert a column to a comma-separated list",
      howToSteps: [
        "Paste one value per line.",
        "Keep Comma + space selected or choose another separator.",
        "Adjust whitespace and empty-line handling if needed.",
        "Copy or download the single-line result.",
      ],
      resultsHeading: "How column serialization works",
      resultsIntro:
        "Each processed line stays one list value, in the same order, and the selected delimiter is inserted between values.",
      resultsItems: [
        {
          term: "Comma + space",
          description: "produces a readable comma-separated list by default.",
        },
        {
          term: "Other separators",
          description: "include comma, semicolon, pipe, tab and a custom value.",
        },
        {
          term: "Duplicates",
          description: "are preserved because this tool formats rather than deduplicates.",
        },
      ],
      commonUsesHeading: "Common uses",
      commonUsesIntro: "Column-to-list conversion is useful for:",
      commonUsesItems: [
        "columns copied from Excel or Google Sheets",
        "IDs, names, URLs and keywords",
        "quick comma-separated values for forms or filters",
        "semicolon, pipe or tab-delimited text",
      ],
      dataHeading: "Private browser-side formatting",
      dataParagraph: "Column conversion runs entirely in your browser.",
      dataItems,
      dataLinkLabel: "Read more on the Privacy page.",
      faqHeading: "Frequently asked questions",
      faqItems: [
        {
          question: "Can I use a separator other than a comma?",
          answer:
            "Yes. Choose semicolon, pipe, tab or enter a custom separator.",
        },
        {
          question: "Are duplicate values removed?",
          answer: "No. Duplicate lines are preserved in their original order.",
        },
        {
          question: "Can I keep spaces around my values?",
          answer:
            "Yes. Turn off Trim surrounding whitespace to keep them exactly as entered.",
        },
        {
          question: "Is my column uploaded?",
          answer: "No. Conversion runs locally in your browser.",
        },
      ],
    },
  },
  metadata: {
    randomTeamGenerator: {
      title: "Random Team Generator — Split Names into Random Groups | ListContrast",
      description:
        "Paste a list of names, choose the number of teams or group size, and split everyone into balanced random teams. Free and processed locally in your browser.",
    },
    randomPairGenerator: {
      title: "Random Pair Generator — Create Random Pairs Online | ListContrast",
      description:
        "Paste names or list items and create random pairs instantly. Handles odd-sized lists clearly and runs locally in your browser.",
    },
    removeLineBreaks: {
      title: "Remove Line Breaks Online — Join Lines & Keep Paragraphs | ListContrast",
      description:
        "Remove unwanted line breaks and newlines from text, keep paragraph breaks, or replace newlines with a separator. Runs locally in your browser.",
    },
    columnToCommaSeparatedList: {
      title: "Column to Comma Separated List — Online Converter | ListContrast",
      description:
        "Convert one-item-per-line columns into a comma-separated list. Choose comma, semicolon, pipe, tab or a custom delimiter and copy the result instantly.",
    },
  },
  toolsPageItems: {
    randomTeamGenerator: {
      label: "Random Team Generator",
      description: "Split names or items into balanced random teams or groups.",
    },
    randomPairGenerator: {
      label: "Random Pair Generator",
      description: "Create random pairs and clearly handle an odd item.",
    },
    removeLineBreaks: {
      label: "Remove Line Breaks",
      description: "Join wrapped text while optionally preserving paragraphs.",
    },
    columnToCommaSeparatedList: {
      label: "Column to Comma Separated List",
      description: "Turn one-item-per-line columns into a delimited list.",
    },
  },
  aboutParagraphs: [
    "ListContrast is a focused collection of browser-based tools for comparing, organizing, randomizing, cleaning and formatting line-based lists.",
    "The toolkit includes list comparison, alphabetizing, randomizing, duplicate removal, balanced team generation, random pairing, line-break cleanup and column-to-delimiter conversion.",
    "The tools are designed for quick one-off work without accounts or server-side processing of your pasted list content.",
  ],
} satisfies ExpansionLocaleContent;
