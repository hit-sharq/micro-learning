"use client"

import { useState, useEffect } from "react"

interface BookmarkButtonProps {
  lessonId: number
  className?: string
}

export function BookmarkButton({ lessonId, className = "" }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkBookmarkStatus()
  }, [lessonId])

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/bookmark`)
      const data = await response.json()
      setIsBookmarked(data.isBookmarked)
    } catch (error) {
      console.error("Failed to check bookmark status:", error)
    }
  }

  const toggleBookmark = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      })

      const data = await response.json()
      setIsBookmarked(data.isBookmarked)
    } catch (error) {
      console.error("Failed to toggle bookmark:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={`bookmark-btn ${isBookmarked ? "bookmarked" : ""} ${className}`}
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  )
}
