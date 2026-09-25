import type { Metadata } from "next"
import { Action, CtaBand, PageHeader, Section, SectionHeading, reveal } from "@/components/ui"
import { site } from "@/content/site"
import { PhotoBand } from "@/components/photo-band"
import { media } from "@/content/media"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `Who ${site.name} is, how engagements are structured, and how we work.`,
  path: "/about",
})

const engagements = [
  {
    name: "Fixed scope",
    body: "A defined piece of work with an agreed scope document, milestones and a price. Best when the problem is understood well enough to write down.",
  },
  {
    name: "Retainer",
    body: "A recurring block of capacity for ongoing product work, maintenance, and the things that surface only once real users arrive.",
  },
  {
    name: "Staff augmentation",
    body: "Our engineers working inside your team and your process, when you need capacity rather than a separate delivery.",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title={`Why ${site.name} exists`}
        lead="Too much software is delivered as a demo and handed over as a liability — no environments, no tests, no runbook, and nobody who can explain a decision six months later. We build the other kind."
        meta={`${site.team}, ${site.location}`}
      />

      <PhotoBand
        photo={media.planning}
        eyebrow="/ THE WORK"
        title="Scope argued in the open, before anyone opens an editor"
        height="short"
      />

      <Section labelledBy="how" rule={false}>
        <SectionHeading
          id="how"
          index="/ approach"
          title="How we work"
          lead="Scope before build, milestones you can use, and the trade-offs written down at the time rather than reconstructed afterwards."
        />
        <p className="max-w-measure mt-6 text-base" {...reveal(1)}>
          Nothing gets built before it is scoped, and nothing is called finished before it can be
          deployed, observed and handed over.
        </p>
        <p className="mt-8" {...reveal(2)}>
          <Action href="/process" variant="quiet">
            The five stages in full, including what happens when scope changes
          </Action>
        </p>
      </Section>

      <Section labelledBy="engage">
        <SectionHeading
          id="engage"
          index="/ engagements"
          title="How to engage us"
          lead="Three shapes, and we will tell you which fits rather than defaulting to the largest."
        />
        <dl className="border-line mt-10 border-t">
          {engagements.map((model, i) => (
            <div
              key={model.name}
              className="border-line grid gap-2 border-b py-6 md:grid-cols-[16rem_1fr] md:gap-8"
              {...reveal(i)}
            >
              <dt className="text-lg">{model.name}</dt>
              <dd className="max-w-measure text-muted text-base">{model.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <PhotoBand
        photo={media.engineer}
        eyebrow="/ THE PEOPLE"
        title="Ten engineers, and you talk to the ones building it"
        height="short"
      />

      <Section labelledBy="team">
        <SectionHeading id="team" index="/ team" title="Who you would be working with" />
        <div className="max-w-measure mt-6 space-y-4 text-base" {...reveal(1)}>
          {/* PLACEHOLDER: replace with real names, roles and links before launch. */}
          <p>
            {site.team}, working out of {site.location}. We are a startup, and small on purpose — if
            you want senior people on your problem directly, that is what this is. If you need forty
            engineers next month we are honestly the wrong firm, and we will say so on the first
            call.
          </p>
          <p className="border-line text-muted border px-4 py-3 font-mono text-sm">
            Names, roles and profiles are being added to this page.
          </p>
        </div>
      </Section>

      <CtaBand
        heading="Start a conversation"
        body="Tell us what you are building and which constraint is non-negotiable. We will tell you whether we are the right firm for it."
        actionLabel="Start a project"
      />
    </>
  )
}
