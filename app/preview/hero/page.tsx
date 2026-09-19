import type { Metadata } from "next"
import ShaderShowcase from "@/components/ui/hero"

/**
 * Preview harness for the supplied ShaderShowcase component, following the demo.tsx
 * from the brief. Unlinked, noindex and absent from the sitemap — it exists so the
 * component can be evaluated in the real app before any decision to adopt it.
 */
export const metadata: Metadata = {
  title: "Shader hero preview",
  robots: { index: false, follow: false },
}

export default function DemoOne() {
  return (
    <div className="h-full min-h-screen w-full">
      <ShaderShowcase />
    </div>
  )
}
