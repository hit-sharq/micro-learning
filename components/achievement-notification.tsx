"use client"

import { useState, useEffect } from "react"
import { X, Trophy } from "lucide-react"

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  points: number
}

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100)

    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{achievement.icon}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4" />
                <span className="font-semibold text-sm">Achievement Unlocked!</span>
              </div>
              <h4 className="font-bold">{achievement.name}</h4>
              <p className="text-sm opacity-90">{achievement.description}</p>
              <div className="text-xs mt-1 opacity-75">+{achievement.points} points</div>
            </div>
          </div>
          <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Achievement Manager Component
export function AchievementManager() {
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    // Listen for achievement events
    const handleAchievement = (event: CustomEvent<Achievement>) => {
      setAchievements((prev) => [...prev, event.detail])
    }

    window.addEventListener("achievement-unlocked", handleAchievement as EventListener)

    return () => {
      window.removeEventListener("achievement-unlocked", handleAchievement as EventListener)
    }
  }, [])

  const removeAchievement = (id: number) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <>
      {achievements.map((achievement) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => removeAchievement(achievement.id)}
        />
      ))}
    </>
  )
}

// Helper function to trigger achievement notifications
export function triggerAchievement(achievement: Achievement) {
  const event = new CustomEvent("achievement-unlocked", { detail: achievement })
  window.dispatchEvent(event)
}
