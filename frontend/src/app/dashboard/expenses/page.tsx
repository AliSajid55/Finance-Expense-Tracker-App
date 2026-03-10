"use client"

import { useState } from "react"
import { useExpenses } from "@/hooks/useExpenses"
import { useCategories } from "@/hooks/useCategories"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Expense } from "@/types/expense"
import Modal from "@/components/ui/Modal"

type FormState = {
  amount: string
  description: string
  expense_date: string
  category_id: string
}

const empty: FormState = { amount: "", description: "", expense_date: "", category_id: "" }

export default function ExpensesPage() {
  const { expenses, loading, addExpense, editExpense, removeExpense } = useExpenses()
  const { categories } = useCategories()

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Expense | null>(null)
  const [form, setForm] = useState<FormState>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  function openAdd() {
    setEditTarget(null)
    setForm(empty)
    setError("")
    setShowModal(true)
  }

  function openEdit(expense: Expense) {
    setEditTarget(expense)
    setForm({
      amount: String(expense.amount),
      description: expense.description || "",
      expense_date: expense.expense_date,
      category_id: String(expense.category_id),
    })
    setError("")
    setShowModal(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const payload = {
        amount: parseFloat(form.amount),
        description: form.description || undefined,
        expense_date: form.expense_date,
        category_id: parseInt(form.category_id),
      }
      if (editTarget) {
        await editExpense(editTarget.id, payload)
      } else {
        await addExpense(payload)
      }
      setShowModal(false)
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to save expense")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this expense?")) return
    await removeExpense(id)
  }

  const filtered = filterCategory
    ? expenses.filter((e) => String(e.category_id) === filterCategory)
    : expenses

  const getCategoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name || "—"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-500 mt-1">Manage all your expenses</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          + Add Expense
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        {filterCategory && (
          <button onClick={() => setFilterCategory("")} className="text-sm text-gray-500 hover:text-gray-700">
            Clear filter
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading expenses...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-4xl mb-2">💸</p>
            <p>No expenses found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Description</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-right px-6 py-3 text-gray-500 font-medium">Amount</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-500">{formatDate(expense.expense_date)}</td>
                  <td className="px-6 py-3 text-gray-800">{expense.description || <span className="text-gray-400 italic">No description</span>}</td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {getCategoryName(expense.category_id)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-red-500">
                    -{formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(expense)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(expense.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editTarget ? "Edit Expense" : "Add Expense"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Amount (PKR)</label>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Description</label>
              <input
                name="description"
                type="text"
                placeholder="Optional"
                value={form.description}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Date</label>
              <input
                name="expense_date"
                type="date"
                value={form.expense_date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? "Saving..." : editTarget ? "Update" : "Add Expense"}
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
