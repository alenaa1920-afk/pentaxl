import type { ClusterId } from "./stack"

/**
 * Five disciplines, one per hero node. Array order drives the index, the cards and
 * prev/next. `heroCycle` orders the pentagon so perimeter edges land on adjacent nodes.
 *
 * PLACEHOLDER: confirm each of these is genuinely sold today. Delete rather than keep
 * anything aspirational.
 */
export type Service = {
  slug: string
  name: string
  nodeLabel: string
  summary: string
  body: string
  deliverables: string[]
  timeline: string
  /** [min, max] weeks — the numbers behind `timeline`, for the chart. */
  weeks: [number, number]
  timelineCaveat: string
  stackClusters: ClusterId[]
  caseStudySlug?: string
}

export const services: Service[] = [
  {
    slug: "software-development",
    name: "Software development",
    nodeLabel: "Software",
    summary: "Web and mobile products, built to survive their second year.",
    body: "Most projects that go wrong went wrong before any code was written. We pull the idea apart first — what it has to do, what it does not have to do yet, and which parts are genuinely uncertain — then build against a scope you agreed to. Interfaces are fast on a mid-range phone on a bad connection, and accessible by keyboard and screen reader, because retrofitting either costs several times what doing it properly costs.",
    deliverables: [
      "A written scope, with what is explicitly out of it",
      "Technical design covering the decisions and their trade-offs",
      "Working software at every milestone, not just the last one",
      "Tests over the paths that matter, running in CI",
      "Handover notes and a runbook, whoever maintains it next",
    ],
    timeline: "4 to 12 weeks to a first production release",
    weeks: [4, 12],
    timelineCaveat:
      "The range is wide because discovery honestly changes it. We narrow it in writing after week one, and tell you if it moves again.",
    stackClusters: ["languages", "frameworks", "data"],
  },
  {
    slug: "ai-and-ml-integration",
    name: "AI and ML integration",
    nodeLabel: "AI & ML",
    summary: "Putting models into products that already exist, without the theatre.",
    body: "The interesting question is rarely which model. It is what happens when the model is wrong, slow, or expensive — and whether the feature still makes sense when it is. We build retrieval over your own data, evaluate before and after rather than guessing, put limits and fallbacks around every call, and tell you plainly when a problem does not need a model at all.",
    deliverables: [
      "A written evaluation set, so quality is measured rather than felt",
      "Retrieval over your data with the chunking and ranking explained",
      "Guardrails: rate limits, timeouts, fallbacks, and a cost ceiling",
      "Cost per request measured at realistic volume before launch",
      "A human review path for whatever the model gets wrong",
    ],
    timeline: "3 to 8 weeks for a production feature",
    weeks: [3, 8],
    timelineCaveat:
      "Evaluation and data access take longer than the integration itself, which is usually the surprise.",
    stackClusters: ["ai-ml", "data", "languages"],
  },
  {
    slug: "cloud-and-devops",
    name: "Cloud and DevOps",
    nodeLabel: "Cloud",
    summary: "Infrastructure you can rebuild, deploy safely, and see into.",
    body: "Cloud native, on-premise or hybrid — some buyers have a hard constraint here and we would rather know on day one. Either way the goal is the same: environments defined as code so they can be recreated, deploys that are boring and reversible, and enough observability that a production problem is a question you can answer rather than guess at.",
    deliverables: [
      "Infrastructure as code, so any environment rebuilds from scratch",
      "CI pipeline with tests, build and a gated deploy",
      "Staging that genuinely matches production",
      "Logs, metrics and traces with alerts that mean something",
      "A documented rollback, tested at least once",
    ],
    timeline: "2 to 6 weeks to a first working pipeline",
    weeks: [2, 6],
    timelineCaveat:
      "Existing estates take longer than greenfield, and the difference is usually access and approvals rather than engineering.",
    stackClusters: ["cloud-devops", "data"],
  },
  {
    slug: "security-and-compliance",
    name: "Security and compliance",
    nodeLabel: "Security",
    summary: "Auth, secrets and regulatory posture agreed before the build, not after.",
    body: "Authentication and authorisation designed rather than bolted on, secrets held somewhere other than a committed file, least-privilege access per service, and a clear position on whichever regime applies to you — GDPR, HIPAA, or India's DPDP Act. Deciding this early is cheap. Discovering it during a customer's security review is not.",
    deliverables: [
      "An auth design covering roles, sessions and token lifetimes",
      "Secrets moved into a managed store, with rotation",
      "Scoped access per service, with the permissions justified",
      "A data inventory: what is collected, where it lives, how long it is kept",
      "Dependency and image scanning in CI, with a patching cadence",
    ],
    timeline: "1 to 4 weeks as a focused engagement",
    weeks: [1, 4],
    timelineCaveat:
      "Shorter alongside a build we are already doing, because those decisions are being made anyway.",
    stackClusters: ["security-compliance", "cloud-devops"],
  },
  {
    slug: "data-and-integrations",
    name: "Data and integrations",
    nodeLabel: "Data",
    summary: "Making separate systems agree, and making their data usable.",
    body: "Connecting systems never designed to talk to each other: payment providers, ERPs, device fleets, third-party APIs with documentation of varying honesty. The hard part is rarely the happy path — it is retries, partial failures, duplicate events, and reconciling two systems that each believe they are correct. We design for that case first.",
    deliverables: [
      "A data model with the ownership of each field stated",
      "Integrations with retry, idempotency and dead-letter handling",
      "Reconciliation that surfaces divergence before a customer does",
      "Reporting or export paths, reachable without an engineer",
      "Documented contracts for every external system touched",
    ],
    timeline: "2 to 8 weeks per integration surface",
    weeks: [2, 8],
    timelineCaveat:
      "The variable is almost always the other system: its rate limits, its sandbox quality, and how fast its owners reply.",
    stackClusters: ["data", "languages", "cloud-devops"],
  },
]

/** An edge is a claim: these two ship as one piece of work. */
export const serviceEdges: [string, string][] = [
  ["software-development", "ai-and-ml-integration"],
  ["ai-and-ml-integration", "cloud-and-devops"],
  ["cloud-and-devops", "security-and-compliance"],
  ["security-and-compliance", "data-and-integrations"],
  ["data-and-integrations", "software-development"],
  ["software-development", "cloud-and-devops"],
  ["ai-and-ml-integration", "data-and-integrations"],
]

export const heroCycle = [
  "software-development",
  "ai-and-ml-integration",
  "cloud-and-devops",
  "security-and-compliance",
  "data-and-integrations",
]

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)

export function neighbours<T extends { slug: string }>(items: T[], slug: string) {
  const i = items.findIndex((x) => x.slug === slug)
  if (i === -1 || items.length < 2) return null
  return {
    prev: items[(i - 1 + items.length) % items.length],
    next: items[(i + 1) % items.length],
  }
}
