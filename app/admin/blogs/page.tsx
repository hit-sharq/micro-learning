"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Blog {
  id: number
  title: string
  slug: string
  description: string
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  category?: string
}

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs")
      if (!response.ok) throw new Error("Failed to fetch blogs")
      const data = await response.json()
      setBlogs(data)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast.error("Failed to load blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete blog")
      setBlogs(blogs.filter((b) => b.id !== id))
      toast.success("Blog deleted successfully")
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast.error("Failed to delete blog")
    }
  }

  const handleTogglePublish = async (id: number, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublished: !isPublished,
          publishedAt: !isPublished ? new Date().toISOString() : null,
        }),
      })
      if (!response.ok) throw new Error("Failed to update blog")
      const updated = await response.json()
      setBlogs(blogs.map((b) => (b.id === id ? updated : b)))
      toast.success(isPublished ? "Blog unpublished" : "Blog published")
    } catch (error) {
      console.error("Error updating blog:", error)
      toast.error("Failed to update blog")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-2">Create and manage blog posts</p>
          </div>
          <Link href="/admin/blogs/create">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Blog Post
            </Button>
          </Link>
        </div>

        {/* Blogs Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {blogs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No blog posts yet. Create your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Published</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{blog.title}</p>
                          <p className="text-sm text-gray-500">{blog.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{blog.category || "-"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            blog.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(blog.id, blog.isPublished)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title={blog.isPublished ? "Unpublish" : "Publish"}
                          >
                            {blog.isPublished ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <Link href={`/admin/blogs/edit/${blog.id}`}>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
