import { Container, PageHeader, reveal } from "@/components/ui"
import { legalPages, site } from "@/content/site"

/**
 * Shared body for /privacy and /terms.
 *
 * These were briefly one `app/[legal]` route. That was a mistake: a dynamic segment at
 * the root intercepts every unknown top-level path, and with `dynamicParams = false` a
 * production build answers /anything-else with an internal NoFallbackError instead of
 * the designed 404. Two thin pages sharing this component is worth the duplication.
 */
export function LegalPage({ which }: { which: keyof typeof legalPages }) {
  const page = legalPages[which]
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
