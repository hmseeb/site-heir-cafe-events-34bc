import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  fetchEventById,
  formatEventDate,
  isEventOver,
  RECURRENCE_BADGE,
  type EventWithPhoto,
  type Recurrence,
} from "@/lib/events";

export const Route = createFileRoute("/events/$id")({
  head: () => ({
    meta: [
      { title: "Event Details — HEIR Cafe & Events" },
      {
        name: "description",
        content:
          "Details, date, time and reservations for an upcoming event at HEIR Cafe & Events in Victorville, CA.",
      },
      { property: "og:title", content: "Event Details — HEIR Cafe & Events" },
      {
        property: "og:description",
        content: "Date, time and reservations for an event at HEIR Cafe & Events in Victorville.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventDetailPage,
});

function EventDetailPage() {
  const { id } = Route.useParams();
  const [event, setEvent] = useState<EventWithPhoto | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let active = true;
    fetchEventById(id)
      .then((ev) => {
        if (!active) return;
        if (!ev || !ev.published) {
          setStatus("missing");
          return;
        }
        setEvent(ev);
        setStatus("ready");
      })
      .catch(() => active && setStatus("missing"));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-sand">
      <div className="mx-auto max-w-4xl px-5 py-14 md:py-20">
        <Link to="/" className="text-sm text-terracotta underline">
          ← Back to HEIR Cafe &amp; Events
        </Link>

        {status === "loading" && <p className="mt-10 text-foreground/70">Loading event…</p>}

        {status === "missing" && (
          <div className="mt-10 rounded-3xl border border-gold/25 bg-background p-8">
            <h1 className="font-display text-3xl text-forest-deep">Event not found</h1>
            <p className="mt-3 text-foreground/75">
              This event may have ended or been removed. Take a look at everything else happening at
              HEIR.
            </p>
            <Link to="/" className="btn-base btn-primary mt-6 inline-flex">
              See what&rsquo;s on
            </Link>
          </div>
        )}

        {status === "ready" && event && <EventBody event={event} />}
      </div>
    </main>
  );
}

function EventBody({ event }: { event: EventWithPhoto }) {
  const { date, time } = formatEventDate(event.starts_at, event.recurrence);
  const over = isEventOver(event);

  return (
    <article className="mt-8">
      <p className="eyebrow text-terracotta">
        {over ? "This event has ended" : RECURRENCE_BADGE[event.recurrence as Recurrence]}
      </p>
      <h1 className="mt-3 font-display text-4xl text-forest-deep md:text-5xl">{event.title}</h1>

      {event.photoUrl && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-gold/30 shadow-lg">
          <img
            src={event.photoUrl}
            alt={`${event.title} at HEIR Cafe and Events`}
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="mt-8 grid gap-3 text-foreground/80">
        <p className="flex items-center gap-3">
          <span className="text-terracotta" aria-hidden="true">
            📅
          </span>
          <span className="font-medium text-foreground">{date}</span>
        </p>
        <p className="flex items-center gap-3">
          <span className="text-terracotta" aria-hidden="true">
            🕖
          </span>
          <span className="font-medium text-foreground">{time}</span>
        </p>
        <p className="flex items-center gap-3">
          <span className="text-terracotta" aria-hidden="true">
            📍
          </span>
          <span>{event.location}</span>
        </p>
      </div>

      {event.description && (
        <p className="mt-7 whitespace-pre-line text-base text-foreground/80 md:text-lg">
          {event.description}
        </p>
      )}

      <div className="mt-9 flex flex-wrap gap-3">
        {!over && event.cta_url && (
          <a
            href={event.cta_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-base btn-primary"
          >
            {event.cta_label || "Reserve Your Spot"}
          </a>
        )}
        <Link to="/" className="btn-base btn-outline">
          Back to home
        </Link>
      </div>

      {over && (
        <p className="mt-6 rounded-2xl border border-gold/25 bg-background p-5 text-foreground/75">
          This event has already taken place. Check the homepage for what&rsquo;s coming up next.
        </p>
      )}
    </article>
  );
}
