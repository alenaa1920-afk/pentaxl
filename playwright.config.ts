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
  // Every page paints two full-viewport WebGL canvases, which headless renders in
  // software. More workers than this and the shader-heavy specs time out on the
  // machine rather than on anything the site is doing wrong.
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    // Default to reduced motion. A full-screen WebGL backdrop plus several infinite
    // CSS loops make headless runs slow and non-deterministic — elements never reach
    // Playwright's "stable" state. Tests that assert motion create their own context
    // with reducedMotion: "no-preference".
    reducedMotion: "reduce",
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
