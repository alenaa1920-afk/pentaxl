import type { Metadata } from "next"
import Link from "next/link"
import { Container, CtaBand, PageHeader, reveal } from "@/components/ui"
import { Spotlight } from "@/components/spotlight"
import { caseStudies } from "@/content/work"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Case studies from Pentaxl — context, problem, approach with trade-offs, architecture, " +
    "outcome, stack, and what we would do differently.",
  path: "/work",
})

export default function WorkPage() {
  return (
    <>
      <PageHeader
        title="Work"
        lead="Two products we designed, built and shipped ourselves. Each write-up follows the same shape — including a section on what we would do differently, which is the part most firms leave out."
      />

      <div className="pb-20">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {caseStudies.map((study, i) => (
              <Spotlight as="li" key={study.slug} className="panel" {...reveal(i)}>
                <Link
                  href={`/work/${study.slug}`}
                  className="group flex h-full flex-col p-6 md:p-8"
                >
                  <p className="text-muted font-mono text-sm">{study.client}</p>
                  <h2 className="group-hover:text-accent mt-3 text-xl transition-colors">
                    {study.title}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="bg-accent/40 rule-draw mt-6 block h-px w-full"
                  />
                  <p className="text-muted mt-6 text-base">
                    {study.status === "draft"
                      ? "Write-up in progress. We have left it empty rather than filling it with plausible-sounding detail."
                      : study.problemLine}
                  </p>
                  <span className="text-accent mt-6 font-mono text-sm">
                    {study.status === "draft" ? `Ask about ${study.title}` : "Read the case study"}
                  </span>
                </Link>
              </Spotlight>
            ))}
          </ul>
          <p className="text-muted max-w-measure mt-10 text-base">
            Client engagements are covered by confidentiality and are discussed in a call rather
            than published here.
          </p>
        </Container>
      </div>

      <CtaBand
        heading="Want the detail behind one of these"
        body="We will walk you through the architecture, the decisions, and the parts that did not work — in more depth than a public write-up allows."
        actionLabel="Ask about a project"
      />
    </>
  )
}
