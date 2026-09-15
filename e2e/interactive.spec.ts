import { test, expect } from "@playwright/test"
import { services } from "../content/services"

test.describe("service tabs", () => {
  test("keyboard driven: one tab stop, arrows move selection, panel follows", async ({ page }) => {
    await page.goto("/")
    const tabs = page.getByRole("tab")
    await expect(tabs).toHaveCount(services.length)

    // Roving tabindex: exactly one tab is in the tab order.
    expect(await page.locator('[role="tab"][tabindex="0"]').count()).toBe(1)

    await tabs.first().focus()
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true")

    await page.keyboard.press("ArrowRight")
    await expect(tabs.nth(1)).toBeFocused()
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true")
    await expect(tabs.first()).toHaveAttribute("aria-selected", "false")

    // The visible panel is the selected tab's, and only one is visible.
    const panels = page.locator('[role="tabpanel"]:not([hidden])')
    await expect(panels).toHaveCount(1)
    await expect(panels).toContainText(services[1].name)

    await page.keyboard.press("End")
    await expect(tabs.last()).toBeFocused()
    await page.keyboard.press("Home")
    await expect(tabs.first()).toBeFocused()
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
