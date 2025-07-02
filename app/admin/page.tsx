import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Users, BookOpen, BarChart3, Megaphone, TrendingUp, Clock, Award, Activity } from "lucide-react"

async function getAdminStats() {
  try {
    const [totalUsers, totalLessons, totalProgress, recentActivity] = await Promise.all([
      prisma.user.count(),
      prisma.lesson.count(),
      prisma.userProgress.count({ where: { completed: true } }),
      prisma.userProgress.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          lesson: { select: { title: true } },
        },
      }),
    ])

    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    })

    return {
      totalUsers,
      totalLessons,
      totalProgress,
      activeUsers,
      recentActivity,
      avgCompletionRate: totalUsers > 0 ? Math.round((totalProgress / totalUsers) * 100) / 100 : 0,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      totalUsers: 0,
      totalLessons: 0,
      totalProgress: 0,
      activeUsers: 0,
      recentActivity: [],
      avgCompletionRate: 0,
    }
  }
}

export default async function AdminPage() {
  console.log("Admin page loading...")

  const { userId } = await auth()
  console.log("Admin page - User ID:", userId)

  if (!userId) {
    console.log("No user ID, redirecting to sign-in")
    redirect("/sign-in")
  }

  const userIsAdmin = await isAdmin()
  console.log("User is admin:", userIsAdmin)

  if (!userIsAdmin) {
    console.log("User is not admin, redirecting to dashboard")
    redirect("/dashboard")
  }

  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info */}
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Debug Info:</h3>
          <p className="text-yellow-700">User ID: {userId}</p>
          <p className="text-yellow-700">Is Admin: {userIsAdmin ? "Yes" : "No"}</p>
          <p className="text-yellow-700">Admin IDs: {process.env.ADMIN_USER_IDS || "Not set"}</p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xl text-gray-600">Manage your microlearning platform</p>
            </div>
          </div>
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <div className="text-blue-100 text-sm">Total Users</div>
              </div>
            </div>
            <div className="text-blue-100 text-sm">{stats.activeUsers} active this week</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalLessons}</div>
                <div className="text-green-100 text-sm">Total Lessons</div>
              </div>
            </div>
            <div className="text-green-100 text-sm">Published content</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalProgress}</div>
                <div className="text-purple-100 text-sm">Completed Lessons</div>
              </div>
            </div>
            <div className="text-purple-100 text-sm">Total completions</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.avgCompletionRate}</div>
                <div className="text-orange-100 text-sm">Avg. Completion Rate</div>
              </div>
            </div>
            <div className="text-orange-100 text-sm">Per user average</div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/admin/content"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Management</h3>
            <p className="text-gray-600 text-sm">Create and manage lessons, categories, and content</p>
          </Link>

          <Link
            href="/admin/users"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600 text-sm">View and manage user accounts and progress</p>
          </Link>

          <Link
            href="/admin/analytics"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">View detailed platform analytics and insights</p>
          </Link>

          <Link
            href="/admin/announcements"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Announcements</h3>
            <p className="text-gray-600 text-sm">Create and manage platform announcements</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Recent Activity</h3>
            <Clock className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{activity.user.name || activity.user.email}</div>
                      <div className="text-sm text-gray-600">Completed: {activity.lesson.title}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(activity.updatedAt).toLocaleDateString()}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
