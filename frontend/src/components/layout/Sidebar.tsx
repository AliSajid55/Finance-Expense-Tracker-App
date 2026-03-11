"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout, getProfile } from "@/hooks/useAuth"
import { useTheme } from "@/lib/theme"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/expenses", label: "Expenses", icon: "💸" },
  { href: "/dashboard/categories", label: "Categories", icon: "🏷️" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
  { href: "/profile", label: "Profile", icon: "👤" },
]

interface UserInfo {
  full_name: string | null
  email: string
}

function getInitial(info: UserInfo | null): string {
  if (!info) return "?"
  if (info.full_name) return info.full_name.trim()[0].toUpperCase()
  return info.email[0].toUpperCase()
}

export default function Sidebar() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const isProfileActive = pathname === "/profile"
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    getProfile()
      .then((data) => setUser({ full_name: data.full_name, email: data.email }))
      .catch(() => {})
  }, [])

  const initial = getInitial(user)

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm select-none" style={{ background: "linear-gradient(135deg, #2563eb 0%, #10b981 100%)" }}>
            FT
          </div>
          <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">ExpenseTracker</h1>
        </div>

        {/* Logged-in user info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base uppercase shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight">
              {user?.full_name || user?.email?.split("@")[0] || "..."}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
        {/* Theme toggle — shown below Profile nav item */}
        <button
          onClick={toggle}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <span className="text-lg">{theme === "light" ? "🌙" : "☀️"}</span>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>

        {/* Sign Out — only visible when Profile page is active */}
        {isProfileActive && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <span>🚪</span>
            Logout
          </button>
        )}
      </div>
    </aside>
  )
}
