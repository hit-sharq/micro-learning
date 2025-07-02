"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { SearchAndFilter } from "@/components/search-and-filter"

interface Lesson {
  id: number
  title: string
  description: string
  type: string
  category: string
  difficulty: string
  duration: number
  completed: boolean
  categoryColor: string
  tags: string[]
}

interface LessonsClientProps {
  lessons: Lesson[]
}

export function LessonsClient({ lessons }: LessonsClientProps) {
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>(lessons)
  const [isLoading, setIsLoading] = useState(false)

  const handleFilter = useCallback((filteredLessons: Lesson[]) => {
    setFilteredLessons(filteredLessons)
  }, [])

  return (
    <>
      <SearchAndFilter lessons={lessons} onFilter={handleFilter} />

      <div className="lessons-count">
        Showing {filteredLessons.length} of {lessons.length} lessons
      </div>

      {isLoading ? (
        <div className="lessons-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="lesson-skeleton"></div>
          ))}
        </div>
      ) : filteredLessons.length > 0 ? (
        <div className="lessons-grid">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="lesson-card">
              <button className="bookmark-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>

              <div className="lesson-header">
                <div className="lesson-badges">
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `${lesson.categoryColor}20`,
                      color: lesson.categoryColor,
                    }}
                  >
                    {lesson.category}
                  </span>
                  {lesson.completed && <span className="badge badge-success">✓ Completed</span>}
                </div>
                <div className="lesson-type">
                  {lesson.type === "text" && "📄"}
                  {lesson.type === "video" && "🎥"}
                  {lesson.type === "quiz" && "❓"}
                </div>
              </div>

              <h3 className="lesson-title">{lesson.title}</h3>
              <p className="lesson-description">{lesson.description}</p>

              <div className="lesson-tags">
                {lesson.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
                {lesson.tags.length > 3 && <span className="tag-more">+{lesson.tags.length - 3} more</span>}
              </div>

              <div className="lesson-meta">
                <span className="lesson-duration">⏱️ {lesson.duration} min</span>
                <span
                  className={`badge ${
                    lesson.difficulty === "beginner"
                      ? "badge-success"
                      : lesson.difficulty === "intermediate"
                        ? "badge-warning"
                        : "badge-danger"
                  }`}
                >
                  {lesson.difficulty}
                </span>
              </div>

              <Link href={`/lessons/${lesson.id}`} className="btn btn-primary lesson-btn">
                {lesson.completed ? "Review Lesson" : "Start Lesson"}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-lessons">
          <div className="no-lessons-icon">🔍</div>
          <h3>No lessons found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Reset Filters
          </button>
        </div>
      )}

      {filteredLessons.length > 0 && filteredLessons.length >= 6 && (
        <div className="load-more">
          <button className="btn btn-secondary">Load More Lessons</button>
        </div>
      )}
    </>
  )
}
