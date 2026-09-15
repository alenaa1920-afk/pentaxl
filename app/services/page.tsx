import type { Metadata } from "next"
import Link from "next/link"
import { Container, CtaBand, PageHeader, reveal } from "@/components/ui"
import { Spotlight } from "@/components/spotlight"
import { ServiceIcon } from "@/components/service-icon"
import { services } from "@/content/services"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Software development, AI and ML integration, cloud and DevOps, security and compliance, " +
    "and data and integrations — the five disciplines Pentaxl delivers together.",
  path: "/services",
})

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Five disciplines, delivered together"
        lead="They are sold as one set because that is how software actually reaches production. A build nobody can deploy is unfinished. A deployment nobody can observe is a liability. A model nobody evaluated is a guess."
      />

      <div className="pb-20">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {services.map((service, i) => (
              <Spotlight as="li" key={service.slug} className="panel" {...reveal(i)}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col p-6 md:p-8"
                >
                  <span className="text-accent border-line flex size-10 items-center justify-center border">
                    <ServiceIcon slug={service.slug} className="size-4" />
                  </span>
                  <h2 className="group-hover:text-accent mt-6 text-xl transition-colors">
                    {service.name}
                  </h2>
                  <p className="text-muted mt-3 text-base">{service.summary}</p>
                  <span
                    aria-hidden="true"
                    className="bg-accent/40 rule-draw mt-6 block h-px w-full"
                  />
                  <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm">
                    <div>
                      <dt className="text-muted inline">Typically </dt>
                      <dd className="inline">{service.timeline}</dd>
                    </div>
                    <div>
                      <dt className="text-muted inline">Deliverables </dt>
                      <dd className="text-accent inline">{service.deliverables.length}</dd>
                    </div>
                  </dl>
                </Link>
              </Spotlight>
            ))}
          </ul>
        </Container>
      </div>

      <CtaBand
        heading="Not sure which of these you need"
        body="Most engagements start as one and turn out to be two. Describe the problem and we will tell you which disciplines it actually touches."
        actionLabel="Talk about a build"
      />
    </>
  )
}
