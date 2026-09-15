import { defineConfig, devices } from "@playwright/test"

const PORT = 3210
const baseURL = `http://127.0.0.1:${PORT}`

/**
 * Runs against a production build, not the dev server — dev has extra scripts and
 * different timing, so an accessibility or performance result from it means little.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // The form's real limit is 5 per hour per IP. Every test submits from 127.0.0.1, so
    // without this the suite rate-limits itself and later specs fail for the wrong reason.
    env: { CONTACT_RATE_LIMIT_MAX: "1000" },
  },
})
