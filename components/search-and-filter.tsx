"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, X } from "lucide-react"

interface SearchFilters {
  category: string
  difficulty: string
  type: string
  duration: string
}

interface SearchAndFilterProps {
  onSearch: (query: string, filters: SearchFilters) => void
  loading?: boolean
}

const categories = [
  "All Categories",
  "Programming",
  "Data Science",
  "Design",
  "Business",
  "Marketing",
  "Languages",
  "Science",
  "Arts",
]

const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"]

const types = ["All Types", "Text", "Video", "Quiz"]

const durations = ["Any Duration", "Under 5 min", "5-10 min", "10-20 min", "20+ min"]

export function SearchAndFilter({ onSearch, loading = false }: SearchAndFilterProps) {
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: "All Categories",
    difficulty: "All Levels",
    type: "All Types",
    duration: "Any Duration",
  })

  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearch(query, filters)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query, filters])

  const handleSearch = () => {
    onSearch(query, filters)
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pr-10 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
      </div>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showFilters ? <X size={16} /> : <Filter size={16} />}
        {showFilters ? " Hide Filters" : " Show Filters"}
      </button>
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 text-sm border rounded"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="px-4 py-2 text-sm border rounded"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 text-sm border rounded"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={filters.duration}
            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
            className="px-4 py-2 text-sm border rounded"
          >
            {durations.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
