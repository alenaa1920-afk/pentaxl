/**
 * Six clusters. Every entry says what it is *used for* — that is the point of the page.
 *
 * PLACEHOLDER: a reasonable default, not a confirmed inventory. Prune anything Pentaxl
 * does not genuinely work in; an overstated stack fails in the first technical call.
 * Vendor and model names are left out on purpose — add them once you want to commit to
 * specific providers publicly.
 */

export type ClusterId =
  "languages" | "frameworks" | "ai-ml" | "cloud-devops" | "data" | "security-compliance"

export type StackCluster = {
  id: ClusterId
  name: string
  intro: string
  items: { name: string; use: string }[]
}

export const stackClusters: StackCluster[] = [
  {
    id: "languages",
    name: "Core languages",
    intro: "What the work is actually written in.",
    items: [
      { name: "TypeScript", use: "Application and API code, end to end, strict mode on." },
      { name: "Python", use: "ML work, data pipelines and internal tooling." },
      { name: "Go", use: "Services where a small static binary and low memory matter." },
      { name: "Kotlin", use: "Android builds and JVM services." },
      { name: "SQL", use: "Queries written by hand where an ORM would hide the cost." },
    ],
  },
  {
    id: "frameworks",
    name: "Frameworks and interfaces",
    intro: "The layers we build product on.",
    items: [
      { name: "Next.js", use: "Web apps and marketing sites, server-first." },
      { name: "React", use: "Interface work, including this site." },
      { name: "React Native", use: "Mobile apps sharing types with the web codebase." },
      { name: "Node.js", use: "APIs and background workers." },
      { name: "FastAPI", use: "Python services needing typed request validation." },
      { name: "Tailwind CSS", use: "Design systems expressed as tokens, not stylesheets." },
    ],
  },
  {
    id: "ai-ml",
    name: "AI and ML",
    intro: "Models in production, with the failure cases designed for rather than discovered.",
    items: [
      {
        name: "Hosted LLM APIs",
        use: "Commercial providers for text, vision and tool-use workloads.",
      },
      {
        name: "Retrieval (RAG)",
        use: "Answering over your documents, with the chunking explained.",
      },
      { name: "pgvector", use: "Vector search kept inside the database you already run." },
      {
        name: "PyTorch",
        use: "Training and fine-tuning where an off-the-shelf model will not do.",
      },
      { name: "Hugging Face", use: "Open models, tokenizers and datasets." },
      { name: "vLLM", use: "Self-hosted model serving when data cannot leave your network." },
      {
        name: "Evaluation harnesses",
        use: "Measuring quality before and after a change, not guessing.",
      },
      { name: "MLflow", use: "Tracking experiments, versions and what actually shipped." },
    ],
  },
  {
    id: "cloud-devops",
    name: "Cloud and DevOps",
    intro:
      "Cloud native, on-premise or hybrid — the deployment target is a constraint we take as given.",
    items: [
      { name: "AWS", use: "Primary cloud: compute, storage, managed databases, queues." },
      { name: "Vercel", use: "Front-end hosting with a preview deploy per pull request." },
      { name: "Docker", use: "Reproducible builds and parity between local and production." },
      { name: "Kubernetes", use: "Orchestration where scale or on-prem genuinely calls for it." },
      { name: "Terraform", use: "Infrastructure as code, so an environment can be rebuilt." },
      { name: "GitHub Actions", use: "CI, tests and gated deploys on every branch." },
      { name: "OpenTelemetry", use: "Traces and metrics, so production is observable." },
    ],
  },
  {
    id: "data",
    name: "Data platform",
    intro: "Where state lives, and why there rather than somewhere else.",
    items: [
      { name: "PostgreSQL", use: "Default system of record. Relational until proven otherwise." },
      { name: "Redis", use: "Caching, rate limiting and ephemeral queues." },
      {
        name: "ClickHouse",
        use: "Analytical queries that would strangle a transactional database.",
      },
      { name: "S3", use: "Object storage for uploads, exports and backups." },
      { name: "Event-driven flows", use: "Decoupling work that must not fail together." },
      { name: "Migration paths", use: "Schema changes without a maintenance window." },
    ],
  },
  {
    id: "security-compliance",
    name: "Security and compliance",
    intro:
      "A named pillar, not an afterthought — posture is agreed before build, not audited after.",
    items: [
      { name: "OAuth 2.0 / OIDC", use: "Authentication and delegated access." },
      { name: "Secrets management", use: "Vault or cloud KMS. Never a committed .env." },
      { name: "Least privilege", use: "Scoped roles per service, reviewed." },
      { name: "GDPR", use: "Data minimisation, retention and subject access requests." },
      { name: "HIPAA", use: "Protected health data: encryption, audit trails, BAAs." },
      { name: "DPDP Act", use: "India's data protection regime: consent and localisation." },
      { name: "Dependency scanning", use: "Automated advisories in CI, patched on a clock." },
    ],
  },
]

export const clustersByIds = (ids: ClusterId[]) =>
  ids.map((id) => stackClusters.find((c) => c.id === id)).filter((c): c is StackCluster => !!c)
