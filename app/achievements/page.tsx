"use client"

import { useState, useEffect } from "react"
import BackButton from "@/app/lessons/BackButton"

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  type: string
  points: number
  isUnlocked: boolean
  unlockedAt?: string
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/achievements")
      const data = await response.json()
      setAchievements(data.achievements || [])
    } catch (error) {
      console.error("Failed to fetch achievements:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === "unlocked") return achievement.isUnlocked
    if (filter === "locked") return !achievement.isUnlocked
    return true
  })

  const totalPoints = achievements.filter((a) => a.isUnlocked).reduce((sum, a) => sum + a.points, 0)
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length

  if (loading) {
    return (
      <div className="space-y-8">
        <BackButton />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-slate-600 font-medium">Loading achievements...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <BackButton />
        <h1 className="text-4xl font-bold text-slate-900 mt-4 mb-2">Achievements</h1>
        <p className="text-lg text-slate-600">Track your learning milestones and unlock rewards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-bold text-purple-600 mb-2">{unlockedCount}</div>
          <div className="text-slate-600 font-medium">Achievements Unlocked</div>
          <div className="text-xs text-slate-500 mt-1">{achievements.length - unlockedCount} remaining</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-bold text-amber-600 mb-2">{totalPoints}</div>
          <div className="text-slate-600 font-medium">Total Points</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-bold text-indigo-600 mb-2">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </div>
          <div className="text-slate-600 font-medium">Completion Rate</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {achievements.filter((a) => a.isUnlocked && a.type === "STREAK").length}
          </div>
          <div className="text-slate-600 font-medium">Streak Achievements</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
            filter === "all" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All ({achievements.length})
        </button>
        <button
          onClick={() => setFilter("unlocked")}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
            filter === "unlocked"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Unlocked ({unlockedCount})
        </button>
        <button
          onClick={() => setFilter("locked")}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
            filter === "locked"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Locked ({achievements.length - unlockedCount})
        </button>
      </div>

      {/* Achievements Grid */}
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-2xl p-6 text-center border-2 transition-all transform hover:-translate-y-1 ${
                achievement.isUnlocked
                  ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:shadow-lg"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="text-6xl mb-4">{achievement.isUnlocked ? achievement.icon : "🔒"}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{achievement.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{achievement.description}</p>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    achievement.isUnlocked ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {achievement.points} points
                </span>
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <span className="text-xs text-slate-500">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {achievement.isUnlocked && (
                <div className="mt-3 text-emerald-600 font-semibold text-sm">✅ Unlocked!</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No achievements found</h3>
          <p className="text-slate-600">Try adjusting your filter or start learning to unlock achievements!</p>
        </div>
      )}
    </div>
  )
}
