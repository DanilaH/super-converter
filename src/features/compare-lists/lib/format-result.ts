import type {
  CompareResult,
  FormattedResult,
  ResultType,
} from "../model/types";

const FILENAMES: Record<ResultType, string> = {
  differences: "compare-lists-differences.txt",
  onlyA: "compare-lists-only-a.txt",
  onlyB: "compare-lists-only-b.txt",
  matches: "compare-lists-matches.txt",
  all: "compare-lists-all.txt",
};

export function formatResult(
  result: CompareResult,
  type: ResultType,
): FormattedResult {
  let text: string;

  switch (type) {
    case "differences":
      text = [
        "ONLY IN LIST A",
        ...result.onlyA,
        "",
        "ONLY IN LIST B",
        ...result.onlyB,
      ].join("\n");
      break;
    case "onlyA":
      text = result.onlyA.join("\n");
      break;
    case "onlyB":
      text = result.onlyB.join("\n");
      break;
    case "matches":
      text = result.matches.join("\n");
      break;
    case "all":
      text = result.union.join("\n");
      break;
  }

  return {
    text,
    filename: FILENAMES[type],
  };
}
