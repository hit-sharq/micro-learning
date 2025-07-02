"use client"

import { useState } from "react"
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

// Move the lessons data to component state
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

  const handleFilter = (lessons: Lesson[]) => {
    setFilteredLessons(lessons)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Lessons</h1>
        <p className="text-gray-600">Discover bite-sized lessons tailored to your learning goals</p>
      </div>

      {/* Search and Filter Component */}
      <SearchAndFilter lessons={allLessons} onFilter={handleFilter} />

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredLessons.length} of {allLessons.length} lessons
      </div>

      {/* Lessons Grid */}
      {isLoading ? (
        <div className="grid grid-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="lesson-skeleton h-64"></div>
          ))}
        </div>
      ) : filteredLessons.length > 0 ? (
        <div className="grid grid-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="card hover:shadow-lg transition-all duration-300 relative">
              {/* Bookmark Button */}
              <button className="bookmark-btn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
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
                <div className="text-2xl">
                  {lesson.type === "text" && "📄"}
                  {lesson.type === "video" && "🎥"}
                  {lesson.type === "quiz" && "❓"}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {lesson.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {lesson.tags.length > 3 && (
                  <span className="text-xs text-gray-400">+{lesson.tags.length - 3} more</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">⏱️ {lesson.duration} min</span>
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

              <Link href={`/lessons/${lesson.id}`} className="btn btn-primary w-full">
                {lesson.completed ? "Review Lesson" : "Start Lesson"}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No lessons found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Reset Filters
          </button>
        </div>
      )}

      {/* Load More */}
      {filteredLessons.length > 0 && filteredLessons.length >= 6 && (
        <div className="text-center mt-8">
          <button className="btn btn-secondary">Load More Lessons</button>
        </div>
      )}
    </div>
  )
}
