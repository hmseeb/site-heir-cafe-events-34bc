import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GHL_BASE = "https://services.leadconnectorhq.com";
export const TOUR_TIMEZONE = "America/Los_Angeles";
const CALENDAR_ID = "tW5YeO3lkicYS9aXTDNC";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(160),
  date: z.string().trim().max(40).optional().default(""),
  altDate: z.string().trim().max(40).optional().default(""),
  eventType: z.string().trim().max(120).optional().default(""),
  guests: z.string().trim().max(20).optional().default(""),
  eventTime: z.string().trim().max(40).optional().default(""),
  food: z.string().trim().max(300).optional().default(""),
  entertainment: z.string().trim().max(300).optional().default(""),
  contactTime: z.string().trim().max(120).optional().default(""),
  details: z.string().trim().max(1000).optional().default(""),
});

const newsletterSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(160),
});

const slotsSchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const tourSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(160),
  startTime: z.string().trim().min(10).max(60),
  notes: z.string().trim().max(600).optional().default(""),
});

const appointmentsSchema = z.object({
  range: z.enum(["upcoming", "today", "past"]).default("upcoming"),
});

export type AppointmentRow = {
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  status: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  source: string;
};


type GhlEnv = { token: string; locationId: string };

function ghlEnv(): GhlEnv {
  const token = process.env["GHL_PRIVATE_TOKEN"];
  const locationId = process.env["GHL_LOCATION_ID"];
  if (!token || !locationId) throw new Error("GHL credentials are not configured.");
  return { token, locationId };
}

async function ghlRequest(
  env: GhlEnv,
  method: "GET" | "POST",
  path: string,
  body?: unknown,
): Promise<Record<string, unknown>> {
  const res = await fetch(`${GHL_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.token}`,
      Version: "2021-04-15",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`[GHL] ${method} ${path} failed`, res.status, text.slice(0, 500));
    throw new Error("We couldn't submit your request. Please call us instead.");
  }
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function ghlFetch(env: GhlEnv, path: string, body: unknown) {
  return ghlRequest(env, "POST", path, body);
}

function contactIdOf(payload: Record<string, unknown>): string | null {
  const contact = payload["contact"] as { id?: string } | undefined;
  return contact?.id ?? (payload["id"] as string | undefined) ?? null;
}

/** All venue times are Pacific — format ISO strings in PST/PDT for notes + admin. */
export function formatPacific(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TOUR_TIMEZONE,
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

async function saveLead(row: {
  kind: "inquiry" | "newsletter" | "tour";
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  details?: Record<string, unknown>;
  notes?: string | null;
  ghl_contact_id?: string | null;
}) {
  // Submissions live in GoHighLevel; the Lovable-only leads table is gone.
  void row
}

/** Pacific UTC offset (e.g. "-07:00") for a given calendar day. */
function pacificOffset(sampleIso: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TOUR_TIMEZONE,
    timeZoneName: "longOffset",
  }).formatToParts(new Date(sampleIso));
  const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT-08:00";
  return name.replace("GMT", "") || "-08:00";
}

/** Turn a loose date + time from the inquiry form into a Pacific ISO timestamp. */
function pacificIso(dateStr: string, timeStr: string): string | null {
  let ymd = "";
  const iso = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    ymd = `${iso[1]}-${iso[2]}-${iso[3]}`;
  } else {
    const parsed = new Date(dateStr);
    if (Number.isNaN(parsed.getTime())) return null;
    ymd = new Intl.DateTimeFormat("en-CA", { timeZone: TOUR_TIMEZONE }).format(parsed);
  }

  let hour = 12;
  let minute = 0;
  const t = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (t) {
    hour = Number(t[1]) % 24;
    minute = t[2] ? Number(t[2]) : 0;
    const mer = t[3]?.toLowerCase();
    if (mer === "pm" && hour < 12) hour += 12;
    if (mer === "am" && hour === 12) hour = 0;
  }
  const hhmm = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const naive = `${ymd}T${hhmm}:00`;
  return `${naive}${pacificOffset(`${naive}Z`)}`;
}

export const submitVenueInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inquirySchema.parse(input))
  .handler(async ({ data }) => {
    const env = ghlEnv();
    const [firstName, ...rest] = data.name.split(" ");
    const upsert = await ghlFetch(env, "/contacts/upsert", {
      locationId: env.locationId,
      firstName: firstName || data.name,
      lastName: rest.join(" ") || undefined,
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: "Website — Venue Inquiry",
      tags: ["website-lead", "venue-inquiry"],
    });

    const contactId = contactIdOf(upsert);
    const notes = [
      "New private event / venue request from heir7.com",
      "(all times Pacific)",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Preferred date: ${data.date || "—"}`,
      `Alternative date: ${data.altDate || "—"}`,
      `Preferred time: ${data.eventTime ? `${data.eventTime} PT` : "—"}`,
      `Event type: ${data.eventType || "—"}`,
      `Estimated guests: ${data.guests || "—"}`,
      `Food / cafe needs: ${data.food || "—"}`,
      `Entertainment needs: ${data.entertainment || "—"}`,
      `Best time to contact: ${data.contactTime || "—"}`,
      `Additional details: ${data.details || "—"}`,
    ].join("\n");

    if (contactId) {
      await ghlFetch(env, `/contacts/${contactId}/notes`, { body: notes }).catch(() => undefined);

      // Put the request on the calendar so staff see it alongside tours.
      const startTime =
        pacificIso(data.date, data.eventTime) ??
        pacificIso(data.altDate, data.eventTime) ??
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await ghlFetch(env, "/calendars/events/appointments", {
        calendarId: CALENDAR_ID,
        locationId: env.locationId,
        contactId,
        startTime,
        title: `Venue Request - ${data.name}`,
        appointmentStatus: "new",
        ignoreFreeSlotValidation: true,
      }).catch((err) => {
        console.error("[GHL] venue request appointment failed", err);
      });
    }


    await saveLead({
      kind: "inquiry",
      name: data.name,
      email: data.email,
      phone: data.phone,
      details: { ...data },
      notes,
      ghl_contact_id: contactId,
    });

    return { ok: true as const };
  });

export const joinNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => newsletterSchema.parse(input))
  .handler(async ({ data }) => {
    const env = ghlEnv();
    const upsert = await ghlFetch(env, "/contacts/upsert", {
      locationId: env.locationId,
      firstName: data.firstName,
      email: data.email,
      source: "Website — Newsletter",
      tags: ["website-lead", "newsletter"],
    });
    await saveLead({
      kind: "newsletter",
      name: data.firstName,
      email: data.email,
      details: { source: "newsletter" },
      notes: "Joined the HEIR email list from heir7.com",
      ghl_contact_id: contactIdOf(upsert),
    });
    return { ok: true as const };
  });

/** Free tour slots for one Pacific calendar day. */
export const getTourSlots = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => slotsSchema.parse(input))
  .handler(async ({ data }) => {
    const env = ghlEnv();
    // Cover the whole Pacific day generously; GHL filters to real availability.
    const start = new Date(`${data.date}T00:00:00-08:00`).getTime();
    const end = start + 36 * 60 * 60 * 1000;
    const params = new URLSearchParams({
      startDate: String(start),
      endDate: String(end),
      timezone: TOUR_TIMEZONE,
    });
    let payload: Record<string, unknown>;
    try {
      payload = await ghlRequest(
        env,
        "GET",
        `/calendars/${CALENDAR_ID}/free-slots?${params.toString()}`,
      );
    } catch {
      return { slots: [] as string[], error: "Calendar is unavailable right now." };
    }
    const day = payload[data.date] as { slots?: string[] } | undefined;
    const slots = day?.slots ?? [];
    return { slots, error: null as string | null };
  });

/** Books a tour on the Pacific-time calendar and logs the details in GHL + admin. */
export const bookTour = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tourSchema.parse(input))
  .handler(async ({ data }) => {
    const env = ghlEnv();
    const [firstName, ...rest] = data.name.split(" ");
    const upsert = await ghlFetch(env, "/contacts/upsert", {
      locationId: env.locationId,
      firstName: firstName || data.name,
      lastName: rest.join(" ") || undefined,
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: "Website — Tour Request",
      tags: ["website-lead", "venue-tour"],
      timezone: TOUR_TIMEZONE,
    });
    const contactId = contactIdOf(upsert);
    if (!contactId) throw new Error("We couldn't start your booking. Please call us instead.");

    await ghlFetch(env, "/calendars/events/appointments", {
      calendarId: CALENDAR_ID,
      locationId: env.locationId,
      contactId,
      startTime: data.startTime,
      title: `Tour Request - ${data.name}`,
      appointmentStatus: "confirmed",
      ignoreFreeSlotValidation: false,
    });

    const notes = [
      "Venue tour booked from heir7.com",
      `Tour time: ${formatPacific(data.startTime)} (Pacific)`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `What they want to see: ${data.notes || "—"}`,
    ].join("\n");
    await ghlFetch(env, `/contacts/${contactId}/notes`, { body: notes }).catch(() => undefined);

    await saveLead({
      kind: "tour",
      name: data.name,
      email: data.email,
      phone: data.phone,
      details: { startTime: data.startTime, timezone: TOUR_TIMEZONE, notes: data.notes },
      notes,
      ghl_contact_id: contactId,
    });

    return { ok: true as const, startTime: data.startTime };
  });

function pacificDayBounds(nowMs: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TOUR_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date(nowMs));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  const hour = get("hour") % 24;
  const elapsed = (hour * 3600 + get("minute") * 60 + get("second")) * 1000;
  const start = nowMs - elapsed;
  return { start, end: start + 24 * 60 * 60 * 1000 };
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
