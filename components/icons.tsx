import {
  Banknote,
  Boxes,
  Building2,
  Cpu,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  Layers,
  LineChart,
  Receipt,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Siren,
  TestTube2,
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

const GUARANTEE: Record<string, React.ComponentType<{ className?: string }>> = {
  scope: ScrollText,
  milestones: Boxes,
  tests: TestTube2,
  rollback: RotateCcw,
  observability: Siren,
  cost: Receipt,
  handover: FileCheck2,
  honesty: LineChart,
}

export function IndustryIcon({ id, className = "size-4" }: { id: string; className?: string }) {
  const Icon = INDUSTRY[id] ?? Layers
  return <Icon className={className} />
}

export function GuaranteeIcon({ id, className = "size-4" }: { id: string; className?: string }) {
  const Icon = GUARANTEE[id] ?? ShieldCheck
  return <Icon className={className} />
}
