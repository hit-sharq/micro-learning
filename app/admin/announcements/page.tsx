"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Announcement {
  id: number
  title: string
  content: string
  type: "INFO" | "WARNING" | "SUCCESS" | "UPDATE" | "MAINTENANCE"
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT"
  targetAudience: string[]
  publishAt: string
  expiresAt: string | null
  isActive: boolean
  isDraft: boolean
  viewCount: number
  clickCount: number
  createdAt: string
}

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "INFO" as const,
    priority: "NORMAL" as const,
    targetAudience: ["all"],
    publishAt: new Date().toISOString().slice(0, 16),
    expiresAt: "",
    isDraft: false,
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/admin/announcements")
      const data = await response.json()
      setAnnouncements(data.announcements || [])
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      })

      if (response.ok) {
        const data = await response.json()
        setAnnouncements([data.announcement, ...announcements])
        setShowCreateForm(false)
        setNewAnnouncement({
          title: "",
          content: "",
          type: "INFO",
          priority: "NORMAL",
          targetAudience: ["all"],
          publishAt: new Date().toISOString().slice(0, 16),
          expiresAt: "",
          isDraft: false,
        })
      }
    } catch (error) {
      console.error("Failed to create announcement:", error)
    }
  }

  const toggleAnnouncementStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/announcements/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        setAnnouncements(announcements.map((ann) => (ann.id === id ? { ...ann, isActive: !currentStatus } : ann)))
      }
    } catch (error) {
      console.error("Failed to toggle announcement status:", error)
    }
  }

  const deleteAnnouncement = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAnnouncements(announcements.filter((ann) => ann.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete announcement:", error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "INFO":
        return "ℹ️"
      case "WARNING":
        return "⚠️"
      case "SUCCESS":
        return "✅"
      case "UPDATE":
        return "🔄"
      case "MAINTENANCE":
        return "🔧"
      default:
        return "📢"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "badge-danger"
      case "HIGH":
        return "badge-warning"
      case "NORMAL":
        return "badge-primary"
      case "LOW":
        return "badge-secondary"
      default:
        return "badge-primary"
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">Loading announcements...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Announcements</h1>
          <p className="text-gray-600">Create and manage platform announcements</p>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
          📢 Create Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-value">{announcements.length}</div>
          <div className="stat-label">Total Announcements</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{announcements.filter((a) => a.isActive).length}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{announcements.reduce((sum, a) => sum + a.viewCount, 0)}</div>
          <div className="stat-label">Total Views</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{announcements.reduce((sum, a) => sum + a.clickCount, 0)}</div>
          <div className="stat-label">Total Clicks</div>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Create New Announcement</h2>
              <button onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Content *</label>
                <textarea
                  className="form-input form-textarea"
                  rows={4}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-input form-select"
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any })}
                  >
                    <option value="INFO">ℹ️ Information</option>
                    <option value="WARNING">⚠️ Warning</option>
                    <option value="SUCCESS">✅ Success</option>
                    <option value="UPDATE">🔄 Update</option>
                    <option value="MAINTENANCE">🔧 Maintenance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-input form-select"
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select
                  className="form-input form-select"
                  value={newAnnouncement.targetAudience[0]}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: [e.target.value] })}
                >
                  <option value="all">All Users</option>
                  <option value="students">Students Only</option>
                  <option value="admins">Admins Only</option>
                </select>
              </div>

              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Publish At</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={newAnnouncement.publishAt}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, publishAt: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expires At (Optional)</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={newAnnouncement.expiresAt}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiresAt: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newAnnouncement.isDraft}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isDraft: e.target.checked })}
                  />
                  <span>Save as draft</span>
                </label>
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getTypeIcon(announcement.type)}</span>
                  <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  <span className={`badge ${getPriorityColor(announcement.priority)}`}>{announcement.priority}</span>
                  {announcement.isDraft && <span className="badge badge-warning">Draft</span>}
                  {!announcement.isActive && <span className="badge badge-secondary">Inactive</span>}
                </div>

                <p className="text-gray-600 mb-3">{announcement.content}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>👥 {announcement.targetAudience.join(", ")}</span>
                  <span>👁️ {announcement.viewCount} views</span>
                  <span>👆 {announcement.clickCount} clicks</span>
                  <span>📅 {new Date(announcement.publishAt).toLocaleDateString()}</span>
                  {announcement.expiresAt && (
                    <span>⏰ Expires {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Link href={`/admin/announcements/edit/${announcement.id}`} className="btn btn-sm btn-secondary">
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => toggleAnnouncementStatus(announcement.id, announcement.isActive)}
                  className={`btn btn-sm ${announcement.isActive ? "btn-warning" : "btn-success"}`}
                >
                  {announcement.isActive ? "🚫 Deactivate" : "✅ Activate"}
                </button>
                <button onClick={() => deleteAnnouncement(announcement.id)} className="btn btn-sm btn-danger">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-semibold mb-2">No announcements yet</h3>
            <p className="text-gray-600 mb-4">Create your first announcement to communicate with users</p>
            <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
              Create Announcement
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
