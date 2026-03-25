/** e.g. "lørdag 29. mars kl. 18:00" */
export function formatEventDateLong(iso: string): string {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString("nb-NO", { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleDateString("nb-NO", { month: "long" });
  const time = d.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${weekday} ${day}. ${month} kl. ${time}`;
}

/** Short card date: "lør 29. mar." */
export function formatEventDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Header clock date: "mandag 25. mars 2026" */
export function formatTodayLong(now: Date): string {
  return now.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatClockTime(now: Date): string {
  return now.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
