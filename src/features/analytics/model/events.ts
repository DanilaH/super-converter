import type { ResultType } from "../../compare-lists/model/types";

export type SizeBucket =
  "0" | "1-10" | "11-100" | "101-1000" | "1001-10000" | "10001+";

export type AnalyticsEventMap = {
  tool_used: {
    inputMethod: "typing" | "paste" | "example";
  };
  comparison_completed: {
    sizeA: SizeBucket;
    sizeB: SizeBucket;
    hasDifferences: boolean;
    hasMatches: boolean;
  };
  option_changed: {
    option:
      "trimWhitespace" | "ignoreEmptyLines" | "ignoreCase" | "removeDuplicates";
    enabled: boolean;
  };
  result_tab_changed: {
    resultType: ResultType;
  };
  copy_result: {
    resultType: ResultType;
  };
  download_result: {
    resultType: ResultType;
  };
  example_loaded: undefined;
};

export type AnalyticsEventName = keyof AnalyticsEventMap;
