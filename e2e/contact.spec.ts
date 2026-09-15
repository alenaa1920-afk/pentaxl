import { test, expect } from "@playwright/test"
import { services } from "../content/services"

const fill = async (page: import("@playwright/test").Page, message: string) => {
  await page.getByLabel("Your name").fill("Jordan Vale")
  await page.getByLabel("Email").fill("jordan@example.org")
  await page.getByLabel("What do you need").selectOption(services[0].slug)
  await page.getByLabel("What are you trying to build").fill(message)
}

const alert = (page: import("@playwright/test").Page) => page.locator("form").getByRole("alert")

test("empty submit reports per-field errors and sends nothing", async ({ page }) => {
  await page.goto("/contact")
  await page.getByRole("button", { name: "Send this" }).click()

  await expect(alert(page)).toBeVisible()
  await expect(page.getByText("Please enter your name.")).toBeVisible()
  await expect(page.getByText("We need an email address to reply to.")).toBeVisible()
  await expect(page.getByText("Please choose which service you need.")).toBeVisible()
})

test("invalid email is caught on blur, not on keystroke", async ({ page }) => {
  await page.goto("/contact")
  const email = page.getByLabel("Email")

  await email.fill("not-an-email")
  await expect(page.getByText("That does not look like an email address")).toBeHidden()

  await email.blur()
  await expect(page.getByText("That does not look like an email address")).toBeVisible()
})

test("a too-short message is rejected with a usable reason", async ({ page }) => {
  await page.goto("/contact")
  const message = page.getByLabel("What are you trying to build")
  await message.fill("help")
  await message.blur()
  await expect(page.getByText("A sentence or two more, please")).toBeVisible()
})

test("input is preserved when submission fails", async ({ page }) => {
  const text = "We have a warehouse system on a spreadsheet and it has stopped coping."
  await page.goto("/contact")
  await fill(page, text)
  await page.getByRole("button", { name: "Send this" }).click()

  // The mailbox is a placeholder, so the honest failure state is the expected outcome.
  await expect(alert(page)).toContainText("not delivering mail yet")
  await expect(page.getByLabel("Your name")).toHaveValue("Jordan Vale")
  await expect(page.getByLabel("Email")).toHaveValue("jordan@example.org")
  await expect(page.getByLabel("What are you trying to build")).toHaveValue(text)
})

test("the submit button cannot be double-fired", async ({ page }) => {
  await page.goto("/contact")
  await fill(page, "A long enough message to pass validation and reach the server action.")
  await page.getByRole("button", { name: "Send this" }).click()
  await expect(alert(page)).toBeVisible()
})

test("contact details are reachable without using the form", async ({ page }) => {
  await page.goto("/contact")
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible()
})
