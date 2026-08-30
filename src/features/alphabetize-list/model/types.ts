export type AlphabetizeOrder = "asc" | "desc";

export type TransformListOptions = {
  trimWhitespace: boolean;
  ignoreEmptyLines: boolean;
};

export type AlphabetizeOptions = TransformListOptions & {
  order: AlphabetizeOrder;
};

export type AlphabetizeResult = {
  items: string[];
  text: string;
};
