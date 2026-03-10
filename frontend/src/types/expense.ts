export interface Expense {
  id: number
  amount: number
  description: string | null
  expense_date: string
  created_at: string
  category_id: number
  user_id?: number
}

export interface ExpenseCreate {
  amount: number
  description?: string
  expense_date: string
  category_id: number
}

export interface ExpenseUpdate {
  amount?: number
  description?: string
  expense_date?: string
  category_id?: number
}