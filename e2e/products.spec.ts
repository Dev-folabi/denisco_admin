import { expect, test } from "@playwright/test";
import { signIn, uniqueName } from "./helpers";

test.describe("products", () => {
  test("creates, edits and deletes a product", async ({ page }) => {
    await signIn(page);
    await page.goto("/products");

    // The list loads before anything is asserted about it: the first request
    // goes out before the session has been restored, and the client retries it.
    await expect(page.locator("tbody tr").first()).toBeVisible({
      timeout: 20_000,
    });

    const name = uniqueName("E2E Guinea Fowl");

    // Create. The modal is a native <dialog>, so scoping to it keeps the
    // "Add Product" in the panel header out of the way.
    await page.getByRole("button", { name: /Add Product/i }).first().click();
    const form = page.getByRole("dialog");

    await form.getByLabel("Product Name").fill(name);
    await form.getByLabel("Category").selectOption("poultry");
    await form.getByLabel("Unit").fill("bird");
    await form.getByLabel("Price ₦").fill("9500");
    await form.getByLabel("Stock Quantity").fill("45");
    await form.getByLabel("Description").fill("Created by the end-to-end suite.");
    await form.getByRole("button", { name: "Add Product" }).click();

    const row = page.getByRole("row", { name: new RegExp(name) });
    await expect(row).toBeVisible({ timeout: 20_000 });
    await expect(row).toContainText("₦9,500");
    await expect(row).toContainText("45");

    // Edit: change the price, which is what the shop charges at checkout.
    await page.getByLabel(`Edit ${name}`).click();
    await form.getByLabel("Price ₦").fill("10500");
    await form.getByRole("button", { name: "Update Product" }).click();

    await expect(page.getByRole("row", { name: new RegExp(name) })).toContainText(
      "₦10,500",
      { timeout: 20_000 },
    );

    // Delete. Nothing has ordered this product, so it goes outright rather
    // than being left behind as an archived row — and the dashboard says so.
    // The other half of the rule, a product with orders being archived
    // instead, needs a real order to exist: it is covered deterministically by
    // TestRemovingAnOrderedProductArchivesIt in the backend's integration
    // suite, which can place one.
    await page.getByLabel(`Delete ${name}`).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Delete Product" })
      .click();

    await expect(page.getByText(new RegExp(`"${name}" was deleted`))).toBeVisible(
      { timeout: 20_000 },
    );
    await expect(page.getByRole("row", { name: new RegExp(name) })).toHaveCount(
      0,
    );
  });

  test("refuses a product with no price before calling the API", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/products");
    await expect(page.locator("tbody tr").first()).toBeVisible({
      timeout: 20_000,
    });

    await page.getByRole("button", { name: /Add Product/i }).first().click();
    const form = page.getByRole("dialog");

    await form.getByLabel("Product Name").fill(uniqueName("E2E Incomplete"));
    await form.getByLabel("Unit").fill("bird");
    await form.getByLabel("Stock Quantity").fill("5");
    // Zero passes the input's own min="0", so this is the schema's catch: a
    // product cannot be sold for nothing.
    await form.getByLabel("Price ₦").fill("0");
    await form.getByRole("button", { name: "Add Product" }).click();

    await expect(
      form.getByText(/price must be greater than zero/i),
    ).toBeVisible();
  });

  test("searches the catalogue", async ({ page }) => {
    await signIn(page);
    await page.goto("/products");
    await expect(page.locator("tbody tr").first()).toBeVisible({
      timeout: 20_000,
    });

    await page.getByPlaceholder(/Search products/i).fill("broiler");

    // The search runs on the API, so the table reloads; wait for it to settle
    // before reading the rows.
    await expect
      .poll(async () => page.locator("tbody tr").count(), { timeout: 15_000 })
      .toBeGreaterThan(0);

    const names = await page
      .locator("tbody tr td:nth-child(2)")
      .allTextContents();

    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain("broiler");
    }
  });
});
