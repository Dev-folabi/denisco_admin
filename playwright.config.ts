import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests for the management console, run against the built app and a
 * live API.
 *
 * They need an administrator to sign in as. Create one with the backend's
 * seeding script and pass the credentials in:
 *
 *   cd ../denisco_backend
 *   ADMIN_PASSWORD='…' go run ./scripts/seed-admin -email admin@denisco.test
 *   cd ../denisco_admin
 *   E2E_ADMIN_EMAIL=admin@denisco.test E2E_ADMIN_PASSWORD='…' npm run test:e2e
 *
 * Run the API with RATE_LIMIT_ENABLED=false: the suite signs in on every spec,
 * and the login limiter is five attempts a minute.
 */

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3001";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default defineConfig({
  testDir: "./e2e",
  // The specs create, edit and delete catalogue entries against one API, so
  // they run in order rather than racing each other.
  workers: 1,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
      testIgnore: /responsive\.spec\.ts/,
    },
    {
      name: "mobile",
      // The sidebar becomes a sliding overlay at 1024px and narrows again at
      // 760px; 390 × 844 is inside both.
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
      testMatch: /responsive\.spec\.ts/,
    },
  ],

  webServer: {
    command: "npm run start",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_API_URL: API_URL,
      NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000",
    },
  },
});
