"use client"

import { useState, useEffect } from "react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { toast } from "sonner"

interface BookmarkButtonProps {
  lessonId: number
  className?: string
}

export function BookmarkButton({ lessonId, className = "" }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkBookmarkStatus()
  }, [lessonId])

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(`/api/bookmarks?lessonId=${lessonId}`)
      if (response.ok) {
        const data = await response.json()
        setIsBookmarked(data.isBookmarked)
      }
    } catch (error) {
      console.error("Failed to check bookmark status:", error)
    }
  }

  const toggleBookmark = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/bookmarks", {
        method: isBookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      })

      if (response.ok) {
        setIsBookmarked(!isBookmarked)
        toast.success(isBookmarked ? "Bookmark removed" : "Lesson bookmarked")
      } else {
        throw new Error("Failed to toggle bookmark")
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error)
      toast.error("Failed to update bookmark")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isBookmarked
          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${className}`}
    >
      {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
    </button>
  )
}
