import type { Metadata } from "next"
import { Container, PageHeader } from "@/components/ui"
import { site, whatsAppUrl, RESPONSE_PROMISE } from "@/content/site"
import { pageMetadata } from "@/lib/utils"
import { ContactForm } from "./form"

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Start a project with ${site.name}. Tell us what you are building and we will reply within ${RESPONSE_PROMISE}.`,
  path: "/contact",
})

export default function ContactPage() {
  const whatsapp = whatsAppUrl()
  const details = [
    { term: "Email", value: site.email, href: `mailto:${site.email}` },
    ...(site.phone ? [{ term: "Phone", value: site.phoneDisplay, href: `tel:${site.phone}` }] : []),
    ...(whatsapp ? [{ term: "WhatsApp", value: "Message us", href: whatsapp }] : []),
    { term: "Where we are", value: site.location, href: null },
  ]

  return (
    <>
      <PageHeader
        title="Start a project"
        lead="Describe the problem in a paragraph. We will tell you whether we are the right firm for it, what we would need to know to scope it, and roughly what it would take."
      />

      <div className="pb-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
            <ContactForm />

            <div className="lg:border-line lg:border-l lg:pl-12">
              <h2 className="text-lg">Or reach us directly</h2>
              <p className="max-w-measure text-muted mt-3 text-base">
                Some people will never use a form. That is fine — everything below reaches the same
                engineers.
              </p>

              <dl className="mt-8 space-y-6">
                {details.map((item) => (
                  <div key={item.term}>
                    <dt className="text-muted font-mono text-sm">{item.term}</dt>
                    <dd className="mt-1 text-base">
                      {item.href ? (
                        <a
                          href={item.href}
                          {...(item.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="text-accent decoration-accent/30 hover:decoration-accent underline underline-offset-4"
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* PLACEHOLDER: remove the moment the mailbox is live. */}
              {!site.emailIsLive ? (
                <p className="border-line text-muted mt-10 border px-4 py-3 text-sm">
                  Our company mailbox is still being set up, so the form is not delivering mail yet.
                  Phone and WhatsApp details are being added here too.
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
