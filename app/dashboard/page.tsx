import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { BookOpen, Target, Trophy, TrendingUp, Clock, Star, ArrowRight, Flame } from "lucide-react"

async function getUserStats(userId: string) {
  try {
    const [user, totalProgress, recentLessons, userAchievements, totalLessons] = await Promise.all([
      prisma.user.findUnique({
        where: { clerkId: userId },
        include: {
          _count: { select: { progress: true } },
          streaks: true,
        },
      }),
      prisma.userProgress.count({
        where: { userId, completed: true },
      }),
      prisma.userProgress.findMany({
        where: { userId },
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { lesson: { select: { title: true, estimatedDuration: true, type: true } } },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
        take: 3,
      }),
      prisma.lesson.count({ where: { isPublished: true } }),
    ])

    const currentStreak = user?.streaks?.currentStreak || 0
    const completionRate = totalLessons > 0 ? Math.round((totalProgress / totalLessons) * 100) : 0

    return {
      totalProgress,
      currentStreak,
      completionRate,
      recentLessons,
      achievements: userAchievements,
      dailyGoal: user?.dailyGoal || 1,
      totalLessons,
    }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return {
      totalProgress: 0,
      currentStreak: 0,
      completionRate: 0,
      recentLessons: [],
      achievements: [],
      dailyGoal: 1,
      totalLessons: 0,
    }
  }
}

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const stats = await getUserStats(userId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
          <p className="text-xl text-gray-600">Ready to continue your learning journey?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalProgress}</div>
                <div className="text-blue-100 text-sm">Lessons Completed</div>
              </div>
            </div>
            <div className="text-blue-100 text-sm">{stats.totalLessons - stats.totalProgress} remaining</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.currentStreak}</div>
                <div className="text-orange-100 text-sm">Day Streak</div>
              </div>
            </div>
            <div className="text-orange-100 text-sm">Keep it going! 🔥</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.completionRate}%</div>
                <div className="text-green-100 text-sm">Completion Rate</div>
              </div>
            </div>
            <div className="text-green-100 text-sm">Excellent progress!</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.achievements.length}</div>
                <div className="text-purple-100 text-sm">Achievements</div>
              </div>
            </div>
            <div className="text-purple-100 text-sm">Unlock more rewards!</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/lessons"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Lessons</h3>
            <p className="text-gray-600">Discover new topics and continue learning</p>
          </Link>

          <Link
            href="/progress"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">View Progress</h3>
            <p className="text-gray-600">Track your learning journey and stats</p>
          </Link>

          <Link
            href="/achievements"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Achievements</h3>
            <p className="text-gray-600">View your badges and milestones</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">Recent Activity</h3>
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats.recentLessons.length > 0 ? (
                stats.recentLessons.map((progress, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        {progress.lesson.type === "TEXT" && "📄"}
                        {progress.lesson.type === "VIDEO" && "🎥"}
                        {progress.lesson.type === "QUIZ" && "❓"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{progress.lesson.title}</div>
                        <div className="text-sm text-gray-500">
                          {progress.completed ? "✅ Completed" : "📚 In Progress"}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{progress.lesson.estimatedDuration} min</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                  <Link href="/lessons" className="text-blue-600 hover:text-blue-700 font-medium">
                    Start learning now →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">Recent Achievements</h3>
              <Star className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats.achievements.length > 0 ? (
                stats.achievements.map((userAchievement, index) => {
                  const achievement = userAchievement.achievement as {
                    icon?: string
                    name?: string
                    description?: string
                    points?: number
                  }
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                    >
                      <div className="text-3xl">{achievement?.icon || "🏆"}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{achievement?.name || "Achievement"}</div>
                        <div className="text-sm text-gray-600">{achievement?.description || "Great job!"}</div>
                        <div className="text-xs text-orange-600 font-medium">+{achievement?.points || 0} points</div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No achievements yet</p>
                  <Link href="/lessons" className="text-purple-600 hover:text-purple-700 font-medium">
                    Start earning badges →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
