import { services } from "../content/services"
import { caseStudies } from "../content/work"

/** Derived from content, so adding a service or case study extends the suite for free. */
export const ROUTES = [
  "/",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/work",
  ...caseStudies.map((c) => `/work/${c.slug}`),
  "/stack",
  "/process",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
]
