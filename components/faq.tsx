import { Plus } from "lucide-react"
import { faqs, site } from "@/content/site"
import { JsonLd, reveal } from "./ui"

/**
 * Native <details>/<summary>: keyboard, screen-reader and find-in-page behaviour come
 * free, and it costs no JavaScript. The glow and the rotating marker are CSS only.
 *
 * `name` groups them so opening one closes the others (an accordion) while still
 * degrading to plain toggles in browsers without support.
 */
export function Faq() {
  return (
    <>
      <div className="border-line border-t">
        {faqs.map((item, i) => (
          <details
            key={item.q}
            name="faq"
            className="group border-line spot border-b"
            {...reveal(i)}
          >
            <summary className="glow flex cursor-pointer items-start justify-between gap-6 px-1 py-5 text-base marker:content-none md:text-lg [&::-webkit-details-marker]:hidden">
              <span className="group-hover:text-accent transition-colors">{item.q}</span>
              <Plus
                aria-hidden="true"
                className="text-accent mt-1 size-4 shrink-0 transition-transform duration-300 group-open:rotate-45"
              />
            </summary>
            <p className="text-muted max-w-measure px-1 pb-6 text-base">{item.a}</p>
          </details>
        ))}
      </div>

      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: `${site.url}/#faq`,
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </>
  )
}
