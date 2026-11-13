import { services } from "../content/services"
import { posts } from "../content/blog"
import { site } from "../content/site"

/** Derived from content, so adding a service or post extends the suite for free. */
export const ROUTES = [
  "/",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/process",
  ...(site.blogEnabled ? ["/blog", ...posts.map((p) => `/blog/${p.slug}`)] : []),
  "/about",
  "/contact",
  "/privacy",
  "/terms",
]
