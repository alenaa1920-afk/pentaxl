import {
  Banknote,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  ShieldCheck,
  Bot,
  FileSearch,
  MessagesSquare,
  Sparkles,
  TrendingUp,
  Workflow,
  Building2,
  Cpu,
  GraduationCap,
  HeartPulse,
  Layers,
  ShoppingBag,
  Truck,
} from "lucide-react"

/**
 * Per-icon imports, never the barrel — the barrel pulls the whole icon set into the
 * bundle. Keyed by content id so `content/` stays plain data with no React in it.
 */
const INDUSTRY: Record<string, React.ComponentType<{ className?: string }>> = {
  fintech: Banknote,
  health: HeartPulse,
  logistics: Truck,
  retail: ShoppingBag,
  education: GraduationCap,
  industrial: Cpu,
  realestate: Building2,
  saas: Layers,
}

export function IndustryIcon({ id, className = "size-4" }: { id: string; className?: string }) {
  const Icon = INDUSTRY[id] ?? Layers
  return <Icon className={className} />
}

const AI_USE: Record<string, React.ComponentType<{ className?: string }>> = {
  assistant: MessagesSquare,
  extraction: FileSearch,
  agents: Workflow,
  triage: Bot,
  copilot: Sparkles,
  forecast: TrendingUp,
}

export function AiUseIcon({ id, className = "size-4" }: { id: string; className?: string }) {
  const Icon = AI_USE[id] ?? Sparkles
  return <Icon className={className} />
}

const SERVICE: Record<string, React.ComponentType<{ className?: string }>> = {
  "software-development": Code2,
  "ai-and-ml-integration": BrainCircuit,
  "cloud-and-devops": Cloud,
  "security-and-compliance": ShieldCheck,
  "data-and-integrations": Database,
}

export function ServiceIcon({ slug, className = "size-4" }: { slug: string; className?: string }) {
  const Icon = SERVICE[slug]
  return Icon ? <Icon className={className} /> : null
}
