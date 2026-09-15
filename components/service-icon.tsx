import { BrainCircuit, Cloud, Code2, Database, ShieldCheck } from "lucide-react"

/**
 * Icons live here rather than in `content/` so the content layer stays plain data.
 * Imported per-icon — never from the barrel, which would blow the bundle budget.
 */
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "software-development": Code2,
  "ai-and-ml-integration": BrainCircuit,
  "cloud-and-devops": Cloud,
  "security-and-compliance": ShieldCheck,
  "data-and-integrations": Database,
}

export function ServiceIcon({ slug, className = "size-4" }: { slug: string; className?: string }) {
  const Icon = ICONS[slug]
  return Icon ? <Icon className={className} /> : null
}
