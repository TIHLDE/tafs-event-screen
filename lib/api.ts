import type { EventList, NewsItem, Paginated } from "./types";

const EVENTS_URL =
  "https://api.tihlde.org/events/?expired=false&ordering=start_date&page_size=100";
const NEWS_URL =
  "https://api.tihlde.org/news/?ordering=-created_at&page_size=20";

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
