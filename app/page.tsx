import type { Metadata } from "next"
import Image from "next/image"
import { Action, Block, Container, CtaBand, Ticker, reveal } from "@/components/ui"
import { HeroFigure, HeroHeadline } from "@/components/hero"
import { ServiceFold } from "@/components/service-fold"
import { Spotlight } from "@/components/spotlight"
import { CountUp } from "@/components/count-up"
import { Faq } from "@/components/faq"
import { PhotoBand } from "@/components/photo-band"
import { GuaranteeIcon } from "@/components/icons"
import { services } from "@/content/services"
import { processStages } from "@/content/process"
import { stackClusters } from "@/content/stack"
import { guarantees, site } from "@/content/site"
import { media } from "@/content/media"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: "/",
  ogTitle: site.name,
})

const facts = [
  { value: site.teamSize, label: "engineers" },
  { value: services.length, label: "disciplines" },
  { value: stackClusters.length, label: "clusters" },
]

export default function HomePage() {
  return (
    <>
      {/* Hero: arriving in sequence over a photographic ground, which in turn sits over
          the live shader. The photograph is full-bleed and heavily scrimmed on purpose —
          it is atmosphere for the headline and the pentagon, not a subject of its own,
          and a tighter, busier crop behind the figure read as clutter. The scrim is
          neutral black, which leaves the photograph its own cool grey rather than
          pulling it toward the site violet — asked for deliberately. Lightest to the
          right, where only the pentagon sits. */}
      {/* Pulled up by the header's own height (h-16, md:h-20) so the photograph runs behind
          the transparent nav instead of starting under it — otherwise the nav reads as a
          separate strip across the top of the picture. The extra top padding gives that
          height back to the content, so it stays centred in what the visitor can see. */}
      <section className="relative -mt-16 flex min-h-[calc(86vh+4rem)] items-center overflow-hidden pt-32 pb-16 md:-mt-20 md:min-h-[calc(86vh+5rem)] md:pt-40 md:pb-20">
        <Image
          src={media.heroGround.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          priority
          className="-z-20 object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07061aef] via-[#07061ad9] to-[#07061ab8]"
        />

        <Container>
          {/* Two columns from lg: the claim on the left, the pentagon beside it rather
              than a screen below it. Below lg it stacks and the figure follows. */}
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="text-left">
              <p
                className="text-accent-2 enter mb-6 font-mono text-sm tracking-[0.25em]"
                style={{ animationDelay: "60ms" }}
              >
                TECHNICAL CONSULTING
              </p>

              <HeroHeadline
                lead="We build software, wire in AI, and run the"
                accent="cloud underneath."
                className="text-2xl md:text-3xl lg:text-[3.4rem] lg:leading-[1.02]"
              />

              <p
                className="text-muted enter mt-7 max-w-md text-base md:text-lg"
                style={{ animationDelay: "620ms" }}
              >
                Ten engineers. Idea to production, and the part after launch.
              </p>

              <div
                className="enter mt-9 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "740ms" }}
              >
                <Action href="/contact">Start a project</Action>
                <Action href="/process" variant="secondary">
                  See how we work
                </Action>
              </div>

              <dl
                className="enter mt-12 flex flex-wrap items-center gap-x-10 gap-y-5"
                style={{ animationDelay: "860ms" }}
              >
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="sr-only">{fact.label}</dt>
                    <dd>
                      <span className="gradient-text font-display block text-2xl md:text-3xl">
                        <CountUp to={fact.value} />
                      </span>
                      <span className="text-muted font-mono text-sm">{fact.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="enter" style={{ animationDelay: "1000ms" }}>
              <HeroFigure />
            </div>
          </div>
        </Container>
      </section>

      <Ticker items={stackClusters.flatMap((c) => c.items.map((i) => i.name))} />

      {/* Kept deliberately short: four sections and two photographs. Everything cut from
          here still lives on the page it belongs to — the timeline chart on /process, the
          engagement models and the domains on /about, the writing on /blog. */}
      <Block
        id="services"
        index="/ 01 — WHAT WE DO"
        title="Five disciplines, one team"
        more={{ href: "/services", label: "All services" }}
        rule={false}
      >
        <ServiceFold />
      </Block>

      <PhotoBand photo={media.team} title="Senior enough to say no" />

      {/* The four commitments that matter most to a buyer, in one row. The full eight
          made a wall of cards. */}
      <Block id="guarantees" index="/ 02 — IN WRITING" title="What you actually get">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.slice(0, 4).map((item, i) => (
            <Spotlight
              as="li"
              key={item.id}
              className="panel glass-hover tilt lift p-6 text-center"
              {...reveal(i)}
            >
              <span className="text-accent border-line mx-auto flex size-11 items-center justify-center rounded-full border">
                <GuaranteeIcon id={item.id} className="size-5" />
              </span>
              <h3 className="mt-5 text-base">{item.name}</h3>
            </Spotlight>
          ))}
        </ul>
      </Block>

      <Block id="process-peek" index="/ 03 — THE SEQUENCE" title="Five stages, in order">
        {/* tabIndex + a name: a scrollable region with no focusable content is a
            serious axe failure, and keyboard users genuinely cannot scroll it. */}
        <ol
          tabIndex={0}
          aria-label="Delivery stages"
          className="rail -mx-5 gap-4 px-5 md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0"
        >
          {processStages.map((stage, i) => (
            <Spotlight
              key={stage.number}
              as="li"
              className="panel glass-hover tilt lift w-[70%] p-6 text-center sm:w-[44%] md:w-auto"
              {...reveal(i)}
            >
              <p className="text-accent font-display text-3xl">
                {String(stage.number).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-base">{stage.name}</h3>
              <p className="text-muted mt-2 font-mono text-sm">{stage.duration}</p>
            </Spotlight>
          ))}
        </ol>
        <p className="mt-12 text-center">
          <Action href="/process" variant="quiet">
            Walk through an engagement
          </Action>
        </p>
      </Block>

      <PhotoBand photo={media.servers} title="Built to survive its second year" height="short" />

      <Block id="faq" index="/ 04 — QUESTIONS" title="What buyers ask first">
        <div className="mx-auto max-w-3xl">
          <Faq />
        </div>
      </Block>

      <CtaBand
        heading="Tell us what you are building"
        body="A paragraph is enough. We will tell you if we are the right firm for it."
        actionLabel="Start a project"
      />
    </>
  )
}
