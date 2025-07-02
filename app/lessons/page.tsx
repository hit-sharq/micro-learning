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

const allLessons: Lesson[] = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "Learn the fundamentals of JavaScript programming",
    type: "text",
    category: "Programming",
    difficulty: "beginner",
    duration: 5,
    completed: true,
    categoryColor: "#3B82F6",
    tags: ["javascript", "programming", "basics", "variables", "functions"],
  },
  {
    id: 2,
    title: "React Components",
    description: "Understanding React functional components",
    type: "text",
    category: "Programming",
    difficulty: "intermediate",
    duration: 7,
    completed: true,
    categoryColor: "#3B82F6",
    tags: ["react", "components", "jsx", "props", "hooks"],
  },
  {
    id: 3,
    title: "Data Visualization",
    description: "Introduction to data visualization principles",
    type: "text",
    category: "Data Science",
    difficulty: "beginner",
    duration: 6,
    completed: false,
    categoryColor: "#8B5CF6",
    tags: ["data", "visualization", "charts", "analytics", "insights"],
  },
  {
    id: 4,
    title: "CSS Flexbox Quiz",
    description: "Test your knowledge of CSS Flexbox",
    type: "quiz",
    category: "Programming",
    difficulty: "intermediate",
    duration: 3,
    completed: false,
    categoryColor: "#3B82F6",
    tags: ["css", "flexbox", "layout", "responsive", "quiz"],
  },
  {
    id: 5,
    title: "Machine Learning Intro",
    description: "Basic concepts of machine learning",
    type: "video",
    category: "Data Science",
    difficulty: "beginner",
    duration: 8,
    completed: false,
    categoryColor: "#8B5CF6",
    tags: ["machine learning", "ai", "algorithms", "models", "training"],
  },
  {
    id: 6,
    title: "UI Design Principles",
    description: "Fundamental principles of user interface design",
    type: "text",
    category: "Design",
    difficulty: "beginner",
    duration: 6,
    completed: false,
    categoryColor: "#EC4899",
    tags: ["ui", "design", "principles", "usability", "interface"],
  },
]

export default function LessonsPage() {
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>(allLessons)
  const [isLoading, setIsLoading] = useState(false)

  // Use useCallback to prevent the function from changing on every render
  const handleFilter = useCallback((lessons: Lesson[]) => {
    setFilteredLessons(lessons)
  }, [])

  return (
    <div className="lessons-page animate-fade-in">
      <div className="lessons-header">
        <h1>Browse Lessons</h1>
        <p>Discover bite-sized lessons tailored to your learning goals</p>
      </div>

      <SearchAndFilter lessons={allLessons} onFilter={handleFilter} />

      <div className="lessons-count">
        Showing {filteredLessons.length} of {allLessons.length} lessons
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
    </div>
  )
}
