import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Container, PageHeader, reveal } from "@/components/ui"
import { legalPages, site } from "@/content/site"
import { pageMetadata } from "@/lib/utils"

/**
 * /privacy and /terms from one file. Static routes win over this dynamic segment, so it
 * only ever matches these two slugs; `dynamicParams = false` 404s anything else.
 */
type Slug = keyof typeof legalPages

export const dynamicParams = false
export const generateStaticParams = () => Object.keys(legalPages).map((legal) => ({ legal }))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legal: string }>
}): Promise<Metadata> {
  const page = legalPages[(await params).legal as Slug]
  if (!page) return {}
  return pageMetadata({
    title: page.title,
    description: `${page.title} for the ${site.name} website — ${page.lead}`.slice(0, 155),
    path: `/${(await params).legal}`,
  })
}

export default async function LegalPage({ params }: { params: Promise<{ legal: string }> }) {
  const page = legalPages[(await params).legal as Slug]
  if (!page) notFound()

  return (
    <>
      <PageHeader title={page.title} lead={page.lead} />
      <div className="pb-24">
        <Container>
          <div className="max-w-measure space-y-10">
            {page.sections.map((section, i) => (
              <section key={section.heading} aria-labelledby={section.heading} {...reveal(i)}>
                <h2 id={section.heading} className="text-xl">
                  {section.heading}
                </h2>
                <p className="text-muted mt-4 text-base">{section.body}</p>
              </section>
            ))}
            <p className="border-line text-muted border px-4 py-3 text-sm">
              Being reviewed before launch. Email <span className="text-accent">{site.email}</span>{" "}
              with any question or request.
            </p>
          </div>
        </Container>
      </div>
    </>
  )
}
