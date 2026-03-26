import type { EventList, NewsItem, Paginated } from "./types";

const EVENTS_URL = "/api/tihlde/events";
const NEWS_URL = "/api/tihlde/news";

export async function fetchAllEvents(): Promise<EventList[]> {
  const all: EventList[] = [];
  let url: string | null = EVENTS_URL;

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Events fetch failed: ${res.status}`);
    }
    const data = (await res.json()) as Paginated<EventList>;
    all.push(...data.results);
    url = data.next;
  }

  return all;
}

export async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(NEWS_URL);
  if (!res.ok) {
    throw new Error(`News fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as Paginated<NewsItem>;
  return data.results;
}
