import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="navbar bg-white">
        <div className="container navbar-content">
          <Link href="/dashboard" className="logo">
            🎯 Microlearning Coach
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/lessons" className="nav-link">
              Lessons
            </Link>
            <Link href="/progress" className="nav-link">
              Progress
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav>
            <ul className="sidebar-nav">
              <li>
                <Link href="/dashboard" className="active">
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link href="/lessons">📚 Browse Lessons</Link>
              </li>
              <li>
                <Link href="/progress">📈 My Progress</Link>
              </li>
              <li>
                <Link href="/achievements">🏆 Achievements</Link>
              </li>
              <li>
                <Link href="/settings">⚙️ Settings</Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="container">{children}</div>
        </main>
      </div>
    </div>
  )
}
