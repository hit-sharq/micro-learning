"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, Clock, BookOpen, Play, HelpCircle, X } from "lucide-react"
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
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "intermediate":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "advanced":
        return "bg-rose-100 text-rose-700 border-rose-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" || selectedType !== "all"

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSelectedType("all")
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lessons, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 hover:bg-white transition-all font-medium"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 hover:bg-white transition-all font-medium"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 hover:bg-white transition-all font-medium"
                >
                  <option value="all">All Types</option>
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600 font-medium">
          Showing <span className="text-indigo-600 font-semibold">{filteredLessons.length}</span> of{" "}
          <span className="text-indigo-600 font-semibold">{lessons.length}</span> lessons
        </p>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 hover:border-indigo-300 relative flex flex-col"
            >
              {/* Bookmark Button */}
              <BookmarkButton lessonId={lesson.id} className="absolute top-4 right-4 z-10" />

              {/* Completed Badge */}
              {lesson.completed && (
                <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  ✓ Completed
                </div>
              )}

              {/* Header with Category and Type */}
              <div className="p-6 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${lesson.categoryColor}20`,
                      color: lesson.categoryColor,
                      border: `1.5px solid ${lesson.categoryColor}40`,
                    }}
                  >
                    {lesson.category}
                  </span>
                  <div className="text-indigo-600 group-hover:scale-110 transition-transform">
                    {getTypeIcon(lesson.type)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {lesson.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">{lesson.description}</p>

                {/* Tags */}
                {lesson.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lesson.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {lesson.tags.length > 2 && (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                        +{lesson.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{lesson.duration} min</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(lesson.difficulty)}`}
                  >
                    {lesson.difficulty}
                  </span>
                </div>

                {/* Action Button */}
                <Link
                  href={`/lessons/${lesson.id}`}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform group-hover:scale-105"
                >
                  {lesson.completed ? "Review" : "Start"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No lessons found</h3>
          <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={resetFilters}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
