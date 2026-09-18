/**
 * Blog posts.
 *
 * PLACEHOLDER: these three are outlines, not finished articles — the titles and angles
 * are ones Pentaxl can genuinely speak to, but the prose has to come from whoever did
 * the work. Each is `status: "draft"`, which keeps it out of the sitemap, marks it
 * noindex, and shows a visible notice on the page. Flip to "published" once written.
 *
 * Adding a post is one entry here — the index, the home carousel, prev/next and the
 * sitemap all follow.
 */

export type Post = {
  slug: string
  title: string
  excerpt: string
  /** ISO date. Empty until published. */
  date: string
  readingMinutes: number
  tag: "Engineering" | "AI and ML" | "Cloud" | "Practice"
  status: "draft" | "published"
  /** What the finished piece will argue, section by section. */
  outline: string[]
}

export const posts: Post[] = [
  {
    slug: "what-happens-when-the-model-is-wrong",
    title: "What happens when the model is wrong",
    excerpt:
      "Most AI features are designed for the case where the model answers well. The interesting engineering is everything else: the fallback, the cost ceiling, and the human who has to review it.",
    date: "",
    readingMinutes: 8,
    tag: "AI and ML",
    status: "draft",
    outline: [
      'Why "which model" is the least interesting question in the room',
      "Building an evaluation set before you build the feature",
      "Guardrails that earn their keep: timeouts, rate limits, fallbacks",
      "Measuring cost per request at realistic volume, not at demo volume",
      "Designing the human review path first, not last",
    ],
  },
  {
    slug: "scope-in-writing-before-anyone-builds",
    title: "Scope in writing, before anyone builds",
    excerpt:
      "The stage most projects skip is the one that decides whether they end in a handover or a dispute. What a scope document should actually contain — including the out-of-scope list.",
    date: "",
    readingMinutes: 6,
    tag: "Practice",
    status: "draft",
    outline: [
      "The failure mode: a moving target with an invoice attached",
      "What belongs in a scope document, and what belongs in a design document",
      "Why the out-of-scope list does more work than the scope list",
      "Trading items in and out instead of adding",
      "What we do when our own estimate turns out to be wrong",
    ],
  },
  {
    slug: "a-rollback-nobody-has-tested",
    title: "A rollback nobody has tested is not a rollback",
    excerpt:
      "Infrastructure as code, a gated deploy and a documented rollback are table stakes. The difference between a plan and a capability is whether anyone has run it.",
    date: "",
    readingMinutes: 7,
    tag: "Cloud",
    status: "draft",
    outline: [
      "Environments you can rebuild from scratch, and why that matters at 2am",
      "Staging that genuinely matches production",
      "Alerts that mean something versus alerts people mute",
      "Exercising the rollback on a quiet Tuesday",
      "What observability buys you when the problem is not in your code",
    ],
  },
]

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug)
export const publishedPosts = posts.filter((p) => p.status === "published")
