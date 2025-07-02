import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"

async function getDashboardData(userId: string) {
  // In a real app, this would fetch from your database
  return {
    user: {
      name: "John Doe",
      totalLessons: 45,
      completedLessons: 32,
      currentStreak: 7,
      longestStreak: 15,
    },
    recentLessons: [
      { id: 1, title: "JavaScript Basics", completed: true, score: 95 },
      { id: 2, title: "React Components", completed: true, score: 88 },
      { id: 3, title: "CSS Flexbox", completed: false, score: null },
    ],
    categories: [
      { id: 1, name: "Programming", progress: 75, color: "#3B82F6" },
      { id: 2, name: "Data Science", progress: 45, color: "#8B5CF6" },
      { id: 3, name: "Design", progress: 30, color: "#EC4899" },
    ],
  }
}

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const data = await getDashboardData(userId)

  return (
    <div className="animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {data.user.name}! 👋</h1>
        <p className="text-gray-600">Ready to continue your learning journey?</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-value">{data.user.completedLessons}</div>
          <div className="stat-label">Lessons Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.user.currentStreak}</div>
          <div className="stat-label">Day Streak 🔥</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.round((data.user.completedLessons / data.user.totalLessons) * 100)}%</div>
          <div className="stat-label">Overall Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.user.longestStreak}</div>
          <div className="stat-label">Longest Streak</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Continue Learning</h3>
          <p className="text-gray-600 mb-4">Pick up where you left off</p>
          <Link href="/lessons" className="btn btn-primary">
            Browse Lessons
          </Link>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Daily Challenge</h3>
          <p className="text-gray-600 mb-4">Complete today's challenge to maintain your streak</p>
          <Link href="/challenge" className="btn btn-success">
            Take Challenge
          </Link>
        </div>
      </div>

      {/* Progress by Category */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="text-xl font-semibold">Learning Progress</h3>
        </div>

        <div className="space-y-4">
          {data.categories.map((category) => (
            <div key={category.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-gray-500">{category.progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${category.progress}%`,
                    background: `linear-gradient(90deg, ${category.color}, ${category.color}aa)`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-semibold">Recent Lessons</h3>
        </div>

        <div className="space-y-3">
          {data.recentLessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${lesson.completed ? "bg-green-500" : "bg-gray-300"}`}></div>
                <span className="font-medium">{lesson.title}</span>
              </div>
              <div className="flex items-center gap-3">
                {lesson.completed && lesson.score && <span className="badge badge-success">{lesson.score}%</span>}
                <Link href={`/lessons/${lesson.id}`} className="btn btn-secondary btn-sm">
                  {lesson.completed ? "Review" : "Continue"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
