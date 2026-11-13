/**
 * The AI development life cycle. Five stages, shown without numbers or durations
 * (feedback 2026-11: no timeline, no small numbering). `phase` is the one-word verb for
 * the stage; `ai` is what the model work looks like at that stage.
 *
 * PLACEHOLDER: the `ai` lines and the ADLC framing — owner to confirm they describe how
 * PentaXL actually works.
 */
export const journey = {
  eyebrow: "AI development life cycle",
  title: "From first idea to AI in production",
  lead: "Not a classic SDLC with a model bolted on at the end. Data, evaluation and cost are designed in from the first conversation, so AI ships as a dependable part of the product — and keeps earning its place once it is live.",
}

export const processStages = [
  {
    name: "Idea",
    phase: "Discover",
    ai: "Whether the problem needs a model at all, and which of your data could feed one.",
    what: "We listen to the problem before proposing anything: what the product is for, who it serves, what already exists, and which constraint is non-negotiable — a deadline, a budget ceiling, an on-premise requirement, a system that cannot be replaced.",
    clientDoes: "One or two conversations, and honesty about constraints.",
    deliverable: "A written problem statement we both recognise.",
  },
  {
    name: "Technical enrichment",
    phase: "Design",
    ai: "Model choice, retrieval design and a first evaluation set, so quality has a number before anything is built.",
    what: "We turn the problem into a technical shape: architecture, data model, integration points, and the risks worth worrying about. Where there is real uncertainty we say so and propose the cheapest way to resolve it, usually a spike rather than a guess.",
    clientDoes: "Access to existing systems, data, and whoever knows the edge cases.",
    deliverable: "A technical design document with the trade-offs named.",
  },
  {
    name: "Scope agreement",
    phase: "Agree",
    ai: "A quality bar and a cost ceiling per model call, agreed in writing alongside the features.",
    what: "We agree what the first release contains and — more usefully — what it does not. Scope is fixed in writing here, before anyone builds. This is the stage most projects skip, and skipping it is why they end in a dispute.",
    clientDoes: "Decide and sign off. Trade items in and out rather than adding.",
    deliverable: "A scope document with an explicit out-of-scope list.",
  },
  {
    name: "Delivery",
    phase: "Build",
    ai: "Evaluations run in CI next to the tests, with guardrails, fallbacks and a human review path built in.",
    what: "We build in milestones, each ending in something you can use rather than a status report. Environments, CI and tests are set up at the start, not retrofitted. You see working software roughly every two weeks.",
    clientDoes: "Review each milestone and give feedback while it is still cheap.",
    deliverable: "A deployed, working release with tests and a staging environment.",
  },
  {
    name: "Production ready",
    phase: "Operate",
    ai: "Quality, drift and cost per request watched in production, with fallbacks that have actually been exercised.",
    what: "Hardening for real traffic: performance, observability, alerting, backups and a tested rollback. Then a feedback loop — we watch what real usage does to the system and fix what that reveals, which is never quite what anyone predicted.",
    clientDoes: "Go live, and tell us what users actually do.",
    deliverable: "Production deployment, runbook, monitoring and a handover.",
  },
]

export const scopeChangePolicy = {
  heading: "What happens when scope changes",
  body: "It will. Something gets discovered in build that nobody could have known when scope was agreed. When that happens we tell you the same day, with the cost in time and money and at least one alternative — usually trading something out of the current release rather than extending it. Nothing gets quietly absorbed and nothing gets quietly billed. If we got an estimate wrong ourselves, we say so, and we do not pass the cost of our own mistake on to you.",
}
