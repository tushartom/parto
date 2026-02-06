import { z } from "zod";

/**
 * Lead Schema: The "Source of Truth" for buyer requirements.
 * This ensures every lead captured has the necessary vehicle and
 * contact details for suppliers to provide accurate quotes.
 */
export const leadSchema = z.object({
  // Step 1: Vehicle Details
  make: z.string().min(1, "Please select a brand"),
  model: z.string().min(1, "Please select a model"),
  year: z.string().min(1, "Year is required"),

  // Step 1: Part Selection
  parts: z.array(z.string()).min(1, "Add at least one part to your request"),

  condition: z.enum(["New", "Used", "Doesn't matter"], {
    errorMap: () => ({ message: "Please select part condition" }),
  }),

  // Step 2: Verification & Delivery
  location: z
    .string()
    .min(2, "Enter a valid city name")
    .max(50, "City name is too long"),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  // Note: We assume +91 is handled in the UI and store only the 10 digits
});
