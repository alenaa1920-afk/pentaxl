import { test, expect } from "@playwright/test"
import { ROUTES } from "./routes"
import { services } from "../content/services"

/** Widths from the brief's quality floor. */
const WIDTHS = [375, 768, 1280, 1920]

for (const route of ROUTES) {
  test(`${route} has the structural basics`, async ({ page }) => {
    await page.goto(route)

    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator("main#main")).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator("header").first()).toBeVisible()
    await expect(page.locator("footer").first()).toBeVisible()

    const title = await page.title()
    expect(title.length).toBeGreaterThan(4)
    expect(title).not.toContain("Create Next App")

    // No dead links anywhere in the shipped build.
    expect(await page.locator('a[href="#"], a[href=""]').count()).toBe(0)
  })
}

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    for (const route of ["/", "/services/software-development", "/stack", "/contact"]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(route)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      )
      expect(overflow, `${route} scrolls horizontally at ${width}px`).toBe(false)
    }
  })
}

test("skip link is first in tab order and moves focus to main", async ({ page }) => {
  await page.goto("/")
  await page.keyboard.press("Tab")
  const focused = page.locator(":focus")
  await expect(focused).toHaveText(/skip to content/i)
  await focused.press("Enter")
  expect(await page.evaluate(() => window.location.hash)).toBe("#main")
})

test("mobile drawer opens, then closes on Escape and restores focus", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "drawer is mobile-only")
  await page.goto("/")

  const trigger = page.getByRole("button", { name: "Open menu" })
  await trigger.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("link", { name: "Services" })).toBeVisible()

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("hero nodes are real links into the service pages", async ({ page }) => {
  await page.goto("/")
  const first = services[0]
  await page.getByRole("link", { name: first.name }).first().click()
  await expect(page).toHaveURL(new RegExp(`/services/${first.slug}$`))
  await expect(page.locator("h1")).toHaveText(first.name)
})

test("scroll reveal shows content as it enters the viewport", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on")

  const target = page.locator("[data-reveal]").last()
  await target.scrollIntoViewIfNeeded()
  await expect(target).toHaveAttribute("data-shown", "")
  await expect(target).toBeVisible()
})

test("the hero pentagon redraws on every load", async ({ page }) => {
  await page.goto("/")

  const edges = page.locator("svg .edge-draw")
  expect(await edges.count()).toBe(7)
  expect(await edges.first().evaluate((el) => getComputedStyle(el).animationName)).toContain(
    "draw-edge",
  )

  // Server-rendered, so the draw starts on first paint rather than after hydration.
  expect(await (await page.request.get("/")).text()).toContain("edge-draw")

  // No session gate: it must animate again after a reload, and store nothing.
  await page.reload()
  await expect(page.locator("svg .edge-draw").first()).toBeAttached()
  expect(await page.evaluate(() => Object.keys(sessionStorage).length)).toBe(0)
})

test("the pentagon traces one line at a time, not all at once", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" })

  const sample = () =>
    page.evaluate(() => {
      const pct = [...document.querySelectorAll("svg .edge-draw")].map((l) => {
        const cs = getComputedStyle(l)
        const len = parseFloat(cs.strokeDasharray) || 1
        return 1 - (parseFloat(cs.strokeDashoffset) || 0) / len
      })
      return {
        drawing: pct.filter((v) => v > 0.005 && v < 0.995).length,
        idlePulses: [...document.querySelectorAll("svg .pulse-in")].filter(
          (g) => parseFloat(getComputedStyle(g).opacity) > 0.01,
        ).length,
      }
    })

  // Mid-trace: exactly one edge in flight, and no pulse visible yet.
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(500)
    const s = await sample()
    expect(s.drawing, "more than one edge drawing at once").toBeLessThanOrEqual(1)
    expect(s.idlePulses, "pulse visible before the line is drawn").toBe(0)
  }

  // Settled: everything drawn.
  await page.waitForTimeout(2500)
  expect((await sample()).drawing).toBe(0)
})

test("current route is marked in the nav", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "desktop nav only")
  await page.goto("/stack")
  await expect(page.locator('nav[aria-label="Primary"] a[aria-current="page"]')).toHaveText("Stack")
})

test("draft case studies are excluded from the sitemap", async ({ page }) => {
  const body = await (await page.request.get("/sitemap.xml")).text()
  expect(body).toContain("/services/software-development")
  expect(body).not.toContain("/work/high-flyers")
})
