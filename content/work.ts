import type { ClusterId } from "./stack"

/**
 * Case studies in the fixed seven-part shape.
 *
 * PLACEHOLDER: High Flyers and Mon Amour are real shipped products, but the write-ups
 * are not written. Both are `status: "draft"` — excluded from the sitemap, marked
 * noindex, and the page says plainly that it is unfinished.
 *
 * Deliberately NOT done: inventing plausible decisions or outcome numbers. Fabricated
 * specifics are the one placeholder that survives to launch and discredits everything
 * true around it.
 */

export type CaseStudy = {
  slug: string
  title: string
  /** "Pentaxl product" for our own — never imply an external client. */
  client: string
  domain: string
  year: string
  status: "draft" | "published"
  problemLine: string
  outcomeLine: string
  context: string
  problem: string
  approach: { decision: string; tradeOff: string }[]
  architecture: { name: string; items: string[] }[]
  outcome: string
  stackClusters: ClusterId[]
  /** Required before publishing. The section engineers trust. */
  differently: string
}

const PENDING = "Awaiting real detail from the project."

export const caseStudies: CaseStudy[] = [
  {
    slug: "high-flyers",
    title: "High Flyers",
    client: "Pentaxl product",
    // PLACEHOLDER: what this product actually is, and the year it shipped.
    domain: "Consumer product",
    year: "",
    status: "draft",
    problemLine: PENDING,
    outcomeLine: PENDING,
    context: PENDING,
    problem: PENDING,
    approach: [],
    architecture: [],
    outcome: PENDING,
    stackClusters: ["frameworks", "languages"],
    differently: PENDING,
  },
  {
    slug: "mon-amour",
    title: "Mon Amour",
    client: "Pentaxl product",
    // PLACEHOLDER: what this product actually is, and the year it shipped.
    domain: "Consumer product",
    year: "",
    status: "draft",
    problemLine: PENDING,
    outcomeLine: PENDING,
    context: PENDING,
    problem: PENDING,
    approach: [],
    architecture: [],
    outcome: PENDING,
    stackClusters: ["frameworks", "languages"],
    differently: PENDING,
  },
]

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug)
export const publishedCaseStudies = caseStudies.filter((c) => c.status === "published")
