import type { MetadataRoute } from "next"
import { site } from "@/content/site"
import { services } from "@/content/services"
import { publishedCaseStudies } from "@/content/work"
import { STATIC_ROUTES } from "@/lib/utils"

/**
 * Draft case studies are excluded on purpose — submitting a page that says "write-up in
 * progress" is worse than not submitting it. They appear once status flips to published.
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
    ...publishedCaseStudies.map((c) => ({
      url: url(`/work/${c.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
