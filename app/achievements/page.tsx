"use client"

import { useState, useEffect } from "react"

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
  const [filter, setFilter] = useState("all") // all, unlocked, locked

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
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">Loading achievements...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        <p className="text-gray-600">Track your learning milestones and unlock rewards</p>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-value">{unlockedCount}</div>
          <div className="stat-label">Achievements Unlocked</div>
          <div className="text-xs text-gray-500 mt-1">{achievements.length - unlockedCount} remaining</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalPoints}</div>
          <div className="stat-label">Total Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{achievements.filter((a) => a.isUnlocked && a.type === "STREAK").length}</div>
          <div className="stat-label">Streak Achievements</div>
        </div>
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`btn ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
          >
            All ({achievements.length})
          </button>
          <button
            onClick={() => setFilter("unlocked")}
            className={`btn ${filter === "unlocked" ? "btn-primary" : "btn-secondary"}`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter("locked")}
            className={`btn ${filter === "locked" ? "btn-primary" : "btn-secondary"}`}
          >
            Locked ({achievements.length - unlockedCount})
          </button>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`card text-center transition-all duration-300 ${
              achievement.isUnlocked
                ? "border-yellow-300 bg-yellow-50 hover:shadow-lg"
                : "border-gray-200 bg-gray-50 opacity-60"
            }`}
          >
            <div className="text-6xl mb-4">{achievement.isUnlocked ? achievement.icon : "🔒"}</div>
            <h3 className="text-lg font-semibold mb-2">{achievement.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>

            <div className="flex items-center justify-between">
              <span className={`badge ${achievement.isUnlocked ? "badge-success" : "badge-secondary"}`}>
                {achievement.points} points
              </span>
              {achievement.isUnlocked && achievement.unlockedAt && (
                <span className="text-xs text-gray-500">{new Date(achievement.unlockedAt).toLocaleDateString()}</span>
              )}
            </div>

            {achievement.isUnlocked && <div className="mt-3 text-green-600 font-medium text-sm">✅ Unlocked!</div>}
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold mb-2">No achievements found</h3>
          <p className="text-gray-600">Try adjusting your filter or start learning to unlock achievements!</p>
        </div>
      )}
    </div>
  )
}
