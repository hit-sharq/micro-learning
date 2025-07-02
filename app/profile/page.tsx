"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { BackButton } from "@/components/back-button"
import { toast } from "sonner"

interface ProfileData {
  timezone: string
  dailyGoal: number
  reminderTime: string
  emailNotifications: boolean
  pushNotifications: boolean
  preferredDifficulty: string
  preferredCategories: string[]
  learningStyle: string
}

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

const categories = ["Programming", "Data Science", "Design", "Business", "Marketing", "Languages", "Science", "Arts"]

export default function ProfilePage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    timezone: "UTC",
    dailyGoal: 1,
    reminderTime: "09:00",
    emailNotifications: true,
    pushNotifications: true,
    preferredDifficulty: "BEGINNER",
    preferredCategories: [],
    learningStyle: "VISUAL",
  })

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
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast.success("Profile updated successfully!")
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
      toast.error("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCategoryToggle = (category: string) => {
    setProfile((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter((c) => c !== category)
        : [...prev.preferredCategories, category],
    }))
  }

  if (loading) {
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackButton href="/dashboard" />
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-gray-600">Customize your learning experience</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* User Info */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Account Information</h3>
          </div>
          <div className="flex items-center gap-4">
            <img src={user?.imageUrl || "/placeholder-user.jpg"} alt="Profile" className="w-16 h-16 rounded-full" />
            <div>
              <h4 className="font-semibold">{user?.fullName || "User"}</h4>
              <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Learning Preferences</h3>
          </div>

          <div className="grid grid-2 gap-6">
            <div className="form-group">
              <label className="form-label">Daily Goal (lessons per day)</label>
              <select
                className="form-input form-select"
                value={profile.dailyGoal}
                onChange={(e) => setProfile((prev) => ({ ...prev, dailyGoal: Number.parseInt(e.target.value) }))}
              >
                <option value={1}>1 lesson</option>
                <option value={2}>2 lessons</option>
                <option value={3}>3 lessons</option>
                <option value={5}>5 lessons</option>
                <option value={10}>10 lessons</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Difficulty</label>
              <select
                className="form-input form-select"
                value={profile.preferredDifficulty}
                onChange={(e) => setProfile((prev) => ({ ...prev, preferredDifficulty: e.target.value }))}
              >
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
                onChange={(e) => setProfile((prev) => ({ ...prev, learningStyle: e.target.value }))}
              >
                <option value="VISUAL">Visual</option>
                <option value="AUDITORY">Auditory</option>
                <option value="KINESTHETIC">Hands-on</option>
                <option value="READING">Reading/Writing</option>
              </select>
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

          <div className="form-group">
            <label className="form-label">Preferred Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    profile.preferredCategories.includes(category)
                      ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold">Notifications</h3>
          </div>

          <div className="grid grid-2 gap-6">
            <div className="form-group">
              <label className="form-label">Daily Reminder Time</label>
              <input
                type="time"
                className="form-input"
                value={profile.reminderTime}
                onChange={(e) => setProfile((prev) => ({ ...prev, reminderTime: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={profile.emailNotifications}
                  onChange={(e) => setProfile((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
                  className="rounded"
                />
                <span>Email notifications</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={profile.pushNotifications}
                  onChange={(e) => setProfile((prev) => ({ ...prev, pushNotifications: e.target.checked }))}
                  className="rounded"
                />
                <span>Push notifications</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <BackButton href="/dashboard" label="Cancel" variant="outline" />
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
