import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { joinNewsletter } from "@/lib/ghl.functions";
import {
  fetchUpcomingEvents,
  formatEventDate,
  type EventWithPhoto,
} from "@/lib/events";



import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import realEventSpace from "@/assets/real-event-space.jpg";
import realHighTea from "@/assets/real-high-tea.jpg";
import realLounge from "@/assets/real-lounge.jpg.asset.json";
import realPaintSip from "@/assets/real-paint-sip.jpg.asset.json";
import realTeaRoom from "@/assets/real-tea-room.jpg.asset.json";
import realStorefront from "@/assets/real-storefront.jpg.asset.json";
import realLivingCrown from "@/assets/real-living-crown.jpg.asset.json";
import realFireplaceNook from "@/assets/real-fireplace-nook.jpg.asset.json";
import realPaintSolo from "@/assets/real-paint-solo.jpg.asset.json";
import realCrownWorkshop from "@/assets/real-crown-workshop.jpg.asset.json";
import realTeaParty from "@/assets/real-tea-party.jpg.asset.json";


const heroLounge = realLounge.url;
const eventPaintSip = realPaintSip.url;
const spaceRoom = realTeaRoom.url;
const finalCta = realStorefront.url;
const privateBirthday = realLivingCrown.url;
const liveMusicImage = realEventSpace;
const diningImage = realHighTea;
const karaokeImage = realLounge.url;
const atmosphereImage = realLounge.url;
import heirLogo from "@/assets/heir-logo.webp.asset.json";

const PHONE = "(442) 419-1056";
const PHONE_HREF = "tel:+14424191056";
const ADDRESS = "14845 Monarch Blvd C, Victorville, CA 92395, United States";
const MAPS = "https://share.google/Od9DjIKVkHgMt7Ye8";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HEIR Cafe & Events — Victorville Community Venue & Event Space" },
      {
        name: "description",
        content:
          "HEIR Cafe & Events in Victorville: karaoke, paint and sip, smooth jazz, food promotions and private party rentals. Health, Empowerment, Inspiration, Renewal.",
      },
      { property: "og:title", content: "HEIR Cafe & Events — Victorville Community Venue & Event Space" },
      {
        property: "og:description",
        content:
          "HEIR Cafe & Events in Victorville: karaoke, paint and sip, smooth jazz, food promotions and private party rentals. Health, Empowerment, Inspiration, Renewal.",
      },
      { property: "og:type", content: "website" },

      { property: "og:url", content: "https://heir7.com/" },
      { property: "og:image", content: "https://heir7.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://heir7.com/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://heir7.com/" }],
    scripts: [
      {
        src: "https://widgets.leadconnectorhq.com/loader.js",
        "data-resources-url": "https://widgets.leadconnectorhq.com/chat-widget/loader.js",
        "data-widget-id": "6a88b04ab433348f40292d7b",
      },
    ],
  }),

  component: Home,
});

/* ---------------- data (editable) ---------------- */

type Activity = {
  title: string;
  image: string;
  description: string;
  tags: string[];
};

const activities: Activity[] = [
  {
    title: "Paint and Sip",
    image: eventPaintSip,
    description:
      "Paint, sip and unwind with friends in a relaxed evening of creativity and conversation.",
    tags: ["Creative", "Social", "Ages 16+"],
  },
  {
    title: "Karaoke Night",
    image: karaokeImage,
    description:
      "Take the mic or cheer from your seat during a fun night of singing and community energy.",
    tags: ["Music", "Social", "Ages 21+"],
  },
  {
    title: "Creative Workshops",
    image: realCrownWorkshop.url,
    description:
      "Hands-on projects like Living Crown planters, crafts and guided painting nights.",
    tags: ["Creative", "All ages"],
  },
  {
    title: "Live Music & Smooth Jazz",
    image: liveMusicImage,
    description:
      "Laid-back performances that set the mood for conversation, dining and relaxation.",
    tags: ["Music", "Evening"],
  },
  {
    title: "Fish Fry Friday",
    image: diningImage,
    description:
      "A themed food and music evening built around good plates and an easygoing atmosphere.",
    tags: ["Food", "Music", "Friday"],
  },
  {
    title: "High Tea & Social Dining",
    image: realTeaParty.url,
    description:
      "Gather around tiered food service, tea and conversation in a comfortable setting.",
    tags: ["Dining", "Social"],
  },
  {
    title: "Watch Parties & Sports Nights",
    image: realFireplaceNook.url,
    description:
      "Catch the game on a big screen with friends, snacks and a relaxed lounge feel.",
    tags: ["Sports", "Social"],
  },
  {
    title: "Private Parties & Banquets",
    image: spaceRoom,
    description:
      "Host birthdays, showers, dinners, meetings or community events in a warm, flexible space.",
    tags: ["Private", "Flexible"],
  },
];

const pillars = [
  {
    letter: "H",
    title: "Health",
    copy: "Make room to slow down, breathe and enjoy a more positive environment.",
  },
  {
    letter: "E",
    title: "Empowerment",
    copy: "Participate in experiences that encourage creativity, confidence and connection.",
  },
  {
    letter: "I",
    title: "Inspiration",
    copy: "Discover music, art, conversation and events that bring fresh energy.",
  },
  {
    letter: "R",
    title: "Renewal",
    copy: "Leave feeling more relaxed, connected and refreshed than when you arrived.",
  },
];

const atmosphere = [
  {
    title: "Smooth Jazz & Music",
    copy: "Laid-back live or recorded music in a comfortable setting.",
  },
  {
    title: "Sports & Social Nights",
    copy: "Watch the game and share the experience with people around you.",
  },
  {
    title: "Food & Conversation",
    copy: "Themed food evenings and time around the table.",
  },
  {
    title: "Friends & Connection",
    copy: "Meet up, catch up and spend time away from daily pressure.",
  },
];

const rentalCategories = [
  { title: "Birthday Celebrations", copy: "Bring family and friends together in a warm social atmosphere.", image: privateBirthday },
  { title: "Private Dinners & Banquets", copy: "A welcoming experience centered around food and conversation.", image: diningImage },
  { title: "Meetings & Workshops", copy: "Educational, creative or community-centered gatherings.", image: spaceRoom },
  { title: "Showers & Family Events", copy: "An intimate celebration around an important new chapter.", image: eventPaintSip },
  { title: "Networking & Community", copy: "Space for local professionals, organizations and groups to connect.", image: finalCta },
  { title: "Watch Parties & Social Nights", copy: "Bring a group together for sports, music or entertainment.", image: realFireplaceNook.url },
];

const benefits = [
  { title: "A Relaxed Environment", copy: "Host somewhere that feels welcoming rather than overly formal." },
  { title: "A Flexible Space", copy: "Use the venue for a celebration, banquet, workshop or social experience." },
  { title: "A Mission With Meaning", copy: "A business centered around health, empowerment, inspiration and renewal." },
  { title: "A Community Feel", copy: "An event connected to real people rather than an anonymous rental room." },
];

const galleryItems = [
  { category: "The Space", image: spaceRoom, alt: "Guests enjoying a tea party in the HEIR dining room" },
  { category: "Live Events", image: liveMusicImage, alt: "Guests gathered for a live event at HEIR" },
  { category: "Karaoke", image: realTeaParty.url, alt: "Guests enjoying a social evening at HEIR" },
  { category: "Paint and Sip", image: eventPaintSip, alt: "Guests holding paintings they created at HEIR Paint and Sip night" },
  { category: "Food Promotions", image: diningImage, alt: "Guests enjoying a themed dining experience at HEIR" },
  { category: "Private Parties", image: privateBirthday, alt: "Living Crown planter workshop at HEIR Cafe & Events" },
  { category: "Community Experiences", image: heroLounge, alt: "Guests gathered in the HEIR lounge and bar area" },
  { category: "Guests", image: finalCta, alt: "HEIR Cafe & Events storefront in Victorville" },
  { category: "The Space", image: realFireplaceNook.url, alt: "Fireplace lounge nook with HEIR lettering and balloon decor" },
  { category: "Paint and Sip", image: realPaintSolo.url, alt: "Guest showing off her painting at HEIR Paint and Sip" },
  { category: "Private Parties", image: realCrownWorkshop.url, alt: "Guest with her finished Living Crown planter" },
  { category: "The Space", image: realTeaParty.url, alt: "Families enjoying afternoon tea service at HEIR" },
];

const galleryFilters = [
  "All",
  ...Array.from(new Set(galleryItems.map((g) => g.category))),
];

const steps = [
  { n: "01", title: "Share Your Event", copy: "Tell us the occasion, preferred date and approximate group size." },
  { n: "02", title: "Speak With the Team", copy: "Discuss availability, the atmosphere you want and your first questions." },
  { n: "03", title: "See the Space", copy: "Schedule a visit and picture your gathering at HEIR." },
  { n: "04", title: "Review the Next Steps", copy: "The team explains current rental details and reservation requirements." },
];

const faqs = [
  { q: "What is HEIR?", a: "HEIR stands for Health, Empowerment, Inspiration and Renewal. It is a café-style community and event venue designed for social experiences, relaxation and private gatherings." },
  { q: "Can I rent the space?", a: "Yes. HEIR is available for private parties, banquets and other gatherings. Submit a reservation request to discuss your event." },
  { q: "What activities are offered at HEIR?", a: "HEIR offers paint and sip nights, karaoke, creative workshops, smooth jazz and live music, Fish Fry Friday, high tea and social dining, watch parties, and private events." },
  { q: "Does HEIR serve food?", a: "The venue has hosted themed café evenings such as Fish Fry Friday. Contact HEIR for the current menu and schedule." },
  { q: "Can I reserve seats for an event?", a: "Yes — public event listings include a reserve button whenever seats are available." },
  { q: "Can I tour the venue before renting it?", a: "Contact the HEIR team to request a walkthrough." },
  { q: "What is the venue capacity?", a: "Capacity is not published. Contact HEIR for seated and standing limits." },
  { q: "How do I request the venue?", a: "Submit the private-event inquiry form below or call the venue directly." },
];

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Upcoming Event", href: "#upcoming-event" },
  { label: "Our Mission", href: "#mission" },
  { label: "Activities", href: "#events" },
  { label: "Private Events", href: "#private" },
  { label: "Café & Promotions", href: "#cafe" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];


/* ---------------- page ---------------- */

function Home() {
  const upcomingEvents = useUpcomingEvents();

  return (
    <div id="top" className="overflow-x-hidden pb-16 md:pb-0">
      <EventBanner events={upcomingEvents} />
      <Nav />
      <Hero />
      <EventComingUp events={upcomingEvents} />

      <Mission />
      <TwoWays />
      <Events />
      <Atmosphere />
      <Cafe />
      <PrivateRentals />
      <WhyHost />
      <Gallery />
      <InquiryForm />
      <Process />
      <Newsletter />
      <Faq />
      <LocationSection />
      <FinalCta />
      <Footer />
      <MobileBar />
    </div>
  );
}


function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <img
            src={heirLogo.url}
            alt="HEIR Cafe & Events logo"
            width={80}
            height={80}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-tight text-forest-deep">
              HEIR Cafe &amp; Events
            </span>
            <span className="hidden text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase sm:block">
              Victorville, CA
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 xl:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-terracotta"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#events" className="btn-base btn-primary hidden !px-5 !py-2.5 !text-xs xl:inline-flex">
            Explore Activities
          </a>
          <a href="#inquiry" className="btn-base btn-outline hidden !px-5 !py-2.5 !text-xs xl:inline-flex">
            Reserve the Venue
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border xl:hidden"
          >
            <span className="text-lg leading-none">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 py-4 xl:hidden">
          <ul className="grid gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-base font-medium text-foreground/85 hover:bg-secondary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate">
      <img
        src={heroLounge}
        alt="Guests relaxing and laughing together in a warm café lounge"
        width={1600}
        height={1008}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/85 via-forest-deep/70 to-charcoal/85" />
      <div className="mx-auto max-w-5xl px-5 py-24 text-center md:py-36">
        <img
          src={heirLogo.url}
          alt="HEIR Cafe & Events logo"
          width={320}
          height={324}
          className="mx-auto mb-7 h-28 w-28 rounded-full object-cover shadow-2xl ring-1 ring-gold/40 md:h-36 md:w-36"
        />
        <p className="eyebrow text-gold">Health • Empowerment • Inspiration • Renewal</p>
        <h1 className="mt-5 font-display text-4xl leading-[1.08] text-cream sm:text-5xl md:text-6xl">
          A Place to Recharge,
          <br className="hidden sm:block" /> Connect and Celebrate
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-cream/85 md:text-lg">
          HEIR Cafe &amp; Events is a welcoming Victorville space for live experiences, food,
          friendship and private gatherings. Come enjoy the atmosphere—or make the space your own.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#events" className="btn-base btn-primary">
            Explore Activities
          </a>
          <a
            href="#inquiry"
            className="btn-base border border-cream/45 text-cream hover:bg-cream/10"
          >
            Reserve the Venue
          </a>
        </div>
        <a
          href={PHONE_HREF}
          className="mt-6 inline-block font-display text-xl text-gold underline-offset-4 hover:underline"
        >
          Call {PHONE}
        </a>
        <ul className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            "Public events and themed evenings",
            "Private parties and banquets",
            "Relaxed, community-focused atmosphere",
          ].map((t) => (
            <li
              key={t}
              className="rounded-2xl border border-cream/20 bg-cream/10 px-4 py-3 text-sm text-cream/90"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}




function useUpcomingEvents(): EventWithPhoto[] {
  const [events, setEvents] = useState<EventWithPhoto[]>([]);

  useEffect(() => {
    fetchUpcomingEvents()
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  return events;
}

function EventBanner({ events }: { events: EventWithPhoto[] }) {
  const next = events[0];
  if (!next) return null;
  const { date, time } = formatEventDate(next.starts_at, next.recurrence);

  const inner = (
    <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
      <span className="rounded-full bg-gold/25 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
        Coming up
      </span>
      <span className="font-medium">{next.title}</span>
      <span className="text-cream/75">
        {date} · {time}
      </span>
      <span className="underline underline-offset-4">
        View event page →
      </span>
    </span>
  );

  return (
    <div className="bg-forest-deep px-4 py-2.5 text-sm text-cream">
      <Link to="/events/$id" params={{ id: next.id }} className="block">
        {inner}
      </Link>
    </div>
  );
}

function EventComingUp({ events }: { events: EventWithPhoto[] }) {
  const upcoming = events;
  if (!upcoming.length) return null;

  return (
    <section id="upcoming-event" className="section-pad bg-sand">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow text-terracotta">
          {upcoming.length > 1 ? "Events coming up" : "Event coming up"}
        </p>
        <div className="mt-6 space-y-16">
          {upcoming.map((ev) => {
            const { date, time } = formatEventDate(ev.starts_at, ev.recurrence);
            return (
              <div key={ev.id} className="grid gap-8 lg:grid-cols-2 lg:items-center">
                {ev.photoUrl && (
                  <div className="overflow-hidden rounded-3xl border border-gold/30 shadow-lg">
                    <img
                      src={ev.photoUrl}
                      alt={`${ev.title} at HEIR Cafe and Events`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h2 className="font-display text-3xl text-forest-deep md:text-5xl">{ev.title}</h2>
                  <div className="mt-5 space-y-3 text-foreground/80">
                    <p className="flex items-center gap-3">
                      <span className="text-terracotta" aria-hidden="true">📅</span>
                      <span className="font-medium text-foreground">{date}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-terracotta" aria-hidden="true">🕖</span>
                      <span className="font-medium text-foreground">{time}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-terracotta" aria-hidden="true">📍</span>
                      <span>{ev.location}</span>
                    </p>
                  </div>
                  {ev.description && (
                    <p className="mt-5 whitespace-pre-line text-foreground/75">{ev.description}</p>
                  )}
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {ev.cta_url && (
                      <a
                        href={ev.cta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-base btn-primary"
                      >
                        {ev.cta_label || "Reserve Your Spot"}
                      </a>
                    )}
                    {(
                      <Link
                        to="/events/$id"
                        params={{ id: ev.id }}
                        className="btn-base btn-outline !px-5 !py-2.5 !text-xs"
                      >
                        View Event Details
                      </Link>
                    )}
                    <a href={PHONE_HREF} className="btn-base btn-outline !px-5 !py-2.5 !text-xs">
                      Call {PHONE}
                    </a>
                  </div>

                  <p className="mt-4 text-sm text-foreground/60">
                    Reservations help the team prepare seating. Walk-ins are welcome if space allows.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function Mission() {

  return (
    <section id="mission" className="section-pad bg-sand">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="eyebrow text-terracotta">The meaning behind HEIR</p>
          <h2 className="mt-4 font-display text-3xl text-forest-deep md:text-5xl">
            More Than an Event Space
          </h2>
          <p className="mt-5 text-base text-foreground/80 md:text-lg">
            HEIR was created around four ideas: Health. Empowerment. Inspiration. Renewal.
          </p>
          <p className="mt-3 text-base text-foreground/70">
            The goal is to give hard-working people a clean, soothing place to step away from
            everyday pressure, enjoy meaningful experiences and reconnect with the people around
            them.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {pillars.map((p) => (
            <article key={p.title} className="panel p-7">
              <span className="font-display text-5xl text-terracotta/70">{p.letter}</span>
              <h3 className="mt-3 text-2xl text-forest-deep">{p.title}</h3>
              <p className="mt-2 text-foreground/70">{p.copy}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 font-display text-xl text-forest md:text-2xl">
          Every HEIR event should support at least one of these four outcomes.
        </p>
      </div>
    </section>
  );
}

function TwoWays() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl font-display text-3xl text-forest-deep md:text-5xl">
          Come to an Event—or Host Your Own
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="panel overflow-hidden">
            <img src={heroLounge} alt="Guests enjoying an evening at HEIR" loading="lazy" width={1600} height={1008} className="h-56 w-full object-cover" />
            <div className="p-7">
              <h3 className="text-2xl text-forest-deep">Attend a HEIR Experience</h3>
              <p className="mt-2 text-foreground/70">
                Explore themed evenings, music, creative events, sports nights and food promotions.
              </p>
              <a href="#events" className="btn-base btn-forest mt-6">
                Explore Activities
              </a>
            </div>
          </article>
          <article className="panel overflow-hidden">
            <img src={spaceRoom} alt="HEIR dining room set for a private gathering" loading="lazy" width={1200} height={900} className="h-56 w-full object-cover" />
            <div className="p-7">
              <h3 className="text-2xl text-forest-deep">Reserve the Space</h3>
              <p className="mt-2 text-foreground/70">
                Host a party, banquet, meeting or private gathering in a flexible and welcoming
                venue.
              </p>
              <a href="#inquiry" className="btn-base btn-primary mt-6">
                Request the Venue
              </a>
            </div>
          </article>
        </div>
        <p className="mt-8 max-w-2xl text-foreground/70">
          HEIR is designed to function as both a community destination and a space for personal
          celebrations.
        </p>
      </div>
    </section>
  );
}

function Events() {
  const [interested, setInterested] = useState<string | null>(null);
  return (
    <section id="events" className="section-pad bg-forest-deep text-cream">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow text-gold">What you can do at HEIR</p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl text-cream md:text-5xl">
          Activities for Every Mood
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {activities.map((a) => (
            <article
              key={a.title}
              className="overflow-hidden rounded-3xl border border-cream/15 bg-cream/5"
            >
              <img
                src={a.image}
                alt={`${a.title} at HEIR Cafe & Events`}
                loading="lazy"
                width={1200}
                height={900}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl text-cream">{a.title}</h3>
                <p className="mt-3 text-sm text-cream/80">{a.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {a.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cream/20 bg-cream/10 px-3 py-1 text-xs text-cream/85"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setInterested(a.title)}
                  className="btn-base btn-primary mt-6 w-full"
                >
                  Ask About This
                </button>
                {interested === a.title && (
                  <p className="mt-3 text-sm text-gold">
                    Thanks for your interest in {a.title}. The HEIR team will follow up with you
                    soon.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <a
            href="#newsletter"
            className="btn-base border border-cream/40 text-cream hover:bg-cream/10"
          >
            Get Activity Updates
          </a>
        </div>
      </div>
    </section>
  );
}

function Atmosphere() {
  return (
    <section className="section-pad">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-[2.5rem]">
          <img
            src={atmosphereImage}
            alt="Guests gathered in the warm HEIR lounge"
            loading="lazy"
            width={1200}
            height={900}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow text-terracotta">A break from the everyday</p>
          <h2 className="mt-4 font-display text-3xl text-forest-deep md:text-5xl">
            Come In, Exhale and Stay Awhile
          </h2>
          <p className="mt-5 text-foreground/75">
            HEIR is intended to feel comfortable, clean and relaxing. A place to listen to smooth
            jazz, watch a game, catch up with friends or simply enjoy being somewhere that does not
            demand anything from you.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {atmosphere.map((a) => (
              <article key={a.title} className="rounded-3xl bg-secondary p-5">
                <h3 className="text-lg text-forest-deep">{a.title}</h3>
                <p className="mt-1.5 text-sm text-foreground/70">{a.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Cafe() {
  return (
    <section id="cafe" className="section-pad bg-sand">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow text-terracotta">Food, music and community</p>
        <h2 className="mt-4 font-display text-3xl text-forest-deep md:text-5xl">
          Special Evenings at HEIR
        </h2>
        <p className="mt-5 max-w-2xl text-foreground/75">
          In addition to venue rentals, HEIR offers themed café promotions and social evenings.
        </p>

        <article className="panel mt-10 grid overflow-hidden md:grid-cols-2">
          <img
            src={diningImage}
            alt="Guests enjoying a themed dining evening at HEIR"
            loading="lazy"
            width={1400}
            height={1000}
            className="h-64 w-full object-cover md:h-full"
          />
          <div className="p-7 md:p-10">
            <p className="eyebrow text-terracotta">Featured promotion</p>
            <h3 className="mt-3 font-display text-3xl text-forest-deep">Fish Fry Friday</h3>
            <p className="mt-3 text-foreground/75">
              Food, music and a relaxed reason to get out of the house.
            </p>
            <dl className="mt-6 grid gap-2 text-sm">
              {[
                ["Day & date", "Fridays — next date to be confirmed"],
                ["Time", "Evening — time to be confirmed"],
                ["Menu", "Fried fish plate with sides"],
                ["Price", "Pricing to be confirmed"],
                ["Entertainment", "Live music"],
                ["Reservations", "Call to check availability"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium text-foreground/85">{v}</dd>
                </div>
              ))}
            </dl>
            <a href={PHONE_HREF} className="btn-base btn-primary mt-7">
              See Current Promotions
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

function PrivateRentals() {
  return (
    <section id="private" className="section-pad">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow text-terracotta">Make HEIR yours</p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl text-forest-deep md:text-5xl">
          A Flexible Space for Your Next Gathering
        </h2>
        <p className="mt-5 max-w-2xl text-foreground/75">
          HEIR can be rented for parties, banquets and private experiences—a comfortable environment
          where people connect and celebrate without the stiffness of a traditional ballroom.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rentalCategories.map((c) => (
            <article key={c.title} className="panel overflow-hidden">
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                width={1200}
                height={900}
                className="h-44 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl text-forest-deep">{c.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{c.copy}</p>
                <a href="#inquiry" className="btn-base btn-outline mt-5 !px-5 !py-2.5 !text-xs">
                  Ask About This Event
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyHost() {
  return (
    <section className="section-pad bg-forest text-cream">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl font-display text-3xl text-cream md:text-5xl">
          Your Event Should Feel Good to Be Part Of
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {benefits.map((b) => (
            <article key={b.title} className="rounded-3xl border border-cream/15 bg-cream/5 p-7">
              <h3 className="text-xl text-cream">{b.title}</h3>
              <p className="mt-2 text-cream/75">{b.copy}</p>
            </article>
          ))}
        </div>
        <a href="#inquiry" className="btn-base btn-primary mt-10">
          Request the Space
        </a>
      </div>
    </section>
  );
}

function Gallery() {
  const [filter, setFilter] = useState("All");
  const items =
    filter === "All" ? galleryItems : galleryItems.filter((g) => g.category === filter);

  return (
    <section id="gallery" className="section-pad">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-3xl text-forest-deep md:text-5xl">Experience HEIR</h2>
        <p className="mt-4 max-w-2xl text-foreground/75">
          Explore public events, café evenings, private gatherings and the atmosphere inside the
          venue.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {galleryFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${
                filter === f
                  ? "border-terracotta bg-terracotta text-accent-foreground"
                  : "border-border text-foreground/70 hover:border-terracotta"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            /* CONCEPT IMAGE — REPLACE WITH REAL HEIR PHOTO */
            <figure key={g.category + g.alt} className="overflow-hidden rounded-3xl">
              <img
                src={g.image}
                alt={g.alt}
                loading="lazy"
                width={1200}
                height={900}
                className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </figure>
          ))}
        </div>

        <a href="#contact" className="btn-base btn-forest mt-10">
          See More Moments
        </a>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-foreground/80">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={120}
        className="rounded-2xl border border-input bg-card px-4 py-3 text-base outline-none focus:border-terracotta"
      />
    </label>
  );
}

function InquiryForm() {
  return (
    <section id="inquiry" className="section-pad bg-sand">
      <div className="mx-auto max-w-4xl px-5">
        <h2 className="font-display text-3xl text-forest-deep md:text-5xl">
          Tell Us What You're Planning
        </h2>
        <p className="mt-4 text-foreground/75">
          Share your preferred date and event details, and the HEIR team can help you explore
          whether the space is the right fit.
        </p>

        <div className="panel mt-8 overflow-hidden p-2 md:p-3">
          <iframe
            src="https://link.leadtocustomerssystem.com/widget/form/xI5AZ96IddZP5RnAqkkX"
            style={{ width: "100%", height: "814px", border: "none", borderRadius: "8px" }}
            id="inline-xI5AZ96IddZP5RnAqkkX"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Website Form"
            data-height="814"
            data-layout-iframe-id="inline-xI5AZ96IddZP5RnAqkkX"
            data-form-id="xI5AZ96IddZP5RnAqkkX"
            data-cookie-consent="true"
            data-cookie-consent-provider="auto"
            title="Website Form"
          />
        </div>
      </div>
    </section>
  );
}


function Process() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-3xl text-forest-deep md:text-5xl">
          From Your Idea to Event Day
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <article key={s.n} className="rounded-3xl border border-border p-6">
              <span className="font-display text-3xl text-gold">{s.n}</span>
              <h3 className="mt-3 text-lg text-forest-deep">{s.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{s.copy}</p>
            </article>
          ))}
        </div>
        <a href="#inquiry" className="btn-base btn-forest mt-10">
          Start My Request
        </a>
      </div>
    </section>
  );
}

function Newsletter() {
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const join = useServerFn(joinNewsletter);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await join({
        data: {
          firstName: String(fd.get("firstName") ?? "").trim(),
          email: String(fd.get("email") ?? "").trim(),
        },
      });
      setJoined(true);
    } catch {
      setError("We couldn't add you to the list. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="newsletter" className="section-pad bg-terracotta text-accent-foreground">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="eyebrow text-cream/85">Don't miss the next experience</p>
        <h2 className="mt-4 font-display text-3xl md:text-5xl">Get HEIR Events in Your Inbox</h2>
        <p className="mt-4 text-cream/90">
          Be the first to hear about karaoke nights, creative events, food promotions and new
          community experiences.
        </p>
        {joined ? (
          <p className="mt-8 font-display text-xl">
            You're on the list—see you at the next HEIR experience.
          </p>
        ) : (
          <form
            className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-[1fr_1fr_auto]"
            onSubmit={handleSubmit}
          >
            <input
              aria-label="First name"
              name="firstName"
              placeholder="First name"
              required
              maxLength={60}
              className="rounded-full border border-cream/40 bg-cream/15 px-5 py-3 text-base text-cream placeholder:text-cream/70 outline-none focus:border-cream"
            />
            <input
              aria-label="Email address"
              name="email"
              type="email"
              placeholder="Email address"
              required
              maxLength={120}
              className="rounded-full border border-cream/40 bg-cream/15 px-5 py-3 text-base text-cream placeholder:text-cream/70 outline-none focus:border-cream"
            />
            <button type="submit" disabled={busy} className="btn-base btn-forest disabled:opacity-60">
              {busy ? "Joining…" : "Join the HEIR List"}
            </button>
            {error ? (
              <p className="text-sm text-cream sm:col-span-3" role="alert">
                {error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}


function Faq() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="font-display text-3xl text-forest-deep md:text-5xl">Questions About HEIR?</h2>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left font-display text-lg text-forest-deep">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-base text-foreground/75">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section id="contact" className="section-pad bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-3xl text-forest-deep md:text-5xl">
            Find HEIR in Victorville
          </h2>
          <address className="mt-6 text-lg not-italic text-foreground/80">
            HEIR Cafe &amp; Events
            <br />
            14845 Monarch Blvd C
            <br />
            Victorville, CA 92395, United States
          </address>
          <a href={PHONE_HREF} className="mt-4 block font-display text-2xl text-terracotta">
            {PHONE}
          </a>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={MAPS} target="_blank" rel="noreferrer" className="btn-base btn-forest">
              Get Directions
            </a>
            <a href={PHONE_HREF} className="btn-base btn-primary">
              Call HEIR
            </a>
            <a href="#inquiry" className="btn-base btn-outline">
              Request the Venue
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-border">
          <iframe
            title="Map to HEIR Cafe & Events in Victorville"
            src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
            className="h-80 w-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative isolate">
      <img
        src={finalCta}
        alt="Friends sharing food, music and conversation at HEIR"
        loading="lazy"
        width={1600}
        height={900}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-forest-deep/85" />
      <div className="mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
        <p className="eyebrow text-gold">Refresh. Reconnect. Renew.</p>
        <h2 className="mt-4 font-display text-3xl text-cream md:text-5xl">
          There's Always a Reason to Come Together
        </h2>
        <p className="mt-5 text-cream/85">
          Join an upcoming HEIR experience—or bring your own event to a space designed for comfort,
          connection and renewal.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#events" className="btn-base btn-primary">
            Explore Activities
          </a>
          <a href="#inquiry" className="btn-base border border-cream/45 text-cream hover:bg-cream/10">
            Reserve the Venue
          </a>
        </div>
        <a href={PHONE_HREF} className="mt-6 inline-block font-display text-xl text-gold">
          Call {PHONE}
        </a>
        <p className="mt-8 text-sm text-cream/70">
          HEIR Cafe &amp; Events—Health, Empowerment, Inspiration and Renewal.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal py-12 text-cream/70">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:grid-cols-2">
        <div>
          <img
            src={heirLogo.url}
            alt="HEIR Cafe & Events logo"
            width={112}
            height={113}
            loading="lazy"
            className="mb-4 h-14 w-14 rounded-full object-cover ring-1 ring-gold/40"
          />
          <p className="font-display text-xl text-cream">HEIR Cafe &amp; Events</p>
          <p className="mt-2 text-sm">
            14845 Monarch Blvd C, Victorville, CA 92395, United States
          </p>
          <a href={PHONE_HREF} className="mt-1 block text-sm text-gold">
            {PHONE}
          </a>
        </div>
        <nav className="grid grid-cols-2 gap-1 text-sm sm:justify-items-end">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-cream">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-cream/15 bg-forest-deep text-center text-[0.7rem] font-semibold tracking-wide text-cream uppercase md:hidden">
      <a href={PHONE_HREF} className="py-4">
        Call Now
      </a>
      <a href="#events" className="border-x border-cream/15 py-4">
        Activities
      </a>
      <a href="#inquiry" className="py-4">
        Book the Space
      </a>
    </div>
  );
}
