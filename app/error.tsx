"use client"

// Error boundaries must be client components — Next's contract, not a choice.

import Link from "next/link"
import { useEffect } from "react"
import { Container } from "@/components/ui"
import { site } from "@/content/site"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("[error boundary]", error)
  }, [error])

  return (
    <div className="py-24">
      <Container>
        <p className="text-accent font-mono text-sm">500</p>
        <h1 className="max-w-measure mt-4 text-2xl md:text-3xl">Something broke on our side</h1>
        <p className="max-w-measure text-muted mt-6 text-base md:text-lg">
          This is a fault in the site, not something you did. Trying again often works — if it does
          not, tell us and we will fix it.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-accent text-canvas inline-flex min-h-11 items-center justify-center px-5 py-2.5 text-base font-medium transition-all hover:brightness-110"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border-line hover:border-accent hover:text-accent inline-flex min-h-11 items-center justify-center border px-5 py-2.5 text-base font-medium"
          >
            Go to the homepage
          </Link>
        </div>
        <p className="mt-8 font-mono text-sm">
          <a href={`mailto:${site.email}`} className="text-muted hover:text-accent">
            {site.email}
          </a>
        </p>
      </Container>
    </div>
  )
}
