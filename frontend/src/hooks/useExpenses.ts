import { useState, useEffect, useCallback } from "react"
import api from "../lib/api"
import { Expense, ExpenseCreate, ExpenseUpdate } from "../types/expense"

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/expenses")
      setExpenses(res.data)
    } catch {
      setError("Failed to fetch expenses")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  async function addExpense(data: ExpenseCreate) {
    const res = await api.post("/expenses", data)
    await fetchExpenses()
    return res.data
  }

  async function editExpense(id: number, data: ExpenseUpdate) {
    const res = await api.put(`/expenses/${id}`, data)
    await fetchExpenses()
    return res.data
  }

  async function removeExpense(id: number) {
    await api.delete(`/expenses/${id}`)
    await fetchExpenses()
  }

  return { expenses, loading, error, addExpense, editExpense, removeExpense, refetch: fetchExpenses }
}