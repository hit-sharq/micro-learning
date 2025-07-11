"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Category {
  id: number
  name: string
  description: string
  color?: string
  icon?: string
  slug: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface Lesson {
  id: number
  title: string
  description: string
  type: string
  category: Category | string
  difficulty: string
  duration: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
  viewCount?: number
  completionRate?: number
}

export default function ContentManagement() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    status: "all", // all, published, draft
    category: "all",
    type: "all",
  })

  useEffect(() => {
    fetchLessons()
  }, [filter])

  const fetchLessons = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.status !== "all") params.append("status", filter.status)
      if (filter.category !== "all") params.append("category", filter.category)
      if (filter.type !== "all") params.append("type", filter.type)

      const response = await fetch(`/api/admin/lessons?${params}`)
      const data = await response.json()
      setLessons(data.lessons || [])
    } catch (error) {
      console.error("Failed to fetch lessons:", error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (lessonId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      })

      if (response.ok) {
        setLessons(
          lessons.map((lesson: Lesson) => (lesson.id === lessonId ? { ...lesson, isPublished: !currentStatus } : lesson)),
        )
      }
    } catch (error) {
      console.error("Failed to toggle publish status:", error)
    }
  }

  const deleteLesson = async (lessonId: number) => {
    if (!confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLessons(lessons.filter((lesson: Lesson) => lesson.id !== lessonId))
      }
    } catch (error) {
      console.error("Failed to delete lesson:", error)
    }
  }

  const duplicateLesson = async (lessonId: number) => {
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}/duplicate`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setLessons([data.lesson, ...lessons])
      }
    } catch (error) {
      console.error("Failed to duplicate lesson:", error)
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">Loading content...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in px-4 sm:px-6 lg:px-8 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-gray-600 max-w-xs sm:max-w-full">Create, edit, and manage all lessons</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2 flex-wrap">
            <button
              className="btn btn-outline"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <Link href="/admin" className="btn btn-outline">
              Back to Dashboard
            </Link>
          </div>
          <Link href="/admin/content/bulk-upload" className="btn btn-secondary whitespace-nowrap">
            📁 Bulk Upload
          </Link>
          <Link href="/admin/content/create" className="btn btn-primary whitespace-nowrap">
            ➕ Create Lesson
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="min-w-0 flex-1">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="form-select w-full"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="min-w-0 flex-1">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="form-select w-full"
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            >
              <option value="all">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div className="min-w-0 flex-1">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="form-select w-full"
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Lesson</th>
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Performance</th>
              <th className="text-left py-3 px-4">Updated</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson: Lesson) => (
              <tr key={lesson.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 max-w-xs">
                  <div>
                    <div className="font-medium truncate">{lesson.title}</div>
                    <div className="text-sm text-gray-500 truncate">{lesson.description}</div>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="badge badge-primary">
                    {lesson.type === "text" && "📄"}
                    {lesson.type === "video" && "🎥"}
                    {lesson.type === "quiz" && "❓"}
                    {lesson.type}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">{typeof lesson.category === 'string' ? lesson.category : lesson.category?.name}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`badge ${lesson.isPublished ? "badge-success" : "badge-warning"}`}>
                    {lesson.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm whitespace-nowrap">
                  <div>
                    <div>👁️ {lesson.viewCount || 0} views</div>
                    <div>✅ {lesson.completionRate || 0}% completion</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">{new Date(lesson.updatedAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                    <Link href={`/admin/content/edit/${lesson.id}`} className="btn btn-sm btn-secondary whitespace-nowrap">
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => togglePublish(lesson.id, lesson.isPublished)}
                      className={`btn btn-sm whitespace-nowrap ${lesson.isPublished ? "btn-warning" : "btn-success"}`}
                    >
                      {lesson.isPublished ? "📤 Unpublish" : "📢 Publish"}
                    </button>
                    <button
                      onClick={() => duplicateLesson(lesson.id)}
                      className="btn btn-sm whitespace-nowrap btn-info"
                    >
                      📄 Duplicate
                    </button>
                    <button
                      onClick={() => deleteLesson(lesson.id)}
                      className="btn btn-sm whitespace-nowrap btn-error"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No lessons found</h3>
          <p className="text-gray-600 mb-4">Create your first lesson to get started</p>
          <Link href="/admin/content/create" className="btn btn-primary">
            Create Lesson
          </Link>
        </div>
      )}
    </div>
  )
}
