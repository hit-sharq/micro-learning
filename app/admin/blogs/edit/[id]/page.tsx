"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Blog {
  id: number
  title: string
  slug: string
  description: string
  content: string
  excerpt?: string
  category?: string
  featuredImage?: string
  tags: string[]
  metaDescription?: string
  metaKeywords?: string
}

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const [formData, setFormData] = useState<Blog>({
    id: 0,
    title: "",
    slug: "",
    description: "",
    content: "",
    excerpt: "",
    category: "",
    featuredImage: "",
    tags: [],
    metaDescription: "",
    metaKeywords: "",
  })

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`)
      if (!response.ok) throw new Error("Failed to fetch blog")
      const data = await response.json()
      setFormData(data)
      setTags(data.tags || [])
    } catch (error) {
      console.error("Error fetching blog:", error)
      toast.error("Failed to load blog")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
    setSubmitting(true)

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      })

      if (!response.ok) throw new Error("Failed to update blog")

      toast.success("Blog post updated successfully!")
      router.push("/admin/blogs")
    } catch (error) {
      console.error("Error updating blog:", error)
      toast.error("Failed to update blog post")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/blogs">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-600 mt-2">Update your blog post</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              required
              className="w-full"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Slug *</label>
            <Input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="blog-slug"
              required
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the blog post"
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Full blog content (supports markdown)"
              required
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt</label>
            <Input
              type="text"
              name="excerpt"
              value={formData.excerpt || ""}
              onChange={handleInputChange}
              placeholder="Short preview text"
              className="w-full"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
            <Input
              type="text"
              name="category"
              value={formData.category || ""}
              onChange={handleInputChange}
              placeholder="e.g., Learning Tips, Technology"
              className="w-full"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Featured Image URL</label>
            <Input
              type="url"
              name="featuredImage"
              value={formData.featuredImage || ""}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag and press Enter"
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription || ""}
                  onChange={handleInputChange}
                  placeholder="SEO meta description"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Keywords</label>
                <Input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords || ""}
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {submitting ? "Updating..." : "Update Blog Post"}
            </Button>
            <Link href="/admin/blogs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
