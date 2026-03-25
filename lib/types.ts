export type EventList = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  image?: string;
  image_alt?: string;
  organizer: { name: string; slug: string } | null;
  category: { id: number; text: string };
};

export type NewsItem = {
  id: number;
  title: string;
  header: string;
  image?: string;
  image_alt?: string;
  created_at: string;
};

export type Paginated<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

export type SlideEvent = { kind: "event"; data: EventList };
export type SlideNews = { kind: "news"; data: NewsItem };
export type Slide = SlideEvent | SlideNews;
