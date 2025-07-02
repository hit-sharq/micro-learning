"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, Lightbulb, ArrowRight } from "lucide-react"

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "fill-blank"
  question: string
  options?: string[]
  correctAnswer: number | string
  explanation?: string
  hint?: string
  points: number
}

interface AdvancedQuizProps {
  questions: Question[]
  onComplete: (score: number, answers: Record<string, any>) => void
  timeLimit?: number
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
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (timeLimit && timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && timeLimit) {
      handleComplete()
    }
  }, [timeLeft, timeLimit, isCompleted])

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowHint(false)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsCompleted(true)
    setShowResults(true)

    const score = calculateScore()
    onComplete(score, answers)
  }

  const calculateScore = () => {
    let totalPoints = 0
    let earnedPoints = 0

    questions.forEach((question) => {
      totalPoints += question.points
      const userAnswer = answers[question.id]

      if (question.type === "multiple-choice" && userAnswer === question.correctAnswer) {
        earnedPoints += question.points
      } else if (question.type === "true-false" && userAnswer === question.correctAnswer) {
        earnedPoints += question.points
      } else if (
        question.type === "fill-blank" &&
        userAnswer?.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim()
      ) {
        earnedPoints += question.points
      }
    })

    return Math.round((earnedPoints / totalPoints) * 100)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              score >= 80 ? "bg-green-100" : score >= 60 ? "bg-yellow-100" : "bg-red-100"
            }`}
          >
            {score >= 80 ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600">Your Score: {score}%</p>
        </div>

        {showExplanations && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Answers</h3>
            {questions.map((question, index) => {
              const userAnswer = answers[question.id]
              const isCorrect =
                question.type === "multiple-choice"
                  ? userAnswer === question.correctAnswer
                  : question.type === "true-false"
                    ? userAnswer === question.correctAnswer
                    : userAnswer?.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim()

              return (
                <div key={question.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Question {index + 1}: {question.question}
                      </h4>
                      {question.explanation && <p className="text-gray-600 text-sm">{question.explanation}</p>}
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
    <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {timeLimit && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.question}</h3>

        {/* Multiple Choice */}
        {currentQ.type === "multiple-choice" && currentQ.options && (
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  answers[currentQ.id] === index ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name={currentQ.id}
                  value={index}
                  checked={answers[currentQ.id] === index}
                  onChange={() => handleAnswer(currentQ.id, index)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ.id] === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    }`}
                  >
                    {answers[currentQ.id] === index && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* True/False */}
        {currentQ.type === "true-false" && (
          <div className="space-y-3">
            {[true, false].map((option, index) => (
              <label
                key={index}
                className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  answers[currentQ.id] === index ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name={currentQ.id}
                  value={index}
                  checked={answers[currentQ.id] === index}
                  onChange={() => handleAnswer(currentQ.id, index)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ.id] === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    }`}
                  >
                    {answers[currentQ.id] === index && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-gray-900">{option ? "True" : "False"}</span>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Fill in the Blank */}
        {currentQ.type === "fill-blank" && (
          <input
            type="text"
            value={answers[currentQ.id] || ""}
            onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          />
        )}
      </div>

      {/* Hint */}
      {showHints && currentQ.hint && (
        <div className="mb-6">
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Show Hint</span>
            </button>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-800">{currentQ.hint}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">Points: {currentQ.points}</div>
        <button
          onClick={handleNext}
          disabled={!answers[currentQ.id]}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span>{currentQuestion === questions.length - 1 ? "Complete Quiz" : "Next Question"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
