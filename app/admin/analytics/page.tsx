"use client"

import { useState, useEffect } from "react"

interface AnalyticsData {
  userStats: {
    totalUsers: number
    newUsersThisWeek: number
    activeUsersToday: number
    retentionRate: number
  }
  lessonStats: {
    totalLessons: number
    completedLessons: number
    averageCompletionTime: number
    popularLessons: Array<{
      id: number
      title: string
      completions: number
      averageScore: number
    }>
  }
  engagementStats: {
    dailyActiveUsers: Array<{ date: string; count: number }>
    lessonCompletions: Array<{ date: string; count: number }>
    streakData: Array<{ streakLength: number; userCount: number }>
  }
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d") // 7d, 30d, 90d

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.status === 401) {
        setData(null)
        setLoading(false)
        alert("Unauthorized: Please log in to access analytics.")
        return
      }
      if (response.status === 403) {
        setData(null)
        setLoading(false)
        alert("Forbidden: You do not have permission to access analytics.")
        return
      }
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Failed to load analytics</h3>
          <button onClick={fetchAnalytics} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
          <p className="text-gray-600">Detailed insights into platform performance</p>
        </div>
        <div>
          <select className="form-select" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-value">{data?.userStats?.totalUsers}</div>
          <div className="stat-label">Total Users</div>
          <div className="text-xs text-green-600 mt-1">+{data?.userStats?.newUsersThisWeek} this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data?.userStats?.activeUsersToday}</div>
          <div className="stat-label">Active Today</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round((data?.userStats?.activeUsersToday / data?.userStats?.totalUsers) * 100)}% of total
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data?.userStats?.retentionRate}%</div>
          <div className="stat-label">Retention Rate</div>
          <div className="text-xs text-gray-500 mt-1">7-day retention</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data?.lessonStats?.completedLessons}</div>
          <div className="stat-label">Lessons Completed</div>
          <div className="text-xs text-gray-500 mt-1">Avg: {data?.lessonStats?.averageCompletionTime}min</div>
        </div>
      </div>

      <div className="grid grid-2 gap-6 mb-8">
        {/* Daily Active Users Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Daily Active Users</h3>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 p-4">
            {data.engagementStats.dailyActiveUsers.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 w-full rounded-t"
                  style={{
                    height: `${(day.count / Math.max(...data.engagementStats.dailyActiveUsers.map((d) => d.count))) * 200}px`,
                  }}
                />
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45">
                  {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Completions Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Lesson Completions</h3>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 p-4">
            {data.engagementStats.lessonCompletions.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-green-500 w-full rounded-t"
                  style={{
                    height: `${(day.count / Math.max(...data.engagementStats.lessonCompletions.map((d) => d.count))) * 200}px`,
                  }}
                />
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45">
                  {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-2 gap-6">
        {/* Popular Lessons */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Most Popular Lessons</h3>
          </div>
          <div className="space-y-3">
            {data.lessonStats.popularLessons.map((lesson, index) => (
              <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <div className="font-medium">{lesson.title}</div>
                    <div className="text-sm text-gray-500">
                      {lesson.completions} completions • {lesson.averageScore}% avg score
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{lesson.completions}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Learning Streaks</h3>
          </div>
          <div className="space-y-3">
            {data.engagementStats.streakData.map((streak, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">
                  {streak.streakLength === 0
                    ? "No streak"
                    : `${streak.streakLength} day${streak.streakLength > 1 ? "s" : ""}`}
                </span>
                <div className="flex items-center gap-2 flex-1 mx-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{
                        width: `${(streak.userCount / Math.max(...data.engagementStats.streakData.map((s) => s.userCount))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{streak.userCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
