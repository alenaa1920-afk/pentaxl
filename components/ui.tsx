import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import type { Thing, WithContext } from "schema-dts"
import { cn } from "@/lib/utils"
import { site, footerNav, whatsAppUrl } from "@/content/site"

/** Spread onto any element to opt it into the scroll reveal. `i` staggers siblings. */
export const reveal = (i = 0) => ({
  "data-reveal": "",
  style: { "--reveal-delay": `${i * 70}ms` } as React.CSSProperties,
})

export const Container = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <div className={cn("mx-auto w-full max-w-[78rem] px-5 sm:px-6 md:px-10", className)}>
    {children}
  </div>
)

export function Section({
  id,
  labelledBy,
  rule = true,
  className,
  children,
}: {
  id?: string
  labelledBy?: string
  rule?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-14 sm:py-16 md:py-20", rule && "border-line border-t", className)}
    >
      <Container>{children}</Container>
    </section>
  )
}

/** Mono index label + title. Not an all-caps eyebrow — a technical marker. */
export function SectionHeading({
  id,
  index,
  title,
  lead,
}: {
  id: string
  index?: string
  title: string
  lead?: string
}) {
  return (
    <div className="max-w-measure" {...reveal()}>
      {index ? <p className="text-accent mb-4 font-mono text-sm">{index}</p> : null}
      <h2 id={id} className="text-xl md:text-2xl">
        {title}
      </h2>
      {lead ? <p className="text-muted mt-4 text-base md:text-lg">{lead}</p> : null}
    </div>
  )
}

export function PageHeader({
  title,
  lead,
  crumbs,
  meta,
}: {
  title: string
  lead?: string
  crumbs?: Crumb[]
  meta?: React.ReactNode
}) {
  return (
    <header className="relative overflow-hidden pt-10 pb-12 md:pt-14 md:pb-16">
      <div
        aria-hidden="true"
        className="bg-accent/10 pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full blur-[120px]"
      />
      <Container>
        {crumbs ? <Breadcrumbs crumbs={crumbs} className="mb-8" /> : null}
        <h1 className="max-w-measure text-2xl md:text-3xl" {...reveal()}>
          {title}
        </h1>
        {lead ? (
          <p className="max-w-measure text-muted mt-6 text-base md:text-lg" {...reveal(1)}>
            {lead}
          </p>
        ) : null}
        {meta ? (
          <p className="text-muted mt-8 font-mono text-sm" {...reveal(2)}>
            {meta}
          </p>
        ) : null}
      </Container>
    </header>
  )
}

const action = cva(
  "inline-flex min-h-11 items-center justify-center px-5 py-2.5 text-base font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-void hover:shadow-[0_0_28px_-4px_var(--color-accent)] hover:brightness-110",
        secondary: "border border-line text-ink hover:border-accent hover:text-accent",
        quiet:
          "px-0 font-mono text-sm text-accent underline decoration-accent/30 underline-offset-[6px] hover:decoration-accent",
      },
    },
    defaultVariants: { variant: "primary" },
  },
)

export function Action({
  href,
  variant,
  className,
  children,
}: VariantProps<typeof action> & { href: string; className?: string; children: React.ReactNode }) {
  const cls = cn(action({ variant }), className)
  return /^(https?:|mailto:|tel:)/.test(href) ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

export const SubmitButton = ({
  children,
  pending,
}: {
  children: React.ReactNode
  pending?: boolean
}) => (
  <button
    type="submit"
    disabled={pending}
    className={cn(
      action({ variant: "primary" }),
      "disabled:cursor-not-allowed disabled:opacity-60",
    )}
  >
    {children}
  </button>
)

export const JsonLd = ({ schema }: { schema: WithContext<Thing> }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
  />
)

export type Crumb = { href: string; label: string }

export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  const full = [{ href: "/", label: "Home" }, ...crumbs]
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("font-mono text-sm", className)}>
        <ol className="text-muted flex flex-wrap items-center gap-x-2">
          {full.map((c, i) => (
            <li key={c.href} className="flex items-center gap-x-2">
              {i === full.length - 1 ? (
                <span aria-current="page" className="text-ink">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-accent">
                  {c.label}
                </Link>
              )}
              {i < full.length - 1 ? (
                <span aria-hidden="true" className="text-line">
                  /
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: full.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: `${site.url}${c.href === "/" ? "" : c.href}`,
          })),
        }}
      />
    </>
  )
}

export function PrevNext({
  prev,
  next,
  label,
}: {
  prev: { href: string; title: string }
  next: { href: string; title: string }
  label: string
}) {
  return (
    <nav aria-label={`Previous and next ${label}`} className="border-line border-t">
      <Container>
        <ul className="grid md:grid-cols-2">
          {[
            { ...prev, kind: `Previous ${label}`, align: "" },
            {
              ...next,
              kind: `Next ${label}`,
              align: "md:border-l md:border-line md:pl-10 md:text-right",
            },
          ].map((item) => (
            <li
              key={item.href}
              className={cn("border-line border-t py-8 first:border-t-0 md:border-t-0", item.align)}
            >
              <Link href={item.href} className="group block">
                <span className="text-muted font-mono text-sm">{item.kind}</span>
                <span className="group-hover:text-accent mt-2 block text-lg transition-colors">
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  )
}

export function CtaBand({
  heading,
  body,
  actionLabel,
  actionHref = "/contact",
}: {
  heading: string
  body: string
  actionLabel: string
  actionHref?: string
}) {
  return (
    <section aria-labelledby="cta" className="border-line relative overflow-hidden border-t">
      <div
        aria-hidden="true"
        className="bg-accent/12 pointer-events-none absolute -bottom-52 left-1/2 size-[44rem] -translate-x-1/2 rounded-full blur-[130px]"
      />
      <Container>
        <div className="flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-24">
          <div className="max-w-measure" {...reveal()}>
            <h2 id="cta" className="text-xl md:text-2xl">
              {heading}
            </h2>
            <p className="text-muted mt-4 text-base md:text-lg">{body}</p>
          </div>
          <div {...reveal(1)}>
            <Action href={actionHref}>{actionLabel}</Action>
          </div>
        </div>
      </Container>
    </section>
  )
}

/** Infinite technology strip. Duplicated once so the loop is seamless. */
export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items]
  return (
    <div className="border-line relative overflow-hidden border-y py-5">
      {/* Tailwind v4 renamed these utilities: bg-linear-*, not bg-gradient-*. */}
      <div
        aria-hidden="true"
        className="from-void pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r to-transparent"
      />
      <div
        aria-hidden="true"
        className="from-void pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-linear-to-l to-transparent"
      />
      <ul className="ticker-track flex w-max gap-10" aria-hidden="true">
        {row.map((item, i) => (
          <li key={`${item}-${i}`} className="text-muted font-mono text-sm whitespace-nowrap">
            {item}
          </li>
        ))}
      </ul>
      <span className="sr-only">{items.join(", ")}</span>
    </div>
  )
}

export function SiteFooter() {
  const whatsapp = whatsAppUrl()
  return (
    <footer className="border-line border-t">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-measure">
            <p className="font-display text-lg">{site.name}</p>
            <p className="text-muted mt-3 text-base">{site.tagline}</p>
            <div className="mt-6 flex flex-col gap-1 font-mono text-sm">
              <a href={`mailto:${site.email}`} className="hover:text-accent">
                {site.email}
              </a>
              {site.phoneDisplay ? (
                <a href={`tel:${site.phone}`} className="hover:text-accent">
                  {site.phoneDisplay}
                </a>
              ) : null}
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  WhatsApp
                </a>
              ) : null}
            </div>
          </div>
          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="font-display text-base">{group.heading}</h2>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted hover:text-accent text-base">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-line text-muted flex flex-col gap-2 border-t py-6 font-mono text-sm md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}
          </p>
          <p>{site.location}</p>
        </div>
      </Container>
    </footer>
  )
}

/** A landing-page section: heading, content, and one optional trailing link. */
export function Block({
  id,
  index,
  title,
  lead,
  more,
  rule = true,
  children,
}: {
  id: string
  index: string
  title: string
  lead?: string
  more?: { href: string; label: string }
  rule?: boolean
  children: React.ReactNode
}) {
  return (
    <Section labelledBy={id} rule={rule}>
      <SectionHeading id={id} index={index} title={title} lead={lead} />
      <div className="mt-12">{children}</div>
      {more ? (
        <p className="mt-10">
          <Action href={more.href} variant="quiet">
            {more.label}
          </Action>
        </p>
      ) : null}
    </Section>
  )
}

/** A numbered section on a detail page. The first one skips the top rule. */
export function Part({
  index,
  id,
  title,
  lead,
  children,
}: {
  index: number
  id: string
  title: string
  lead?: string
  children: React.ReactNode
}) {
  return (
    <Section labelledBy={id} rule={index !== 1}>
      <SectionHeading
        id={id}
        index={`/ ${String(index).padStart(2, "0")}`}
        title={title}
        lead={lead}
      />
      <div className="mt-8" {...reveal(1)}>
        {children}
      </div>
    </Section>
  )
}

export const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="max-w-measure text-base md:text-lg">{children}</p>
)

/** Technology clusters as cards. Shared by service pages and case studies. */
export function ClusterGrid({
  clusters,
  cols = 3,
}: {
  clusters: { id: string; name: string; items: { name: string }[] }[]
  cols?: 2 | 3
}) {
  return (
    <div className={cn("bg-line grid gap-px", cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
      {clusters.map((cluster, i) => (
        <div key={cluster.id} className="panel panel-hover p-6" {...reveal(i)}>
          <h3 className="text-lg">{cluster.name}</h3>
          <ul className="mt-4 space-y-2">
            {cluster.items.map((item) => (
              <li key={item.name} className="text-muted font-mono text-sm">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
