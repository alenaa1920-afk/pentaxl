import { test, expect } from "@playwright/test"
import { services } from "../content/services"

test("service explorer: tabs select by click and arrow keys, panel follows", async ({ page }) => {
  await page.goto("/")
  const tabs = page.getByRole("tablist", { name: "Disciplines" }).getByRole("tab")
  const panel = page.getByRole("tabpanel")
  await expect(tabs).toHaveCount(services.length)
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true")

  await tabs.nth(2).click()
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true")
  await expect(panel).toContainText(services[2].summary)
  await expect(panel.getByRole("link")).toHaveAttribute("href", `/services/${services[2].slug}`)

  // Roving tabindex: arrows move selection and focus together, and wrap.
  await page.keyboard.press("ArrowDown")
  await expect(tabs.nth(3)).toBeFocused()
  await expect(panel).toContainText(services[3].summary)
  await tabs.first().click()
  await page.keyboard.press("ArrowUp")
  await expect(tabs.last()).toHaveAttribute("aria-selected", "true")
})

test("process orbit: scrolling over it turns one stage per gesture, scrolling beside it scrolls the page", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "wheel input")
  await page.goto("/process")
  const live = page.locator(".dsh-sr")
  const scrollY = () => page.evaluate(() => window.scrollY)
  const wheelAt = async (x: number, dy: number) => {
    await page.mouse.move(x, 450)
    await page.mouse.wheel(0, dy)
    await page.waitForTimeout(320) // longer than the carousel's quiet window
  }
  const OVER = 640 // middle of the carousel
  const SIDE = 20 // the page gutter beside it
  await expect(live).toHaveText(/Idea/)

  // Bring the whole carousel on screen.
  await page.evaluate(() => {
    const root = document.querySelector(".dsh-root")!
    window.scrollTo(0, root.getBoundingClientRect().top + window.scrollY - 100)
  })
  await page.waitForTimeout(320)
  const at = await scrollY()

  // Over the carousel: the stage turns and the page holds.
  await wheelAt(OVER, 120)
  await expect(live).toHaveText(/Technical enrichment/)
  expect(await scrollY(), "the page holds while the stages turn").toBe(at)

  // A burst of wheel events — trackpad momentum — is one gesture: one stage, not three.
  await page.mouse.move(OVER, 450)
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 60)
    await page.waitForTimeout(30)
  }
  await page.waitForTimeout(320)
  await expect(live).toHaveText(/Scope agreement/)

  // Beside it: the page scrolls and the stage does not change.
  await wheelAt(SIDE, 200)
  expect(await scrollY()).toBeGreaterThan(at)
  await expect(live).toHaveText(/Scope agreement/)
  await wheelAt(SIDE, -200)

  // Back over it, up turns back, and past the last stage the page scrolls on.
  await wheelAt(OVER, -120)
  await expect(live).toHaveText(/Technical enrichment/)
  for (const stage of [/Scope agreement/, /Delivery/, /Production ready/]) {
    await wheelAt(OVER, 120)
    await expect(live).toHaveText(stage)
  }
  const before = await scrollY()
  await wheelAt(OVER, 300)
  expect(await scrollY()).toBeGreaterThan(before)
})

test.describe("faq", () => {
  test("opens on click and only one answer stays open", async ({ page }) => {
    await page.goto("/")
    const items = page.locator("details[name='faq']")
    expect(await items.count()).toBeGreaterThan(2)

    const first = items.first()
    const second = items.nth(1)
    await first.scrollIntoViewIfNeeded()

    await first.locator("summary").click()
    await expect(first).toHaveAttribute("open", "")

    await second.locator("summary").click()
    await expect(second).toHaveAttribute("open", "")
    // Grouped by name, so opening the second closes the first.
    await expect(first).not.toHaveAttribute("open", "")
  })

  test("answers are in the DOM for search engines even when closed", async ({ page }) => {
    const html = await (await page.request.get("/")).text()
    expect(html).toContain("Cloud native, on-premise or hybrid are all fine")
    expect(html).toContain('"@type":"FAQPage"')
  })
})

test.describe("project dialog", () => {
  test("opens from the nav without navigating, validates, and closes on Escape", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "desktop", "the nav button is desktop-only")
    await page.goto("/")
    await page.locator("header").getByRole("link", { name: "Start a project" }).click()

    const dialog = page.locator("dialog.project-dialog")
    await expect(dialog).toHaveJSProperty("open", true)
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator("#project-dialog-title")).toHaveText("Start your project")

    // Exactly the four fields asked for, and every service in the dropdown.
    for (const label of [
      "Your name",
      "Email",
      "What do you need",
      "What are you trying to build",
    ]) {
      await expect(dialog.getByLabel(label)).toBeVisible()
    }
    for (const service of services) {
      await expect(dialog.locator("select option", { hasText: service.name })).toHaveCount(1)
    }

    await dialog.getByRole("button", { name: /^Send/ }).click()
    await expect(dialog.getByText("Please enter your name.")).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(dialog).toHaveJSProperty("open", false)
  })

  test("on a phone the dialog opened from the hero can be typed into", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "needs a touch screen")
    await page.goto("/")
    await page.locator("main").getByRole("link", { name: "Start a project" }).first().tap()
    const name = page.locator("dialog.project-dialog").getByLabel("Your name")
    await name.tap()
    await page.keyboard.type("Ravi")
    await expect(name).toHaveValue("Ravi")
  })

  test("the mobile menu's Start a project closes the menu and leaves the page usable", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "mobile", "the menu is mobile-only")
    // Regression: this link once navigated without closing the menu, which left the
    // page behind it untappable.
    await page.goto("/")
    await page.getByRole("button", { name: "Open menu" }).tap()
    await page
      .getByRole("dialog", { name: "Menu" })
      .getByRole("link", { name: "Start a project" })
      .tap()
    await expect(page).toHaveURL(/\/contact$/)
    await expect(page.getByRole("dialog", { name: "Menu" })).toHaveCount(0)
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).pointerEvents))
      .not.toBe("none")
  })
})

test("the wordmark's letters sit wholly inside its mask, and the mask inside the bar", async ({
  page,
}) => {
  // Default suite context is reduced motion, so this checks the resting state the
  // animation lands in — the letters must not be clipped by the mask that animates them.
  await page.goto("/")
  const fit = await page.evaluate(() => {
    const mask = document.querySelector(".brand-mask")!.getBoundingClientRect()
    const bar = document.querySelector("header > div > div")!.getBoundingClientRect()
    const letters = [...document.querySelectorAll(".brand-letter")].map((l) => {
      const r = l.getBoundingClientRect()
      return r.top >= mask.top - 0.5 && r.bottom <= mask.bottom + 0.5
    })
    return {
      text: document.querySelector(".brand-mask")!.textContent,
      lettersInside: letters.every(Boolean),
      maskInsideBar: mask.top >= bar.top && mask.bottom <= bar.bottom,
    }
  })
  expect(fit.text).toBe("PentaXL")
  expect(fit.lettersInside).toBe(true)
  expect(fit.maskInsideBar).toBe(true)
})
