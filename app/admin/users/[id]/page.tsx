"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface UserDetail {
  id: string
  clerkId: string
  name: string
  email: string
  role: string
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  totalLessons: number
  completedLessons: number
  currentStreak: number
  longestStreak: number
  recentActivity: Array<{
    id: string
    lessonTitle: string
    completed: boolean
    score: number | null
    completedAt: string
  }>
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserDetail()
  }, [params.id])

  const fetchUserDetail = async () => {
    try {
      // Mock data for now - you should implement the actual API
      const mockUser: UserDetail = {
        id: params.id,
        clerkId: "user_" + params.id,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "STUDENT",
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalLessons: 25,
        completedLessons: 18,
        currentStreak: 7,
        longestStreak: 14,
        recentActivity: [
          {
            id: "1",
            lessonTitle: "Introduction to React",
            completed: true,
            score: 85,
            completedAt: new Date().toISOString(),
          },
          {
            id: "2",
            lessonTitle: "JavaScript Fundamentals",
            completed: true,
            score: 92,
            completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      }

      setUser(mockUser)
    } catch (error) {
      console.error("Error fetching user detail:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">Loading user details...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">User not found</h3>
          <Link href="/admin/users" className="btn btn-primary">
            Back to Users
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Details</h1>
          <p className="text-gray-600">Detailed information about {user.name}</p>
        </div>
        <Link href="/admin/users" className="btn btn-secondary">
          ← Back to Users
        </Link>
      </div>

      {/* User Info Card */}
      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className={`badge ${user.role === "ADMIN" ? "badge-danger" : "badge-primary"}`}>{user.role}</span>
                <span className={`badge ${user.isActive ? "badge-success" : "badge-warning"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
            <div>Last Login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-value">{user.totalLessons}</div>
          <div className="stat-label">Total Lessons</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user.completedLessons}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user.longestStreak}</div>
          <div className="stat-label">Longest Streak</div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="card mb-6">
        <h3 className="text-xl font-semibold mb-4">Learning Progress</h3>
        <div className="progress-bar mb-2">
          <div className="progress-fill" style={{ width: `${(user.completedLessons / user.totalLessons) * 100}%` }} />
        </div>
        <p className="text-sm text-gray-600">
          {Math.round((user.completedLessons / user.totalLessons) * 100)}% completion rate
        </p>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {user.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${activity.completed ? "bg-green-500" : "bg-yellow-500"}`} />
                <div>
                  <div className="font-medium">{activity.lessonTitle}</div>
                  <div className="text-sm text-gray-500">
                    {activity.completed ? "Completed" : "In Progress"}
                    {activity.score && ` • Score: ${activity.score}%`}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{new Date(activity.completedAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
