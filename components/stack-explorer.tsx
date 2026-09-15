"use client"

// Client for the cluster filter only; the data is passed in from the server page.

import { useState } from "react"
import type { StackCluster } from "@/content/stack"
import { cn } from "@/lib/utils"

export function StackExplorer({ clusters }: { clusters: StackCluster[] }) {
  const [active, setActive] = useState<string | null>(null)
  const shown = active ? clusters.filter((c) => c.id === active) : clusters

  return (
    <div>
      <div
        className="rail -mx-5 gap-2 px-5 sm:mx-0 sm:flex-wrap sm:px-0"
        role="group"
        aria-label="Filter by cluster"
      >
        {[{ id: null, name: "Everything" }, ...clusters].map((cluster) => (
          <button
            key={cluster.id ?? "all"}
            type="button"
            onClick={() => setActive(cluster.id)}
            aria-pressed={active === cluster.id}
            className={cn(
              "glow min-h-11 border px-4 text-base whitespace-nowrap",
              active === cluster.id
                ? "glow-on bg-panel-2 text-accent"
                : "border-line text-muted hover:text-ink",
            )}
          >
            {cluster.name}
          </button>
        ))}
      </div>

      <div className="mt-14 space-y-16">
        {shown.map((cluster) => (
          <section key={cluster.id} aria-labelledby={`c-${cluster.id}`}>
            <h2 id={`c-${cluster.id}`} className="text-xl">
              {cluster.name}
            </h2>
            <p className="max-w-measure text-muted mt-3 text-base">{cluster.intro}</p>
            <dl className="border-line mt-8 border-t">
              {cluster.items.map((item) => (
                <div
                  key={item.name}
                  className="group border-line hover:border-accent/40 grid gap-1 border-b py-4 transition-colors md:grid-cols-[16rem_1fr] md:gap-6"
                >
                  <dt className="group-hover:text-accent font-mono text-base transition-colors">
                    {item.name}
                  </dt>
                  <dd className="max-w-measure text-muted text-base">{item.use}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  )
}
