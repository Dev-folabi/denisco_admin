import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  consultationTypeSchema,
  firstIssue,
  productSchema,
} from "./schemas";

// The management forms take numbers as text, which is where the interesting
// mistakes live: an empty price field reads as zero unless something stops it,
// and "60 mins" is not a duration. These schemas restate the API's bounds so
// an administrator is told before the request goes out.

describe("consultationTypeSchema", () => {
  const valid = {
    name: "Poultry Health & Management Advisory",
    duration: "45",
    price: "10000",
    description: "Advice on flock health, housing and biosecurity.",
  };

  it("accepts a type the prototype lists", () => {
    expect(consultationTypeSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a name", () => {
    const parsed = consultationTypeSchema.safeParse({ ...valid, name: "   " });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(firstIssue(parsed.error)).toMatch(/name/i);
    }
  });

  it("will not let an empty price pass as free of charge", () => {
    const parsed = consultationTypeSchema.safeParse({ ...valid, price: "" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(firstIssue(parsed.error)).toBe("Price is required");
    }
  });

  it("accepts a free consultation when that is deliberate", () => {
    expect(
      consultationTypeSchema.safeParse({ ...valid, price: "0" }).success,
    ).toBe(true);
  });

  it("holds the duration inside the API's 15-to-480-minute window", () => {
    for (const duration of ["10", "600", "0", "-30"]) {
      expect(
        consultationTypeSchema.safeParse({ ...valid, duration }).success,
      ).toBe(false);
    }

    for (const duration of ["15", "60", "480"]) {
      expect(
        consultationTypeSchema.safeParse({ ...valid, duration }).success,
      ).toBe(true);
    }
  });

  it("rejects a duration that is not a number", () => {
    const parsed = consultationTypeSchema.safeParse({
      ...valid,
      duration: "60 mins",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects a negative or absurd price", () => {
    expect(
      consultationTypeSchema.safeParse({ ...valid, price: "-5000" }).success,
    ).toBe(false);
    expect(
      consultationTypeSchema.safeParse({ ...valid, price: "999999999" })
        .success,
    ).toBe(false);
  });

  it("trims what it returns, so a stray space is not stored", () => {
    const parsed = consultationTypeSchema.parse({
      ...valid,
      name: "  Crop Production & Soil Advisory  ",
    });
    expect(parsed.name).toBe("Crop Production & Soil Advisory");
  });
});

describe("productSchema", () => {
  const valid = {
    name: "Broiler Chicken",
    category: "poultry",
    unit: "bird",
    price: "6500",
    stock: "350",
    description: "Healthy, fast-growing broilers raised on our poultry unit.",
  };

  it("accepts a product from the prototype's catalogue", () => {
    expect(productSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a category, which the API resolves to an id", () => {
    expect(productSchema.safeParse({ ...valid, category: "" }).success).toBe(
      false,
    );
  });

  it("requires the selling unit the shop prints beside the price", () => {
    expect(productSchema.safeParse({ ...valid, unit: "" }).success).toBe(false);
  });

  it("refuses a free or negative price", () => {
    for (const price of ["", "0", "-100"]) {
      expect(productSchema.safeParse({ ...valid, price }).success).toBe(false);
    }
  });

  it("accepts nothing in stock, which is how a product is marked sold out", () => {
    expect(productSchema.safeParse({ ...valid, stock: "0" }).success).toBe(
      true,
    );
  });

  it("refuses a fractional or negative stock count", () => {
    for (const stock of ["1.5", "-4", "many"]) {
      expect(productSchema.safeParse({ ...valid, stock }).success).toBe(false);
    }
  });
});

describe("changePasswordSchema", () => {
  it("requires the current password", () => {
    const parsed = changePasswordSchema.safeParse({
      current_password: "",
      new_password: "new-farm-secret",
      confirm_password: "new-farm-secret",
    });
    expect(parsed.success).toBe(false);
  });

  it("requires the new password to be long enough for the API", () => {
    expect(
      changePasswordSchema.safeParse({
        current_password: "farm-secret-1",
        new_password: "short",
        confirm_password: "short",
      }).success,
    ).toBe(false);
  });

  it("catches a mistyped confirmation", () => {
    const parsed = changePasswordSchema.safeParse({
      current_password: "farm-secret-1",
      new_password: "new-farm-secret",
      confirm_password: "new-farm-secrets",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(firstIssue(parsed.error)).toBe("The new passwords do not match");
    }
  });

  it("refuses a change that changes nothing", () => {
    const parsed = changePasswordSchema.safeParse({
      current_password: "farm-secret-1",
      new_password: "farm-secret-1",
      confirm_password: "farm-secret-1",
    });

    expect(parsed.success).toBe(false);
  });
});
