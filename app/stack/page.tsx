import type { Metadata } from "next"
import { Container, CtaBand, PageHeader } from "@/components/ui"
import { StackExplorer } from "@/components/stack-explorer"
import { stackClusters } from "@/content/stack"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: "Technology ecosystem",
  description:
    "The languages, frameworks, AI and ML tooling, cloud infrastructure, data platform and " +
    "security posture Pentaxl builds with — and what each one is actually used for.",
  path: "/stack",
})

export default function StackPage() {
  return (
    <>
      <PageHeader
        title="What we build with, and what for"
        lead="Six clusters rather than a wall of logos. Every entry says what we use it for, because the tool matters far less than the reason it was chosen."
      />
      <div className="pb-20">
        <Container>
          <StackExplorer clusters={stackClusters} />
        </Container>
      </div>
      <CtaBand
        heading="Working in something not listed here"
        body="Say so. We would rather tell you we are the wrong firm than learn your stack on your budget."
        actionLabel="Ask us"
      />
    </>
  )
}
