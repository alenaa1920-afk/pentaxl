import { test, expect } from "@playwright/test"
import { ROUTES } from "./routes"
import { services } from "../content/services"

/** Widths from the brief's quality floor. */
// 1024 and 1440 added per the UX checklist's breakpoint set.
const WIDTHS = [375, 768, 1024, 1280, 1440, 1920]

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
    for (const route of ["/", "/services/software-development", "/blog", "/process", "/contact"]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(route)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      )
      expect(overflow, `${route} scrolls horizontally at ${width}px`).toBe(false)
    }
  })
}

test("every internal link resolves — no dead links anywhere", async ({ page, request }) => {
  const seen = new Set<string>()
  for (const route of ROUTES) {
    await page.goto(route)
    const hrefs = await page
      .locator("a[href^='/']")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""))
    for (const href of hrefs) seen.add(href.split("#")[0])
  }

  const broken: string[] = []
  for (const href of [...seen].filter(Boolean)) {
    const res = await request.get(href)
    if (res.status() >= 400) broken.push(`${href} → ${res.status()}`)
  }
  expect(broken, `dead internal links:\n${broken.join("\n")}`).toEqual([])
})

test("skip link is first in tab order and moves focus to main", async ({ page }) => {
  await page.goto("/")
  await page.keyboard.press("Tab")
  const focused = page.locator(":focus")
  await expect(focused).toHaveText(/skip to content/i)
  await focused.press("Enter")
  await expect
    .poll(() => page.evaluate(() => window.location.hash), { timeout: 10000 })
    .toBe("#main")
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
  // Reduced motion (the default) renders the figure in its final state immediately,
  // so the node is clickable without waiting out the trace.
  await page.goto("/")
  const first = services[0]
  await page.getByRole("link", { name: first.name }).first().click()
  await expect(page).toHaveURL(new RegExp(`/services/${first.slug}$`))
  await expect(page.locator("h1")).toHaveText(first.name)
})

test("scroll reveal shows content as it enters the viewport", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "no-preference" })
  const page = await context.newPage()
  await page.goto("/")
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on", { timeout: 20000 })

  // Scroll via evaluate: reveal targets can sit inside perpetually animating bands,
  // where locator actions never satisfy the stability wait.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  // Polled, not asserted once: the observer delivers its callbacks over several frames
  // after the jump, so reading the count the instant the first one lands is a race.
  await expect
    .poll(
      () =>
        page.evaluate(() => document.querySelectorAll("[data-reveal]:not([data-shown])").length),
      { timeout: 20000, message: "everything scrolled past should have been revealed" },
    )
    .toBe(0)
  await context.close()
})

test("the shader backdrop is global, decorative, and yields to reduced motion", async ({
  browser,
}) => {
  // Software GL in headless makes this the slowest test in the suite.
  test.setTimeout(90_000)
  // With motion allowed the WebGL canvas mounts over the static gradient.
  const motion = await browser.newContext({ reducedMotion: "no-preference" })
  const lively = await motion.newPage()
  await lively.goto("/")
  await expect(lively.locator("canvas").first()).toBeAttached({ timeout: 20000 })
  // Fixed and full-viewport — the background of the whole page, not one section.
  const fixed = await lively.locator("div.fixed.inset-0.-z-50").first()
  await expect(fixed).toBeAttached()
  expect(await fixed.getAttribute("aria-hidden")).toBe("true")
  await motion.close()

  // Default context is reduced-motion: the gradient carries it, no canvas at all.
  const page = await browser.newPage()
  await page.goto("/")
  await page.waitForTimeout(2000)
  expect(await page.locator("canvas").count(), "no shader canvas under reduced motion").toBe(0)
  await expect(page.locator(".mesh").first()).toBeAttached()
  await expect(page.locator("h1")).toBeVisible()
  await page.close()
})

test("band photography is real, sized, lazy and described", async ({ page }) => {
  await page.goto("/")
  // Asserted via evaluate rather than a locator action: the Ken Burns zoom never
  // settles, so Playwright's stability wait can never succeed on these images. They
  // are decorative backgrounds, not targets, so perpetual motion is fine here.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3))
  await page.waitForTimeout(1200)

  const shots = await page.evaluate(() =>
    [...document.querySelectorAll("section img")].map((el) => {
      const img = el as HTMLImageElement
      const r = img.getBoundingClientRect()
      return { alt: img.alt, width: Math.round(r.width), loading: img.loading, src: img.src }
    }),
  )

  expect(shots.length).toBeGreaterThan(0)
  for (const shot of shots) {
    expect(shot.alt, "every band photo needs a real alt").toBeTruthy()
    expect(shot.width, "photo should fill its band").toBeGreaterThan(300)
    expect(shot.loading, "band photos are below the fold").toBe("lazy")
    // Served through next/image, which negotiates AVIF/WebP per request.
    expect(shot.src).toContain("/_next/image")
  }
})

test("the hero pentagon redraws on every load", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "no-preference" })
  const page = await context.newPage()
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
  await context.close()
})

test("the pentagon traces one line at a time, not all at once", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "no-preference" })
  const page = await context.newPage()
  await page.goto("/", { waitUntil: "commit" })

  // Wait until the stylesheet has applied: before it does, .pulse-in has no rule and
  // every pulse reads as fully opaque, which is an artefact of sampling too early.
  await page.waitForFunction(
    () => {
      const el = document.querySelector("svg .pulse-in")
      return !!el && getComputedStyle(el).animationName === "node-in"
    },
    undefined,
    { timeout: 20000 },
  )

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

  // Sampling starts when the pen actually starts, not on a wall clock: how long the
  // page takes to get here varies with machine load, and a run that only sampled after
  // the trace had finished used to fail on pulses that were correctly visible by then.
  await page.waitForFunction(() => {
    const l = document.querySelector("svg .edge-draw")
    if (!l) return false
    const cs = getComputedStyle(l)
    const len = parseFloat(cs.strokeDasharray) || 1
    const drawn = 1 - (parseFloat(cs.strokeDashoffset) || 0) / len
    return drawn > 0.005
  })

  // Mid-trace: exactly one edge in flight, and no pulse visible while one still is.
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(500)
    const s = await sample()
    expect(s.drawing, "more than one edge drawing at once").toBeLessThanOrEqual(1)
    if (s.drawing > 0) expect(s.idlePulses, "pulse visible before the line is drawn").toBe(0)
  }

  // Settled: everything drawn.
  await page.waitForTimeout(3500)
  expect((await sample()).drawing).toBe(0)
  await context.close()
})

test("current route is marked in the nav", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "desktop nav only")
  await page.goto("/blog")
  await expect(page.locator('nav[aria-label="Primary"] a[aria-current="page"]')).toHaveText("Blog")
})

test("draft posts are excluded from the sitemap, and removed routes are gone", async ({ page }) => {
  const body = await (await page.request.get("/sitemap.xml")).text()
  expect(body).toContain("/services/software-development")
  expect(body).toContain("/blog")
  // Drafts stay out until written.
  expect(body).not.toContain("/blog/what-happens-when-the-model-is-wrong")
  // Work and Stack were deferred to phase two.
  expect(body).not.toContain("/work")
  expect(body).not.toContain("/stack")
})

test("the deferred routes 404 rather than linger", async ({ page }) => {
  for (const gone of ["/work", "/stack"]) {
    expect((await page.request.get(gone)).status(), `${gone} should be gone`).toBe(404)
  }
})

test("the floating contact dock opens, closes on Escape and hides on /contact", async ({
  page,
}) => {
  await page.goto("/")
  const trigger = page.getByRole("button", { name: "Contact us" })
  await expect(trigger).toBeVisible()

  await trigger.click()
  await expect(page.getByRole("button", { name: "Close contact options" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Tell us about the project" })).toBeVisible()

  await page.keyboard.press("Escape")
  await expect(page.getByRole("button", { name: "Contact us" })).toBeFocused()

  // Redundant on the contact page itself.
  await page.goto("/contact")
  await expect(page.getByRole("button", { name: "Contact us" })).toHaveCount(0)
})
