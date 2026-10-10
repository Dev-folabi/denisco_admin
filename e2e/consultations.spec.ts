import { expect, test } from "@playwright/test";
import { signIn, uniqueName } from "./helpers";

test.describe("consultations", () => {
  test("creates and deletes a consultation type", async ({ page }) => {
    await signIn(page);
    await page.goto("/consultations");

    const name = uniqueName("E2E Soil Advisory");

    await page.getByRole("button", { name: "Add Type" }).click();
    const form = page.getByRole("dialog");

    await form.getByLabel("Type Name").fill(name);
    await form.getByLabel("Duration (minutes)").fill("45");
    await form.getByLabel("Price ₦").fill("12000");
    await form
      .getByLabel("Description")
      .fill("Created by the end-to-end suite.");
    await form.getByRole("button", { name: "Add Type" }).click();

    const card = page.locator("div", { hasText: name }).last();
    await expect(page.getByText(name).first()).toBeVisible({ timeout: 20_000 });
    await expect(card).toContainText("₦12,000");

    // And it is gone again when deleted, so the suite leaves nothing behind.
    await page.getByLabel(`Delete ${name}`).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /Delete|Yes|Continue/i })
      .last()
      .click();

    await expect(page.getByText(name)).toHaveCount(0, { timeout: 20_000 });
  });

  test("holds a type's duration inside the bookable range", async ({ page }) => {
    await signIn(page);
    await page.goto("/consultations");

    await page.getByRole("button", { name: "Add Type" }).click();
    const form = page.getByRole("dialog");

    await form.getByLabel("Type Name").fill(uniqueName("E2E Too Long"));
    await form.getByLabel("Duration (minutes)").fill("600");
    await form.getByLabel("Price ₦").fill("5000");
    await form.getByRole("button", { name: "Add Type" }).click();

    await expect(
      form.getByText(/between 15 and 480 minutes/i),
    ).toBeVisible();
  });

  test("adds and removes a time from the availability grid", async ({ page }) => {
    await signIn(page);
    await page.goto("/consultations");

    await expect(page.getByText("Time Availability")).toBeVisible();

    // A time the prototype's grid does not use, so it cannot collide with the
    // seeded availability. An earlier interrupted run may have left it behind,
    // so it is cleared first — the suite works against one shared API.
    const leftover = page.getByLabel("Remove 04:30 PM");
    if (await leftover.isVisible().catch(() => false)) {
      await leftover.click();
      await expect(page.getByText("04:30 PM")).toHaveCount(0, {
        timeout: 20_000,
      });
    }

    await page.locator('input[type="time"]').fill("16:30");
    await page.getByRole("button", { name: "Add Time" }).click();

    const chip = page.getByText("04:30 PM");
    await expect(chip).toBeVisible({ timeout: 20_000 });

    await page.getByLabel("Remove 04:30 PM").click();
    await expect(page.getByText("04:30 PM")).toHaveCount(0, {
      timeout: 20_000,
    });
  });

  test("updates a booking's status", async ({ page }) => {
    await signIn(page);
    await page.goto("/consultations");

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 20_000 });

    // The booking table's second-to-last column is the current status, and the
    // last is the dropdown that changes it.
    const row = rows.first();
    const reference = (await row.locator("td").first().textContent())?.trim();
    expect(reference).toMatch(/CB-\d{5}/);

    await row.getByRole("combobox").selectOption("confirmed");

    await expect(row).toContainText("Confirmed", { timeout: 20_000 });

    // The change is on the record: a reload still shows it.
    await page.reload();
    await expect(
      page.getByRole("row", { name: new RegExp(reference!) }),
    ).toContainText("Confirmed", { timeout: 20_000 });
  });
});
