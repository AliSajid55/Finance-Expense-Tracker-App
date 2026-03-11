"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import StatCard from "@/components/ui/StatCard"
import Link from "next/link"

export default function Dashboard() {
  const [total, setTotal] = useState<number>(0)
  const [expenseCount, setExpenseCount] = useState<number>(0)
  const [categoryCount, setCategoryCount] = useState<number>(0)
  const [recentExpenses, setRecentExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [totalRes, expensesRes, categoriesRes] = await Promise.all([
          api.get("/analytics/monthly-total"),
          api.get("/expenses"),
          api.get("/categories"),
        ])
        setTotal(totalRes.data.total_expenses || 0)
        setExpenseCount(expensesRes.data.length)
        setCategoryCount(categoriesRes.data.length)
        setRecentExpenses(expensesRes.data.slice(-5).reverse())
      } catch {
        // handle error silently
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here is your financial overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Expenses" value={formatCurrency(total)} icon="💸" color="blue" />
        <StatCard title="Total Records" value={expenseCount} icon="📋" color="green" />
        <StatCard title="Categories" value={categoryCount} icon="🏷️" color="purple" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Expenses</h2>
          <Link href="/dashboard/expenses" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-2">💸</p>
            <p>No expenses yet.</p>
            <Link href="/dashboard/expenses" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
              Add your first expense
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {expense.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{expense.expense_date}</p>
                </div>
                <span className="text-sm font-semibold text-red-500">
                  -{formatCurrency(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/expenses" className="card hover:shadow-md transition-shadow cursor-pointer block">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl">💸</div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">Manage Expenses</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add, edit, or delete expenses</p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/analytics" className="card hover:shadow-md transition-shadow cursor-pointer block">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-2xl">📈</div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">View Analytics</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly summary and charts</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
