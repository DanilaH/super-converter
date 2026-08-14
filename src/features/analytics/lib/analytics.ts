import type { AnalyticsEventMap, AnalyticsEventName } from "../model/events";

export interface Analytics {
  track<Name extends AnalyticsEventName>(
    name: Name,
    payload: AnalyticsEventMap[Name],
  ): void;
}

export class NoopAnalytics implements Analytics {
  track<Name extends AnalyticsEventName>(
    name: Name,
    payload: AnalyticsEventMap[Name],
  ): void {
    void name;
    void payload;
  }
}

export class DevelopmentAnalytics implements Analytics {
  constructor(
    private readonly logger: (message: string, payload?: unknown) => void = (
      message,
      payload,
    ) => console.debug(message, payload),
  ) {}

  track<Name extends AnalyticsEventName>(
    name: Name,
    payload: AnalyticsEventMap[Name],
  ): void {
    if (payload === undefined) {
      this.logger(`[analytics] ${name}`);
      return;
    }
    this.logger(`[analytics] ${name}`, payload);
  }
}

export function defaultAnalytics(): Analytics {
  if (import.meta.env.MODE === "development") {
    return new DevelopmentAnalytics();
  }
  return new NoopAnalytics();
}

export function safeTrack<Name extends AnalyticsEventName>(
  analytics: Analytics,
  name: Name,
  payload: AnalyticsEventMap[Name],
): void {
  try {
    analytics.track(name, payload);
  } catch {
    return;
  }
}
