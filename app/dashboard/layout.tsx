import type React from "react"
import { auth } from "@/auth"
import { isAdminUser } from "@/lib/admin"
import { Settings } from "lucide-react"
import Link from "next/link"

import { MainNav } from "@/components/main-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { siteConfig } from "@/config/site"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId } = await auth()
  const isAdmin = userId ? isAdminUser(userId) : false

  const sidebarNavItems = siteConfig.sidebarNavItems

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/documentation" className="text-sm font-medium underline underline-offset-4">
              Documentation
            </Link>
            <Link href="/examples" className="text-sm font-medium underline underline-offset-4">
              Examples
            </Link>
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <SidebarNav items={sidebarNavItems} />
          <div className="py-4">
            {/* Admin Link - only show for admins */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors group"
              >
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="font-medium">Admin Panel</span>
              </Link>
            )}
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
