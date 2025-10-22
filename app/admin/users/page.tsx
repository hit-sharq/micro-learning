"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"

interface User {
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
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState({
    role: "all",
    status: "all",
    activity: "all",
  })

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.role !== "all") params.append("role", filter.role)
      if (filter.status !== "all") params.append("status", filter.status)
      if (filter.activity !== "all") params.append("activity", filter.activity)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        setUsers(users.map((user) => (user.id === userId ? { ...user, isActive: !currentStatus } : user)))
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error)
    }
  }

  const resetUserProgress = async (userId: string) => {
    if (!confirm("Are you sure you want to reset this user's progress? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-progress`, {
        method: "POST",
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Failed to reset user progress:", error)
    }
  }

  const exportUserData = async () => {
    try {
      const response = await fetch("/api/admin/users/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to export user data:", error)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">Loading users...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">User Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Monitor and manage platform users</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <BackButton href="/admin" />
          <button onClick={exportUserData} className="btn btn-secondary whitespace-nowrap">
            Export Data
          </button>
          <Link href="/admin/users/bulk-actions" className="btn btn-secondary whitespace-nowrap">
            Bulk Actions
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-value text-2xl sm:text-3xl">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-2xl sm:text-3xl">{users.filter((u) => u.isActive).length}</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-2xl sm:text-3xl">
            {
              users.filter(
                (u) => u.lastLoginAt && new Date(u.lastLoginAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              ).length
            }
          </div>
          <div className="stat-label">Active This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-2xl sm:text-3xl">
            {Math.round(
              (users.reduce((acc, u) => acc + u.completedLessons / Math.max(u.totalLessons, 1), 0) / users.length) *
                100,
            ) || 0}
            %
          </div>
          <div className="stat-label">Avg Completion Rate</div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col gap-3">
          <div className="w-full">
            <input
              type="text"
              className="form-input w-full"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              className="form-select"
              value={filter.role}
              onChange={(e) => setFilter({ ...filter, role: e.target.value })}
            >
              <option value="all">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="ADMIN">Admins</option>
              <option value="INSTRUCTOR">Instructors</option>
            </select>
            <select
              className="form-select"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              className="form-select"
              value={filter.activity}
              onChange={(e) => setFilter({ ...filter, activity: e.target.value })}
            >
              <option value="all">All Activity</option>
              <option value="recent">Recent (7 days)</option>
              <option value="inactive">Inactive (30+ days)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">User</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Role</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Status</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Progress</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Streak</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Last Active</th>
              <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2 sm:px-4">
                  <div>
                    <div className="font-medium text-xs sm:text-sm truncate">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <span
                    className={`badge text-xs ${
                      user.role === "ADMIN"
                        ? "badge-danger"
                        : user.role === "INSTRUCTOR"
                          ? "badge-warning"
                          : "badge-primary"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <span className={`badge text-xs ${user.isActive ? "badge-success" : "badge-warning"}`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <div className="text-xs">
                    <div>
                      {user.completedLessons}/{user.totalLessons}
                    </div>
                    <div className="progress-bar mt-1 h-1">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(user.completedLessons / Math.max(user.totalLessons, 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <div className="text-xs">
                    <div>{user.currentStreak}d</div>
                    <div className="text-gray-500">Best: {user.longestStreak}</div>
                  </div>
                </td>
                <td className="py-3 px-2 sm:px-4 text-xs text-gray-500 whitespace-nowrap">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <div className="flex gap-1 flex-wrap">
                    <Link href={`/admin/users/${user.id}`} className="btn btn-sm btn-secondary text-xs">
                      View
                    </Link>
                    <button
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      className={`btn btn-sm text-xs ${user.isActive ? "btn-warning" : "btn-success"}`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => resetUserProgress(user.id)}
                      className="btn btn-sm btn-danger text-xs"
                      title="Reset Progress"
                    >
                      Reset
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl sm:text-6xl mb-4">👥</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No users found</h3>
          <p className="text-gray-600 text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
