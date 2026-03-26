import type { EventList, Paginated } from "@/lib/types";

const EVENTS_PATH = "/events/?expired=false&ordering=start_date&page_size=100";

function getApiBaseUrl(): string {
  const value = process.env.TIHLDE_API_BASE_URL?.trim();
  if (!value) {
    throw new Error("Missing TIHLDE_API_BASE_URL");
  }
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export async function GET() {
  try {
    const baseUrl = getApiBaseUrl();
    const all: EventList[] = [];
    let url: string | null = `${baseUrl}${EVENTS_PATH}`;

    while (url) {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Events fetch failed: ${res.status}`);
      }
      const data = (await res.json()) as Paginated<EventList>;
      all.push(...data.results);
      url = data.next;
    }

    return Response.json({ results: all }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch TIHLDE events", error);
    return Response.json(
      { error: "Failed to fetch TIHLDE events" },
      { status: 500 },
    );
  }
}
