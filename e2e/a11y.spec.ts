import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { ROUTES } from "./routes"

/**
 * The floor: zero critical, zero serious. Moderate and minor do not block.
 *
 * Run with reduced motion so axe measures settled colours. Otherwise it samples text
 * mid-fade and reports the blended value (muted at 60% opacity reads ~3.1:1 against the
 * background, while the token itself is 7.6:1) — a measurement artefact, not a defect.
 * The settled reveal state is asserted separately in structure.spec.ts.
 */
test.use({ reducedMotion: "reduce" })

for (const route of ROUTES) {
  test(`no critical or serious axe violations on ${route}`, async ({ page }) => {
    await page.goto(route)
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze()

    const blocking = violations.filter((v) => v.impact === "critical" || v.impact === "serious")
    expect(
      blocking,
      blocking.map((v) => `${v.impact}: ${v.id} — ${v.nodes.length} node(s)`).join("\n"),
    ).toEqual([])
  })
}

test("muted and accent text both clear AA on the page background", async ({ page }) => {
  // Reads live token values, so editing the palette re-runs the check.
  await page.goto("/")
  const ratios = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    const lum = (value: string) => {
      // The production build minifies #ffffff to #fff, so expand shorthand first.
      let hex = value.trim().replace("#", "")
      if (hex.length === 3) hex = [...hex].map((c) => c + c).join("")
      const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
    }
    const against = (token: string, surface: string) => {
      const a = lum(root.getPropertyValue(token))
      const b = lum(root.getPropertyValue(surface))
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    }
    return {
      muted: against("--color-muted", "--color-canvas"),
      accent: against("--color-accent", "--color-canvas"),
      accent2: against("--color-accent-2", "--color-canvas"),
      hot: against("--color-hot", "--color-canvas"),
      mutedOnMist: against("--color-muted", "--color-mist"),
      onAccent: against("--color-on-accent", "--color-accent"),
    }
  })

  expect(ratios.muted, "muted on canvas").toBeGreaterThanOrEqual(4.5)
  expect(ratios.accent, "accent on canvas").toBeGreaterThanOrEqual(4.5)
  expect(ratios.accent2, "accent-2 on canvas").toBeGreaterThanOrEqual(4.5)
  expect(ratios.hot, "hot on canvas").toBeGreaterThanOrEqual(4.5)
  expect(ratios.mutedOnMist, "muted on the mist band").toBeGreaterThanOrEqual(4.5)
  expect(ratios.onAccent, "button text on accent").toBeGreaterThanOrEqual(4.5)
})

test("reduced motion disables the reveal system entirely", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto("/")

  // data-motion is never set, so nothing is hidden waiting for an observer.
  await expect(page.locator("html")).not.toHaveAttribute("data-motion", "on")
  await expect(page.locator("h1")).toBeVisible()
  await context.close()
})
