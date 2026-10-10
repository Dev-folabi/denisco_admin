import { expect, test } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD, signIn } from "./helpers";

test.describe("admin access", () => {
  test("signs in and lands on the dashboard", async ({ page }) => {
    await signIn(page);

    // The six stat cards from the plan, and the sales chart.
    await expect(page.getByText("Total Revenue")).toBeVisible();
    await expect(page.getByText("Total Orders")).toBeVisible();
    await expect(page.getByText("Total Customers")).toBeVisible();
    await expect(page.getByText("Consultation Bookings")).toBeVisible();
    await expect(page.locator("canvas")).toBeVisible();
  });

  test("refuses a wrong password", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email Address").fill(ADMIN_EMAIL);
    await page.getByLabel("Password", { exact: true }).fill("not-the-password");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByText(/incorrect|invalid/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("sends an unauthenticated visitor to the login page", async ({ page }) => {
    await page.goto("/orders");
    await expect(page).toHaveURL(/\/login/);
  });

  test("keeps the session across a reload, from the refresh cookie alone", async ({
    page,
  }) => {
    await signIn(page);

    // The access token lives in memory, so this proves the cookie-based
    // restore the plan describes.
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText("Total Revenue")).toBeVisible();
  });

  test("signs out and will not come back without signing in", async ({ page }) => {
    await signIn(page);

    await page.getByRole("button", { name: /Logout/i }).first().click();
    const confirm = page.getByRole("button", { name: /Yes|Continue|Logout/i }).last();
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
    }

    await expect(page).toHaveURL(/\/login/, { timeout: 20_000 });

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
