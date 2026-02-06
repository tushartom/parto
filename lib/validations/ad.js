import { z } from "zod";

/**
 * Shared Zod Schema for Part Advertisements
 * Syncs with Prisma model and handles Frontend/Backend validation.
 */
export const adSchema = z
  .object({
    // 1. Compatibility & Identification
    brandId: z.string().min(1, "Please select a brand"),
    modelId: z.string().min(1, "Please select a model"),
    categoryId: z.string().min(1, "Please select a category"),

    // Selection logic: either partId or customPartName is usually used
    partId: z.string().nullable().optional(),
    customPartName: z
      .string()
      .max(50, "Custom name is too long")
      .nullable()
      .optional(),

    oemNumber: z
      .string()
      .max(30, "OEM number is too long")
      .nullable()
      .optional(),

    year: z.coerce
      .number()
      .min(1980, "Year must be 1980 or later")
      .max(new Date().getFullYear() + 1, "Invalid year"),

    condition: z.enum(["USED", "NEW", "ANY"], {
      errorMap: () => ({ message: "Select a valid condition" }),
    }),

    // 2. Media (Strictly capped at 2 images)
    images: z
      .array(
        z.object({
          public_id: z.string().min(1),
          url: z.string().url(),
        }),
      )
      .min(1, "At least one image is required")
      .max(2, "You can upload a maximum of 2 images"),

    // 3. Pricing
    price: z.coerce
      .number()
      .positive("Price must be greater than 0")
      .nullable()
      .optional(),

    askForPrice: z.boolean().default(false),

    // 4. Logistics & Notes
    deliveryOption: z.string().min(1, "Please select a delivery option"),

    supplierNote: z
      .string()
      .max(80, "Note must be under 80 characters")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      // If 'Ask for Price' is NOT checked, 'price' MUST be provided
      if (!data.askForPrice && (!data.price || data.price <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Please enter a price or select 'Ask for Price'",
      path: ["price"],
    },
  )
  .refine(
    (data) => {
      // Ensure either a predefined part is selected or a custom name is given
      if (!data.partId && !data.customPartName) {
        return false;
      }
      return true;
    },
    {
      message: "Please select a part or enter a custom name",
      path: ["customPartName"],
    },
  );
