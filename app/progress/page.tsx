import Link from "next/link"

async function getProgressData() {
  // In a real app, this would fetch from your database
  return {
    overallStats: {
      totalLessons: 45,
      completedLessons: 32,
      averageScore: 87,
      timeSpent: 240, // minutes
      currentStreak: 7,
      longestStreak: 15,
    },
    categoryProgress: [
      { name: "Programming", completed: 15, total: 20, avgScore: 92 },
      { name: "Data Science", completed: 8, total: 15, avgScore: 85 },
      { name: "Design", completed: 5, total: 10, avgScore: 78 },
      { name: "Business", completed: 4, total: 8, avgScore: 90 },
    ],
    recentActivity: [
      { date: "2024-01-15", lessonsCompleted: 3, timeSpent: 25 },
      { date: "2024-01-14", lessonsCompleted: 2, timeSpent: 15 },
      { date: "2024-01-13", lessonsCompleted: 4, timeSpent: 35 },
      { date: "2024-01-12", lessonsCompleted: 1, timeSpent: 8 },
      { date: "2024-01-11", lessonsCompleted: 2, timeSpent: 18 },
      { date: "2024-01-10", lessonsCompleted: 3, timeSpent: 22 },
      { date: "2024-01-09", lessonsCompleted: 2, timeSpent: 12 },
    ],
    achievements: [
      { id: 1, title: "First Steps", description: "Complete your first lesson", earned: true, date: "2024-01-01" },
      { id: 2, title: "Week Warrior", description: "Maintain a 7-day streak", earned: true, date: "2024-01-08" },
      { id: 3, title: "Quiz Master", description: "Score 90%+ on 5 quizzes", earned: true, date: "2024-01-12" },
      { id: 4, title: "Speed Learner", description: "Complete 10 lessons in one day", earned: false, date: null },
      { id: 5, title: "Perfect Score", description: "Get 100% on any quiz", earned: true, date: "2024-01-10" },
    ],
  }
}

export default async function ProgressPage() {
  const data = await getProgressData()

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Learning Progress</h1>
        <p className="text-gray-600">Track your journey and celebrate your achievements</p>
      </div>

      {/* Overall Stats */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-value">{data.overallStats.completedLessons}</div>
          <div className="stat-label">Lessons Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.overallStats.averageScore}%</div>
          <div className="stat-label">Average Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Math.floor(data.overallStats.timeSpent / 60)}h {data.overallStats.timeSpent % 60}m
          </div>
          <div className="stat-label">Time Spent Learning</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.overallStats.currentStreak} 🔥</div>
          <div className="stat-label">Current Streak</div>
        </div>
      </div>

      <div className="grid grid-2 gap-6 mb-8">
        {/* Category Progress */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Progress by Category</h3>
          </div>

          <div className="space-y-4">
            {data.categoryProgress.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{category.name}</span>
                  <div className="text-sm text-gray-500">
                    {category.completed}/{category.total} • {category.avgScore}% avg
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(category.completed / category.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
          </div>

          <div className="space-y-3">
            {data.recentActivity.map((day) => (
              <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {day.lessonsCompleted} lessons • {day.timeSpent} min
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(day.lessonsCompleted, 5) }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-semibold">Achievements</h3>
        </div>

        <div className="grid grid-3 gap-4">
          {data.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned ? "border-yellow-300 bg-yellow-50" : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.earned ? "🏆" : "🔒"}</div>
                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                {achievement.earned && achievement.date && (
                  <p className="text-xs text-gray-500">Earned {new Date(achievement.date).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 text-center">
        <div className="flex gap-4 justify-center">
          <Link href="/lessons" className="btn btn-primary">
            Continue Learning
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
