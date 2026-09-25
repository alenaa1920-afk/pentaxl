import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ClusterGrid, CtaBand, JsonLd, PageHeader, Part, PrevNext, Prose } from "@/components/ui"
import { neighbours, serviceBySlug, services } from "@/content/services"
import { clustersByIds } from "@/content/stack"
import { site } from "@/content/site"
import { PhotoBand } from "@/components/photo-band"
import { serviceMedia } from "@/content/media"
import { pageMetadata } from "@/lib/utils"

export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const service = serviceBySlug((await params).slug)
  if (!service) return {}
  return pageMetadata({
    title: service.name,
    description: service.summary,
    path: `/services/${service.slug}`,
  })
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const service = serviceBySlug((await params).slug)
  if (!service) notFound()

  const near = neighbours(services, service.slug)

  return (
    <>
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.summary,
          serviceType: service.name,
          provider: { "@type": "Organization", name: site.legalName, url: site.url },
          url: `${site.url}/services/${service.slug}`,
        }}
      />

      <PageHeader
        title={service.name}
        lead={service.summary}
        crumbs={[
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.name },
        ]}
      />

      <PhotoBand
        photo={serviceMedia[service.slug]}
        eyebrow={`/ ${service.nodeLabel.toUpperCase()}`}
        title={service.summary}
        height="short"
        priority
      />

      <Part index={1} id="what" title="What this is">
        <Prose>{service.body}</Prose>
      </Part>

      <Part
        index={2}
        id="deliverables"
        title="What you get"
        lead="Artefacts, not adjectives. Each is something you can open, run, or hand to someone else."
      >
        <ul className="border-line border-t">
          {service.deliverables.map((item, i) => (
            <li
              key={item}
              className="border-line grid gap-3 border-b py-4 md:grid-cols-[3rem_1fr] md:gap-8"
            >
              <span className="text-accent font-mono text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="max-w-measure text-base">{item}</span>
            </li>
          ))}
        </ul>
      </Part>

      <Part index={3} id="timeline" title="How long it takes">
        <p className="text-accent font-mono text-lg md:text-xl">{service.timeline}</p>
        <p className="max-w-measure text-muted mt-4 text-base">{service.timelineCaveat}</p>
      </Part>

      <Part
        index={4}
        id="tech"
        title="What it is built with"
        lead="The tools this discipline actually uses, and why each one is in the list."
      >
        <ClusterGrid clusters={clustersByIds(service.stackClusters)} />
      </Part>

      {near ? (
        <PrevNext
          label="service"
          prev={{ href: `/services/${near.prev.slug}`, title: near.prev.name }}
          next={{ href: `/services/${near.next.slug}`, title: near.next.name }}
        />
      ) : null}

      <CtaBand
        heading={`Talk about ${service.name.toLowerCase()}`}
        body="Send the problem rather than a specification. The first thing we will do is tell you which parts of it are actually uncertain."
        actionLabel="Talk about a build"
      />
    </>
  )
}
