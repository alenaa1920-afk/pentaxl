/**
 * Company facts, navigation, form options and legal copy.
 * `PLACEHOLDER:` marks anything provisional — `grep -rn "PLACEHOLDER" content/ app/`
 * is the pre-launch checklist.
 */

export const site = {
  name: "PentaXL",
  legalName: "PentaXL",
  // PLACEHOLDER: tagline — owner to confirm.
  tagline: "Software, AI and cloud, from idea to production.",
  description:
    "PentaXL is a technology consultancy building AI-first software, integrating AI and " +
    "ML into products that already exist, and running the cloud infrastructure underneath " +
    "— cloud native, on-premise or hybrid.",
  domain: "pentaxl.com",
  url: "https://pentaxl.com",
  // PLACEHOLDER: email — stand-in, no mailbox purchased yet (see emailIsLive).
  email: "sam33@pentaxl.com",
  // PLACEHOLDER: phone — links stay hidden while empty.
  phone: "",
  phoneDisplay: "",
  // PLACEHOLDER: location — the city shown publicly.
  location: "India",
  emailIsLive: false,
  // Blog hidden for now (feedback 2026-11). Flip to true to bring back the nav links,
  // the sitemap entries and the routes themselves.
  blogEnabled: false,
}

export const whatsAppUrl = () => {
  const digits = site.phone.replace(/\D/g, "")
  return digits ? `https://wa.me/${digits}` : null
}

export const primaryNav = [
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  ...(site.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export const footerNav = [
  {
    heading: "What we do",
    items: [
      { href: "/services", label: "Services" },
      { href: "/process", label: "Process" },
    ],
  },
  {
    heading: "The firm",
    items: [
      ...(site.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
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
 * PentaXL actually takes on. Wrong bands filter out good leads.
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
    q: "Who would we actually work with?",
    a: "A dedicated team shaped around your project and led by a senior engineer, with AI, cloud, security and data specialists brought in as the work needs them. You talk directly to the people building it, not through layers of account management.",
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
        body: "To reply, and if it becomes work, to keep a record of what was discussed. We do not sell it, share it outside PentaXL, or market to you with it.",
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
        body: "The content here describes what PentaXL does, for information. Timelines, ranges and technology choices on these pages are typical rather than promised — what applies to your project is what we write down for your project.",
      },
      {
        heading: "Nothing here is a quote",
        body: "Sending the contact form does not create a contract, and neither does our reply. Work begins when a scope and a price are agreed in writing.",
      },
      {
        heading: "Content and ownership",
        body: "The text, diagrams and code of this site belong to PentaXL. Product names belonging to other companies are theirs; we name them to say what we work with, not to imply endorsement.",
      },
      {
        heading: "Questions",
        body: "Email us and we will answer.",
      },
    ],
  },
}
