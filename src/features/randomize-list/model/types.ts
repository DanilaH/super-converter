import type { TransformListOptions } from "../../list-transform/model/types";

export type RandomizeOptions = TransformListOptions;

export type RandomizeResult = {
  items: string[];
  text: string;
};

export type RandomSource = () => number;
