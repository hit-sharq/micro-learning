"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Lesson {
  id: number
  title: string
  description: string
  type: string
  category: string
  difficulty: string
  duration: number
  tags: string[]
}

interface SearchAndFilterProps {
  lessons: Lesson[]
  onFilter: (filteredLessons: Lesson[]) => void
}

export function SearchAndFilter({ lessons, onFilter }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [searchResults, setSearchResults] = useState<Lesson[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const categories = [...new Set(lessons.map((l) => l.category))]
  const difficulties = ["beginner", "intermediate", "advanced"]
  const types = ["text", "video", "quiz"]

  useEffect(() => {
    const filtered = lessons.filter((lesson) => {
      const matchesSearch =
        !searchQuery ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = !selectedCategory || lesson.category === selectedCategory
      const matchesDifficulty = !selectedDifficulty || lesson.difficulty === selectedDifficulty
      const matchesType = !selectedType || lesson.type === selectedType

      return matchesSearch && matchesCategory && matchesDifficulty && matchesType
    })

    onFilter(filtered)
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedType, lessons, onFilter])

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = lessons
        .filter(
          (lesson) =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lesson.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5)
      setSearchResults(results)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [searchQuery, lessons])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedDifficulty("")
    setSelectedType("")
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedDifficulty || selectedType

  return (
    <div className="mb-6">
      {/* Search Bar */}
      <div ref={searchRef} className="search-container mb-4">
        <div className="relative">
          <svg className="search-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search lessons, topics, or tags..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="search-result-item block"
                onClick={() => setShowResults(false)}
              >
                <div className="font-medium text-sm">{lesson.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {lesson.category} • {lesson.difficulty}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filter-container">
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            className="filter-select form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Difficulty</label>
          <select
            className="filter-select form-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="">All Levels</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Type</label>
          <select
            className="filter-select form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="filter-group">
            <label className="filter-label">&nbsp;</label>
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchQuery && (
            <span className="badge badge-primary">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery("")} className="ml-2 text-xs hover:text-red-600">
                ×
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="badge badge-primary">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory("")} className="ml-2 text-xs hover:text-red-600">
                ×
              </button>
            </span>
          )}
          {selectedDifficulty && (
            <span className="badge badge-primary">
              Difficulty: {selectedDifficulty}
              <button onClick={() => setSelectedDifficulty("")} className="ml-2 text-xs hover:text-red-600">
                ×
              </button>
            </span>
          )}
          {selectedType && (
            <span className="badge badge-primary">
              Type: {selectedType}
              <button onClick={() => setSelectedType("")} className="ml-2 text-xs hover:text-red-600">
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
