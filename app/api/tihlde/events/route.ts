import type { EventList, Paginated } from "@/lib/types";

/**
 * Kommende arrangementer, eldste først — det er rekkefølgen skjermen viser dem i.
 * `pageSize=100` er Photons maksimum, så det holder til én runde i praksis
 * (~26 kommende arrangementer i august 2026). Løkka under er der for sikkerhets skyld.
 */
const EVENTS_PATH = "/event?expired=false&ordering=oldest&pageSize=100";

/** Photons rå arrangementsform. Kun feltene skjermen faktisk bruker. */
type PhotonEvent = {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  image: string | null;
  imageAlt: string | null;
  organizer: { name: string; slug: string } | null;
  category: { slug: string; label: string } | null;
};

function getApiBaseUrl(): string {
  const value = process.env.TIHLDE_API_BASE_URL?.trim();
  if (!value) {
    throw new Error("Missing TIHLDE_API_BASE_URL");
  }
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function toEventList(event: PhotonEvent): EventList {
  return {
    id: event.id,
    title: event.title,
    start_date: event.startTime,
    end_date: event.endTime,
    location: event.location,
    image: event.image ?? undefined,
    image_alt: event.imageAlt ?? undefined,
    organizer: event.organizer
      ? { name: event.organizer.name, slug: event.organizer.slug }
      : null,
    // Photon lar kategorien være valgfri; skjermen trenger alltid noe å farge etter.
    category: event.category ?? { slug: "annet", label: "Annet" },
  };
}

export async function GET() {
  try {
    const baseUrl = getApiBaseUrl();
    const all: EventList[] = [];
    let page: number | null = 0;

    while (page !== null) {
      const res = await fetch(`${baseUrl}${EVENTS_PATH}&page=${page}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Events fetch failed: ${res.status}`);
      }
      const data = (await res.json()) as Paginated<PhotonEvent>;
      all.push(...data.items.map(toEventList));
      page = data.nextPage;
    }

    return Response.json({ items: all }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch TIHLDE events", error);
    return Response.json(
      { error: "Failed to fetch TIHLDE events" },
      { status: 500 },
    );
  }
}
