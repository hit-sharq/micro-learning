import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { isAdminUser } from "@/lib/admin"
import {
  BarChart3, BookOpen, Trophy, Bookmark, User, Settings,
  Flame, Target, Clock, TrendingUp, ChevronRight, Zap,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: BarChart3 },
  { href: "/lessons",    label: "Lessons",    Icon: BookOpen },
  { href: "/progress",   label: "Progress",   Icon: TrendingUp },
  { href: "/achievements", label: "Achievements", Icon: Trophy },
  { href: "/bookmarks",  label: "Bookmarks",  Icon: Bookmark },
  { href: "/profile",    label: "Profile",    Icon: User },
]

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId } = await auth()
  const isAdmin = userId ? await isAdminUser(userId) : false

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex">

        {/* ═══════ SIDEBAR ═══════ */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen sticky top-0 border-r border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">ML</span>
              <span className="text-slate-600 dark:text-slate-400"> Coach</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navItems.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group"
              >
                <Icon className="w-4.5 h-4.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Admin link at bottom */}
          {isAdmin && (
            <div className="px-3 pb-4 border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all"
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </Link>
            </div>
          )}
        </aside>

        {/* ═══════ MAIN COLUMN ═══════ */}
        <div className="flex-1 min-w-0">

          {/* Mobile top bar */}
          <header className="lg:hidden sticky top-0 z-40 h-14 px-4 flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white">ML Coach</span>
            </Link>
            <nav className="flex items-center gap-1 overflow-x-auto">
              {navItems.map(({ href, label }) => (
                <Link key={href} href={href} className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap hover:bg-indigo-50 dark:hover:bg-indigo-500/10">{label}</Link>
              ))}
            </nav>
          </header>

          <main className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
