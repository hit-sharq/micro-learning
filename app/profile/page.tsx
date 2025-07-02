"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"

interface UserProfile {
  timezone: string
  dailyGoal: number
  reminderTime: string
  emailNotifications: boolean
  pushNotifications: boolean
  preferredDifficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null
  preferredCategories: string[]
  learningStyle: "VISUAL" | "AUDITORY" | "KINESTHETIC" | "MIXED"
}

const categories = [
  { id: "1", name: "Programming", color: "#3B82F6" },
  { id: "2", name: "Data Science", color: "#8B5CF6" },
  { id: "3", name: "Design", color: "#EC4899" },
  { id: "4", name: "Business", color: "#10B981" },
  { id: "5", name: "Marketing", color: "#F59E0B" },
]

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
]

export default function ProfilePage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile>({
    timezone: "UTC",
    dailyGoal: 1,
    reminderTime: "09:00",
    emailNotifications: true,
    pushNotifications: true,
    preferredDifficulty: null,
    preferredCategories: [],
    learningStyle: "MIXED",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        setMessage("Profile updated successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      setMessage("Failed to update profile. Please try again.")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setProfile((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(categoryId)
        ? prev.preferredCategories.filter((id) => id !== categoryId)
        : [...prev.preferredCategories, categoryId],
    }))
  }

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse">Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-600">Customize your learning experience</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("success")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-2 gap-8">
        {/* Personal Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Personal Information</h3>
          </div>

          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" value={user?.fullName || ""} disabled />
              <p className="text-sm text-gray-500 mt-1">Name is managed through your account settings</p>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={user?.primaryEmailAddress?.emailAddress || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select
                className="form-input form-select"
                value={profile.timezone}
                onChange={(e) => setProfile((prev) => ({ ...prev, timezone: e.target.value }))}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Learning Preferences</h3>
          </div>

          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Daily Learning Goal</label>
              <select
                className="form-input form-select"
                value={profile.dailyGoal}
                onChange={(e) => setProfile((prev) => ({ ...prev, dailyGoal: Number.parseInt(e.target.value) }))}
              >
                <option value={1}>1 lesson per day</option>
                <option value={2}>2 lessons per day</option>
                <option value={3}>3 lessons per day</option>
                <option value={5}>5 lessons per day</option>
                <option value={10}>10 lessons per day</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Difficulty</label>
              <select
                className="form-input form-select"
                value={profile.preferredDifficulty || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    preferredDifficulty: (e.target.value as any) || null,
                  }))
                }
              >
                <option value="">No preference</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Learning Style</label>
              <select
                className="form-input form-select"
                value={profile.learningStyle}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    learningStyle: e.target.value as any,
                  }))
                }
              >
                <option value="VISUAL">Visual (prefer images, diagrams)</option>
                <option value="AUDITORY">Auditory (prefer videos, audio)</option>
                <option value="KINESTHETIC">Kinesthetic (prefer interactive)</option>
                <option value="MIXED">Mixed (all types)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preferred Categories */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Preferred Categories</h3>
            <p className="text-sm text-gray-600">Select topics you're most interested in</p>
          </div>

          <div className="grid grid-2 gap-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={profile.preferredCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="font-medium">{category.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Daily Reminder Time</label>
              <input
                type="time"
                className="form-input"
                value={profile.reminderTime}
                onChange={(e) => setProfile((prev) => ({ ...prev, reminderTime: e.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={profile.emailNotifications}
                  onChange={(e) => setProfile((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive progress updates and new content alerts</div>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={profile.pushNotifications}
                  onChange={(e) => setProfile((prev) => ({ ...prev, pushNotifications: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-gray-600">Get reminded about your daily learning goals</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex gap-4">
        <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <Link href="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
