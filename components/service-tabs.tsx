"use client"

// Client because it owns the tab selection. The panel content is static data, so
// nothing extra crosses the boundary beyond what the tabs already need.

import Link from "next/link"
import { services } from "@/content/services"
import { clustersByIds } from "@/content/stack"
import { Tabs } from "./tabs"
import { ServiceIcon } from "./service-icon"

const tabs = services.map((s) => ({
  id: s.slug,
  label: s.nodeLabel,
  icon: <ServiceIcon slug={s.slug} />,
}))

export function ServiceTabs() {
  return (
    <Tabs tabs={tabs} label="Services">
      {(id) => {
        const service = services.find((s) => s.slug === id)
        if (!service) return null
        const clusters = clustersByIds(service.stackClusters)

        return (
          <div className="panel spot grid gap-10 p-6 md:grid-cols-[1.4fr_1fr] md:gap-12 md:p-10">
            <div>
              <h3 className="text-xl md:text-2xl">{service.name}</h3>
              <p className="text-muted max-w-measure mt-4 text-base md:text-lg">{service.body}</p>

              <p className="text-accent mt-8 font-mono text-sm">What you get</p>
              <ul className="border-line mt-4 border-t">
                {service.deliverables.map((item, i) => (
                  <li
                    key={item}
                    className="border-line grid gap-3 border-b py-3 md:grid-cols-[2.5rem_1fr]"
                  >
                    <span className="text-muted font-mono text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:border-line md:border-l md:pl-10">
              <p className="text-accent font-mono text-sm">Typical timeline</p>
              <p className="mt-2 text-lg">{service.timeline}</p>
              <p className="text-muted mt-3 text-sm">{service.timelineCaveat}</p>

              <p className="text-accent mt-8 font-mono text-sm">Built with</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {clusters
                  .flatMap((c) => c.items.slice(0, 4))
                  .map((item) => (
                    <li
                      key={item.name}
                      className="border-line text-muted glow border px-3 py-1 font-mono text-sm"
                    >
                      {item.name}
                    </li>
                  ))}
              </ul>

              <Link
                href={`/services/${service.slug}`}
                className="text-accent decoration-accent/30 hover:decoration-accent mt-10 inline-block font-mono text-sm underline underline-offset-[6px]"
              >
                Full {service.nodeLabel.toLowerCase()} detail
              </Link>
            </div>
          </div>
        )
      }}
    </Tabs>
  )
}
