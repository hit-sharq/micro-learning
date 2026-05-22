"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, Clock, BookOpen, Play, HelpCircle, X, ArrowLeft, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PremiumButton } from "@/components/premium"
import { PremiumBadge } from "@/components/premium"

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

const typeIconMap: Record<string, React.ElementType> = {
  text: BookOpen,
  video: Play,
  quiz: HelpCircle,
}

const difficultyBadge: Record<string, { variant: "primary" | "success" | "warning" | "danger"; label: string }> = {
  beginner:    { variant: "success",    label: "Beginner" },
  intermediate:{ variant: "warning",    label: "Intermediate" },
  advanced:    { variant: "danger",     label: "Advanced" },
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
      const mSearch =
        !searchQuery ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      const mCat = selectedCategory === "all" || lesson.category === selectedCategory
      const mDif = selectedDifficulty === "all" || lesson.difficulty === selectedDifficulty
      const mType = selectedType === "all" || lesson.type === selectedType
      return mSearch && mCat && mDif && mType
    })
  }, [lessons, searchQuery, selectedCategory, selectedDifficulty, selectedType])

  const hasFilters = searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" || selectedType !== "all"

  const resetFilters = () => {
    setSearchQuery(""); setSelectedCategory("all"); setSelectedDifficulty("all"); setSelectedType("all")
  }

  const TypeIcon = (type: string) => typeIconMap[type] || BookOpen

  return (
    <div className="space-y-6">

      {/* ── Search + filters ─────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search lessons, topics, or tags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/70 dark:border-slate-700/70 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "inline-flex items-center gap-2 px-5 h-11 rounded-xl text-sm font-semibold transition-all",
              showFilters
                ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/30"
                : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasFilters && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Category",    value: selectedCategory,   onChange: setSelectedCategory,   options: categories.map(c => [c, c === "all" ? "All" : c]) },
                { label: "Difficulty",  value: selectedDifficulty, onChange: setSelectedDifficulty, options: [["all","All Levels"],["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]] },
                { label: "Type",        value: selectedType,       onChange: setSelectedType,       options: [["all","All Types"],["text","Text"],["video","Video"],["quiz","Quiz"]] },
              ].map(({ label, value, onChange, options }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                  <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200/70 dark:border-slate-700/70 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    {options.map(([v, l]) => (
                      <option key={v} value={v}>{l as string}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {hasFilters && (
              <div className="mt-4 flex justify-end">
                <button onClick={resetFilters} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors">
                  <X className="w-3.5 h-3.5" /> Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Results header ────────────────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filteredLessons.length}</span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">{lessons.length}</span>{" "}
          lessons
        </p>
        {hasFilters && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Filter className="w-3 h-3" /> Filters active
          </span>
        )}
      </div>

      {/* ── Grid ──────────────────────────────────────────────── */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredLessons.map((lesson) => {
            const ResolvedTypeIcon = TypeIcon(lesson.type)
            const diffTok = difficultyBadge[lesson.difficulty] || { variant: "primary" as const, label: lesson.difficulty }
            return (
              <div
                key={lesson.id}
                className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 hover:border-indigo-300/60 dark:hover:border-indigo-700/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/8 hover:-translate-y-1 overflow-hidden"
              >
                {/* top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: lesson.categoryColor }}
                />
                {/* completed badge */}
                {lesson.completed && (
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <PremiumBadge variant="success" size="sm" dot>
                      ✓ Completed
                    </PremiumBadge>
                  </div>
                )}
                {/* bookmark */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <BookmarkButton lessonId={lesson.id} />
                </div>

                {/* Card body */}
                <div className="p-6 pt-14 sm:pt-6">
                  {/* icon + title row */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                      style={{ backgroundColor: lesson.categoryColor }}
                    >
                      <ResolvedTypeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-1">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lesson.category}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {lesson.description}
                  </p>

                  {/* Tags */}
                  {lesson.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {lesson.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta row */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" /> {lesson.duration}m
                      </span>
                      <PremiumBadge variant={diffTok.variant} size="sm">{diffTok.label}</PremiumBadge>
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                      {lesson.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">No lessons found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Try adjusting your search or filters</p>
          <button onClick={resetFilters} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Clear filters</button>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   BookmarkButton — thin wrapper around existing component
   ══════════════════════════════════════════════════════════ */
import { useTransition } from "react"
import { Bookmark } from "lucide-react"

function BookmarkButton({ lessonId }: { lessonId: number }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isPending, startTransition] = useTransition()

  const toggle = () => {
    startTransition(async () => {
      setIsBookmarked((prev) => !prev)
      try {
        await fetch("/api/bookmarks", {
          method: isBookmarked ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        })
      } catch {
        setIsBookmarked((prev) => !prev)
      }
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      className={cn(
        "p-2 rounded-xl transition-all duration-200",
        isBookmarked
          ? "bg-amber-50 dark:bg-amber-500/15 text-amber-500"
          : "bg-white/60 dark:bg-slate-800/60 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50",
      )}
    >
      <Bookmark className={cn("w-4.5 h-4.5 transition-all", isBookmarked && "fill-current")} />
    </button>
  )
}
