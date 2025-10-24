"use client"

import { useState, useMemo } from "react"
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
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null)
  const [lessonContent, setLessonContent] = useState<any>(null)
  const [loadingContent, setLoadingContent] = useState(false)

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
        return <BookOpen className="lesson-type-icon-svg" />
      case "video":
        return <Play className="lesson-type-icon-svg" />
      case "quiz":
        return <HelpCircle className="lesson-type-icon-svg" />
      default:
        return <BookOpen className="lesson-type-icon-svg" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "lesson-difficulty-beginner"
      case "intermediate":
        return "lesson-difficulty-intermediate"
      case "advanced":
        return "lesson-difficulty-advanced"
      default:
        return "lesson-difficulty-default"
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

  const handleReadMore = async (lessonId: number) => {
    setSelectedLessonId(lessonId)
    setLoadingContent(true)
    try {
      const response = await fetch(`/api/lessons/${lessonId}`)
      if (response.ok) {
        const data = await response.json()
        setLessonContent(data.lesson)
      }
    } catch (error) {
      console.error("Failed to fetch lesson content:", error)
    } finally {
      setLoadingContent(false)
    }
  }

  const closePanel = () => {
    setSelectedLessonId(null)
    setLessonContent(null)
  }

  const selectedLesson = selectedLessonId ? lessons.find((l) => l.id === selectedLessonId) : null

  return (
    <div className="lessons-content">
      {/* Search and Filters Section */}
      <div className="lessons-search-section">
        {/* Search Bar */}
        <div className="lessons-search-container">
          <div className="lessons-search-input-container">
            <Search className="lessons-search-icon" />
            <input
              type="text"
              placeholder="Search lessons, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lessons-search-input"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lessons-filters-toggle"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="lessons-filters-panel">
            <div className="lessons-filters-grid">
              {/* Category Filter */}
              <div className="lessons-filter-group">
                <label className="lessons-filter-label">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="lessons-filter-select"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="lessons-filter-group">
                <label className="lessons-filter-label">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="lessons-filter-select"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="lessons-filter-group">
                <label className="lessons-filter-label">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="lessons-filter-select"
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
              <div className="lessons-clear-filters">
                <button
                  onClick={resetFilters}
                  className="lessons-clear-filters-button"
                >
                  <X className="lessons-clear-icon" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="lessons-results-header">
        <p className="lessons-results-count">
          Showing <span className="lessons-results-highlight">{filteredLessons.length}</span> of{" "}
          <span className="lessons-results-highlight">{lessons.length}</span> lessons
        </p>
      </div>

      {/* Main Content */}
      <div className="lessons-main-content">
        {/* Lessons Grid */}
        <div>
          {filteredLessons.length > 0 ? (
            <div className="lessons-grid">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="lesson-card"
                >
                  {/* Bookmark Button */}
                  <div className="lesson-bookmark">
                    <BookmarkButton lessonId={lesson.id} />
                  </div>

                  {/* Completed Badge */}
                  {lesson.completed && (
                    <div className="lesson-completed-badge">
                      ✓ Completed
                    </div>
                  )}

                  <div className="lesson-card-header">
                    <div className="lesson-card-header-content">
                      <div className="lesson-type-icon-container">
                        <div
                          className="lesson-type-icon"
                          style={{ backgroundColor: lesson.categoryColor }}
                        >
                          {getTypeIcon(lesson.type)}
                        </div>
                        <div className="lesson-card-title-container">
                          <h3 className="lesson-card-title">
                            {lesson.title}
                          </h3>
                          <p className="lesson-card-category">{lesson.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lesson-card-content">
                    <p className="lesson-card-description">{lesson.description}</p>

                    {/* Tags */}
                    {lesson.tags.length > 0 && (
                      <div className="lesson-tags">
                        {lesson.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="lesson-tag"
                          >
                            {tag}
                          </span>
                        ))}
                        {lesson.tags.length > 2 && (
                          <span className="lesson-tag-extra">
                            +{lesson.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="lesson-meta">
                      <div className="lesson-meta-left">
                        <div className="lesson-duration">
                          <Clock className="lesson-clock-icon" />
                          <span>{lesson.duration} min</span>
                        </div>
                        <span
                          className={`lesson-difficulty ${getDifficultyColor(lesson.difficulty)}`}
                        >
                          {lesson.difficulty}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReadMore(lesson.id)}
                      className="lesson-action-button"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="lessons-no-results">
              <div className="lessons-no-results-icon">
                <Search className="lessons-no-results-search-icon" />
              </div>
              <h3 className="lessons-no-results-title">No lessons found</h3>
              <p className="lessons-no-results-text">Try adjusting your search or filter criteria</p>
              <button
                onClick={resetFilters}
                className="lessons-no-results-button"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {selectedLesson && (
          <>
            {/* Overlay */}
            <div className="lesson-overlay" onClick={closePanel} />

            {/* Slide-in Card */}
            <div className={`lesson-slide-card ${selectedLessonId ? "open" : ""}`}>
              {/* Header */}
              <div className="lesson-card-header">
                <h2 className="lesson-card-title">Reading</h2>
                <button onClick={closePanel} className="lesson-close-btn">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="lesson-card-content">
                {loadingContent ? (
                  <div className="lesson-loading">
                    <div className="lesson-loading-item"></div>
                    <div className="lesson-loading-item"></div>
                    <div className="lesson-loading-item"></div>
                  </div>
                ) : lessonContent ? (
                  <>
                    {/* Icon and Title */}
                    <div className="lesson-detail-header">
                      <div
                        className="lesson-detail-icon"
                        style={{ backgroundColor: selectedLesson.categoryColor }}
                      >
                        {getTypeIcon(selectedLesson.type)}
                      </div>
                      <div>
                        <h3 className="lesson-detail-title">{selectedLesson.title}</h3>
                        <p className="lesson-detail-category">{selectedLesson.category}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="lesson-detail-description">
                      <p>{selectedLesson.description}</p>
                    </div>

                    {/* Meta Information */}
                    <div className="lesson-detail-meta">
                      <div className="lesson-meta-item">
                        <span className="lesson-meta-label">Duration</span>
                        <span className="lesson-meta-value">
                          <Clock className="w-4 h-4" />
                          {selectedLesson.duration} min
                        </span>
                      </div>
                      <div className="lesson-meta-item">
                        <span className="lesson-meta-label">Difficulty</span>
                        <span
                          className={`lesson-difficulty ${getDifficultyColor(selectedLesson.difficulty)}`}
                        >
                          {selectedLesson.difficulty}
                        </span>
                      </div>
                      <div className="lesson-meta-item">
                        <span className="lesson-meta-label">Type</span>
                        <span className="lesson-meta-value capitalize">{selectedLesson.type}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedLesson.tags.length > 0 && (
                      <div className="lesson-detail-tags">
                        <p className="lesson-detail-tags-label">Tags</p>
                        <div className="lesson-detail-tags-list">
                          {selectedLesson.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="lesson-detail-tag"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lesson Content */}
                    {lessonContent.type === "TEXT" && (
                      <div className="lesson-content-section">
                        <div
                          className="lesson-content-text"
                          dangerouslySetInnerHTML={{
                            __html: lessonContent.content
                              .replace(/\n/g, "<br>")
                              .replace(
                                /`([^`]+)`/g,
                                "<code class='lesson-content-code'>$1</code>",
                              )
                              .replace(/\*\*([^*]+)\*\*/g, "<strong class='lesson-content-strong'>$1</strong>")
                              .replace(/\*([^*]+)\*/g, "<em class='lesson-content-em'>$1</em>"),
                          }}
                        />
                      </div>
                    )}

                    {/* Completed Badge */}
                    {selectedLesson.completed && (
                      <div className="lesson-completed-section">
                        <span className="lesson-completed-check">✓</span>
                        <div className="lesson-completed-content">
                          <h3>Completed</h3>
                          <p>You've finished this lesson</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="lesson-error">
                    <p>Unable to load lesson content</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
