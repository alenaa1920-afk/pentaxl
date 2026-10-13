import type { Metadata } from "next"
import Image from "next/image"
import { Container, CtaBand, PageHeader, Section, SectionHeading, reveal } from "@/components/ui"
import { Spotlight } from "@/components/spotlight"
import { EngagementFilm } from "@/components/engagement-film"
import { PhotoBand } from "@/components/photo-band"
import { engagementFilm, media } from "@/content/media"
import { StageArt } from "@/components/stage-art"
import { RangeChart } from "@/components/range-chart"
import { engagementWeeks, processStages, scopeChangePolicy } from "@/content/process"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: "How an engagement runs",
  description:
    "PentaXL's five delivery stages — idea, technical enrichment, scope agreement, delivery " +
    "and production readiness — with what each delivers and how long it takes.",
  path: "/process",
})

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        title="How an engagement runs"
        lead="Five stages. Scope is agreed in writing at stage three, before anyone builds — that ordering is the whole point, and it is the stage most projects skip."
        meta={`${engagementWeeks[0]}–${engagementWeeks[1]} weeks end to end, typically`}
      />

      {/* Stock footage standing in for the real thing. A recording of an actual PentaXL
          engagement would be stronger still — when one exists, swap engagementFilm in
          content/media.ts and nothing else here needs to change. */}
      <div className="pb-6">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]" {...reveal()}>
            <EngagementFilm src={engagementFilm.src} poster={engagementFilm.poster} />
            <div className="min-w-0">
              <h2 className="text-xl">Work you can watch take shape</h2>
              <p className="text-muted mt-4 text-base">
                Every stage below ends the same way: a review where the people who own the problem
                watch the work run, ask questions, and decide what happens next. Progress you can
                see, not a status report.
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Each stage alternates side and surface, so the page has a rhythm rather than
          five identical rows. */}
      <ol>
        {processStages.map((stage, i) => {
          const dark = i % 2 === 1
          return (
            <li
              key={stage.number}
              className={dark ? "on-mist border-line border-t" : "border-line border-t"}
            >
              <div className="py-14 sm:py-16 md:py-20">
                <Container>
                  <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <Spotlight
                      className={`panel tilt lift p-6 md:p-10 ${i % 2 === 1 ? "lg:order-2" : ""}`}
                      {...reveal()}
                    >
                      <StageArt index={i} />
                    </Spotlight>

                    <div {...reveal(1)}>
                      <p className="text-accent font-mono text-sm">
                        Stage {String(stage.number).padStart(2, "0")} of 05
                      </p>
                      <h2 className="mt-3 text-xl md:text-2xl">{stage.name}</h2>
                      <span
                        aria-hidden="true"
                        className="bg-accent/50 rule-draw mt-6 block h-px w-full"
                      />
                      <p className="max-w-measure mt-6 text-base md:text-lg">{stage.what}</p>

                      <dl className="mt-8 grid gap-6 sm:grid-cols-3">
                        {[
                          { term: "What you do", detail: stage.clientDoes },
                          { term: "What lands", detail: stage.deliverable },
                          { term: "Roughly", detail: stage.duration },
                        ].map((cell) => (
                          <div key={cell.term}>
                            <dt className="text-accent font-mono text-sm">{cell.term}</dt>
                            <dd className="mt-2 text-base">{cell.detail}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </Container>
              </div>
            </li>
          )
        })}
      </ol>

      <Section labelledBy="timeline-chart">
        <SectionHeading
          id="timeline-chart"
          title="The same five stages, drawn to scale"
          lead="Ranges rather than single figures. Delivery is the long pole, and the only stage whose length you can really trade."
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Spotlight className="panel p-6 md:p-8">
            <RangeChart
              ticks={[0, 2, 4, 6, 8, 10]}
              emphasis={3}
              items={processStages.map((stage) => ({
                label: stage.name,
                note: `Stage ${stage.number}`,
                min: stage.weeks[0],
                max: stage.weeks[1],
              }))}
              caption="Stages run in order, so the end-to-end figure is the sum of these."
            />
          </Spotlight>

          {/* PLACEHOLDER: two photographs of the team actually working — a whiteboard
              session and a review — replace these frames. */}
          <div className="min-w-0">
            <figure className="border-line m-0 overflow-hidden border">
              <Image
                src={media.infrastructure.src}
                alt={media.infrastructure.alt}
                width={2400}
                height={1350}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full"
              />
              <figcaption className="text-muted border-line border-t px-4 py-3 font-mono text-sm">
                Stage five hardens this: rebuildable environments, a tested rollback and alerts that
                mean something.
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      <Section labelledBy="scope-change" className="on-mist">
        <SectionHeading id="scope-change" title={scopeChangePolicy.heading} />
        <p className="max-w-measure mt-6 text-base md:text-lg" {...reveal(1)}>
          {scopeChangePolicy.body}
        </p>
      </Section>

      <PhotoBand
        photo={media.patchPanel}
        title="The environment is part of the deliverable"
        height="short"
      />

      <PhotoBand
        photo={media.scoping}
        title="It starts with a conversation, not a proposal"
        body="We listen to the problem before proposing anything. What the product is for, who it serves, and which constraint is non-negotiable."
        height="short"
      />

      <CtaBand
        heading="Start at stage one"
        body="A conversation about the problem, then a written problem statement we both recognise. Nothing is billed before scope is agreed."
        actionLabel="Start a project"
      />
    </>
  )
}
