import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Metadata } from "next"
import { site } from "@/content/site"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/** Every route's metadata goes through here so canonical and OG can never drift. */
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  type = "website",
}: {
  title: string
  description: string
  path: string
  ogTitle?: string
  type?: "website" | "article"
}): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`
  const images = [
    {
      url: `/api/og?title=${encodeURIComponent(ogTitle ?? title)}`,
      width: 1200,
      height: 630,
      alt: title,
    },
  ]
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url,
      siteName: site.name,
      type,
      images,
    },
    twitter: { card: "summary_large_image", title: `${title} — ${site.name}`, description, images },
  }
}

export const STATIC_ROUTES = [
  "/",
  "/services",
  "/process",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
]
