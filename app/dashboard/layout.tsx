import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { isAdminUser } from "@/lib/admin"
import { Settings } from "lucide-react"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId } = await auth()
  const isAdmin = userId ? await isAdminUser(userId) : false

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                📚 Microlearning Coach
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link href="/lessons" className="nav-link">
                  Lessons
                </Link>
                <Link href="/progress" className="nav-link">
                  Progress
                </Link>
                <Link href="/achievements" className="nav-link">
                  Achievements
                </Link>
                <Link href="/bookmarks" className="nav-link">
                  Bookmarks
                </Link>
                <Link href="/profile" className="nav-link">
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link href="/admin" className="btn btn-secondary flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
