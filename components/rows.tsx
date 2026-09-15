import Link from "next/link"
import type { Service } from "@/content/services"
import type { CaseStudy } from "@/content/work"
import { reveal } from "./ui"

/** Shared row shell: hairline list, mono index, accent on hover. No shadow, no lift. */
function Row({
  href,
  index,
  title,
  aside,
  children,
  delay,
}: {
  href: string
  index: number
  title: string
  aside?: string
  children: React.ReactNode
  delay: number
}) {
  return (
    <li className="border-line border-b" {...reveal(delay)}>
      <Link href={href} className="group grid gap-4 py-8 md:grid-cols-[3rem_1fr] md:gap-8">
        <span className="text-muted group-hover:text-accent font-mono text-sm transition-colors">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <div className="flex flex-wrap items-baseline gap-x-4">
            <h3 className="group-hover:text-accent text-lg transition-colors md:text-xl">
              {title}
            </h3>
            {aside ? <span className="text-muted font-mono text-sm">{aside}</span> : null}
          </div>
          {children}
        </div>
      </Link>
    </li>
  )
}

export const ServiceRow = ({ service, index }: { service: Service; index: number }) => (
  <Row href={`/services/${service.slug}`} index={index} title={service.name} delay={index}>
    <p className="max-w-measure text-muted mt-3 text-base">{service.summary}</p>
    <p className="text-muted mt-4 font-mono text-sm">Typically {service.timeline}</p>
  </Row>
)

export const WorkRow = ({ study, index }: { study: CaseStudy; index: number }) => (
  <Row
    href={`/work/${study.slug}`}
    index={index}
    title={study.title}
    aside={study.client}
    delay={index}
  >
    {study.status === "draft" ? (
      <p className="border-line text-muted mt-4 inline-block border px-3 py-1 font-mono text-sm">
        Write-up in progress
      </p>
    ) : (
      <dl className="max-w-measure mt-4 space-y-2">
        <dt className="text-muted font-mono text-sm">Problem</dt>
        <dd className="text-base">{study.problemLine}</dd>
        <dt className="text-muted font-mono text-sm">Outcome</dt>
        <dd className="text-base">{study.outcomeLine}</dd>
      </dl>
    )}
  </Row>
)
