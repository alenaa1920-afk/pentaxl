import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  Action,
  ClusterGrid,
  CtaBand,
  JsonLd,
  PageHeader,
  Part,
  PrevNext,
  Prose,
  Section,
  reveal,
} from "@/components/ui"
import { caseStudies, caseStudyBySlug } from "@/content/work"
import { neighbours } from "@/content/services"
import { clustersByIds } from "@/content/stack"
import { site } from "@/content/site"
import { pageMetadata } from "@/lib/utils"

export const generateStaticParams = () => caseStudies.map((c) => ({ slug: c.slug }))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const study = caseStudyBySlug((await params).slug)
  if (!study) return {}
  const meta = pageMetadata({
    title: study.title,
    description:
      study.status === "published"
        ? `${study.title} — ${study.problemLine}`
        : `${study.title}, a ${site.name} product. Full case study in progress.`,
    path: `/work/${study.slug}`,
    type: "article",
  })
  // Drafts stay out of the index until they say something real.
  return study.status === "draft" ? { ...meta, robots: { index: false, follow: true } } : meta
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const study = caseStudyBySlug((await params).slug)
  if (!study) notFound()

  const near = neighbours(caseStudies, study.slug)

  return (
    <>
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: study.title,
          about: study.domain,
          author: { "@type": "Organization", name: site.legalName, url: site.url },
          publisher: { "@type": "Organization", name: site.legalName, url: site.url },
          url: `${site.url}/work/${study.slug}`,
        }}
      />

      <PageHeader
        title={study.title}
        lead={study.status === "draft" ? undefined : study.problemLine}
        crumbs={[
          { href: "/work", label: "Work" },
          { href: `/work/${study.slug}`, label: study.title },
        ]}
        meta={study.year ? `${study.client}, ${study.year}` : study.client}
      />

      {study.status === "draft" ? (
        <Section labelledBy="draft" rule={false}>
          <h2 id="draft" className="text-xl">
            This write-up is not finished
          </h2>
          <div className="max-w-measure mt-6 space-y-4 text-base" {...reveal(1)}>
            <p>
              {study.title} is a product we built and shipped. The case study is being written from
              the actual project — the decisions, the trade-offs, the architecture, and the parts we
              would do differently.
            </p>
            <p>
              We have left it empty rather than filling it with plausible-sounding detail. If you
              want to hear about this project before the write-up lands, ask and we will walk you
              through it.
            </p>
          </div>
          <p className="mt-10">
            <Action href="/contact" variant="quiet">
              Ask about {study.title}
            </Action>
          </p>
        </Section>
      ) : (
        <>
          <Part index={1} id="context" title="Context">
            <Prose>{study.context}</Prose>
          </Part>

          <Part index={2} id="problem" title="Problem">
            <Prose>{study.problem}</Prose>
          </Part>

          <Part
            index={3}
            id="approach"
            title="Approach"
            lead="Each decision with what it cost us. A decision without a trade-off was not a decision."
          >
            <dl className="border-line border-t">
              {study.approach.map((item) => (
                <div key={item.decision} className="border-line border-b py-6">
                  <dt className="max-w-measure text-lg">{item.decision}</dt>
                  <dd className="max-w-measure text-muted mt-2 text-base">
                    Trade-off: {item.tradeOff}
                  </dd>
                </div>
              ))}
            </dl>
          </Part>

          <Part index={4} id="architecture" title="Architecture">
            <figure>
              <ol className="bg-line grid gap-px">
                {study.architecture.map((layer) => (
                  <li key={layer.name} className="panel grid gap-4 p-6 md:grid-cols-[12rem_1fr]">
                    <h3 className="text-accent font-mono text-sm">{layer.name}</h3>
                    <ul className="flex flex-wrap gap-2">
                      {layer.items.map((item) => (
                        <li key={item} className="border-line border px-3 py-1 font-mono text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
              <figcaption className="text-muted mt-3 font-mono text-sm">
                Layers top to bottom, each showing what lives in it.
              </figcaption>
            </figure>
          </Part>

          <Part index={5} id="stack-used" title="Stack used">
            <ClusterGrid clusters={clustersByIds(study.stackClusters)} cols={2} />
          </Part>

          <Part index={6} id="outcome" title="Outcome">
            <Prose>{study.outcome}</Prose>
          </Part>

          <Part
            index={7}
            id="differently"
            title="What we would do differently"
            lead="The section most case studies omit."
          >
            <Prose>{study.differently}</Prose>
          </Part>
        </>
      )}

      {near ? (
        <PrevNext
          label="case study"
          prev={{ href: `/work/${near.prev.slug}`, title: near.prev.title }}
          next={{ href: `/work/${near.next.slug}`, title: near.next.title }}
        />
      ) : null}

      <CtaBand
        heading="Have a problem shaped like this one"
        body="Tell us what you are building. We will tell you which parts we think are actually risky, before you commit to anything."
        actionLabel="Start a project"
      />
    </>
  )
}
