import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

// This spec runs in the mobile project only (see playwright.config.ts), where
// the viewport is 390 × 844 — inside the 1024px breakpoint at which the
// sidebar becomes a sliding overlay.

test.describe("on a phone", () => {
  test("the sidebar opens from the topbar and closes behind a link", async ({
    page,
  }) => {
    await signIn(page);

    const sidebar = page.locator("aside").first();
    const viewport = page.viewportSize()!;

    // Off-canvas to begin with: present in the DOM, pushed off the left edge.
    await expect
      .poll(async () => (await sidebar.boundingBox())!.x)
      .toBeLessThan(0);

    await page.getByLabel(/Open|Toggle/i).first().click();

    await expect.poll(async () => (await sidebar.boundingBox())!.x).toBe(0);
    await expect(sidebar.getByRole("link", { name: "Orders" })).toBeVisible();

    await sidebar.getByRole("link", { name: "Orders" }).click();
    await expect(page).toHaveURL(/\/orders/);

    // And it slides away again, rather than covering the page it opened.
    await expect
      .poll(async () => (await sidebar.boundingBox())!.x, { timeout: 10_000 })
      .toBeLessThan(0);

    expect(viewport.width).toBeLessThan(1024);
  });

  test("the tables scroll sideways instead of breaking the layout", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/orders");

    await expect(page.locator("tbody tr").first()).toBeVisible({
      timeout: 20_000,
    });

    // The page itself must not scroll sideways…
    const pageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(pageOverflow).toBeLessThanOrEqual(1);

    // …while the table's own wrapper is what scrolls, as the plan's ≤640px
    // rule requires.
    const scrollable = await page
      .locator("table")
      .first()
      .evaluate((table) => {
        const wrapper = table.parentElement!;
        return {
          overflowX: getComputedStyle(wrapper).overflowX,
          scrollable: wrapper.scrollWidth > wrapper.clientWidth,
        };
      });

    expect(["auto", "scroll"]).toContain(scrollable.overflowX);
  });

  test("the dashboard stat cards stack", async ({ page }) => {
    await signIn(page);

    const cards = page.getByText(/Total Revenue|Total Orders/).first();
    await expect(cards).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
