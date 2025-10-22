"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

interface LessonForm {
  title: string
  description: string
  content: string
  type: "TEXT" | "VIDEO" | "QUIZ"
  categoryId: number
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  estimatedDuration: number
  tags: string[]
  videoUrl?: string
  videoThumbnail?: string
  quizData?: any
  metaDescription?: string
  isPublished: boolean
}

interface Category {
  id: number
  name: string
  description?: string
}

export default function EditLesson({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<LessonForm>({
    title: "",
    description: "",
    content: "",
    type: "TEXT",
    categoryId: 1,
    difficulty: "BEGINNER",
    estimatedDuration: 5,
    tags: [],
    metaDescription: "",
    isPublished: false,
  })

  useEffect(() => {
    fetchCategories()
    fetchLesson()
  }, [params.id])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
    }
  }

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/admin/lessons/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        const lesson = data.lesson
        setForm({
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          type: lesson.type,
          categoryId: lesson.categoryId,
          difficulty: lesson.difficulty,
          estimatedDuration: lesson.estimatedDuration,
          tags: lesson.tags || [],
          videoUrl: lesson.videoUrl || "",
          videoThumbnail: lesson.videoThumbnail || "",
          quizData: lesson.quizData,
          metaDescription: lesson.metaDescription || "",
          isPublished: lesson.isPublished,
        })
      }
    } catch (error) {
      console.error("Error fetching lesson:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/lessons/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        router.push("/admin/content")
      } else {
        throw new Error("Failed to update lesson")
      }
    } catch (error) {
      console.error("Error updating lesson:", error)
      alert("Failed to update lesson. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (!form.tags.includes(newTag)) {
        setForm({ ...form, tags: [...form.tags, newTag] })
      }
      e.currentTarget.value = ""
    }
  }

  const removeTag = (tagToRemove: string) => {
    setForm({ ...form, tags: form.tags.filter((tag) => tag !== tagToRemove) })
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">Loading lesson...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Lesson</h1>
          <p className="text-gray-600">Update lesson content and settings</p>
        </div>
        <Link href="/admin/content" className="btn btn-secondary">
          ← Back to Content
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-2 gap-6 mb-6">
          <div className="form-group">
            <label className="form-label">Lesson Title *</label>
            <input
              type="text"
              className="form-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lesson Type *</label>
            <select
              className="form-input form-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
            >
              <option value="TEXT">📄 Text Lesson</option>
              <option value="VIDEO">🎥 Video Lesson</option>
              <option value="QUIZ">❓ Quiz</option>
            </select>
          </div>
        </div>

        <div className="form-group mb-6">
          <label className="form-label">Description *</label>
          <textarea
            className="form-input form-textarea"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-3 gap-4 mb-6">
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-input form-select"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: Number.parseInt(e.target.value) })}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty *</label>
            <select
              className="form-input form-select"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
            >
              <option value="BEGINNER">🟢 Beginner</option>
              <option value="INTERMEDIATE">🟡 Intermediate</option>
              <option value="ADVANCED">🔴 Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Duration (minutes) *</label>
            <input
              type="number"
              className="form-input"
              value={form.estimatedDuration}
              onChange={(e) => setForm({ ...form, estimatedDuration: Number.parseInt(e.target.value) })}
              min="1"
              max="120"
            />
          </div>
        </div>

        <div className="form-group mb-6">
          <label className="form-label">Content *</label>
          <textarea
            className="form-input form-textarea"
            rows={15}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
        </div>

        {form.type === "VIDEO" && (
          <div className="grid grid-2 gap-4 mb-6">
            <div className="form-group">
              <label className="form-label">Video URL</label>
              <input
                type="url"
                className="form-input"
                value={form.videoUrl || ""}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Video Thumbnail URL</label>
              <input
                type="url"
                className="form-input"
                value={form.videoThumbnail || ""}
                onChange={(e) => setForm({ ...form, videoThumbnail: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="form-group mb-6">
          <label className="form-label">Tags</label>
          <input
            type="text"
            className="form-input"
            placeholder="Type a tag and press Enter"
            onKeyDown={handleTagInput}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {form.tags.map((tag) => (
              <span key={tag} className="badge badge-primary">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-xs hover:text-red-600">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group mb-6">
          <label className="form-label">SEO Meta Description</label>
          <textarea
            className="form-input form-textarea"
            rows={3}
            value={form.metaDescription || ""}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            maxLength={160}
          />
          <p className="text-sm text-gray-500 mt-1">{(form.metaDescription || "").length}/160 characters</p>
        </div>

        <div className="form-group mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            <span>Published (visible to students)</span>
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/content" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? "Updating..." : "Update Lesson"}
          </button>
        </div>
      </form>
    </div>
  )
}
