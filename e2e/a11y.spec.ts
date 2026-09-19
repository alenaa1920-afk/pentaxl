import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { ROUTES } from "./routes"

/**
 * The floor: zero critical, zero serious. Moderate and minor do not block.
 *
 * The suite runs reduced-motion by default (see playwright.config.ts), which also means
 * axe measures settled colours rather than sampling text mid-fade.
 */
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

test("text clears AA against the lightest the shader ground can get", async ({ page }) => {
  // The backdrop is two moving gradients under a 0.58 scrim. The worst case is the
  // brightest point of the rendered ground over a full shader cycle, sampled at
  // #0F4E6A by scripts/measure-ground.mjs — so that, not a flat token, is what text
  // has to clear.
  await page.goto("/")
  const ratios = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    const lum = (value: string) => {
      let hex = value.trim().replace("#", "")
      if (hex.length === 3) hex = [...hex].map((c) => c + c).join("")
      const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
    }
    const WORST_GROUND = "#0f4e6a"
    const against = (token: string) => {
      const a = lum(root.getPropertyValue(token))
      const b = lum(WORST_GROUND)
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    }
    return {
      ink: against("--color-ink"),
      muted: against("--color-muted"),
      accent: against("--color-accent"),
      accent2: against("--color-accent-2"),
      hot: against("--color-hot"),
    }
  })

  expect(ratios.ink, "body text on the brightest ground").toBeGreaterThanOrEqual(4.5)
  expect(ratios.muted, "muted text on the brightest ground").toBeGreaterThanOrEqual(4.5)
  expect(ratios.accent, "accent on the brightest ground").toBeGreaterThanOrEqual(4.5)
  expect(ratios.accent2, "accent-2 on the brightest ground").toBeGreaterThanOrEqual(4.5)
  // `hot` only ever appears inside gradient-text, which is large display type, so the
  // bar is AA large rather than AA body.
  expect(ratios.hot, "hot on the brightest ground").toBeGreaterThanOrEqual(3)
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
