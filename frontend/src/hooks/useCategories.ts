import { useState, useEffect, useCallback } from "react"
import api from "../lib/api"
import { Category, CategoryCreate } from "../types/category"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/categories")
      setCategories(res.data)
    } catch {
      setError("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  async function addCategory(data: CategoryCreate) {
    const res = await api.post("/categories", data)
    await fetchCategories()
    return res.data
  }

  async function removeCategory(id: number) {
    await api.delete(`/categories/${id}`)
    await fetchCategories()
  }

  return { categories, loading, error, addCategory, removeCategory, refetch: fetchCategories }
}