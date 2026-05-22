"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BackButton } from "@/components/premium"
import { PremiumButton } from "@/components/premium"
import { PremiumBadge } from "@/components/premium"
import { Bookmark, Clock, BookOpen, Play, HelpCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Bookmark {
  id: number
  lesson: {
    id: number
    title: string
    description: string
    type: string
    difficulty: string
    estimatedDuration: number
    category: { name: string; color: string }
  }
  createdAt: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBookmarks() }, [])

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmarks")
      if (res.ok) {
        const data = await res.json()
        setBookmarks(data.bookmarks || [])
      } else {
        toast.error("Failed to load bookmarks")
      }
    } catch {
      toast.error("Failed to load bookmarks")
    } finally {
      setLoading(false)
    }
  }

  const removeBookmark = async (lessonId: number) => {
    try {
      await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      })
      setBookmarks((prev) => prev.filter((b) => b.lesson.id !== lessonId))
      toast.success("Bookmark removed")
    } catch {
      toast.error("Failed to remove bookmark")
    }
  }

  const typeIcon: Record<string, React.ElementType> = {
    TEXT: BookOpen, VIDEO: Play, QUIZ: HelpCircle,
  }

  if (loading) {
    return (
      <div className="space-y-8 pt-4">
        <div className="absolute top-4 left-4 z-40 pt-2"><BackButton href="/dashboard" /></div>
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 relative">

      {/* ── Back ─────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 z-40 pt-2"><BackButton href="/dashboard" /></div>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-4 ring-1 ring-indigo-200/50 dark:ring-indigo-500/20">
          <Bookmark className="w-4 h-4" />
          Saved
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Bookmarks</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
          Lessons you&apos;ve saved to revisit later
        </p>
      </div>

      {/* ── Empty ────────────────────────────────────────────── */}
      {bookmarks.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
            <Bookmark className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">No bookmarks yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
            Save any lesson to come back to it later — they&apos;ll appear right here.
          </p>
          <Link href="/lessons">
            <PremiumButton variant="gradient" rightIcon={<ArrowRight className="w-4.5 h-4.5" />}>
              Browse Lessons
            </PremiumButton>
          </Link>
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────── */}
      {bookmarks.length > 0 && (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 px-1">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{bookmarks.length}</span> saved lesson{bookmarks.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookmarks.map((bookmark) => {
              const Icon = typeIcon[bookmark.lesson.type] || BookOpen
              const diffColor =
                bookmark.lesson.difficulty === "BEGINNER"
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40"
                  : bookmark.lesson.difficulty === "INTERMEDIATE"
                    ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40"
                    : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/60 dark:border-red-800/40"

              return (
                <div
                  key={bookmark.id}
                  className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 hover:border-indigo-300/60 dark:hover:border-indigo-700/40 hover:shadow-xl hover:shadow-indigo-500/8 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: bookmark.lesson.category.color }}
                  />

                  {/* Remove bookmark */}
                  <button
                    onClick={() => removeBookmark(bookmark.lesson.id)}
                    aria-label="Remove bookmark"
                    className="absolute top-3.5 right-3.5 z-10 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/15 transition-all"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  {/* Card body */}
                  <Link href={`/lessons/${bookmark.lesson.id}`} className="block p-6">
                    <div className="flex items-start gap-3.5 mb-4">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md",
                          "group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
                        )}
                        style={{ backgroundColor: bookmark.lesson.category.color }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-1">
                          {bookmark.lesson.title}
                        </h3>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: bookmark.lesson.category.color }}>
                          {bookmark.lesson.category.name}
                        </p>
                        <p className="text-xs text-slate-400 capitalize">{bookmark.lesson.difficulty.toLowerCase()}</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {bookmark.lesson.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" /> {bookmark.lesson.estimatedDuration} min
                        </span>
                        <PremiumBadge
                          variant={
                            bookmark.lesson.difficulty === "BEGINNER"
                              ? "success"
                              : bookmark.lesson.difficulty === "INTERMEDIATE"
                                ? "warning"
                                : "danger"
                          }
                          size="sm"
                        >
                          {bookmark.lesson.difficulty.toLowerCase()}
                        </PremiumBadge>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {bookmark.lesson.type}
                      </span>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
