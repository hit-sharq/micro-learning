"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Plus, X, CheckCircle2, BookOpen, ImageIcon, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

type Step = "basic" | "content" | "media" | "seo" | "review"

const STEPS: { id: Step; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "basic", label: "Basic Info", icon: <BookOpen className="w-5 h-5" />, description: "Title and description" },
  { id: "content", label: "Content", icon: <BookOpen className="w-5 h-5" />, description: "Main blog content" },
  { id: "media", label: "Media", icon: <ImageIcon className="w-5 h-5" />, description: "Featured image" },
  { id: "seo", label: "SEO", icon: <Settings className="w-5 h-5" />, description: "Search optimization" },
  { id: "review", label: "Review", icon: <CheckCircle2 className="w-5 h-5" />, description: "Final check" },
]

export default function CreateBlogPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>("basic")
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    excerpt: "",
    category: "",
    featuredImage: "",
    metaDescription: "",
    metaKeywords: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
      setFormData((prev) => ({
        ...prev,
        slug: slug,
      }))
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      })

      if (!response.ok) throw new Error("Failed to create blog")

      toast.success("Blog post created successfully!")
      router.push("/admin/blogs")
    } catch (error) {
      console.error("Error creating blog:", error)
      toast.error("Failed to create blog post")
    } finally {
      setLoading(false)
    }
  }

  const getStepIndex = () => STEPS.findIndex((s) => s.id === currentStep)
  const stepIndex = getStepIndex()
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === STEPS.length - 1

  const canProceed = () => {
    switch (currentStep) {
      case "basic":
        return formData.title.trim() && formData.description.trim()
      case "content":
        return formData.content.trim() && formData.excerpt.trim()
      case "media":
        return true
      case "seo":
        return true
      case "review":
        return true
      default:
        return false
    }
  }

  const goToStep = (step: Step) => {
    setCurrentStep(step)
  }

  const nextStep = () => {
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id)
    }
  }

  const prevStep = () => {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/blogs">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Create Blog Post</h1>
            <p className="text-gray-600 mt-2">Follow the steps to publish your blog post</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Steps */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Progress</h3>
              <div className="space-y-3">
                {STEPS.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      currentStep === step.id
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                        : index < stepIndex
                          ? "bg-green-50 border-2 border-green-200 text-green-900"
                          : "bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          currentStep === step.id
                            ? "bg-white text-indigo-600"
                            : index < stepIndex
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {index < stepIndex ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{step.label}</p>
                        <p className="text-xs opacity-75">{step.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                  <span className="text-sm font-bold text-indigo-600">
                    {Math.round(((stepIndex + 1) / STEPS.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
              {/* Step: Basic Info */}
              {currentStep === "basic" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                    <p className="text-gray-600">Start with the essentials - title and description</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Blog Title *</label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., 10 Tips for Effective Learning"
                      className="w-full text-lg text-gray-900 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">Make it catchy and descriptive</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">URL Slug</label>
                    <Input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="auto-generated-slug"
                      className="w-full text-gray-900 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">Auto-generated from title, edit if needed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief summary of your blog post (shown in listings)"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">This appears in blog listings and search results</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Category</label>
                    <Input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Learning Tips, Technology, Success Stories"
                      className="w-full text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* Step: Content */}
              {currentStep === "content" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Content</h2>
                    <p className="text-gray-600">Write your main content and excerpt</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Main Content *</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Write your full blog content here (supports markdown)"
                      rows={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-gray-900 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">Markdown formatting is supported</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Excerpt *</label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Short preview text (1-2 sentences)"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">Used as preview in some contexts</p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Tags</label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        placeholder="Add a tag and press Enter"
                        className="flex-1 text-gray-900 placeholder:text-gray-400"
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <div
                          key={tag}
                          className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step: Media */}
              {currentStep === "media" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Image</h2>
                    <p className="text-gray-600">Add a cover image for your blog post</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Featured Image URL</label>
                    <Input
                      type="url"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full text-gray-900 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">Recommended size: 1200x630px</p>
                  </div>

                  {formData.featuredImage && (
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-gray-900 mb-3">Preview</p>
                      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={formData.featuredImage || "/placeholder.svg"}
                          alt="Featured"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Tip:</strong> Use high-quality images that represent your content. Images make your blog
                      more engaging!
                    </p>
                  </div>
                </div>
              )}

              {/* Step: SEO */}
              {currentStep === "seo" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Settings</h2>
                    <p className="text-gray-600">Optimize for search engines</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      placeholder="Brief description for search engines (150-160 characters)"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">{formData.metaDescription.length}/160 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Meta Keywords</label>
                    <Input
                      type="text"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleInputChange}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full text-gray-900 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">Comma-separated keywords for search optimization</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-900">
                      <strong>SEO Tip:</strong> Use relevant keywords naturally in your title, description, and content
                      for better search visibility.
                    </p>
                  </div>
                </div>
              )}

              {/* Step: Review */}
              {currentStep === "review" && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Post</h2>
                    <p className="text-gray-600">Everything looks good? Publish your blog post!</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Title</p>
                      <p className="text-lg font-bold text-gray-900">{formData.title}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Category</p>
                      <p className="text-gray-900">{formData.category || "Not specified"}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Description</p>
                      <p className="text-gray-900 line-clamp-3">{formData.description}</p>
                    </div>

                    {formData.featuredImage && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Featured Image</p>
                        <div className="w-full h-40 bg-gray-200 rounded overflow-hidden">
                          <img
                            src={formData.featuredImage || "/placeholder.svg"}
                            alt="Featured"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <span key={tag} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-900">
                      <strong>Ready to publish?</strong> Click the "Publish Blog Post" button below to make your post
                      live!
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-8 border-t border-gray-200 mt-8">
                <Button
                  type="button"
                  onClick={prevStep}
                  disabled={isFirstStep}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                {!isLastStep ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2"
                  >
                    {loading ? "Publishing..." : "Publish Blog Post"}
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}

                <Link href="/admin/blogs">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
