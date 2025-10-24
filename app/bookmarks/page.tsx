"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"
import { BookmarkButton } from "@/components/bookmark-button"
import { toast } from "sonner"
import "./bookmarks.css"

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
      <div className="bookmarks-page">
        <div className="bookmarks-container">
          <div className="bookmarks-loading">
            <div className="bookmarks-loading-text">Loading bookmarks...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-container">
        <div className="bookmarks-header">
          <div className="bookmarks-header-content">
            <BackButton href="/dashboard" />
            <div>
              <h1 className="bookmarks-title">My Bookmarks</h1>
              <p className="bookmarks-subtitle">Lessons you've saved for later</p>
            </div>
          </div>
        </div>

        {bookmarks.length > 0 ? (
          <div className="bookmarks-grid">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bookmark-card">
                <div className="bookmark-bookmark-button">
                  <BookmarkButton lessonId={bookmark.lesson.id} />
                </div>

                <div className="bookmark-header">
                  <span
                    className="bookmark-category-badge"
                    style={{
                      backgroundColor: `${bookmark.lesson.category.color}20`,
                      color: bookmark.lesson.category.color,
                    }}
                  >
                    {bookmark.lesson.category.name}
                  </span>
                  <div className="bookmark-type-icon">
                    {bookmark.lesson.type === "TEXT" && "📄"}
                    {bookmark.lesson.type === "VIDEO" && "🎥"}
                    {bookmark.lesson.type === "QUIZ" && "❓"}
                  </div>
                </div>

                <h3 className="bookmark-title">{bookmark.lesson.title}</h3>
                <p className="bookmark-description">{bookmark.lesson.description}</p>

                <div className="bookmark-meta">
                  <span className="bookmark-duration">⏱️ {bookmark.lesson.estimatedDuration} min</span>
                  <span
                    className={`bookmark-difficulty ${
                      bookmark.lesson.difficulty === "BEGINNER"
                        ? "bookmark-difficulty-beginner"
                        : bookmark.lesson.difficulty === "INTERMEDIATE"
                          ? "bookmark-difficulty-intermediate"
                          : "bookmark-difficulty-advanced"
                    }`}
                  >
                    {bookmark.lesson.difficulty.toLowerCase()}
                  </span>
                </div>

                <div className="bookmark-date">
                  Bookmarked {new Date(bookmark.createdAt).toLocaleDateString()}
                </div>

                <Link href={`/lessons/${bookmark.lesson.id}`} className="bookmark-action-button">
                  Start Lesson
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bookmarks-empty">
            <div className="bookmarks-empty-icon">
              <div className="bookmarks-empty-emoji">🔖</div>
            </div>
            <h3 className="bookmarks-empty-title">No bookmarks yet</h3>
            <p className="bookmarks-empty-text">Save lessons you want to revisit later</p>
            <Link href="/lessons" className="bookmarks-empty-button">
              Browse Lessons
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
