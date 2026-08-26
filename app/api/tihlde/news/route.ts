import type { NewsItem, Paginated } from "@/lib/types";

/**
 * Photon sorterer nyheter nyest først og utelater arkiverte som standard,
 * så skjermen trenger bare be om den første sida.
 */
const NEWS_PATH = "/news?pageSize=20";

/** Photons rå nyhetsform. Kun feltene skjermen faktisk bruker. */
type PhotonNews = {
  id: string;
  title: string;
  header: string;
  imageUrl: string | null;
  imageAlt: string | null;
  createdAt: string;
};

function getApiBaseUrl(): string {
  const value = process.env.TIHLDE_API_BASE_URL?.trim();
  if (!value) {
    throw new Error("Missing TIHLDE_API_BASE_URL");
  }
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function toNewsItem(news: PhotonNews): NewsItem {
  return {
    id: news.id,
    title: news.title,
    header: news.header,
    image: news.imageUrl ?? undefined,
    image_alt: news.imageAlt ?? undefined,
    created_at: news.createdAt,
  };
}

export async function GET() {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}${NEWS_PATH}`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`News fetch failed: ${res.status}`);
    }

    const data = (await res.json()) as Paginated<PhotonNews>;
    return Response.json({ items: data.items.map(toNewsItem) }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch TIHLDE news", error);
    return Response.json(
      { error: "Failed to fetch TIHLDE news" },
      { status: 500 },
    );
  }
}
