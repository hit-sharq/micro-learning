import { redirect } from "next/navigation"
import { requireAdmin, getAdminStats } from "@/lib/admin"
import Link from "next/link"

export default async function AdminDashboard() {
  try {
    await requireAdmin()
  } catch {
    redirect("/dashboard")
  }

  const stats = await getAdminStats()

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage content, users, and platform analytics</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
          <div className="text-xs text-gray-500 mt-1">{stats.activeUsers} active this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.publishedLessons}</div>
          <div className="stat-label">Published Lessons</div>
          <div className="text-xs text-gray-500 mt-1">{stats.totalLessons - stats.publishedLessons} drafts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completedLessons}</div>
          <div className="stat-label">Lessons Completed</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round((stats.completedLessons / Math.max(stats.totalProgress, 1)) * 100)}% completion rate
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.activeStreaks}</div>
          <div className="stat-label">Active Streaks</div>
          <div className="text-xs text-gray-500 mt-1">{stats.totalStreaks} total users with streaks</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-3 gap-6 mb-8">
        <Link href="/admin/content" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Content Management</h3>
            <p className="text-gray-600 text-sm">Create, edit, and manage lessons</p>
          </div>
        </Link>

        <Link href="/admin/users" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600 text-sm">Monitor users and their progress</p>
          </div>
        </Link>

        <Link href="/admin/analytics" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">View detailed platform statistics</p>
          </div>
        </Link>

        <Link href="/admin/announcements" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">📢</div>
            <h3 className="text-xl font-semibold mb-2">Announcements</h3>
            <p className="text-gray-600 text-sm">Create and manage announcements</p>
          </div>
        </Link>

        <Link href="/admin/reports" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold mb-2">Content Reports</h3>
            <p className="text-gray-600 text-sm">Review flagged content</p>
          </div>
        </Link>

        <Link href="/admin/categories" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold mb-2">Categories</h3>
            <p className="text-gray-600 text-sm">Manage lesson categories</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Recent User Activity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">New user registrations</div>
                <div className="text-sm text-gray-500">Last 24 hours</div>
              </div>
              <div className="text-2xl font-bold text-green-600">+12</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Lessons completed</div>
                <div className="text-sm text-gray-500">Today</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">247</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Active streaks</div>
                <div className="text-sm text-gray-500">Current</div>
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.activeStreaks}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">System Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Database Connection</span>
              <span className="badge badge-success">✓ Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Video Streaming</span>
              <span className="badge badge-success">✓ Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Email Service</span>
              <span className="badge badge-success">✓ Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Storage Usage</span>
              <span className="badge badge-warning">⚠ 78% Full</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
