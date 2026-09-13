"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TihldeLogo } from "@/components/TihldeLogo";
import { fetchAllEvents, fetchNews } from "@/lib/api";
import { DEFAULT_COVER_IMAGE } from "@/lib/image";
import {
  formatClockTime,
  formatEventDateLong,
  formatEventDateShort,
  formatTodayLong,
} from "@/lib/format";
import { buildSlides, filterLaterEvents } from "@/lib/slideData";
import type { EventList, NewsItem, Slide } from "@/lib/types";

const REFRESH_MS = 5 * 60 * 1000;
const SLIDE_MS = 10_000;

function useNowEverySecond(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function SlideBackground({
  imageUrl,
  blur,
  priority,
}: {
  imageUrl?: string;
  blur: boolean;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return <div className="absolute inset-0 bg-background" aria-hidden />;
  }

  return (
    <>
      <Image
        src={imageUrl}
        alt=""
        fill
        className={
          blur
            ? "object-cover blur-md brightness-[0.4]"
            : "object-cover brightness-[0.4]"
        }
        sizes="100vw"
        loading="eager"
        priority={priority}
        onError={() => setFailed(true)}
        aria-hidden
      />
      <div className="absolute inset-0 bg-background/35" aria-hidden />
    </>
  );
}

function EventSlide({
  event,
  isActive,
}: {
  event: EventList;
  isActive: boolean;
}) {
  const hasImage = Boolean(event.image?.trim());
  const imageUrl = event.image?.trim() || DEFAULT_COVER_IMAGE;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SlideBackground
        key={event.image?.trim() || `event-bg-${event.id}`}
        imageUrl={event.image}
        blur={hasImage}
        priority={isActive}
      />
      <div className="relative z-10 flex h-full w-full items-stretch px-10 py-8">
        <div className="flex w-[46%] flex-col justify-center pr-6">
          <div className="mb-0 flex w-full items-start justify-between gap-4">
            <span className="rounded-full border border-border bg-black/35 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
              {event.category.label}
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-snug tracking-tight text-white line-clamp-2 pt-[0.1em] pb-[0.22em]">
            {event.title}
          </h2>
          <p className="mt-4 text-2xl text-white/95">
            {formatEventDateLong(event.start_date)}
          </p>
          <p className="mt-2 text-xl text-foreground line-clamp-2">
            {event.location}
          </p>
        </div>
        <div className="flex h-full min-h-[280px] w-[54%] min-w-0 flex-col justify-center">
          <div className="relative aspect-[21/9] w-full max-h-full min-h-0 shrink-0 overflow-hidden rounded-xl bg-secondary">
            <EventCardImage
              src={imageUrl}
              alt={event.image_alt}
              priority={isActive}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCardImage({
  src,
  alt,
  priority,
}: {
  src?: string;
  alt?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(!src?.trim());
  if (!src?.trim() || failed) {
    return <div className="h-full w-full bg-secondary" aria-hidden />;
  }
  return (
    <Image
      src={src}
      alt={alt || ""}
      fill
      className="object-cover object-center"
      sizes="54vw"
      loading="eager"
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}

function NewsSlide({
  news,
  isActive,
}: {
  news: NewsItem;
  isActive: boolean;
}) {
  const hasImage = Boolean(news.image?.trim());

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SlideBackground
        key={news.image?.trim() || `news-bg-${news.id}`}
        imageUrl={news.image}
        blur={hasImage}
        priority={isActive}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-16 text-center">
        <div className="mb-0 flex w-full max-w-5xl justify-center">
          <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-amber-200 backdrop-blur-sm">
            Nyhet
          </span>
        </div>
        <h2 className="font-display max-w-5xl text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-snug tracking-tight text-white line-clamp-3 pt-[0.1em] pb-[0.22em]">
          {news.title}
        </h2>
        <p className="mt-6 max-w-4xl text-2xl font-light leading-snug text-foreground line-clamp-3">
          {news.header}
        </p>
      </div>
    </div>
  );
}

function BottomCard({ event }: { event: EventList }) {
  return (
    <article className="flex w-[200px] shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-[21/9] w-full bg-secondary">
        <ThumbImage
          src={event.image?.trim() || DEFAULT_COVER_IMAGE}
          alt={event.image_alt}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white">
          {event.title}
        </h3>
        <p className="text-xs font-semibold text-primary">
          {formatEventDateShort(event.start_date)}
        </p>
        <p className="line-clamp-1 text-[11px] text-muted-foreground">
          {event.location}
        </p>
      </div>
    </article>
  );
}

function ThumbImage({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(!src?.trim());
  if (!src?.trim() || failed) {
    return <div className="h-full w-full bg-secondary" />;
  }
  return (
    <Image
      src={src}
      alt={alt || ""}
      fill
      className="object-cover"
      sizes="200px"
      loading="eager"
      onError={() => setFailed(true)}
    />
  );
}

function BottomStrip({ events }: { events: EventList[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [marquee, setMarquee] = useState(false);

  const measure = useCallback(() => {
    const v = viewportRef.current;
    const t = trackRef.current;
    if (!v || !t) return;
    setMarquee(t.scrollWidth > v.clientWidth + 4);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [events, measure]);

  if (events.length === 0) {
    return (
      <div className="flex h-full items-center justify-center border-t border-border bg-card/40 px-6 text-muted-foreground">
        Ingen arrangementer lenger enn én uke frem i tid akkurat nå.
      </div>
    );
  }

  const cards = events.map((e) => <BottomCard key={e.id} event={e} />);

  return (
    <div
      ref={viewportRef}
      className="flex h-full min-h-0 items-center overflow-hidden border-t border-border bg-card/30 px-2"
    >
      <div
        ref={trackRef}
        className={
          marquee
            ? "flex w-max shrink-0 animate-strip-marquee items-stretch gap-6 py-3"
            : "flex w-full items-stretch justify-evenly gap-6 py-3"
        }
      >
        {cards}
        {marquee ? cards : null}
      </div>
    </div>
  );
}

function slidesStableKey(slides: Slide[]): string {
  return slides.map((s) => `${s.kind}-${s.data.id}`).join("|");
}

function SlideshowCarousel({ slides }: { slides: Slide[] }) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [slides]);

  return (
    <>
      <div className="relative h-full w-full">
        {slides.map((slide, i) => (
          <div
            key={`${slide.kind}-${slide.data.id}`}
            className="absolute inset-0 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: i === slideIndex ? 1 : 0,
              zIndex: i === slideIndex ? 2 : 1,
              pointerEvents: i === slideIndex ? "auto" : "none",
            }}
          >
            {slide.kind === "event" ? (
              <EventSlide event={slide.data} isActive={i === slideIndex} />
            ) : (
              <NewsSlide news={slide.data} isActive={i === slideIndex} />
            )}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-1 bg-secondary/80">
        <div
          key={slideIndex}
          className="h-full w-full origin-left scale-x-0 bg-[hsl(219_100%_81%)] animate-slide-progress"
        />
      </div>
    </>
  );
}

export function TihldeTvScreen() {
  const clockNow = useNowEverySecond();
  const [events, setEvents] = useState<EventList[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [asOf, setAsOf] = useState(() => new Date());
  const [loadError, setLoadError] = useState<string | null>(null);

  const slides = useMemo(
    () => buildSlides(events, news, asOf),
    [events, news, asOf],
  );

  const laterEvents = useMemo(
    () => filterLaterEvents(events, asOf, 12),
    [events, asOf],
  );

  const slidesKey = useMemo(() => slidesStableKey(slides), [slides]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const [ev, nw] = await Promise.all([fetchAllEvents(), fetchNews()]);
        if (cancelled) return;
        setEvents(ev);
        setNews(nw);
        setAsOf(new Date());
        setLoadError(null);
      } catch {
        if (cancelled) return;
        setLoadError(
          "Kunne ikke hente data fra TIHLDE. Prøver igjen om noen minutter.",
        );
      }
    }

    void run();
    const id = setInterval(() => void run(), REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-8">
        <TihldeLogo size="large" />
        <div className="flex items-end gap-5">
          <span className="pb-1 text-lg text-muted-foreground">
            {clockNow ? formatTodayLong(clockNow) : "\u00a0"}
          </span>
          <time
            className="font-display text-5xl font-bold leading-none tracking-tight text-white tabular-nums"
            dateTime={clockNow?.toISOString() ?? "1970-01-01T00:00:00.000Z"}
          >
            {clockNow ? formatClockTime(clockNow) : "00:00"}
          </time>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <section className="relative h-[72%] min-h-0 shrink-0 overflow-hidden">
          {loadError ? (
            <div className="flex h-full items-center justify-center px-8 text-center text-xl text-muted-foreground">
              {loadError}
            </div>
          ) : slides.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
              <p className="text-2xl font-medium text-white">
                Ingen innhold å vise akkurat nå
              </p>
              <p className="max-w-xl text-muted-foreground">
                Det er ingen kommende arrangementer innen de neste sju dagene,
                og ingen nyheter er tilgjengelige for lysbilder.
              </p>
            </div>
          ) : (
            <SlideshowCarousel key={slidesKey} slides={slides} />
          )}
        </section>

        <section className="min-h-0 flex-1 overflow-hidden">
          <BottomStrip events={laterEvents} />
        </section>
      </div>
    </div>
  );
}
