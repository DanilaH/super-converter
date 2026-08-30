import type { TransformListOptions } from "../../list-transform/model/types";

export type AlphabetizeOrder = "asc" | "desc";

export type { TransformListOptions } from "../../list-transform/model/types";

export type AlphabetizeOptions = TransformListOptions & {
  order: AlphabetizeOrder;
};

export type AlphabetizeResult = {
  items: string[];
  text: string;
};
