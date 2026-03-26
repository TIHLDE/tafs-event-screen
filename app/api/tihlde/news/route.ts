import type { NewsItem, Paginated } from "@/lib/types";

const NEWS_PATH = "/news/?ordering=-created_at&page_size=20";

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
    const res = await fetch(`${baseUrl}${NEWS_PATH}`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`News fetch failed: ${res.status}`);
    }

    const data = (await res.json()) as Paginated<NewsItem>;
    return Response.json({ results: data.results }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch TIHLDE news", error);
    return Response.json(
      { error: "Failed to fetch TIHLDE news" },
      { status: 500 },
    );
  }
}
