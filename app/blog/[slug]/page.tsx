import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Action, Container, CtaBand, JsonLd, PageHeader, PrevNext, reveal } from "@/components/ui"
import { posts, postBySlug } from "@/content/blog"
import { neighbours } from "@/content/services"
import { site } from "@/content/site"
import { pageMetadata } from "@/lib/utils"

export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const post = postBySlug((await params).slug)
  if (!post) return {}
  const meta = pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
  })
  // Drafts stay out of the index until they say something real.
  return post.status === "draft" ? { ...meta, robots: { index: false, follow: true } } : meta
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug((await params).slug)
  if (!post) notFound()

  const near = neighbours(posts, post.slug)

  return (
    <>
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          about: post.tag,
          author: { "@type": "Organization", name: site.legalName, url: site.url },
          publisher: { "@type": "Organization", name: site.legalName, url: site.url },
          url: `${site.url}/blog/${post.slug}`,
          ...(post.date ? { datePublished: post.date } : {}),
        }}
      />

      <PageHeader
        title={post.title}
        lead={post.excerpt}
        crumbs={[
          { href: "/blog", label: "Blog" },
          { href: `/blog/${post.slug}`, label: post.title },
        ]}
        meta={`${post.tag} · ${post.readingMinutes} min read${post.date ? ` · ${post.date}` : ""}`}
      />

      <div className="pb-20">
        <Container>
          <div className="max-w-measure">
            {post.status === "draft" ? (
              <div className="panel p-6 md:p-8" {...reveal()}>
                <p className="text-gold font-mono text-sm">Not written yet</p>
                <h2 className="mt-3 text-xl">What this piece will argue</h2>
                <p className="text-muted mt-4 text-base">
                  The outline is real; the prose is not written. We would rather show you the shape
                  than publish something padded out to look finished.
                </p>
                <ol className="border-line mt-8 border-t">
                  {post.outline.map((point, i) => (
                    <li
                      key={point}
                      className="border-line grid gap-3 border-b py-4 md:grid-cols-[3rem_1fr]"
                    >
                      <span className="text-accent font-mono text-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base">{point}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-8">
                  <Action href="/contact" variant="quiet">
                    Ask us about this instead of waiting
                  </Action>
                </p>
              </div>
            ) : (
              <ol className="border-line border-t">
                {post.outline.map((point, i) => (
                  <li key={point} className="border-line border-b py-5" {...reveal(i)}>
                    <p className="text-base">{point}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Container>
      </div>

      {near ? (
        <PrevNext
          label="post"
          prev={{ href: `/blog/${near.prev.slug}`, title: near.prev.title }}
          next={{ href: `/blog/${near.next.slug}`, title: near.next.title }}
        />
      ) : null}

      <CtaBand
        heading="Working on something like this"
        body="If this is the problem in front of you, skip the article and talk to the people who would build it."
        actionLabel="Start a project"
      />
    </>
  )
}
