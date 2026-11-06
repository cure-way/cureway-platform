import type { MetadataRoute } from "next";

import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

/**
 * Sitemap
 *
 * Only crawlable, publicly reachable entry points are listed. Patient,
 * pharmacy and admin portal pages sit behind auth guards, so they are
 * intentionally omitted (and disallowed in `robots.ts`).
 *
 * Every URL is built from `SITE_URL`, so changing the public origin in one
 * place (`@/lib/site`) updates the whole sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: ROUTES.PUBLIC.LANDING, changeFrequency: "daily", priority: 1 },
    { path: ROUTES.AUTH.SIGN_IN, changeFrequency: "monthly", priority: 0.5 },
    { path: ROUTES.AUTH.SIGN_UP, changeFrequency: "monthly", priority: 0.5 },
    // NOTE: /auth/pharmacy/sign-in has no `page.tsx` yet, so it is not
    // listed here — a sitemap must not advertise a 404.
    { path: "/auth/pharmacy/sign-up", changeFrequency: "monthly", priority: 0.4 },
  ];

  return entries.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
