import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

async function getUserStats(userId: string) {
  try {
    const [user, totalProgress, recentLessons, achievements] = await Promise.all([
      prisma.user.findUnique({
        where: { clerkId: userId },
        include: { _count: { select: { progress: true } } },
      }),
      prisma.progress.count({
        where: { userId, completed: true },
      }),
      prisma.progress.findMany({
        where: { userId },
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { lesson: { select: { title: true, estimatedDuration: true } } },
      }),
      prisma.achievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
        take: 3,
      }),
    ])

    const currentStreak = user?.currentStreak || 0
    const totalLessons = await prisma.lesson.count({ where: { isPublished: true } })
    const completionRate = totalLessons > 0 ? Math.round((totalProgress / totalLessons) * 100) : 0

    return {
      totalProgress,
      currentStreak,
      completionRate,
      recentLessons,
      achievements,
      dailyGoal: user?.dailyGoal || 1,
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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalProgress}</div>
          <div className="stat-label">Lessons Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.currentStreak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.achievements.length}</div>
          <div className="stat-label">Achievements</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-3 gap-6 mb-8">
        <Link href="/lessons" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">Browse Lessons</h3>
            <p className="text-gray-600 text-sm">Discover new topics to learn</p>
          </div>
        </Link>

        <Link href="/progress" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-lg font-semibold mb-2">View Progress</h3>
            <p className="text-gray-600 text-sm">Track your learning journey</p>
          </div>
        </Link>

        <Link href="/achievements" className="card hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold mb-2">Achievements</h3>
            <p className="text-gray-600 text-sm">See your accomplishments</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {stats.recentLessons.length > 0 ? (
              stats.recentLessons.map((progress, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{progress.lesson.title}</div>
                    <div className="text-sm text-gray-600">{progress.completed ? "Completed" : "In Progress"}</div>
                  </div>
                  <div className="text-sm text-gray-500">{progress.lesson.estimatedDuration} min</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Recent Achievements</h3>
          </div>
          <div className="space-y-4">
            {stats.achievements.length > 0 ? (
              stats.achievements.map((userAchievement, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="text-2xl">{userAchievement.achievement.icon}</div>
                  <div>
                    <div className="font-medium">{userAchievement.achievement.title}</div>
                    <div className="text-sm text-gray-600">{userAchievement.achievement.description}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No achievements yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
