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
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <Link href="/dashboard">
            <h2>Microlearning Coach</h2>
          </Link>
        </div>

        <div className="nav-links">
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

          {userIsAdmin && (
            <Link href="/admin" className="nav-link admin-link">
              Admin Panel
            </Link>
          )}
        </div>

        <div className="nav-user">
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="dashboard-main">{children}</main>
    </div>
  )
}
