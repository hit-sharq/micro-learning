"use client"

import { useState, useEffect } from "react"

interface QuizQuestion {
  id: string
  type: "multiple-choice" | "true-false" | "fill-blank" | "drag-drop"
  question: string
  options?: string[]
  correctAnswer: string | number | string[]
  explanation?: string
  hint?: string
  timeLimit?: number // seconds
  points: number
}

interface AdvancedQuizProps {
  questions: QuizQuestion[]
  onComplete: (score: number, answers: Record<string, any>) => void
  timeLimit?: number // total quiz time limit in seconds
  showHints?: boolean
  showExplanations?: boolean
}

export function AdvancedQuiz({
  questions,
  onComplete,
  timeLimit,
  showHints = true,
  showExplanations = true,
}: AdvancedQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showHint, setShowHint] = useState<Record<string, boolean>>({})
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  // Timer effects
  useEffect(() => {
    if (timeLimit && timeRemaining && timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      handleQuizComplete()
    }
  }, [timeRemaining, timeLimit, isCompleted])

  useEffect(() => {
    if (currentQuestion?.timeLimit) {
      setQuestionTimeRemaining(currentQuestion.timeLimit)
    }
  }, [currentQuestionIndex, currentQuestion])

  useEffect(() => {
    if (questionTimeRemaining && questionTimeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setQuestionTimeRemaining(questionTimeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (questionTimeRemaining === 0) {
      handleNextQuestion()
    }
  }, [questionTimeRemaining, isCompleted])

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setQuestionTimeRemaining(questions[currentQuestionIndex + 1]?.timeLimit || null)
    } else {
      handleQuizComplete()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setQuestionTimeRemaining(questions[currentQuestionIndex - 1]?.timeLimit || null)
    }
  }

  const handleQuizComplete = () => {
    setIsCompleted(true)
    const score = calculateScore()
    onComplete(score, answers)
    setShowResults(true)
  }

  const calculateScore = () => {
    let totalPoints = 0
    let earnedPoints = 0

    questions.forEach((question) => {
      totalPoints += question.points
      const userAnswer = answers[question.id]

      if (isAnswerCorrect(question, userAnswer)) {
        earnedPoints += question.points
      }
    })

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
  }

  const isAnswerCorrect = (question: QuizQuestion, userAnswer: any) => {
    if (!userAnswer) return false

    switch (question.type) {
      case "multiple-choice":
      case "true-false":
        return userAnswer === question.correctAnswer
      case "fill-blank":
        return userAnswer.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim()
      case "drag-drop":
        return JSON.stringify(userAnswer.sort()) === JSON.stringify(question.correctAnswer)
      default:
        return false
    }
  }

  const toggleHint = (questionId: string) => {
    setShowHint((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="card max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {score >= 90 ? "🏆" : score >= 80 ? "🎉" : score >= 70 ? "👍" : score >= 60 ? "📚" : "💪"}
          </div>
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600">You scored {score}%</p>
        </div>

        {showExplanations && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Review Your Answers</h3>
            {questions.map((question, index) => {
              const userAnswer = answers[question.id]
              const isCorrect = isAnswerCorrect(question, userAnswer)

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>

                      {question.type === "multiple-choice" && (
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded ${
                                optIndex === question.correctAnswer
                                  ? "bg-green-100 text-green-800"
                                  : optIndex === userAnswer
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-50"
                              }`}
                            >
                              {option}
                              {optIndex === question.correctAnswer && " ✓"}
                              {optIndex === userAnswer && optIndex !== question.correctAnswer && " ✗"}
                            </div>
                          ))}
                        </div>
                      )}

                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card max-w-4xl mx-auto">
      {/* Header with timers */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <div className="text-sm text-gray-500 mt-1">
            {currentQuestion.points} point{currentQuestion.points !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          {timeLimit && timeRemaining && (
            <div
              className={`px-3 py-1 rounded-full ${
                timeRemaining < 60 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              Total: {formatTime(timeRemaining)}
            </div>
          )}
          {questionTimeRemaining && (
            <div
              className={`px-3 py-1 rounded-full ${
                questionTimeRemaining < 10 ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
              }`}
            >
              Question: {formatTime(questionTimeRemaining)}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-6">{currentQuestion.question}</h3>

        {/* Multiple Choice */}
        {currentQuestion.type === "multiple-choice" && (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <label key={index} className="quiz-option cursor-pointer">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={index}
                  checked={answers[currentQuestion.id] === index}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, Number.parseInt(e.target.value))}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQuestion.id] === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion.id] === index && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                  </div>
                  <span>{option}</span>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* True/False */}
        {currentQuestion.type === "true-false" && (
          <div className="space-y-3">
            {["True", "False"].map((option, index) => (
              <label key={index} className="quiz-option cursor-pointer">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={index}
                  checked={answers[currentQuestion.id] === index}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, Number.parseInt(e.target.value))}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQuestion.id] === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion.id] === index && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                  </div>
                  <span>{option}</span>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Fill in the blank */}
        {currentQuestion.type === "fill-blank" && (
          <div>
            <input
              type="text"
              className="form-input w-full max-w-md"
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            />
          </div>
        )}

        {/* Hint */}
        {showHints && currentQuestion.hint && (
          <div className="mt-4">
            <button onClick={() => toggleHint(currentQuestion.id)} className="btn btn-secondary btn-sm">
              {showHint[currentQuestion.id] ? "Hide Hint" : "Show Hint"} 💡
            </button>
            {showHint[currentQuestion.id] && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">{currentQuestion.hint}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="btn btn-secondary">
          ← Previous
        </button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                index === currentQuestionIndex
                  ? "bg-blue-500 text-white"
                  : answers[questions[index].id] !== undefined
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={currentQuestionIndex === questions.length - 1 ? handleQuizComplete : handleNextQuestion}
          disabled={answers[currentQuestion.id] === undefined}
          className="btn btn-primary"
        >
          {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next →"}
        </button>
      </div>
    </div>
  )
}
