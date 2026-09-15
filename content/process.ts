/**
 * Five delivery stages. The only place numbered markers are earned — it is a sequence.
 * `weeks` is the same range as `duration`, expressed numerically so the timeline chart
 * and the prose can never disagree.
 */

export const processStages = [
  {
    number: 1,
    name: "Idea",
    what: "We listen to the problem before proposing anything: what the product is for, who it serves, what already exists, and which constraint is non-negotiable — a deadline, a budget ceiling, an on-premise requirement, a system that cannot be replaced.",
    clientDoes: "One or two conversations, and honesty about constraints.",
    deliverable: "A written problem statement we both recognise.",
    duration: "2 to 4 days",
    weeks: [0.4, 0.8] as [number, number],
  },
  {
    number: 2,
    name: "Technical enrichment",
    what: "We turn the problem into a technical shape: architecture, data model, integration points, and the risks worth worrying about. Where there is real uncertainty we say so and propose the cheapest way to resolve it, usually a spike rather than a guess.",
    clientDoes: "Access to existing systems, data, and whoever knows the edge cases.",
    deliverable: "A technical design document with the trade-offs named.",
    duration: "1 to 2 weeks",
    weeks: [1, 2] as [number, number],
  },
  {
    number: 3,
    name: "Scope agreement",
    what: "We agree what the first release contains and — more usefully — what it does not. Scope is fixed in writing here, before anyone builds. This is the stage most projects skip, and skipping it is why they end in a dispute.",
    clientDoes: "Decide and sign off. Trade items in and out rather than adding.",
    deliverable: "A scope document with an explicit out-of-scope list.",
    duration: "3 to 5 days",
    weeks: [0.6, 1] as [number, number],
  },
  {
    number: 4,
    name: "Delivery",
    what: "We build in milestones, each ending in something you can use rather than a status report. Environments, CI and tests are set up at the start, not retrofitted. You see working software roughly every two weeks.",
    clientDoes: "Review each milestone and give feedback while it is still cheap.",
    deliverable: "A deployed, working release with tests and a staging environment.",
    duration: "4 to 10 weeks",
    weeks: [4, 10] as [number, number],
  },
  {
    number: 5,
    name: "Production ready",
    what: "Hardening for real traffic: performance, observability, alerting, backups and a tested rollback. Then a feedback loop — we watch what real usage does to the system and fix what that reveals, which is never quite what anyone predicted.",
    clientDoes: "Go live, and tell us what users actually do.",
    deliverable: "Production deployment, runbook, monitoring and a handover.",
    duration: "2 to 4 weeks, then ongoing if you want it",
    weeks: [2, 4] as [number, number],
  },
]

export const scopeChangePolicy = {
  heading: "What happens when scope changes",
  body: "It will. Something gets discovered in build that nobody could have known at stage three. When that happens we tell you the same day, with the cost in time and money and at least one alternative — usually trading something out of the current release rather than extending it. Nothing gets quietly absorbed and nothing gets quietly billed. If we got an estimate wrong ourselves, we say so, and we do not pass the cost of our own mistake on to you.",
}

/** Honest end-to-end span: the sum of the stage minimums and maximums. */
export const engagementWeeks = processStages.reduce(
  (total, stage) => [total[0] + stage.weeks[0], total[1] + stage.weeks[1]] as [number, number],
  [0, 0] as [number, number],
)
