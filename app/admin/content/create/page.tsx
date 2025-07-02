"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface LessonForm {
  title: string
  description: string
  content: string
  type: "text" | "video" | "quiz"
  categoryId: number
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedDuration: number
  tags: string[]
  videoUrl?: string
  videoThumbnail?: string
  quizData?: any
  attachments?: any[]
  metaDescription?: string
}

const categories = [
  { id: 1, name: "Programming" },
  { id: 2, name: "Data Science" },
  { id: 3, name: "Design" },
  { id: 4, name: "Business" },
  { id: 5, name: "Marketing" },
]

export default function CreateLesson() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<LessonForm>({
    title: "",
    description: "",
    content: "",
    type: "text",
    categoryId: 1,
    difficulty: "beginner",
    estimatedDuration: 5,
    tags: [],
    metaDescription: "",
  })

  const [quizQuestions, setQuizQuestions] = useState([
    {
      id: "q1",
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      points: 10,
    },
  ])

  const handleSubmit = async (isDraft = false) => {
    setIsLoading(true)

    try {
      const lessonData = {
        ...form,
        quizData: form.type === "quiz" ? { questions: quizQuestions } : null,
        isPublished: !isDraft,
      }

      const response = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/admin/content/edit/${data.lesson.id}`)
      } else {
        throw new Error("Failed to create lesson")
      }
    } catch (error) {
      console.error("Error creating lesson:", error)
      alert("Failed to create lesson. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        id: `q${quizQuestions.length + 1}`,
        type: "multiple-choice",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        points: 10,
      },
    ])
  }

  const updateQuizQuestion = (index: number, field: string, value: any) => {
    const updated = [...quizQuestions]
    updated[index] = { ...updated[index], [field]: value }
    setQuizQuestions(updated)
  }

  const removeQuizQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index))
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (!form.tags.includes(newTag)) {
        setForm({ ...form, tags: [...form.tags, newTag] })
      }
      e.currentTarget.value = ""
    }
  }

  const removeTag = (tagToRemove: string) => {
    setForm({ ...form, tags: form.tags.filter((tag) => tag !== tagToRemove) })
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Lesson</h1>
          <p className="text-gray-600">Build engaging educational content</p>
        </div>
        <Link href="/admin/content" className="btn btn-secondary">
          ← Back to Content
        </Link>
      </div>

      {/* Progress Steps */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: "Basic Info", icon: "📝" },
            { step: 2, title: "Content", icon: "📚" },
            { step: 3, title: "Settings", icon: "⚙️" },
            { step: 4, title: "Review", icon: "👀" },
          ].map(({ step, title, icon }) => (
            <div
              key={step}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                currentStep === step
                  ? "bg-blue-100 text-blue-800"
                  : currentStep > step
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setCurrentStep(step)}
            >
              <span>{icon}</span>
              <span className="font-medium">{title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

            <div className="grid grid-2 gap-6">
              <div className="form-group">
                <label className="form-label">Lesson Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter lesson title"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lesson Type *</label>
                <select
                  className="form-input form-select"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                >
                  <option value="text">📄 Text Lesson</option>
                  <option value="video">🎥 Video Lesson</option>
                  <option value="quiz">❓ Quiz</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of what students will learn"
                required
              />
            </div>

            <div className="grid grid-3 gap-4">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-input form-select"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: Number.parseInt(e.target.value) })}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty *</label>
                <select
                  className="form-input form-select"
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
                >
                  <option value="beginner">🟢 Beginner</option>
                  <option value="intermediate">🟡 Intermediate</option>
                  <option value="advanced">🔴 Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duration (minutes) *</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.estimatedDuration}
                  onChange={(e) => setForm({ ...form, estimatedDuration: Number.parseInt(e.target.value) })}
                  min="1"
                  max="120"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                className="form-input"
                placeholder="Type a tag and press Enter"
                onKeyDown={handleTagInput}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="badge badge-primary">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-2 text-xs hover:text-red-600">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Content */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Lesson Content</h2>

            {form.type === "text" && (
              <div className="form-group">
                <label className="form-label">Lesson Content *</label>
                <textarea
                  className="form-input form-textarea"
                  rows={15}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your lesson content here. You can use Markdown formatting."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Supports Markdown formatting. Use **bold**, *italic*, `code`, and more.
                </p>
              </div>
            )}

            {form.type === "video" && (
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Video URL *</label>
                  <input
                    type="url"
                    className="form-input"
                    value={form.videoUrl || ""}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Video Thumbnail URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={form.videoThumbnail || ""}
                    onChange={(e) => setForm({ ...form, videoThumbnail: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    className="form-input form-textarea"
                    rows={5}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Additional notes or transcript for the video"
                  />
                </div>
              </div>
            )}

            {form.type === "quiz" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Quiz Questions</h3>
                  <button onClick={addQuizQuestion} className="btn btn-primary">
                    ➕ Add Question
                  </button>
                </div>

                {quizQuestions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      {quizQuestions.length > 1 && (
                        <button onClick={() => removeQuizQuestion(index)} className="btn btn-sm btn-danger">
                          🗑️ Remove
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Question Text *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={question.question}
                        onChange={(e) => updateQuizQuestion(index, "question", e.target.value)}
                        placeholder="Enter your question"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Answer Options *</label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2 mb-2">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={question.correctAnswer === optIndex}
                            onChange={() => updateQuizQuestion(index, "correctAnswer", optIndex)}
                          />
                          <input
                            type="text"
                            className="form-input flex-1"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options]
                              newOptions[optIndex] = e.target.value
                              updateQuizQuestion(index, "options", newOptions)
                            }}
                            placeholder={`Option ${optIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Explanation</label>
                      <textarea
                        className="form-input form-textarea"
                        rows={2}
                        value={question.explanation}
                        onChange={(e) => updateQuizQuestion(index, "explanation", e.target.value)}
                        placeholder="Explain why this is the correct answer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Settings */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Lesson Settings</h2>

            <div className="form-group">
              <label className="form-label">SEO Meta Description</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={form.metaDescription || ""}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                placeholder="Brief description for search engines (150-160 characters)"
                maxLength={160}
              />
              <p className="text-sm text-gray-500 mt-1">{(form.metaDescription || "").length}/160 characters</p>
            </div>

            <div className="form-group">
              <label className="form-label">File Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">📎</div>
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <button className="btn btn-secondary">Choose Files</button>
                <p className="text-sm text-gray-500 mt-2">Supported: PDF, DOC, PPT, Images (Max 10MB each)</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Review & Publish</h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Lesson Preview</h3>
              <div className="grid grid-2 gap-4 text-sm">
                <div>
                  <strong>Title:</strong> {form.title}
                </div>
                <div>
                  <strong>Type:</strong> {form.type}
                </div>
                <div>
                  <strong>Category:</strong> {categories.find((c) => c.id === form.categoryId)?.name}
                </div>
                <div>
                  <strong>Difficulty:</strong> {form.difficulty}
                </div>
                <div>
                  <strong>Duration:</strong> {form.estimatedDuration} minutes
                </div>
                <div>
                  <strong>Tags:</strong> {form.tags.join(", ") || "None"}
                </div>
              </div>
              <div className="mt-4">
                <strong>Description:</strong>
                <p className="text-gray-600 mt-1">{form.description}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Pre-publish Checklist</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Content is accurate and well-formatted</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>All links and media are working</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Lesson meets quality standards</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Ready for student access</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(currentStep - 1)} className="btn btn-secondary">
                ← Previous
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn btn-primary"
                disabled={!form.title || !form.description}
              >
                Next →
              </button>
            ) : (
              <>
                <button onClick={() => handleSubmit(true)} disabled={isLoading} className="btn btn-secondary">
                  💾 Save as Draft
                </button>
                <button onClick={() => handleSubmit(false)} disabled={isLoading} className="btn btn-primary">
                  🚀 Publish Lesson
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
