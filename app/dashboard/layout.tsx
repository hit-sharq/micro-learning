import type React from "react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { isAdmin } from "@/lib/admin"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userIsAdmin = await isAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span className="font-bold text-xl">Microlearning Coach</span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link href="/lessons" className="text-gray-600 hover:text-gray-900 font-medium">
                Lessons
              </Link>
              <Link href="/progress" className="text-gray-600 hover:text-gray-900 font-medium">
                Progress
              </Link>
              <Link href="/achievements" className="text-gray-600 hover:text-gray-900 font-medium">
                Achievements
              </Link>
              <Link href="/bookmarks" className="text-gray-600 hover:text-gray-900 font-medium">
                Bookmarks
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900 font-medium">
                Profile
              </Link>

              {/* Admin Tab - Only show if user is admin */}
              {userIsAdmin && (
                <Link
                  href="/admin"
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Admin Panel
                </Link>
              )}

              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
