import { z } from "zod"

export const expenseSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z.string().max(255).optional(),
  expense_date: z.string().min(1, "Date is required"),
  category_id: z
    .string()
    .min(1, "Category is required")
    .refine((v) => !isNaN(parseInt(v)), { message: "Invalid category" }),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>