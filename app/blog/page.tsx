import type { Metadata } from "next"
import Link from "next/link"
import { Container, CtaBand, PageHeader, reveal } from "@/components/ui"
import { Spotlight } from "@/components/spotlight"
import { posts } from "@/content/blog"
import { pageMetadata } from "@/lib/utils"

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Notes on building software, putting models into production, and running the cloud " +
    "underneath — from the engineers doing the work.",
  path: "/blog",
})

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="Notes from the work"
        lead="Written by whoever did the thing, not by a marketing team. Short, specific, and honest about what did not work."
      />

      <div className="pb-20">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {posts.map((post, i) => (
              <Spotlight as="li" key={post.slug} className="panel tilt lift" {...reveal(i)}>
                <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm">
                    <span className="text-accent">{post.tag}</span>
                    <span className="text-muted">{post.readingMinutes} min read</span>
                    {post.status === "draft" ? (
                      <span className="border-gold/50 text-gold border px-2 py-0.5">Draft</span>
                    ) : (
                      <span className="text-muted">{post.date}</span>
                    )}
                  </div>
                  <h2 className="group-hover:text-accent mt-4 text-xl transition-colors">
                    {post.title}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="bg-gold/40 rule-draw mt-5 block h-px w-full"
                  />
                  <p className="text-muted mt-5 text-base">{post.excerpt}</p>
                  <span className="text-accent mt-6 font-mono text-sm">
                    {post.status === "draft" ? "See the outline" : "Read the post"}
                  </span>
                </Link>
              </Spotlight>
            ))}
          </ul>
        </Container>
      </div>

      <CtaBand
        heading="Want this in your inbox instead"
        body="We do not run a newsletter yet. Tell us what you would want to read and it will shape what we write next."
        actionLabel="Tell us what to write"
      />
    </>
  )
}
