# Live Appointments from the CRM Calendar

Today the Appointments tab only lists tours submitted through the website form. Anything booked by phone, by staff, or directly in the CRM never appears, and changes (reschedules, cancellations) aren't reflected.

This change makes the Appointments tab read your tour calendar in the CRM directly, so it always shows the real, current schedule. No Google sign-in needed — the CRM calendar already syncs with Google Calendar, so appointments created there show up too. Admin keeps using the passcode.

## What you'll see

- Appointments tab shows every booking on the tour calendar for a chosen range: Upcoming (default), Today, and Past.
- Each row: date and time in Pacific, duration, guest name, phone, email, status (confirmed / cancelled / no-show), and the appointment notes.
- Cancelled appointments are visually marked rather than hidden.
- A Refresh button pulls the latest, plus automatic refresh when you open the tab.
- Website tour submissions stay available as a secondary card underneath, so nothing you already collected is lost.
- Clear message if the CRM connection fails, instead of an empty list.

## Technical notes

- Add `adminListAppointments` to `src/lib/ghl.functions.ts`: a passcode-gated server function (`requireAdmin` from `src/lib/admin.server.ts`) that calls the GHL `calendars/events` endpoint for calendar `tW5YeO3lkicYS9aXTDNC` with `startTime`/`endTime` epoch bounds and the location id, then maps the response to a plain DTO (id, startTime, endTime, title, status, appointmentStatus, contact name/phone/email, notes).
- Contact details come from the appointment payload when present; otherwise fetch the contact by id and cache per request to avoid duplicate calls.
- Return a typed `{ appointments: [], error }` shape on upstream failure rather than throwing, so the tab can render an inline error.
- In `src/routes/admin.tsx`, replace the `LeadsCard kinds={["tour"]}` block in the `appointments` tab with an `AppointmentsPanel` component: range selector, `useQuery` against the new server fn, table rendering with `Intl.DateTimeFormat` in `America/Los_Angeles`, and the existing `LeadsCard` for website tour submissions kept below.
- No database or auth changes; no new secrets (reuses `GHL_PRIVATE_TOKEN` / `GHL_LOCATION_ID`).
