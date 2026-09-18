import type { Metadata } from "next"
import Link from "next/link"
import { Action, Block, Container, CtaBand, Ticker, reveal } from "@/components/ui"
import { HeroFigure, HeroHeadline } from "@/components/hero"
import { ServiceTabs } from "@/components/service-tabs"
import { Carousel } from "@/components/carousel"
import { Spotlight } from "@/components/spotlight"
import { CountUp } from "@/components/count-up"
import { Faq } from "@/components/faq"
import { RangeChart } from "@/components/range-chart"
import { MediaSlot } from "@/components/media-slot"
import { GuaranteeIcon, IndustryIcon } from "@/components/icons"
import { services } from "@/content/services"
import { posts } from "@/content/blog"
import { engagementWeeks, processStages } from "@/content/process"
import { stackClusters } from "@/content/stack"
import { engagementModels, guarantees, industries, site } from "@/content/site"
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
  { value: stackClusters.length, label: "technology clusters" },
]

export default function HomePage() {
  // Home routes people; it does not try to say everything.
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="bg-accent/8 aurora pointer-events-none absolute -top-72 -right-52 size-[44rem] rounded-full blur-[150px]"
        />
        <Container>
          <div className="grid items-center gap-14 py-12 md:py-20 lg:grid-cols-2 lg:gap-8">
            <div>
              <p className="text-gold rise mb-6 font-mono text-sm">Technical consulting</p>
              <HeroHeadline
                text="We build software, wire in AI, and run the cloud underneath."
                className="max-w-measure text-2xl md:text-3xl lg:text-4xl"
              />
              <p className="text-muted max-w-measure mt-6 text-base md:text-lg" {...reveal(1)}>
                {site.teamSize} engineers taking products from idea to production — and staying for
                the part after launch. Cloud native, on-premise, or hybrid.
              </p>
              <div className="mt-9 flex flex-wrap gap-3" {...reveal(2)}>
                <Action href="/contact">Start a project</Action>
                <Action href="/process" variant="secondary">
                  See how we work
                </Action>
              </div>
              <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4" {...reveal(3)}>
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="sr-only">{fact.label}</dt>
                    <dd>
                      <span className="font-display text-gold text-xl">
                        <CountUp to={fact.value} />
                      </span>{" "}
                      <span className="text-muted font-mono text-sm">{fact.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div {...reveal(1)}>
              <HeroFigure />
            </div>
          </div>
        </Container>
      </section>

      <Ticker items={stackClusters.flatMap((c) => c.items.map((i) => i.name))} />

      <Block
        id="services"
        index="/ services"
        title="Five disciplines, delivered together"
        lead="Pick one to see what actually lands. They are sold as a set because that is how software reaches production — a build nobody can deploy is unfinished, and a model nobody evaluated is a guess."
        more={{ href: "/services", label: "All services" }}
        rule={false}
      >
        <ServiceTabs />
      </Block>

      <Block
        id="writing"
        index="/ writing"
        title="Notes from the work"
        lead="Written by whoever did the thing. Short, specific, and honest about what did not work."
        more={{ href: "/blog", label: "All posts" }}
      >
        <Carousel label="Latest posts" itemClass="w-[86%] sm:w-[58%] lg:w-[40%]">
          {posts.map((post) => (
            <Spotlight
              key={post.slug}
              as="article"
              className="panel tilt lift flex h-full flex-col justify-between p-6 md:p-8"
            >
              <div>
                <div className="flex flex-wrap items-center gap-x-3 font-mono text-sm">
                  <span className="text-accent">{post.tag}</span>
                  <span className="text-muted">{post.readingMinutes} min</span>
                </div>
                <h3 className="mt-3 text-xl">{post.title}</h3>
                <p className="text-muted mt-4 text-base">{post.excerpt}</p>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-accent decoration-accent/30 hover:decoration-accent mt-8 inline-block font-mono text-sm underline underline-offset-[6px]"
              >
                {post.status === "draft" ? "See the outline" : "Read the post"}
              </Link>
            </Spotlight>
          ))}
        </Carousel>
      </Block>

      <Block
        id="process"
        index="/ process"
        title="How we work"
        lead="Scope agreed in writing before anyone builds, work landing in milestones you can use, and production with a runbook rather than a handshake."
        more={{ href: "/process", label: "The full process, and what happens when scope changes" }}
        className="on-dark"
      >
        {/* A rail rather than five cramped columns — it stays readable at every width. */}
        {/* tabIndex so keyboard users can scroll the rail on narrow screens — axe flags a
            scrollable region with no focusable content as a serious failure. */}
        <ol
          tabIndex={0}
          aria-label="Delivery stages"
          className="rail -mx-5 gap-4 px-5 md:mx-0 md:grid md:grid-cols-5 md:gap-px md:overflow-visible md:px-0"
        >
          {processStages.map((stage, i) => (
            <Spotlight
              key={stage.number}
              as="li"
              className="panel tilt lift w-[72%] p-6 sm:w-[45%] md:w-auto"
              {...reveal(i)}
            >
              <p className="text-gold font-mono text-sm">{String(stage.number).padStart(2, "0")}</p>
              <span aria-hidden="true" className="bg-accent/40 rule-draw mt-4 block h-px w-full" />
              <h3 className="mt-4 text-lg">{stage.name}</h3>
              <p className="text-muted mt-2 font-mono text-sm">{stage.duration}</p>
              <p className="text-muted mt-3 text-sm">{stage.deliverable}</p>
            </Spotlight>
          ))}
        </ol>
      </Block>

      <Block
        id="timelines"
        index="/ timelines"
        title="How long things actually take"
        lead="The same numbers that appear in the prose, drawn to scale. Ranges rather than single figures, because a single figure would be a guess dressed up as a commitment."
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
          <Spotlight className="panel p-6 md:p-8">
            <h3 className="text-lg">Each stage of an engagement</h3>
            <p className="text-accent font-display mt-2 text-xl">
              {engagementWeeks[0]}–{engagementWeeks[1]} weeks end to end
            </p>
            <div className="mt-8">
              <RangeChart
                ticks={[0, 2, 4, 6, 8, 10]}
                emphasis={3}
                items={processStages.map((stage) => ({
                  label: stage.name,
                  note: `Stage ${stage.number}`,
                  min: stage.weeks[0],
                  max: stage.weeks[1],
                }))}
                caption="Stages run in order, so the end-to-end figure above is the sum. Delivery is the long pole and the only stage whose length you can really trade."
              />
            </div>
          </Spotlight>

          <Spotlight className="panel p-6 md:p-8">
            <h3 className="text-lg">Each discipline, on its own</h3>
            <p className="text-accent font-display mt-2 text-xl">1–12 weeks, depending</p>
            <div className="mt-8">
              <RangeChart
                ticks={[0, 3, 6, 9, 12]}
                items={services.map((service) => ({
                  label: service.nodeLabel,
                  note: service.weeks.join("–") + " wk",
                  min: service.weeks[0],
                  max: service.weeks[1],
                }))}
                caption="Run as a focused piece of work rather than a full engagement. Security is the shortest because the decisions are cheap to make early and expensive to discover late."
              />
            </div>
          </Spotlight>
        </div>
      </Block>

      <Block
        id="guarantees"
        index="/ commitments"
        title="What you get in writing"
        lead="Not adjectives. Every line here is something a service page or the process already promises — collected in one place so you can hold us to it."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item, i) => (
            <Spotlight as="li" key={item.id} className="panel tilt lift p-5" {...reveal(i % 4)}>
              <span className="text-accent border-line flex size-9 items-center justify-center border">
                <GuaranteeIcon id={item.id} />
              </span>
              <h3 className="mt-4 text-base">{item.name}</h3>
              <p className="text-muted mt-2 text-sm">{item.note}</p>
            </Spotlight>
          ))}
        </ul>
      </Block>

      <Block
        id="industries"
        index="/ industries"
        title="Where this work usually lands"
        lead="The domains we are set up for. If yours is not here it does not mean no — it means we will tell you honestly whether we have seen your problem before."
        className="on-dark"
      >
        <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((item, i) => (
            <Spotlight as="li" key={item.id} className="panel tilt lift p-5" {...reveal(i % 4)}>
              <span className="text-accent flex items-center gap-3">
                <IndustryIcon id={item.id} />
                <span className="text-ink text-base">{item.name}</span>
              </span>
              <p className="text-muted mt-2 font-mono text-sm">{item.note}</p>
            </Spotlight>
          ))}
        </ul>
      </Block>

      <Block
        id="engage"
        index="/ engagements"
        title="Three ways to work with us"
        lead="We will tell you which of these fits rather than defaulting to the largest."
        more={{ href: "/about", label: "More about how we work" }}
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {engagementModels.map((model, i) => (
            <Spotlight
              as="li"
              key={model.id}
              className="panel tilt lift flex flex-col p-6 md:p-8"
              {...reveal(i)}
            >
              <h3 className="text-xl">{model.name}</h3>
              <span aria-hidden="true" className="bg-accent/40 rule-draw mt-5 block h-px w-full" />
              <p className="text-muted mt-5 text-base">{model.body}</p>
              <p className="text-accent mt-6 font-mono text-sm">Best when: {model.best}</p>
            </Spotlight>
          ))}
        </ul>
      </Block>

      {/* PLACEHOLDER: reserved frames for real assets — a product walkthrough video, a
          product screenshot and a team photo. Delete this whole Block if the assets are
          not coming; an empty frame is honest, but only until launch. */}
      <Block
        id="proof"
        index="/ proof"
        title="Screenshots and a walkthrough land here"
        lead="Reserved, not forgotten. Real product shots and a short walkthrough of one build do more than any amount of copy — these frames are sized and waiting for the assets."
      >
        <div className="grid items-start gap-4 lg:grid-cols-[1.6fr_1fr]">
          <MediaSlot
            kind="video"
            title="Product walkthrough"
            spec="MP4 or WebM · 1920×1080 · 30–60 seconds"
          />
          <div className="grid min-w-0 gap-4">
            <MediaSlot
              title="Product screenshot"
              spec="PNG · 1600×1000 · light or dark UI"
              ratio="16 / 10"
            />
            <MediaSlot
              title="The team at work"
              spec="JPG · 1600×1000 · candid, not stock"
              ratio="16 / 10"
            />
          </div>
        </div>
      </Block>

      <Block
        id="faq"
        index="/ questions"
        title="What buyers usually ask"
        lead="The answers we give on a first call, written down so you do not have to book one to get them."
      >
        <Faq />
      </Block>

      <CtaBand
        heading="Tell us what you are trying to build"
        body="Describe the problem in a paragraph. We will tell you whether we are the right firm for it, and what we would need to know to scope it."
        actionLabel="Start a project"
      />
    </>
  )
}
