"use client"

import { useEffect, useState } from "react"
import { getProfile, logout } from "@/hooks/useAuth"
import { formatDate } from "@/lib/utils"

interface UserProfile {
  id: number
  email: string
  full_name: string | null
  is_active: boolean
  created_at: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-16 text-gray-400">Failed to load profile.</div>
    )
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your account information</p>
      </div>

      <div className="card space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold uppercase">
            {profile.full_name ? profile.full_name.trim()[0] : profile.email[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{profile.full_name || "—"}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{profile.email}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Account ID</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">#{profile.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
            <span className={`text-sm font-medium ${profile.is_active ? "text-green-600" : "text-red-500"}`}>
              {profile.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Member since</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatDate(profile.created_at)}</span>
          </div>
        </div>
      </div>

      <button onClick={logout} className="btn-danger">
        Sign Out
      </button>
    </div>
  )
}
