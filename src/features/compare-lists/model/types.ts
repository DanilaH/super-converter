export type CompareOptions = {
  trimWhitespace: boolean;
  ignoreEmptyLines: boolean;
  ignoreCase: boolean;
  removeDuplicates: boolean;
};

export type ListItem = {
  raw: string;
  key: string;
  index: number;
};

export type CompareStats = {
  rowsA: number;
  rowsB: number;
  uniqueA: number;
  uniqueB: number;
  onlyA: number;
  onlyB: number;
  matches: number;
};

export type CompareResult = {
  onlyA: string[];
  onlyB: string[];
  matches: string[];
  union: string[];
  differences: string[];
  stats: CompareStats;
};
