/**
 * Formene her følger Photon (`photon.tihlde.org/api`). Skjermen gikk mot
 * Lepton (`api.tihlde.org`) fram til august 2026; Lepton er under avvikling
 * sammen med resten av TIHLDEs Azure-oppsett.
 *
 * Rutene under `app/api/tihlde/` oversetter Photon-svaret til typene her, så
 * resten av appen slipper å forholde seg til hvordan API-et ser ut.
 */

export type EventList = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  image?: string;
  image_alt?: string;
  organizer: { name: string; slug: string } | null;
  category: { slug: string; label: string };
};

export type NewsItem = {
  id: string;
  title: string;
  header: string;
  image?: string;
  image_alt?: string;
  created_at: string;
};

/** Photons paginerte svar. Sidetallet er nullbasert, og `nextPage` er null på siste side. */
export type Paginated<T> = {
  items: T[];
  totalCount: number;
  pages: number;
  nextPage: number | null;
};

export type SlideEvent = { kind: "event"; data: EventList };
export type SlideNews = { kind: "news"; data: NewsItem };
export type Slide = SlideEvent | SlideNews;
