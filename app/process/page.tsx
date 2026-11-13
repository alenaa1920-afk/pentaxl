import type { Metadata } from "next"
import { Container, CtaBand, PageHeader, Section, reveal } from "@/components/ui"
import { EngagementFilm } from "@/components/engagement-film"
import { engagementFilm } from "@/content/media"
import { StageOrbitCarousel } from "@/components/ui/stage-orbit-carousel"
import { journey, scopeChangePolicy } from "@/content/process"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: "How we deliver",
  description:
    "PentaXL's AI development life cycle — idea, technical enrichment, scope agreement, " +
    "delivery and production readiness — with what each stage delivers and where AI fits.",
  path: "/process",
})

export default function ProcessPage() {
  return (
    <>
      <PageHeader title={journey.title} lead={journey.lead} meta={journey.eyebrow} />

      <div className="pb-6">
        <Container>
          <StageOrbitCarousel />
        </Container>
      </div>

      {/* Stock footage standing in for the real thing. A recording of an actual PentaXL
          engagement would be stronger still — when one exists, swap engagementFilm in
          content/media.ts and nothing else here needs to change. */}
      <Section labelledBy="watch">
        <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]" {...reveal()}>
          <div className="overflow-hidden rounded-3xl">
            <EngagementFilm src={engagementFilm.src} poster={engagementFilm.poster} />
          </div>
          <div className="min-w-0">
            <h2 id="watch" className="text-xl md:text-2xl">
              Work you can watch take shape
            </h2>
            <p className="text-muted mt-4 text-base md:text-lg">
              Every stage ends the same way: a review where the people who own the problem watch the
              work run, ask questions, and decide what happens next. Progress you can see, not a
              status report.
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="scope-change">
        <div className="panel mx-auto max-w-4xl rounded-3xl p-6 md:p-10" {...reveal()}>
          <h2 id="scope-change" className="text-xl md:text-2xl">
            {scopeChangePolicy.heading}
          </h2>
          <p className="text-muted mt-5 text-base md:text-lg">{scopeChangePolicy.body}</p>
        </div>
      </Section>

      <CtaBand
        heading="Start with a conversation"
        body="Tell us about the problem and the constraint that cannot move. Nothing is billed before scope is agreed in writing."
        actionLabel="Start a project"
      />
    </>
  )
}
