"use client"

import { useState } from "react"
import { useCategories } from "@/hooks/useCategories"
import { formatDate } from "@/lib/utils"
import Modal from "@/components/ui/Modal"

export default function CategoriesPage() {
  const { categories, loading, addCategory, removeCategory } = useCategories()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters")
      return
    }
    setSaving(true)
    setError("")
    try {
      await addCategory({ name: name.trim() })
      setShowModal(false)
      setName("")
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create category")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this category? Expenses linked to it may be affected.")) return
    await removeCategory(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 mt-1">Organize your expenses into categories</p>
        </div>
        <button onClick={() => { setShowModal(true); setName(""); setError("") }} className="btn-primary">
          + New Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">🏷️</p>
          <p>No categories yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="card flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{category.name}</p>
                <p className="text-xs text-gray-400 mt-1">Created {formatDate(category.created_at)}</p>
              </div>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-400 hover:text-red-600 transition-colors ml-4 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="New Category" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Food, Transport, Shopping"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                autoFocus
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? "Creating..." : "Create"}
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
