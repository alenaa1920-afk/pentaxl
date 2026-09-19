import { test, expect } from "@playwright/test"
import { services } from "../content/services"

test.describe("service fold", () => {
  test("shut by default, and opens on hover, focus and click alike", async ({ page }) => {
    await page.goto("/")
    const triggers = page.locator("[aria-controls^='fold-']")
    await expect(triggers).toHaveCount(services.length)

    // The point of the section: every card shut on arrival, so no service copy is on
    // the landing page until asked for. The copy stays in the DOM — hiding it from a
    // screen reader or a crawler is not what was wanted — so this asserts on what is
    // actually rendered, not on what the markup contains.
    for (const service of services) {
      const i = services.indexOf(service)
      await expect(triggers.nth(i)).toHaveAttribute("aria-expanded", "false")
      await expect(page.locator(`#fold-${service.slug} > div > div`)).toHaveCSS("opacity", "0")
    }

    // Hover opens exactly one.
    await triggers.nth(1).hover()
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true")
    await expect(triggers.and(page.getByRole("button", { expanded: true }))).toHaveCount(1)
    await expect(page.locator("#fold-" + services[1].slug)).toContainText(services[1].summary)

    // Keyboard reaches it without a pointer, and the link inside is only in the tab
    // order once its card is open.
    await triggers.nth(3).focus()
    await expect(triggers.nth(3)).toHaveAttribute("aria-expanded", "true")
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "false")
    await page.keyboard.press("Tab")
    await expect(page.locator("#fold-" + services[3].slug).getByRole("link")).toBeFocused()

    // Clicking opens rather than toggles, and opening one shuts the last.
    await triggers.first().click()
    await expect(triggers.first()).toHaveAttribute("aria-expanded", "true")
    await expect(triggers.nth(3)).toHaveAttribute("aria-expanded", "false")
  })

  test("a touch tap opens a card", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "needs a touch screen")
    // Regression: a tap fires focus before click. While the click toggled, those two
    // cancelled out on the same tap and no card could be opened by touch at all —
    // which page.click() does not reproduce, because it sends mouse input.
    await page.goto("/")
    const trigger = page.locator("[aria-controls^='fold-']").nth(1)
    await trigger.scrollIntoViewIfNeeded()
    await trigger.tap()
    // Deliberately not an immediate assertion. A tap synthesises a mouseleave a few
    // milliseconds after it opens the card, and a check that raced that event passed
    // against a build where tapping visibly did nothing. The card has to still be open
    // once everything the tap set off has settled.
    await page.waitForTimeout(600)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(page.locator(`#fold-${services[1].slug} > div > div`)).toHaveCSS("opacity", "1")
  })
})

test.describe("work carousel", () => {
  test("arrows page through and disable at the ends", async ({ page }) => {
    await page.goto("/")
    const prev = page.getByRole("button", { name: "Previous" })
    const next = page.getByRole("button", { name: "Next" })

    await prev.scrollIntoViewIfNeeded()
    await expect(prev).toBeDisabled()
    await expect(next).toBeEnabled()

    await next.click()
    await page.waitForTimeout(700)
    await expect(prev).toBeEnabled()

    // Reaching the end disables next.
    for (let i = 0; i < 4; i++) {
      if (await next.isDisabled()) break
      await next.click()
      await page.waitForTimeout(500)
    }
    await expect(next).toBeDisabled()
  })

  test("position is announced and dots jump to a slide", async ({ page }) => {
    await page.goto("/")
    const dots = page.getByRole("button", { name: /^Go to item/ })
    expect(await dots.count()).toBeGreaterThan(1)

    await dots.last().scrollIntoViewIfNeeded()
    await dots.last().click()
    await page.waitForTimeout(700)
    await expect(dots.last()).toHaveAttribute("aria-current", "true")
  })
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
