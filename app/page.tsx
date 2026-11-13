import type { Metadata } from "next"
import Image from "next/image"
import { Action, Block, Container, CtaBand, reveal } from "@/components/ui"
import { HeroFigure, HeroHeadline } from "@/components/hero"
import { ServiceExplorer } from "@/components/service-explorer"
import { Faq } from "@/components/faq"
import { PhotoBand } from "@/components/photo-band"
import { AiUseIcon } from "@/components/icons"
import { aiUseCases } from "@/content/services"
import { site } from "@/content/site"
import { media } from "@/content/media"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: "/",
  ogTitle: site.name,
})

export default function HomePage() {
  return (
    <>
      {/* Hero: the photograph over the live shader, bright and nearly opaque, with one
          gradient darkening only the left, where the headline sits. */}
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
          className="-z-20 object-cover opacity-90 brightness-125 saturate-125"
        />
        {/* Darkens only where there is text — behind the headline, and a halo behind the
            pentagon — plus a soft fade at the foot, so the photograph stays bright and
            nearly opaque everywhere else (feedback 2026-11: it read as dim). Below lg the
            text runs full width, so it gets an even scrim instead. Text contrast over
            this is measured, not assumed. */}
        <div
          aria-hidden="true"
          className="bg-canvas/70 absolute inset-0 -z-10 lg:bg-transparent lg:bg-[linear-gradient(90deg,rgb(7_6_26/0.92)_0%,rgb(7_6_26/0.72)_36%,transparent_62%),radial-gradient(34%_50%_at_73%_55%,rgb(7_6_26/0.86),rgb(7_6_26/0.68)_58%,transparent),linear-gradient(180deg,transparent_72%,rgb(7_6_26/0.55))]"
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
                AI-FIRST ENGINEERING
              </p>

              <HeroHeadline
                lead="We build AI into real products, and run the"
                accent="cloud underneath."
                className="text-2xl md:text-3xl lg:text-[3.4rem] lg:leading-[1.02]"
              />

              <p
                className="text-muted enter mt-7 max-w-md text-base md:text-lg"
                style={{ animationDelay: "620ms" }}
              >
                Senior delivery teams for AI, software and cloud — from the first idea to
                production, and the part after launch.
              </p>

              <div
                className="enter mt-9 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "740ms" }}
              >
                <Action href="/contact" data-project-dialog="">
                  Start a project
                </Action>
                <Action href="/process" variant="secondary">
                  See how we work
                </Action>
              </div>
            </div>

            <div className="enter" style={{ animationDelay: "1000ms" }}>
              <HeroFigure />
            </div>
          </div>
        </Container>
      </section>

      {/* AI leads, straight after the hero (feedback 2026-11). The tech-stack ticker
          that used to sit here is gone; the stack still lives on each service page. */}
      <Block
        id="ai"
        index="AI USE CASES"
        title="Where AI earns its place"
        lead="Models wired into the software you already run — measured, guarded and costed before launch."
        more={{ href: "/services/ai-and-ml-integration", label: "AI and ML integration" }}
        rule={false}
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiUseCases.map((item, i) => (
            <li key={item.id} className="panel panel-hover rounded-2xl p-6" {...reveal(i)}>
              <span className="text-accent-2 border-line flex size-11 items-center justify-center rounded-full border">
                <AiUseIcon id={item.id} className="size-5" />
              </span>
              <h3 className="mt-5 text-lg">{item.name}</h3>
              <p className="text-muted mt-2 text-base">{item.note}</p>
            </li>
          ))}
        </ul>
      </Block>

      <PhotoBand photo={media.teamBright} title="Senior enough to say no" />

      <Block
        id="services"
        index="WHAT WE DO"
        title="One partner, every layer of the stack"
        more={{ href: "/services", label: "All services" }}
      >
        <ServiceExplorer />
      </Block>

      <Block id="faq" index="QUESTIONS" title="What buyers ask first">
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
