import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"
import { legalPages, site } from "@/content/site"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: legalPages.privacy.title,
  description: `What ${site.name} collects through this site, why, and how long it is kept.`,
  path: "/privacy",
})

export default function Page() {
  return <LegalPage which="privacy" />
}
