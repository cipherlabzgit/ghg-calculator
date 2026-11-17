import { z } from "zod";

export const organisationSchema = z.object({
  name: z.string().min(1, "Enter the organisation name"),
  country: z.string().min(1, "Choose a country"),
  city: z.string().optional(),
  period: z.string().min(1, "Enter the year, for example 2024"),
  employees: z
    .string()
    .optional()
    .refine((value) => !value || Number(value) >= 0, "Employees cannot be negative"),
});

export const positiveAmount = z
  .string()
  .min(1, "Enter an amount")
  .refine((value) => Number(value) >= 0, "Amount cannot be negative");

export const percentSchema = z
  .string()
  .min(1, "Enter a percentage")
  .refine((value) => {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 && n <= 100;
  }, "Use a value between 0 and 100");
