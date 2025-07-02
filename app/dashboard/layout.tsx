import type React from "react"
import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { isAdmin } from "@/lib/admin"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  const userIsAdmin = await isAdmin()

  if (!userId) {
    return null
  }

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <Link href="/dashboard" className="nav-brand">
          <h2>Microlearning Coach</h2>
        </Link>

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
          <Link href="/profile" className="nav-link">
            Profile
          </Link>
          {userIsAdmin && (
            <Link href="/admin" className="nav-link admin-link">
              Admin Panel
            </Link>
          )}
          <UserButton />
        </div>
      </nav>

      <main className="dashboard-main">{children}</main>
    </div>
  )
}
