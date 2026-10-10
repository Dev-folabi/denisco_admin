import { expect, type Page } from "@playwright/test";

/**
 * Signing in is the first thing every management spec does, because every page
 * is behind the admin guard.
 */

export const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@denisco.test";
export const ADMIN_PASSWORD =
  process.env.E2E_ADMIN_PASSWORD ?? "e2e-admin-secret-1";

/** Signs in through the login form and waits for the dashboard. */
export async function signIn(page: Page): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email Address").fill(ADMIN_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
}

/** A name that will not collide with an earlier run's leftovers. */
export function uniqueName(prefix: string): string {
  return `${prefix} ${Date.now().toString().slice(-6)}`;
}
