import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

async function getAdminStats() {
  try {
    const [totalUsers, totalLessons, totalProgress, recentActivity] = await Promise.all([
      prisma.user.count(),
      prisma.lesson.count(),
      prisma.progress.count({ where: { completed: true } }),
      prisma.progress.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          lesson: { select: { title: true } },
        },
      }),
    ])

    return {
      totalUsers,
      totalLessons,
      totalProgress,
      recentActivity,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      totalUsers: 0,
      totalLessons: 0,
      totalProgress: 0,
      recentActivity: [],
    }
  }
}

export default async function AdminPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const userIsAdmin = await isAdmin()

  if (!userIsAdmin) {
    redirect("/dashboard")
  }

  const stats = await getAdminStats()

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your microlearning platform</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalLessons}</div>
          <div className="stat-label">Total Lessons</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalProgress}</div>
          <div className="stat-label">Completed Lessons</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.round((stats.totalProgress / (stats.totalUsers || 1)) * 100) / 100}</div>
          <div className="stat-label">Avg. Completion Rate</div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-2 gap-6 mb-8">
        <Link href="/admin/content" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Content Management</h3>
            <p className="text-gray-600">Create and manage lessons, categories, and content</p>
          </div>
        </Link>

        <Link href="/admin/users" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">View and manage user accounts and progress</p>
          </div>
        </Link>

        <Link href="/admin/analytics" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">View detailed platform analytics and insights</p>
          </div>
        </Link>

        <Link href="/admin/announcements" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">📢</div>
            <h3 className="text-xl font-semibold mb-2">Announcements</h3>
            <p className="text-gray-600">Create and manage platform announcements</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{activity.user.name || activity.user.email}</div>
                  <div className="text-sm text-gray-600">Completed: {activity.lesson.title}</div>
                </div>
                <div className="text-sm text-gray-500">{new Date(activity.updatedAt).toLocaleDateString()}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}
