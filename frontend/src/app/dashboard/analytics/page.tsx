"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { useCategories } from "@/hooks/useCategories"
import { Expense } from "@/types/expense"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"]

export default function AnalyticsPage() {
  const { categories } = useCategories()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [exRes, totalRes] = await Promise.all([
          api.get("/expenses"),
          api.get("/analytics/monthly-total"),
        ])
        setExpenses(exRes.data)
        setTotal(totalRes.data.total_expenses || 0)
      } catch {
        // silently handle errors
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Category-wise totals
  const categoryData = categories
    .map((cat) => {
      const catTotal = expenses
        .filter((e) => e.category_id === cat.id)
        .reduce((sum, e) => sum + Number(e.amount), 0)
      return { name: cat.name, total: catTotal }
    })
    .filter((c) => c.total > 0)

  // Monthly breakdown (group by month from expense_date)
  const monthlyMap: Record<string, number> = {}
  expenses.forEach((e) => {
    const month = e.expense_date.slice(0, 7)
    monthlyMap[month] = (monthlyMap[month] || 0) + Number(e.amount)
  })
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }))

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Loading analytics...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Visualize your spending patterns</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <p className="text-sm text-gray-500 mb-1">Total Spent</p>
          <p className="text-3xl font-bold text-red-500">{formatCurrency(total)}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
          <p className="text-3xl font-bold text-blue-600">{expenses.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500 mb-1">Categories Used</p>
          <p className="text-3xl font-bold text-green-600">{categoryData.length}</p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">📊</p>
          <p>No data to show. Add some expenses first!</p>
        </div>
      ) : (
        <>
          {/* Monthly Bar Chart */}
          {monthlyData.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Monthly Spending</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Amount"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Category Pie Chart */}
          {categoryData.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Spending by Category</h2>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category breakdown table */}
              <div className="mt-6 space-y-2">
                {categoryData
                  .sort((a, b) => b.total - a.total)
                  .map((cat, i) => (
                    <div key={cat.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(cat.total)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
