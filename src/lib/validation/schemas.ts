import { z } from "zod";

/**
 * Form schemas for the management screens, mirroring the rules the API
 * enforces.
 *
 * The API validates every request again — these exist so an administrator is
 * told what is wrong before a round trip, and so the bounds live in one place
 * instead of inline in each modal. They come from
 * `consultations/application/service.go` and `products/domain/product.go`.
 */

const trimmed = z.string().trim();

/**
 * A number typed into a form field. The inputs give strings, and an empty one
 * must read as "missing" rather than as zero — which is how an empty price
 * field would otherwise reach the API as free of charge.
 */
function numeric(label: string) {
  return trimmed.min(1, `${label} is required`).refine(
    (value) => Number.isFinite(Number(value)),
    { message: `${label} must be a number` },
  );
}

/** A consultation type, as the modal on the consultations page submits it. */
export const consultationTypeSchema = z
  .object({
    name: trimmed
      .min(1, "Please enter a name for the consultation type")
      .max(120, "The name must be 120 characters or fewer"),
    // Minutes, as the duration field is labelled.
    duration: numeric("Duration"),
    // Naira, which the page converts to kobo before sending.
    price: numeric("Price"),
    description: trimmed.max(
      1000,
      "The description must be 1000 characters or fewer",
    ),
  })
  .superRefine((values, ctx) => {
    const duration = Number(values.duration);
    if (!Number.isInteger(duration) || duration < 15 || duration > 480) {
      ctx.addIssue({
        code: "custom",
        path: ["duration"],
        message: "Duration must be a whole number between 15 and 480 minutes",
      });
    }

    const price = Number(values.price);
    if (price < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Price cannot be negative",
      });
    }
    // The API's ceiling is 10,000,000,000 kobo; the form is in naira.
    if (price > 100_000_000) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Price is unrealistically large",
      });
    }
  });

export type ConsultationTypeValues = z.infer<typeof consultationTypeSchema>;

/** A product, as the add and edit modal on the products page submits it. */
export const productSchema = z
  .object({
    name: trimmed
      .min(1, "Please enter a product name")
      .max(120, "The name must be 120 characters or fewer"),
    category: trimmed.min(1, "Please choose a category"),
    unit: trimmed
      .min(1, "Please enter the selling unit, such as bird or 100kg bag")
      .max(40, "The unit must be 40 characters or fewer"),
    // Naira in the form, kobo on the wire.
    price: numeric("Price"),
    stock: numeric("Stock quantity"),
    description: trimmed.max(
      2000,
      "The description must be 2000 characters or fewer",
    ),
  })
  .superRefine((values, ctx) => {
    const price = Number(values.price);
    if (price <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Price must be greater than zero",
      });
    }

    const stock = Number(values.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["stock"],
        message: "Stock must be a whole number, and cannot be negative",
      });
    }
  });

export type ProductValues = z.infer<typeof productSchema>;

/** Changing one's own password, from the settings page. */
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Please enter your current password"),
    new_password: z
      .string()
      .min(8, "The new password must be at least 8 characters")
      .max(72, "The new password must be 72 characters or fewer"),
    confirm_password: z.string(),
  })
  .refine((values) => values.new_password === values.confirm_password, {
    path: ["confirm_password"],
    message: "The new passwords do not match",
  })
  .refine((values) => values.new_password !== values.current_password, {
    path: ["new_password"],
    message: "The new password must be different from the current one",
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

/**
 * Returns the first problem with a form, as a sentence for the message above
 * it — the management modals show one at a time.
 */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}
