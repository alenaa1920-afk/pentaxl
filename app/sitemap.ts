import type { MetadataRoute } from "next"
import { site } from "@/content/site"
import { services } from "@/content/services"
import { publishedPosts } from "@/content/blog"
import { STATIC_ROUTES } from "@/lib/utils"

/**
 * Draft posts are excluded on purpose — submitting an unwritten page is worse than not
 * submitting it. They appear automatically once status flips to published.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path === "/" ? "" : path}`
  return [
    ...STATIC_ROUTES.map((path) => ({
      url: url(path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...services.map((s) => ({
      url: url(`/services/${s.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...publishedPosts.map((post) => ({
      url: url(`/blog/${post.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
