"use client"

import { useState, useEffect } from "react"

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  points: number
}

interface AchievementNotificationProps {
  achievements: Achievement[]
  onClose: () => void
}

export function AchievementNotification({ achievements, onClose }: AchievementNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (achievements.length === 0) return

    const timer = setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        onClose()
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [currentIndex, achievements.length, onClose])

  if (achievements.length === 0) return null

  const achievement = achievements[currentIndex]

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6 shadow-xl max-w-sm">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-lg">Achievement Unlocked!</div>
            <div className="font-semibold">{achievement.name}</div>
            <div className="text-sm opacity-90">{achievement.description}</div>
            <div className="text-xs mt-1">+{achievement.points} points</div>
          </div>
        </div>

        {achievements.length > 1 && (
          <div className="mt-3 text-xs text-center opacity-75">
            {currentIndex + 1} of {achievements.length}
          </div>
        )}
      </div>
    </div>
  )
}
