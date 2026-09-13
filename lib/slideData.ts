import type { EventList, NewsItem, Slide } from "./types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function addDays(base: Date, days: number): Date {
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

/** Events starting within the next 7 days (from `now`), still upcoming. */
export function filterEventsThisWeek(events: EventList[], now: Date): EventList[] {
  const horizon = new Date(now.getTime() + WEEK_MS);
  return events.filter((e) => {
    const start = new Date(e.start_date);
    return start >= now && start <= horizon;
  });
}

/** Events starting strictly after 7 days from `now`, sorted by start_date ascending. */
export function filterLaterEvents(events: EventList[], now: Date, max: number): EventList[] {
  const cutoff = new Date(now.getTime() + WEEK_MS);
  return events
    .filter((e) => {
      const start = new Date(e.start_date);
      return start > cutoff;
    })
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, max);
}

/**
 * For every 2 events, insert 1 news item. Remaining news/events appended evenly.
 */
export function interleaveEventsAndNews(
  events: EventList[],
  news: NewsItem[],
): Slide[] {
  const e = [...events];
  const n = [...news];
  const out: Slide[] = [];

  while (e.length > 0 || n.length > 0) {
    if (e.length >= 2) {
      out.push({ kind: "event", data: e.shift()! });
      out.push({ kind: "event", data: e.shift()! });
      if (n.length > 0) {
        out.push({ kind: "news", data: n.shift()! });
      }
    } else if (e.length === 1) {
      out.push({ kind: "event", data: e.shift()! });
      if (n.length > 0) {
        out.push({ kind: "news", data: n.shift()! });
      }
    } else {
      while (n.length > 0) {
        out.push({ kind: "news", data: n.shift()! });
      }
    }
  }

  return out;
}

export function buildSlides(events: EventList[], news: NewsItem[], now: Date): Slide[] {
  const thisWeek = filterEventsThisWeek(events, now);
  const topNews = news.slice(0, 3);
  return interleaveEventsAndNews(thisWeek, topNews);
}
