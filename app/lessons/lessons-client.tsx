"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, Clock, BookOpen, Play, HelpCircle } from "lucide-react"
import { BookmarkButton } from "@/components/bookmark-button"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const categories = useMemo(() => {
    const cats = [...new Set(lessons.map((l) => l.category))]
    return ["all", ...cats]
  }, [lessons])

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        !searchQuery ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "all" || lesson.difficulty === selectedDifficulty
      const matchesType = selectedType === "all" || lesson.type === selectedType

      return matchesSearch && matchesCategory && matchesDifficulty && matchesType
    })
  }, [lessons, searchQuery, selectedCategory, selectedDifficulty, selectedType])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <BookOpen className="w-5 h-5" />
      case "video":
        return <Play className="w-5 h-5" />
      case "quiz":
        return <HelpCircle className="w-5 h-5" />
      default:
        return <BookOpen className="w-5 h-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lessons, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredLessons.length} of {lessons.length} lessons
        </p>
        {(searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" || selectedType !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setSelectedDifficulty("all")
              setSelectedType("all")
            }}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative overflow-hidden"
            >
              {/* Bookmark Button */}
              <BookmarkButton lessonId={lesson.id} className="absolute top-4 right-4 z-10" />

              {/* Completed Badge */}
              {lesson.completed && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ✓ Completed
                </div>
              )}

              {/* Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${lesson.categoryColor}20`,
                    color: lesson.categoryColor,
                    border: `1px solid ${lesson.categoryColor}40`,
                  }}
                >
                  {lesson.category}
                </span>
                <div className="flex items-center space-x-1 text-purple-600">{getTypeIcon(lesson.type)}</div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                {lesson.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{lesson.description}</p>

              {/* Tags */}
              {lesson.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {lesson.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                      {tag}
                    </span>
                  ))}
                  {lesson.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                      +{lesson.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration} min</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(lesson.difficulty)}`}
                >
                  {lesson.difficulty}
                </span>
              </div>

              {/* Action Button */}
              <Link
                href={`/lessons/${lesson.id}`}
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform group-hover:scale-105"
              >
                {lesson.completed ? "Review Lesson" : "Start Learning"}
              </Link>

              {/* Decorative Element */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No lessons found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setSelectedDifficulty("all")
              setSelectedType("all")
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
