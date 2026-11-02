import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "HEIR Cafe & Events" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "HEIR Cafe & Events — Victorville Community Venue & Event Space" },
      { property: "og:title", content: "HEIR Cafe & Events — Victorville Community Venue & Event Space" },
      { name: "twitter:title", content: "HEIR Cafe & Events — Victorville Community Venue & Event Space" },
      { name: "description", content: "HEIR Cafe & Events in Victorville: karaoke, paint and sip, smooth jazz, food promotions and private party rentals. Health, Empowerment, Inspiration, Renewal." },
      { property: "og:description", content: "HEIR Cafe & Events in Victorville: karaoke, paint and sip, smooth jazz, food promotions and private party rentals. Health, Empowerment, Inspiration, Renewal." },
      { name: "twitter:description", content: "HEIR Cafe & Events in Victorville: karaoke, paint and sip, smooth jazz, food promotions and private party rentals. Health, Empowerment, Inspiration, Renewal." },
      { property: "og:image", content: "https://heir7.com/og-image.jpg" },
      { name: "twitter:image", content: "https://heir7.com/og-image.jpg" },

    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=DM+Sans:wght@400;500;700&display=swap",
      },
    { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
    scripts: [
      { src: "https://link.leadtocustomerssystem.com/js/form_embed.js" },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@id": "https://heir7.com/",
          "@type": "LocalBusiness",
          address: {
            "@type": "PostalAddress",
            addressCountry: "US",
            addressLocality: "Victorville",
            addressRegion: "CA",
            postalCode: "92395",
            streetAddress: "14845 Monarch Blvd C",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            bestRating: "5",
            ratingCount: "4",
            ratingValue: "5.0",
          },
          description:
            "A beautifully and comfortably decorated space for your event or gathering with flexible options for room arrangement, catering and activities. Possible events: birthday, office, holiday, graduation and anniversary parties, presentations, brunch, showers, family gatherings, game nights, wedding receptions, banquets and more. Amenities include large presentation screens, high quality sound system, kitchen, wall fireplace, bar area and adjustable lighting.",
          hasMap: "https://maps.google.com/maps?cid=8787692882656056956",
          image:
            "https://lh3.googleusercontent.com/66bFtHoQJ-Dqg58XG43n68Spm1yJhw0t2BxIioWhetUZbNuuCRA3k9srBWP2OuEvPN7CKQk_P9u5oc--=s0",
          makesOffer: [
            { "@type": "Offer", name: "Event venue" },
            { "@type": "Offer", name: "Art cafe" },
            { "@type": "Offer", name: "Event planner" },
            { "@type": "Offer", name: "Party planner" },
            { "@type": "Offer", name: "Community center" },
            { "@type": "Offer", name: "Live music venue" },
            { "@type": "Offer", name: "Conference center" },
          ],
          name: "HEIR Cafe & Events",
          sameAs: [
            "https://heir7.com/",
            "https://www.instagram.com/heir.cafe/?hl=en",
            "https://www.facebook.com/groups/hides/posts/9564139310320041/",
            "https://share.google/Od9DjIKVkHgMt7Ye8",
          ],
          telephone: "+1 442-419-1056",
          url: "https://heir7.com/",
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      <p data-lv-review="1" style={{ textAlign: "center", margin: "24px 0" }}><a href="/review">Leave us a review</a></p>
</body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );

}
