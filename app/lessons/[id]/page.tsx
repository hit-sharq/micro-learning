"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { BookmarkButton } from "@/components/bookmark-button"
import { VideoPlayer } from "@/components/video-player"
import { AdvancedQuiz } from "@/components/advanced-quiz"
import { toast } from "sonner"

interface Lesson {
  id: number
  title: string
  description: string
  content: string
  type: "TEXT" | "VIDEO" | "QUIZ"
  videoUrl?: string
  videoThumbnail?: string
  quizData?: {
    questions: Array<{
      id: string
      type: "multiple-choice" | "true-false" | "fill-blank"
      question: string
      options?: string[]
      correctAnswer: number | string
      explanation?: string
      hint?: string
      points: number
    }>
  }
  category: {
    name: string
    color: string
  }
  difficulty: string
  estimatedDuration: number
  userProgress?: {
    completed: boolean
    score?: number
    timeSpent?: number
    videoProgress?: number
  }
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = Number.parseInt(params.id as string)

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`)
      if (response.ok) {
        const data = await response.json()
        setLesson(data.lesson)
        setCompleted(data.lesson.userProgress?.completed || false)
        setScore(data.lesson.userProgress?.score || 0)
      } else {
        toast.error("Lesson not found")
        router.push("/lessons")
      }
    } catch (error) {
      console.error("Failed to fetch lesson:", error)
      toast.error("Failed to load lesson")
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (progressData: any) => {
    try {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)

      const response = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...progressData,
          timeSpent,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        return data.progress
      }
    } catch (error) {
      console.error("Failed to update progress:", error)
      toast.error("Failed to save progress")
    }
  }

  const handleComplete = async (lessonScore?: number) => {
    const progress = await updateProgress({
      completed: true,
      score: lessonScore || 100,
    })

    if (progress) {
      setCompleted(true)
      setScore(lessonScore || 100)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <BackButton href="/lessons" label="Back to Lessons" variant="default" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton href="/lessons" />
              <div>
                <h1 className="text-xl font-semibold">{lesson.title}</h1>
                <p className="text-sm text-gray-600">
                  {lesson.category.name} • {lesson.difficulty.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <BookmarkButton lessonId={lesson.id} />
              <span className="text-sm text-gray-600">⏱️ {lesson.estimatedDuration} min</span>
              {completed && <span className="badge badge-success">✓ Completed</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {lesson.type === "TEXT" && (
            <div className="card">
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: lesson.content
                      .replace(/\n/g, "<br>")
                      .replace(/`([^`]+)`/g, "<code>$1</code>")
                      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*([^*]+)\*/g, "<em>$1</em>"),
                  }}
                />
              </div>

              {!completed && (
                <div className="mt-8 pt-6 border-t">
                  <button onClick={() => handleComplete()} className="btn btn-success">
                    Mark as Complete
                  </button>
                </div>
              )}

              {completed && (
                <div className="mt-8 pt-6 border-t bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <h3 className="font-semibold">Lesson Completed!</h3>
                      <p className="text-sm">Great job! You've successfully completed this lesson.</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Link href="/lessons" className="btn btn-primary">
                      Browse More Lessons
                    </Link>
                    <Link href="/dashboard" className="btn btn-secondary">
                      Back to Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {lesson.type === "VIDEO" && (
            <div className="card">
              <VideoPlayer
                src={lesson.videoUrl || ""}
                poster={lesson.videoThumbnail}
                onProgress={async (currentTime, duration) => {
                  const progress = (currentTime / duration) * 100
                  await updateProgress({ videoProgress: progress })
                }}
                onComplete={() => {
                  if (!completed) {
                    handleComplete()
                  }
                }}
              />

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">About this lesson</h2>
                <p className="text-gray-600 mb-4">{lesson.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span>⏱️ {lesson.estimatedDuration} minutes</span>
                  <span>📊 {lesson.difficulty.toLowerCase()}</span>
                  <span>📂 {lesson.category.name}</span>
                </div>

                {completed && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <h3 className="font-semibold">Video Completed!</h3>
                        <p className="text-sm">Great job! You've successfully watched this lesson.</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Link href="/lessons" className="btn btn-primary">
                        Browse More Lessons
                      </Link>
                      <Link href="/dashboard" className="btn btn-secondary">
                        Back to Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {lesson.type === "QUIZ" && lesson.quizData && (
            <AdvancedQuiz
              questions={lesson.quizData.questions}
              onComplete={async (finalScore, answers) => {
                await handleComplete(finalScore)
                await updateProgress({
                  quizAnswers: answers,
                  score: finalScore,
                })
              }}
              timeLimit={300}
              showHints={true}
              showExplanations={true}
            />
          )}
        </div>
      </div>
    </div>
  )
}
