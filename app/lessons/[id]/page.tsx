"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Import the new components at the top
import { VideoPlayer } from "@/components/video-player"
import { AdvancedQuiz } from "@/components/advanced-quiz"

interface Lesson {
  id: number
  title: string
  description: string
  content: string
  type: "text" | "video" | "quiz"
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
  category: string
  difficulty: string
  duration: number
}

// Update the lessons data to include video lessons
const lessons: Record<string, Lesson> = {
  "1": {
    id: 1,
    title: "JavaScript Basics",
    description: "Learn the fundamentals of JavaScript programming",
    content: `# JavaScript Basics

JavaScript is a versatile programming language that powers the modern web. In this lesson, we'll cover the fundamental concepts you need to get started.

## Variables

Variables are containers for storing data values. In JavaScript, you can declare variables using \`let\`, \`const\`, or \`var\`:

\`\`\`javascript
let name = "John";
const age = 25;
var city = "New York";
\`\`\`

## Functions

Functions are reusable blocks of code that perform specific tasks:

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alice")); // Output: Hello, Alice!
\`\`\`

## Data Types

JavaScript has several built-in data types:
- **String**: Text data
- **Number**: Numeric data
- **Boolean**: True or false
- **Array**: Ordered list of values
- **Object**: Key-value pairs

## Key Takeaways

1. Variables store data values
2. Functions make code reusable
3. JavaScript is dynamically typed
4. Practice is essential for mastery

Great job completing this lesson! You now understand the basic building blocks of JavaScript programming.`,
    type: "text",
    category: "Programming",
    difficulty: "beginner",
    duration: 5,
  },
  "4": {
    id: 4,
    title: "CSS Flexbox Quiz",
    description: "Test your knowledge of CSS Flexbox",
    content: "",
    type: "quiz",
    category: "Programming",
    difficulty: "intermediate",
    duration: 3,
    quizData: {
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question: "What does 'justify-content: center' do in Flexbox?",
          options: [
            "Centers items vertically",
            "Centers items horizontally along the main axis",
            "Distributes space evenly",
            "Aligns items to the start",
          ],
          correctAnswer: 1,
          explanation: "justify-content: center centers flex items along the main axis (horizontally by default).",
          hint: "Think about which axis justify-content affects.",
          points: 10,
        },
        {
          id: "q2",
          type: "multiple-choice",
          question: "Which property controls the main axis in Flexbox?",
          options: ["align-items", "justify-content", "flex-direction", "flex-wrap"],
          correctAnswer: 2,
          explanation: "flex-direction determines the main axis direction (row, column, etc.).",
          points: 10,
        },
        {
          id: "q3",
          type: "true-false",
          question: "Flexbox can only arrange items horizontally.",
          correctAnswer: 1, // False
          explanation:
            "Flexbox can arrange items both horizontally (row) and vertically (column) using flex-direction.",
          points: 5,
        },
        {
          id: "q4",
          type: "fill-blank",
          question: "What is the default value of flex-direction?",
          correctAnswer: "row",
          explanation: "The default flex-direction is 'row', which arranges items horizontally.",
          hint: "Think about the most common layout direction.",
          points: 15,
        },
      ],
    },
  },
  "5": {
    id: 5,
    title: "Machine Learning Intro",
    description: "Basic concepts of machine learning",
    content: "",
    type: "video",
    category: "Data Science",
    difficulty: "beginner",
    duration: 8,
    videoUrl: "/placeholder-video.mp4", // In a real app, this would be a real video URL
    videoThumbnail: "/placeholder.svg?height=400&width=600",
  },
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.id as string
  const lesson = lessons[lessonId]

  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <Link href="/lessons" className="btn btn-primary">
            Back to Lessons
          </Link>
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
              <Link href="/lessons" className="btn btn-secondary">
                ← Back
              </Link>
              <div>
                <h1 className="text-xl font-semibold">{lesson.title}</h1>
                <p className="text-sm text-gray-600">
                  {lesson.category} • {lesson.difficulty}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">⏱️ {lesson.duration} min</span>
              {completed && <span className="badge badge-success">✓ Completed</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {lesson.type === "text" && (
            <div className="card">
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: lesson.content.replace(/\n/g, "<br>").replace(/`([^`]+)`/g, "<code>$1</code>"),
                  }}
                />
              </div>

              {!completed && (
                <div className="mt-8 pt-6 border-t">
                  <button onClick={() => setCompleted(true)} className="btn btn-success">
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

          {lesson.type === "video" && (
            <div className="card">
              <VideoPlayer
                src={lesson.videoUrl || ""}
                poster={lesson.videoThumbnail}
                onProgress={(currentTime, duration) => {
                  // Save video progress
                  console.log(`Progress: ${currentTime}/${duration}`)
                }}
                onComplete={() => {
                  if (!completed) {
                    setCompleted(true)
                  }
                }}
              />

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">About this lesson</h2>
                <p className="text-gray-600 mb-4">{lesson.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span>⏱️ {lesson.duration} minutes</span>
                  <span>📊 {lesson.difficulty}</span>
                  <span>📂 {lesson.category}</span>
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

          {lesson.type === "quiz" && lesson.quizData && (
            <AdvancedQuiz
              questions={lesson.quizData.questions}
              onComplete={(score, answers) => {
                setScore(score)
                setCompleted(true)
                // In a real app, save the results to the database
                console.log("Quiz completed:", { score, answers })
              }}
              timeLimit={300} // 5 minutes total
              showHints={true}
              showExplanations={true}
            />
          )}
        </div>
      </div>
    </div>
  )
}
