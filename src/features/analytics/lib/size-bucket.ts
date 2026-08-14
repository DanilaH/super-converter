import type { SizeBucket } from "../model/events";

export function sizeBucketFor(count: number): SizeBucket {
  if (count <= 0) {
    return "0";
  }
  if (count <= 10) {
    return "1-10";
  }
  if (count <= 100) {
    return "11-100";
  }
  if (count <= 1000) {
    return "101-1000";
  }
  if (count <= 10000) {
    return "1001-10000";
  }
  return "10001+";
}
