import type { Metadata } from "next"
import Link from "next/link"
import { Action, Block, Container, CtaBand, Ticker, reveal } from "@/components/ui"
import { HeroFigure, HeroHeadline } from "@/components/hero"
import { ServiceFold } from "@/components/service-fold"
import { Carousel } from "@/components/carousel"
import { Spotlight } from "@/components/spotlight"
import { CountUp } from "@/components/count-up"
import { Faq } from "@/components/faq"
import { RangeChart } from "@/components/range-chart"
import { PhotoBand } from "@/components/photo-band"
import { GuaranteeIcon, IndustryIcon } from "@/components/icons"
import { services } from "@/content/services"
import { posts } from "@/content/blog"
import { engagementWeeks, processStages } from "@/content/process"
import { stackClusters } from "@/content/stack"
import { engagementModels, guarantees, industries, site } from "@/content/site"
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
      {/* Hero: centred, arriving in sequence over the live shader ground. */}
      <section className="relative flex min-h-[86vh] items-center py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p
              className="text-accent-2 enter mb-7 font-mono text-sm tracking-[0.25em]"
              style={{ animationDelay: "60ms" }}
            >
              TECHNICAL CONSULTING
            </p>

            <HeroHeadline
              lead="We build software, wire in AI, and run the"
              accent="cloud underneath."
              className="text-3xl md:text-4xl lg:text-5xl"
            />

            <p
              className="text-muted enter mx-auto mt-8 max-w-xl text-lg"
              style={{ animationDelay: "620ms" }}
            >
              Ten engineers. Idea to production, and the part after launch.
            </p>

            <div
              className="enter mt-10 flex flex-wrap items-center justify-center gap-3"
              style={{ animationDelay: "740ms" }}
            >
              <Action href="/contact">Start a project</Action>
              <Action href="/process" variant="secondary">
                See how we work
              </Action>
            </div>

            <dl
              className="enter mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-5"
              style={{ animationDelay: "860ms" }}
            >
              {facts.map((fact) => (
                <div key={fact.label} className="text-center">
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

            <div className="enter mt-16" style={{ animationDelay: "1000ms" }}>
              <HeroFigure />
            </div>
          </div>
        </Container>
      </section>

      <Ticker items={stackClusters.flatMap((c) => c.items.map((i) => i.name))} />

      {/* Services: one tab per discipline. The panel carries the detail so the page
          does not have to. */}
      <Block
        id="services"
        index="/ 01 — WHAT WE DO"
        title="Five disciplines, one team"
        more={{ href: "/services", label: "All services" }}
        rule={false}
      >
        <ServiceFold />
      </Block>

      <PhotoBand
        src={media.team.src}
        alt={media.team.alt}
        credit={media.team.credit}
        eyebrow="/ THE TEAM"
        title="Senior enough to say no"
      />

      {/* Numbers, drawn. Replaces three paragraphs about timelines. */}
      <Block
        id="timelines"
        index="/ 02 — HOW LONG"
        title={`${engagementWeeks[0]}–${engagementWeeks[1]} weeks, end to end`}
      >
        <div className="mx-auto max-w-3xl">
          <Spotlight className="panel glass-hover tilt lift p-6 md:p-10">
            <RangeChart
              ticks={[0, 2, 4, 6, 8, 10]}
              emphasis={3}
              items={processStages.map((stage) => ({
                label: stage.name,
                note: `Stage ${stage.number}`,
                min: stage.weeks[0],
                max: stage.weeks[1],
              }))}
              caption="Delivery is the long pole, and the only stage whose length you can trade."
            />
          </Spotlight>
        </div>
      </Block>

      {/* Commitments: eight icons, four words each. */}
      <Block id="guarantees" index="/ 03 — IN WRITING" title="What you actually get">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item, i) => (
            <Spotlight
              as="li"
              key={item.id}
              className="panel glass-hover tilt lift p-6 text-center"
              {...reveal(i % 4)}
            >
              <span className="text-accent-2 border-line mx-auto flex size-11 items-center justify-center rounded-full border">
                <GuaranteeIcon id={item.id} className="size-5" />
              </span>
              <h3 className="mt-5 text-base">{item.name}</h3>
            </Spotlight>
          ))}
        </ul>
      </Block>

      <Block id="process-peek" index="/ 04 — THE SEQUENCE" title="Five stages, in order">
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
              <p className="gradient-text font-display text-3xl">
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

      <PhotoBand
        src={media.servers.src}
        alt={media.servers.alt}
        credit={media.servers.credit}
        eyebrow="/ IN PRODUCTION"
        title="Built to survive its second year"
        height="short"
      />

      <Block id="industries" index="/ 05 — WHERE" title="Domains we are set up for">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((item, i) => (
            <Spotlight
              as="li"
              key={item.id}
              className="panel glass-hover tilt lift flex items-center gap-3 p-4"
              {...reveal(i % 4)}
            >
              <span className="text-accent-2 shrink-0">
                <IndustryIcon id={item.id} className="size-5" />
              </span>
              <span className="text-base">{item.name}</span>
            </Spotlight>
          ))}
        </ul>
      </Block>

      <Block
        id="engage"
        index="/ 06 — HOW TO ENGAGE"
        title="Three shapes of engagement"
        more={{ href: "/about", label: "More on how we work" }}
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {engagementModels.map((model, i) => (
            <Spotlight
              as="li"
              key={model.id}
              className="panel glass-hover tilt lift flex flex-col p-6 text-center md:p-8"
              {...reveal(i)}
            >
              <h3 className="text-xl">{model.name}</h3>
              <span aria-hidden="true" className="bg-accent/40 rule-draw mt-5 block h-px w-full" />
              <p className="text-accent-2 mt-5 font-mono text-sm">{model.best}</p>
            </Spotlight>
          ))}
        </ul>
      </Block>

      <Block
        id="writing"
        index="/ 07 — NOTES"
        title="From the people doing the work"
        more={{ href: "/blog", label: "All posts" }}
      >
        <Carousel label="Latest posts" itemClass="w-[86%] sm:w-[58%] lg:w-[40%]">
          {posts.map((post) => (
            <Spotlight
              key={post.slug}
              as="article"
              className="panel glass-hover tilt lift flex h-full flex-col justify-between p-6 md:p-8"
            >
              <div>
                <div className="flex flex-wrap items-center gap-x-3 font-mono text-sm">
                  <span className="text-accent-2">{post.tag}</span>
                  <span className="text-muted">{post.readingMinutes} min</span>
                </div>
                <h3 className="mt-4 text-xl">{post.title}</h3>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-accent decoration-accent/30 hover:decoration-accent mt-8 inline-block font-mono text-sm underline underline-offset-[6px]"
              >
                {post.status === "draft" ? "See the outline" : "Read"}
              </Link>
            </Spotlight>
          ))}
        </Carousel>
      </Block>

      <Block id="faq" index="/ 08 — QUESTIONS" title="What buyers ask first">
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
