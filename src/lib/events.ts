export type Recurrence = "once" | "weekly" | "biweekly" | "monthly" | "yearly";

export const RECURRENCE_OPTIONS: { value: Recurrence; label: string }[] = [
  { value: "once", label: "One-time event" },
  { value: "weekly", label: "Every week" },
  { value: "biweekly", label: "Every two weeks" },
  { value: "monthly", label: "Every month" },
  { value: "yearly", label: "Every year" },
];

export const RECURRENCE_BADGE: Record<Recurrence, string> = {
  once: "One-time",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
  yearly: "Yearly",
};

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  photo_path: string | null;
  starts_at: string;
  ends_at: string | null;
  recurrence: string;
  location: string;
  cta_url: string | null;
  cta_label: string | null;
  published: boolean;
  created_at: string;
};

export type EventWithPhoto = EventRow & { photoUrl: string | null };

// Events are managed in the website admin on LeadrVision and read from its public endpoint.
const EVENTS_URL = "https://vision.leadrai.com/api/forms/718b86bc85f23b02a8d75b390a663ca4/events";

type SiteEvent = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  recurrence: Recurrence;
  location: string | null;
  cta_label: string | null;
  cta_url: string | null;
  image_url: string | null;
  updated_at: string;
};

function toEvent(e: SiteEvent): EventWithPhoto {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    photo_path: null,
    starts_at: e.starts_at,
    ends_at: e.ends_at,
    recurrence: e.recurrence,
    location: e.location ?? "",
    cta_url: e.cta_url,
    cta_label: e.cta_label,
    published: true,
    created_at: e.updated_at,
    photoUrl: e.image_url,
  };
}

export async function fetchPublishedEvents(): Promise<EventWithPhoto[]> {
  const res = await fetch(EVENTS_URL);
  if (!res.ok) throw new Error(`events_${res.status}`);
  const { events } = (await res.json()) as { events: SiteEvent[] };
  return events.map(toEvent);
}

export async function fetchEventById(id: string): Promise<EventWithPhoto | null> {
  const res = await fetch(`${EVENTS_URL}/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`event_${res.status}`);
  const { event } = (await res.json()) as { event: SiteEvent };
  return toEvent(event);
}

/** Grace period after start when no end time is given. */
const DEFAULT_DURATION_MS = 3 * 60 * 60 * 1000;

/** One-time events expire after they finish. Recurring events never expire. */
export function isEventOver(ev: Pick<EventRow, "starts_at" | "ends_at" | "recurrence">): boolean {
  if (ev.recurrence !== "once") return false;
  const end = ev.ends_at
    ? new Date(ev.ends_at).getTime()
    : new Date(ev.starts_at).getTime() + DEFAULT_DURATION_MS;
  return end < Date.now();
}

/** Published events that haven't finished yet, soonest first. */
export async function fetchUpcomingEvents(): Promise<EventWithPhoto[]> {
  const events = await fetchPublishedEvents();
  return events.filter((ev) => !isEventOver(ev));
}

export function formatEventDate(iso: string, recurrence: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (recurrence === "weekly") {
    return {
      date: `Every ${d.toLocaleDateString("en-US", { weekday: "long" })}`,
      time,
    };
  }
  if (recurrence === "biweekly") {
    return {
      date: `Every other ${d.toLocaleDateString("en-US", { weekday: "long" })} · starting ${date}`,
      time,
    };
  }
  if (recurrence === "monthly") {
    return { date: `Monthly · starting ${date}`, time };
  }
  if (recurrence === "yearly") {
    return { date: `Yearly · starting ${date}`, time };
  }
  return { date, time };
}
