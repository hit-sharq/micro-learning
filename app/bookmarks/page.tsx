"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"
import { BookmarkButton } from "@/components/bookmark-button"
import { toast } from "sonner"

interface Bookmark {
  id: number
  lesson: {
    id: number
    title: string
    description: string
    type: string
    difficulty: string
    estimatedDuration: number
    category: {
      name: string
      color: string
    }
  }
  createdAt: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/bookmarks")
      if (response.ok) {
        const data = await response.json()
        setBookmarks(data.bookmarks || [])
      } else {
        toast.error("Failed to load bookmarks")
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error)
      toast.error("Failed to load bookmarks")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">Loading bookmarks...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackButton href="/dashboard" />
          <div>
            <h1 className="text-3xl font-bold">My Bookmarks</h1>
            <p className="text-gray-600">Lessons you've saved for later</p>
          </div>
        </div>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-3 gap-6">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="card hover:shadow-lg transition-all duration-300 relative">
              <BookmarkButton lessonId={bookmark.lesson.id} className="absolute top-4 right-4 z-10" />

              <div className="flex items-start justify-between mb-3">
                <span
                  className="badge"
                  style={{
                    backgroundColor: `${bookmark.lesson.category.color}20`,
                    color: bookmark.lesson.category.color,
                  }}
                >
                  {bookmark.lesson.category.name}
                </span>
                <div className="text-2xl">
                  {bookmark.lesson.type === "TEXT" && "📄"}
                  {bookmark.lesson.type === "VIDEO" && "🎥"}
                  {bookmark.lesson.type === "QUIZ" && "❓"}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">{bookmark.lesson.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{bookmark.lesson.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">⏱️ {bookmark.lesson.estimatedDuration} min</span>
                <span
                  className={`badge ${
                    bookmark.lesson.difficulty === "BEGINNER"
                      ? "badge-success"
                      : bookmark.lesson.difficulty === "INTERMEDIATE"
                        ? "badge-warning"
                        : "badge-danger"
                  }`}
                >
                  {bookmark.lesson.difficulty.toLowerCase()}
                </span>
              </div>

              <div className="text-xs text-gray-400 mb-4">
                Bookmarked {new Date(bookmark.createdAt).toLocaleDateString()}
              </div>

              <Link href={`/lessons/${bookmark.lesson.id}`} className="btn btn-primary w-full">
                Start Lesson
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔖</div>
          <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
          <p className="text-gray-600 mb-4">Save lessons you want to revisit later</p>
          <Link href="/lessons" className="btn btn-primary">
            Browse Lessons
          </Link>
        </div>
      )}
    </div>
  )
}
