import { z } from "zod";

export const preorderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title is too long"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .regex(/^[A-Z0-9-]+$/, "SKU can only contain uppercase letters, numbers, and hyphens"),
  customer: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Customer name is too long"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
  price: z
    .number()
    .min(0.01, "Price must be at least 0.01"),
  description: z
    .string()
    .max(500, "Description is too long")
    .optional(),
  active: z
    .boolean(),
});

export type PreorderFormValues = z.infer<typeof preorderSchema>;
