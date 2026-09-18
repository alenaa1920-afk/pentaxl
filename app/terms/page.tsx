import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"
import { legalPages, site } from "@/content/site"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: legalPages.terms.title,
  description: `Terms covering use of the ${site.name} website.`,
  path: "/terms",
})

export default function Page() {
  return <LegalPage which="terms" />
}
