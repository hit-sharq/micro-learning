"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Plus, X, ArrowLeft, ArrowRight, Save, Eye } from "lucide-react"

interface Category {
  id: number
  name: string
  description?: string
  color?: string
}

interface QuizQuestion {
  id: string
  question: string
  type: "multiple-choice" | "true-false" | "short-answer"
  options?: string[]
  correctAnswer: string | number
  explanation?: string
}

export default function CreateLessonPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [difficultyDialogOpen, setDifficultyDialogOpen] = useState(false)
  const [typeDialogOpen, setTypeDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    type: "",
    categoryId: "",
    difficulty: "",
    estimatedDuration: "",
    videoUrl: "",
    videoThumbnail: "",
    metaDescription: "",
    isPublished: false,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addQuizQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    }
    setQuizQuestions([...quizQuestions, newQuestion])
  }

  const updateQuizQuestion = (id: string, field: string, value: any) => {
    setQuizQuestions(quizQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const removeQuizQuestion = (id: string) => {
    setQuizQuestions(quizQuestions.filter((q) => q.id !== id))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.type && formData.categoryId
      case 2:
        return formData.difficulty && formData.estimatedDuration
      case 3:
        return formData.content
      case 4:
        return true // Optional step
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    } else {
      toast.error("Please fill in all required fields")
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (publish = false) => {
    setLoading(true)
    try {
      const payload = {
        ...formData,
        tags,
        quizData: quizQuestions.length > 0 ? { questions: quizQuestions } : null,
        isPublished: publish,
      }

      const response = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        router.push(`/admin/content/edit/${data.lesson.id}`)
      } else {
        toast.error(data.error || "Failed to create lesson")
      }
    } catch (error) {
      console.error("Error creating lesson:", error)
      toast.error("Failed to create lesson")
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Basic Info", description: "Title, description, and category" },
    { number: 2, title: "Settings", description: "Difficulty, duration, and media" },
    { number: 3, title: "Content", description: "Lesson content and materials" },
    { number: 4, title: "Quiz", description: "Optional quiz questions" },
    { number: 5, title: "Review", description: "Review and publish" },
  ]

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create New Lesson</h1>
          <p className="text-muted-foreground">Create engaging learning content for your students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button variant="destructive" onClick={() => router.push("/admin/content")}>
            Quit
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {step.number}
              </div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={`text-sm font-medium ${currentStep >= step.number ? "text-primary" : "text-muted-foreground"}`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${currentStep > step.number ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Lesson Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter lesson title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Lesson Type *</Label>
                  <Dialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {formData.type || "Select lesson type"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Select Lesson Type</DialogTitle>
                      </DialogHeader>
                      <div className="flex gap-3 mt-4 overflow-x-auto pb-4">
                        {[
                          { value: "READING", label: "Reading", description: "Text-based content", icon: "📖" },
                          { value: "VIDEO", label: "Video", description: "Video lessons", icon: "🎥" },
                          { value: "INTERACTIVE", label: "Interactive", description: "Hands-on activities", icon: "🖱️" },
                          { value: "QUIZ", label: "Quiz", description: "Assessment content", icon: "❓" },
                        ].map((type) => (
                          <Card
                            key={type.value}
                            className={`cursor-pointer transition-all hover:shadow-md flex-shrink-0 w-48 ${
                              formData.type === type.value ? "ring-2 ring-primary" : ""
                            }`}
                            onClick={() => {
                              handleInputChange("type", type.value)
                              setTypeDialogOpen(false)
                            }}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-xl">{type.icon}</span>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-medium text-sm">{type.label}</h3>
                                  <p className="text-xs text-muted-foreground">{type.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the lesson"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {formData.categoryId
                        ? categories.find((c) => c.id.toString() === formData.categoryId)?.name
                        : "Select category"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Select Category</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-4">
                      {categories.map((category) => (
                        <Card
                          key={category.id}
                          className={`cursor-pointer transition-all hover:shadow-md flex-shrink-0 w-48 ${
                            formData.categoryId === category.id.toString() ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => {
                            handleInputChange("categoryId", category.id.toString())
                            setCategoryDialogOpen(false)
                          }}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color || "#3B82F6" }} />
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-sm truncate">{category.name}</h3>
                                {category.description && (
                                  <p className="text-xs text-muted-foreground truncate">{category.description}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          {/* Step 2: Settings */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Lesson Settings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Dialog open={difficultyDialogOpen} onOpenChange={setDifficultyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {formData.difficulty || "Select difficulty"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Select Difficulty Level</DialogTitle>
                      </DialogHeader>
                      <div className="flex gap-3 mt-4 overflow-x-auto pb-4">
                        {[
                          { value: "BEGINNER", label: "Beginner", description: "Perfect for newcomers", color: "bg-green-500" },
                          { value: "INTERMEDIATE", label: "Intermediate", description: "For those with some experience", color: "bg-yellow-500" },
                          { value: "ADVANCED", label: "Advanced", description: "For experienced learners", color: "bg-red-500" },
                        ].map((level) => (
                          <Card
                            key={level.value}
                            className={`cursor-pointer transition-all hover:shadow-md flex-shrink-0 w-48 ${
                              formData.difficulty === level.value ? "ring-2 ring-primary" : ""
                            }`}
                            onClick={() => {
                              handleInputChange("difficulty", level.value)
                              setDifficultyDialogOpen(false)
                            }}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${level.color}`} />
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-medium text-sm">{level.label}</h3>
                                  <p className="text-xs text-muted-foreground">{level.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                    placeholder="e.g., 15"
                    min="1"
                  />
                </div>
              </div>

              {formData.type === "VIDEO" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoThumbnail">Video Thumbnail URL</Label>
                    <Input
                      id="videoThumbnail"
                      value={formData.videoThumbnail}
                      onChange={(e) => handleInputChange("videoThumbnail", e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  placeholder="Brief description for search engines"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Step 3: Content */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Write your lesson content here. You can use Markdown formatting."
                  rows={15}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Supports Markdown formatting. Use **bold**, *italic*, `code`, and more.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Quiz */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Quiz Questions (Optional)</h2>
                <Button onClick={addQuizQuestion} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>

              {quizQuestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No quiz questions added yet.</p>
                  <p className="text-sm">Click "Add Question" to create interactive quiz content.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizQuestions.map((question, index) => (
                    <Card key={question.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Question {index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => removeQuizQuestion(question.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Question</Label>
                          <Input
                            value={question.question}
                            onChange={(e) => updateQuizQuestion(question.id, "question", e.target.value)}
                            placeholder="Enter your question"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value) => updateQuizQuestion(question.id, "type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                              <SelectItem value="true-false">True/False</SelectItem>
                              <SelectItem value="short-answer">Short Answer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {question.type === "multiple-choice" && (
                          <div className="space-y-2">
                            <Label>Options</Label>
                            {question.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(question.options || [])]
                                    newOptions[optionIndex] = e.target.value
                                    updateQuizQuestion(question.id, "options", newOptions)
                                  }}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={question.correctAnswer === optionIndex}
                                    onChange={() => updateQuizQuestion(question.id, "correctAnswer", optionIndex)}
                                  />
                                  <Label className="text-sm">Correct</Label>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === "true-false" && (
                          <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <Select
                              value={question.correctAnswer.toString()}
                              onValueChange={(value) =>
                                updateQuizQuestion(question.id, "correctAnswer", value === "true")
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {question.type === "short-answer" && (
                          <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <Input
                              value={question.correctAnswer.toString()}
                              onChange={(e) => updateQuizQuestion(question.id, "correctAnswer", e.target.value)}
                              placeholder="Enter the correct answer"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Explanation (Optional)</Label>
                          <Textarea
                            value={question.explanation || ""}
                            onChange={(e) => updateQuizQuestion(question.id, "explanation", e.target.value)}
                            placeholder="Explain why this is the correct answer"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Review & Publish</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Lesson Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Title:</span> {formData.title}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {formData.type}
                    </div>
                    <div>
                      <span className="font-medium">Difficulty:</span> {formData.difficulty}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {formData.estimatedDuration} minutes
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {categories.find((c) => c.id.toString() === formData.categoryId)?.name}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Content Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Content Length:</span> {formData.content.length} characters
                    </div>
                    <div>
                      <span className="font-medium">Tags:</span> {tags.length} tags
                    </div>
                    <div>
                      <span className="font-medium">Quiz Questions:</span> {quizQuestions.length} questions
                    </div>
                    {formData.videoUrl && (
                      <div>
                        <span className="font-medium">Video:</span> Included
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="publish"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                />
                <Label htmlFor="publish">Publish immediately</Label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button variant="ghost" onClick={() => router.push("/admin/content")}>
                Quit
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep === 5 ? (
                <>
                  <Button variant="outline" onClick={() => handleSubmit(false)} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={() => handleSubmit(true)} disabled={loading}>
                    <Eye className="h-4 w-4 mr-2" />
                    {loading ? "Publishing..." : "Publish Lesson"}
                  </Button>
                </>
              ) : (
                <Button onClick={nextStep} disabled={!validateStep(currentStep)}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
