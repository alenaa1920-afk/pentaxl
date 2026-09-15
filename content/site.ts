/**
 * Company facts, navigation, form options and legal copy.
 * `PLACEHOLDER:` marks anything provisional — `grep -rn "PLACEHOLDER" content/ app/`
 * is the pre-launch checklist.
 */

export const site = {
  name: "Pentaxl",
  legalName: "Pentaxl",
  // PLACEHOLDER: tagline — owner to confirm.
  tagline: "Software, AI and cloud, from idea to production.",
  description:
    "Pentaxl is a technical consulting startup. Ten engineers building software, " +
    "integrating AI and ML into products that already exist, and running the cloud " +
    "infrastructure underneath — cloud native, on-premise or hybrid.",
  domain: "pentaxl.com",
  url: "https://pentaxl.com",
  // PLACEHOLDER: email — stand-in, no mailbox purchased yet (see emailIsLive).
  email: "sam33@pentaxl.com",
  // PLACEHOLDER: phone — links stay hidden while empty.
  phone: "",
  phoneDisplay: "",
  // PLACEHOLDER: location — the city shown publicly.
  location: "India",
  team: "Ten engineers",
  teamSize: 10,
  emailIsLive: false,
}

export const whatsAppUrl = () => {
  const digits = site.phone.replace(/\D/g, "")
  return digits ? `https://wa.me/${digits}` : null
}

export const primaryNav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/stack", label: "Stack" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export const footerNav = [
  {
    heading: "What we do",
    items: [
      { href: "/services", label: "Services" },
      { href: "/stack", label: "Technology" },
      { href: "/process", label: "How we work" },
    ],
  },
  {
    heading: "The firm",
    items: [
      { href: "/work", label: "Work" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
]

export const RESPONSE_PROMISE = "one working day"

/**
 * PLACEHOLDER: currency and bands are a pricing signal — confirm they match what
 * Pentaxl actually takes on. Wrong bands filter out good leads.
 */
export const budgetOptions = [
  { value: "under-10k", label: "Under $10,000" },
  { value: "10k-25k", label: "$10,000 – $25,000" },
  { value: "25k-75k", label: "$25,000 – $75,000" },
  { value: "75k-plus", label: "$75,000 or more" },
  { value: "unknown", label: "Not decided yet" },
]

/**
 * PLACEHOLDER: industries are a claim about where you have actually shipped. This is a
 * plausible starting set — cut any you cannot speak to in a first call, and add the
 * ones you can. Specificity is what makes a firm sound like it has done the work.
 */
export const industries = [
  {
    id: "fintech",
    name: "Fintech and payments",
    note: "Ledgers, reconciliation, provider integrations",
  },
  { id: "health", name: "Health and wellbeing", note: "Protected data, audit trails, consent" },
  { id: "logistics", name: "Logistics and fleet", note: "Tracking, routing, device telemetry" },
  { id: "retail", name: "Retail and commerce", note: "Catalogues, checkout, stock accuracy" },
  { id: "education", name: "Education", note: "Cohorts, content delivery, assessment" },
  { id: "industrial", name: "Industrial and IoT", note: "Device fleets, edge sync, dashboards" },
  { id: "realestate", name: "Real estate", note: "Listings, documents, visitor management" },
  { id: "saas", name: "B2B SaaS", note: "Multi-tenancy, billing, admin tooling" },
]

/**
 * Commitments, not adjectives. Every line here is something the site already promises
 * in a service page or the process — this section just puts them in one place.
 */
export const guarantees = [
  {
    id: "scope",
    name: "Scope in writing first",
    note: "Agreed at stage three, before anyone builds. Nothing is billed before that.",
  },
  {
    id: "milestones",
    name: "Working software every milestone",
    note: "Roughly every two weeks you get something you can use, not a status report.",
  },
  {
    id: "tests",
    name: "Tests and CI from day one",
    note: "Set up at the start rather than retrofitted, so regressions surface early.",
  },
  {
    id: "rollback",
    name: "A rollback that has been tested",
    note: "Documented and exercised at least once — not a plan nobody has run.",
  },
  {
    id: "observability",
    name: "Production you can see into",
    note: "Logs, metrics and traces with alerts that mean something.",
  },
  {
    id: "cost",
    name: "A cost ceiling on AI calls",
    note: "Measured per request at realistic volume before launch, with fallbacks.",
  },
  {
    id: "handover",
    name: "Handover, not hostage",
    note: "Runbook and notes so whoever maintains it next can, including you.",
  },
  {
    id: "honesty",
    name: "We tell you when we are wrong",
    note: "Including our own bad estimates, which we do not pass on to you.",
  },
]

/** Three shapes an engagement can take. Shared by Home and About. */
export const engagementModels = [
  {
    id: "fixed",
    name: "Fixed scope",
    body: "A defined piece of work with an agreed scope document, milestones and a price. Best when the problem is understood well enough to write down.",
    best: "Clear problem, fixed budget",
  },
  {
    id: "retainer",
    name: "Retainer",
    body: "A recurring block of capacity for ongoing product work, maintenance, and the things that surface only once real users arrive.",
    best: "Live product, continuous change",
  },
  {
    id: "augmentation",
    name: "Staff augmentation",
    body: "Our engineers working inside your team and your process, when you need capacity rather than a separate delivery.",
    best: "You have a team, you need hands",
  },
]

/**
 * Buyer questions, answered from what the site already commits to elsewhere — the
 * process stages, the deployment stance and the team size. Nothing here promises
 * anything the rest of the site does not.
 */
export const faqs = [
  {
    q: "How does an engagement usually start?",
    a: "A conversation about the problem, then a written problem statement we both recognise. We turn that into a technical design, and only then agree scope and price in writing. Nothing is billed before that point.",
  },
  {
    q: "What happens if the scope changes mid-build?",
    a: "We tell you the same day, with the cost in time and money and at least one alternative — usually trading something out of the current release rather than extending it. If we got our own estimate wrong, we say so and do not pass that cost on to you.",
  },
  {
    q: "Can you deploy on-premise instead of in the cloud?",
    a: "Yes. Cloud native, on-premise or hybrid are all fine, and if you have a hard constraint there we would rather know on day one than design around the wrong assumption.",
  },
  {
    q: "Will you work on an existing codebase?",
    a: "Often. Existing systems take longer than greenfield, and the difference is usually access and approvals rather than engineering, so we scope those explicitly.",
  },
  {
    q: "We already have a product. Can you add AI to it?",
    a: "That is most of our AI work. We build retrieval over your own data, measure quality with an evaluation set before and after, and put limits, fallbacks and a cost ceiling around every model call. If a problem does not need a model, we will say so.",
  },
  {
    q: "How big is the team we would work with?",
    a: "Ten engineers in total, so you get senior people on the problem directly. If you need forty engineers next month we are the wrong firm, and we will tell you on the first call.",
  },
]

/** PLACEHOLDER: both pages describe what the site does today; have them reviewed. */
export const legalPages = {
  privacy: {
    title: "Privacy",
    lead: "What this site collects, why, and how long we keep it. Short, because the site does very little.",
    sections: [
      {
        heading: "What we collect",
        body: "Only what you type into the contact form: your name, email, an optional phone number, the service you picked, an optional budget range, and your message. Nothing else here collects anything about you.",
      },
      {
        heading: "Why",
        body: "To reply, and if it becomes work, to keep a record of what was discussed. We do not sell it, share it outside Pentaxl, or market to you with it.",
      },
      {
        heading: "Cookies and analytics",
        body: "No cookies, no third-party analytics, and nothing stored in your browser. The site does not track you between visits or between pages.",
      },
      {
        heading: "How long we keep it",
        body: "Enquiries that do not become work are deleted within twelve months. Records tied to real engagements are kept as long as the contract and tax rules require.",
      },
      {
        heading: "Your rights",
        body: "Ask for a copy of what we hold, ask us to correct it, or ask us to delete it, and we will. Email us.",
      },
    ],
  },
  terms: {
    title: "Terms",
    lead: "These cover this website. The work itself is governed by what we sign for that engagement, not by this page.",
    sections: [
      {
        heading: "This site",
        body: "The content here describes what Pentaxl does, for information. Timelines, ranges and technology choices on these pages are typical rather than promised — what applies to your project is what we write down for your project.",
      },
      {
        heading: "Nothing here is a quote",
        body: "Sending the contact form does not create a contract, and neither does our reply. Work begins when a scope and a price are agreed in writing.",
      },
      {
        heading: "Content and ownership",
        body: "The text, diagrams and code of this site belong to Pentaxl. Product names belonging to other companies are theirs; we name them to say what we work with, not to imply endorsement.",
      },
      {
        heading: "Questions",
        body: "Email us and we will answer.",
      },
    ],
  },
}
