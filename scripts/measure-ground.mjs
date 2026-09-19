// Measures the brightest the shader ground actually gets, and what that does to text.
//
// The contrast numbers in app/globals.css are taken from this, not from a token or an
// assumed scrim value: the ground is two animated WebGL gradients under a scrim, and
// the worst case is a moving target you have to sample rather than compute. The figure
// it prints is what e2e/a11y.spec.ts asserts against.
//
//   pnpm build && pnpm exec next start --port 3210
//   node scripts/measure-ground.mjs

import { chromium } from "@playwright/test"

const URL = process.env.URL ?? "http://127.0.0.1:3210/"
const TOKENS = {
  ink: "#ffffff",
  muted: "#c9c6ee",
  accent: "#c6bdff",
  accent2: "#5ee0ff",
  hot: "#ff7ab8",
}

const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const luminance = ([r, g, b]) =>
  0.2126 * toLinear(r / 255) + 0.7152 * toLinear(g / 255) + 0.0722 * toLinear(b / 255)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: "networkidle" })

// Hide everything but the backdrop, so only the ground is sampled.
await page.evaluate(() => {
  const ground = document.querySelector('[aria-hidden="true"].fixed.inset-0')
  for (const el of document.body.children) if (el !== ground) el.style.visibility = "hidden"
})

let brightest = { L: -1, px: [0, 0, 0] }
// Long enough to cover a full drift of both gradients.
for (let i = 0; i < 24; i++) {
  await page.waitForTimeout(900)
  const shot = await page.screenshot({ type: "png" })
  const px = await page.evaluate(async (b64) => {
    const img = new Image()
    img.src = "data:image/png;base64," + b64
    await img.decode()
    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0)
    // Inset, to keep the dev-tools badge in the corner out of the sample.
    const d = ctx.getImageData(80, 70, canvas.width - 160, canvas.height - 140).data
    let out = null
    let best = -1
    for (let i = 0; i < d.length; i += 4 * 7) {
      const y = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]
      if (y > best) {
        best = y
        out = [d[i], d[i + 1], d[i + 2]]
      }
    }
    return out
  }, shot.toString("base64"))

  const L = luminance(px)
  if (L > brightest.L) brightest = { L, px }
}
await browser.close()

const hex = "#" + brightest.px.map((v) => v.toString(16).padStart(2, "0")).join("")
console.log(`brightest ground: ${hex}  luminance ${brightest.L.toFixed(4)}`)
for (const [name, value] of Object.entries(TOKENS)) {
  const h = value.replace("#", "")
  const L = luminance([0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)))
  const ratio = (Math.max(L, brightest.L) + 0.05) / (Math.min(L, brightest.L) + 0.05)
  console.log(`  ${name.padEnd(8)} ${value}  ${ratio.toFixed(2)}:1`)
}
