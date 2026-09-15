import type { Metadata } from "next"
import { Container, CtaBand, PageHeader, Section, SectionHeading, reveal } from "@/components/ui"
import { processStages, scopeChangePolicy } from "@/content/process"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: "How an engagement runs",
  description:
    "Pentaxl's five delivery stages — idea, technical enrichment, scope agreement, delivery and " +
    "production readiness — with what each delivers and how long it takes.",
  path: "/process",
})

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        title="How an engagement runs"
        lead="Five stages. Scope is agreed in writing at stage three, before anyone builds — that ordering is the whole point, and it is the stage most projects skip."
      />

      <div className="pb-8">
        <Container>
          {/* The one place numbered markers are earned: a real sequence. */}
          <ol className="border-line border-t">
            {processStages.map((stage) => (
              <li key={stage.number} className="border-line border-b py-10" {...reveal()}>
                <div className="grid gap-6 md:grid-cols-[5rem_1fr] md:gap-8">
                  <p className="text-accent font-mono text-xl">
                    {String(stage.number).padStart(2, "0")}
                  </p>
                  <div>
                    <h2 className="text-xl">{stage.name}</h2>
                    <p className="max-w-measure mt-4 text-base">{stage.what}</p>
                    <dl className="mt-8 grid gap-6 md:grid-cols-3">
                      {[
                        { term: "What you do", detail: stage.clientDoes },
                        { term: "What lands", detail: stage.deliverable },
                        { term: "Roughly", detail: stage.duration },
                      ].map((cell) => (
                        <div key={cell.term}>
                          <dt className="text-muted font-mono text-sm">{cell.term}</dt>
                          <dd className="mt-2 text-base">{cell.detail}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </div>

      <Section rule={false} labelledBy="scope-change">
        <SectionHeading id="scope-change" index="/ policy" title={scopeChangePolicy.heading} />
        <p className="max-w-measure mt-6 text-base md:text-lg" {...reveal(1)}>
          {scopeChangePolicy.body}
        </p>
      </Section>

      <CtaBand
        heading="Start at stage one"
        body="A conversation about the problem, then a written problem statement we both recognise. Nothing is billed before scope is agreed."
        actionLabel="Start a project"
      />
    </>
  )
}
