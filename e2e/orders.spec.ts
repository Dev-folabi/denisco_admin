import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

test.describe("orders and customers", () => {
  // The fulfillment state machine only moves forward, so this test consumes
  // whatever it advances: an order it moves to "processing" is no longer
  // "pending" on the next run. It therefore picks a status that still has
  // orders in it rather than assuming one does, which is what makes it
  // survive repeated runs against the same database.
  const NEXT_STATUS: Record<string, string> = {
    pending: "processing",
    processing: "dispatched",
    dispatched: "completed",
  };

  test("opens an order and moves it through fulfillment", async ({ page }) => {
    await signIn(page);
    await page.goto("/orders");

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 20_000 });

    const filter = page.getByRole("combobox");

    let from = "";
    for (const candidate of Object.keys(NEXT_STATUS)) {
      await filter.selectOption(candidate);
      // The filter runs on the API, so give the table a moment to come back
      // before deciding this status is empty.
      const found = await expect
        .poll(async () => rows.count(), { timeout: 8_000 })
        .toBeGreaterThan(0)
        .then(() => true)
        .catch(() => false);

      if (found) {
        from = candidate;
        break;
      }
    }

    expect(
      from,
      "no order is open to being advanced; place one through the storefront first",
    ).not.toBe("");

    const to = NEXT_STATUS[from];

    await rows.first().getByRole("link", { name: /View/i }).click();
    await expect(page).toHaveURL(/\/orders\/[a-f0-9]+$/);

    // The detail page shows the order's own numbers and its two statuses.
    await expect(page.getByText(/DG-\d{6}/).first()).toBeVisible();
    await expect(page.getByText("Update Fulfillment")).toBeVisible();

    await page.getByRole("combobox").selectOption(to);
    await page.getByRole("button", { name: "Update Status" }).click();

    await expect(page.getByText(new RegExp(`updated to ${to}`, "i"))).toBeVisible({
      timeout: 20_000,
    });

    // The change is on the record, not just on the screen: a reload shows it.
    await page.reload();
    await expect(
      page.getByText(new RegExp(to, "i")).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test("searches orders by number", async ({ page }) => {
    await signIn(page);
    await page.goto("/orders");

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 20_000 });

    // Read the order number from its own cell: pulled out of the whole row,
    // a value runs into the one beside it.
    const number = (
      await rows.first().locator("td").first().textContent()
    )?.trim();
    expect(number).toMatch(/DG-\d{6}/);

    await page.getByPlaceholder(/Search orders/i).fill(number!);

    await expect
      .poll(async () => rows.count(), { timeout: 15_000 })
      .toBeGreaterThan(0);
    await expect(rows.first()).toContainText(number!);
  });

  test("searches customers and opens one", async ({ page }) => {
    await signIn(page);
    await page.goto("/customers");

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 20_000 });

    // The email is the second column; taking it from the whole row's text
    // would run the name into it.
    const email = (
      await rows.first().locator("td").nth(1).textContent()
    )?.trim();
    expect(email).toMatch(/@/);

    await page.getByPlaceholder(/Search customers/i).fill(email!);
    await expect
      .poll(async () => rows.count(), { timeout: 15_000 })
      .toBeGreaterThan(0);
    await expect(rows.first()).toContainText(email!);

    await rows.first().getByRole("link", { name: /View/i }).click();
    await expect(page).toHaveURL(/\/customers\/[a-f0-9]+$/);

    // Profile and purchase summary, as the plan's two-column grid.
    await expect(page.getByText(email!).first()).toBeVisible();
    await expect(page.getByText(/Total Orders|Total Spent/i).first()).toBeVisible();
  });
});
