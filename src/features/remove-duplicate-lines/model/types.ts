import type { TransformListOptions } from "../../list-transform/model/types";

export type RemoveDuplicateLinesOptions = TransformListOptions & {
  ignoreCase: boolean;
};

export type RemoveDuplicateLinesStats = {
  input: number;
  unique: number;
  removed: number;
};

export type RemoveDuplicateLinesResult = {
  items: string[];
  text: string;
  stats: RemoveDuplicateLinesStats;
};
