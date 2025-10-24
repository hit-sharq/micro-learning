"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { BookmarkButton } from "@/components/bookmark-button"
import { VideoPlayer } from "@/components/video-player"
import { AdvancedQuiz } from "@/components/advanced-quiz"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Play, BookOpen, HelpCircle, Clock, CheckCircle } from "lucide-react"

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
  const [isReadingOpen, setIsReadingOpen] = useState(false)

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

  const handleStartReading = () => {
    setIsReadingOpen(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <BookOpen className="w-5 h-5" />
      case "video":
        return <Play className="w-5 h-5" />
      case "quiz":
        return <HelpCircle className="w-5 h-5" />
      default:
        return <BookOpen className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/60 rounded-lg w-1/4 mb-6"></div>
            <div className="h-64 bg-white/60 rounded-2xl mb-6"></div>
            <div className="h-4 bg-white/60 rounded-lg w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
          <BackButton href="/lessons" label="Back to Lessons" variant="default" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton href="/lessons" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: lesson.category.color + '20', color: lesson.category.color }}
                  >
                    {lesson.category.name}
                  </span>
                  <span className="text-sm text-gray-600 capitalize">
                    {lesson.difficulty.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <BookmarkButton lessonId={lesson.id} />
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 px-3 py-2 rounded-full">
                <span>⏱️</span>
                <span className="font-medium">{lesson.estimatedDuration} min</span>
              </div>
              {completed && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <span>✓</span>
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Lesson Overview Card */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getTypeIcon(lesson.type.toLowerCase())}
                <span>{lesson.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">{lesson.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.estimatedDuration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="capitalize">{lesson.difficulty.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{lesson.category.name}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleStartReading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  {completed ? "Review Lesson" : "Start Reading"}
                  <Play className="w-4 h-4 ml-2" />
                </Button>

                {completed && (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reading Content */}
          {isReadingOpen && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    {getTypeIcon(lesson.type.toLowerCase())}
                    {lesson.title}
                  </h2>
                  <Button
                    onClick={() => setIsReadingOpen(false)}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>

                {lesson.type === "TEXT" && (
                  <div className="space-y-6">
                    <div className="prose prose-lg max-w-none">
                      <div
                        className="text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: lesson.content
                            .replace(/\n/g, "<br>")
                            .replace(/`([^`]+)`/g, "<code class='bg-gray-100 px-2 py-1 rounded text-sm font-mono'>$1</code>")
                            .replace(/\*\*([^*]+)\*\*/g, "<strong class='font-semibold'>$1</strong>")
                            .replace(/\*([^*]+)\*/g, "<em class='italic'>$1</em>"),
                        }}
                      />
                    </div>

                    {!completed && (
                      <div className="pt-6 border-t border-gray-200">
                        <Button
                          onClick={() => handleComplete()}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg transition-all duration-200"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Complete
                        </Button>
                      </div>
                    )}

                    {completed && (
                      <div className="pt-6 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center gap-3 text-green-700">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">🎉</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">Lesson Completed!</h4>
                              <p className="text-sm text-green-600">Great job!</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {lesson.type === "VIDEO" && (
                  <div className="space-y-6">
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

                    <div>
                      <h3 className="text-lg font-semibold mb-2">About this lesson</h3>
                      <p className="text-gray-700">{lesson.description}</p>
                    </div>

                    {completed && (
                      <div className="pt-6 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center gap-3 text-green-700">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-lg">🎉</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">Video Completed!</h4>
                              <p className="text-sm text-green-600">Great job!</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {lesson.type === "QUIZ" && lesson.quizData && (
                  <div className="space-y-6">
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
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
