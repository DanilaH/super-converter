import { describe, expect, it, vi } from "vitest";
import {
  DevelopmentAnalytics,
  NoopAnalytics,
  defaultAnalytics,
  safeTrack,
  type Analytics,
} from "./analytics";
import { sizeBucketFor } from "./size-bucket";

describe("size buckets", () => {
  it("maps every inclusive boundary to the exact bucket", () => {
    expect(sizeBucketFor(-1)).toBe("0");
    expect(sizeBucketFor(0)).toBe("0");
    expect(sizeBucketFor(1)).toBe("1-10");
    expect(sizeBucketFor(10)).toBe("1-10");
    expect(sizeBucketFor(11)).toBe("11-100");
    expect(sizeBucketFor(100)).toBe("11-100");
    expect(sizeBucketFor(101)).toBe("101-1000");
    expect(sizeBucketFor(1000)).toBe("101-1000");
    expect(sizeBucketFor(1001)).toBe("1001-10000");
    expect(sizeBucketFor(10000)).toBe("1001-10000");
    expect(sizeBucketFor(10001)).toBe("10001+");
  });
});

describe("analytics adapters", () => {
  it("NoopAnalytics does nothing and never throws", () => {
    const noop = new NoopAnalytics();
    expect(() => {
      noop.track("tool_used", { inputMethod: "typing" });
      noop.track("example_loaded", undefined);
    }).not.toThrow();
  });

  it("DevelopmentAnalytics logs the prefixed event name without payload", () => {
    const logger = vi.fn();
    const analytics = new DevelopmentAnalytics(logger);

    analytics.track("example_loaded", undefined);

    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith("[analytics] example_loaded");
  });

  it("DevelopmentAnalytics logs the prefixed event name with a safe payload", () => {
    const logger = vi.fn();
    const analytics = new DevelopmentAnalytics(logger);

    analytics.track("comparison_completed", {
      sizeA: "11-100",
      sizeB: "0",
      hasDifferences: true,
      hasMatches: false,
    });

    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith("[analytics] comparison_completed", {
      sizeA: "11-100",
      sizeB: "0",
      hasDifferences: true,
      hasMatches: false,
    });
  });

  it("selects the default adapter by mode", () => {
    vi.stubEnv("MODE", "development");
    expect(defaultAnalytics()).toBeInstanceOf(DevelopmentAnalytics);
    vi.stubEnv("MODE", "test");
    expect(defaultAnalytics()).toBeInstanceOf(NoopAnalytics);
    vi.stubEnv("MODE", "production");
    expect(defaultAnalytics()).toBeInstanceOf(NoopAnalytics);
    vi.unstubAllEnvs();
  });

  it("keeps an adapter exception inside the safe boundary", () => {
    const throwing: Analytics = {
      track() {
        throw new Error("provider failure");
      },
    };

    expect(() =>
      safeTrack(throwing, "tool_used", { inputMethod: "typing" }),
    ).not.toThrow();
  });
});
