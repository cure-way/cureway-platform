import type { MetadataRoute } from "next";

import { SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * robots.txt
 *
 * The sitemap and host are derived from `SITE_URL` (`@/lib/site`), so they
 * always point at the deployed public origin. Authenticated portal paths are
 * disallowed — they are role-gated and have no value in a search index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/pharmacy",
          "/profile",
          "/cart",
          "/checkout",
          "/orders",
          "/notifications",
          "/prescriptions",
          "/Orderconfirmation",
          "/api",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
