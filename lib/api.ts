import type { EventList, NewsItem } from "./types";

const EVENTS_URL = "/api/tihlde/events";
const NEWS_URL = "/api/tihlde/news";

/**
 * Rutene under `app/api/tihlde/` har allerede fulgt Photons paginering til
 * ende og oversatt svaret, så her er det bare én liste å hente.
 */
export async function fetchAllEvents(): Promise<EventList[]> {
  const res = await fetch(EVENTS_URL);
  if (!res.ok) {
    throw new Error(`Events fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as { items: EventList[] };
  return data.items;
}

export async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(NEWS_URL);
  if (!res.ok) {
    throw new Error(`News fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as { items: NewsItem[] };
  return data.items;
}
