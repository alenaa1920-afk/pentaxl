import { ImageResponse } from "next/og"
import { site } from "@/content/site"

export const runtime = "nodejs"

const BASE = "#07090A"
const INK = "#E9EFEE"
const MUTED = "#93A3A1"
const LINE = "#1D2729"
const ACCENT = "#2FE0B6"

/** Per-route OG images in the site palette. No webfont fetch — that would add a failure
 *  mode to every social preview for a gain nobody sees at this size. */
export function GET(request: Request) {
  const title = (new URL(request.url).searchParams.get("title") ?? site.name).slice(0, 120)

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BASE,
        padding: 72,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 30, color: INK }}>
          {site.name}
          <span style={{ color: ACCENT }}>.</span>
        </span>
        <span style={{ fontSize: 22, color: MUTED }}>{site.domain}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ width: "100%", height: 1, backgroundColor: LINE, marginBottom: 40 }} />
        <span
          style={{
            fontSize: title.length > 48 ? 56 : 72,
            color: INK,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 960,
          }}
        >
          {title}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 3, backgroundColor: ACCENT }} />
        <span style={{ fontSize: 24, color: MUTED }}>{site.tagline}</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  )
}
