"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Career {
  id: number
  title: string
  slug: string
  department: string
  location: string
  jobType: string
  isPublished: boolean
  publishedAt: string | null
  expiresAt: string | null
  createdAt: string
}

export default function CareersAdminPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    try {
      const response = await fetch("/api/admin/careers")
      if (!response.ok) throw new Error("Failed to fetch careers")
      const data = await response.json()
      setCareers(data)
    } catch (error) {
      console.error("Error fetching careers:", error)
      toast.error("Failed to load careers")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return

    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete career")
      setCareers(careers.filter((c) => c.id !== id))
      toast.success("Job posting deleted successfully")
    } catch (error) {
      console.error("Error deleting career:", error)
      toast.error("Failed to delete job posting")
    }
  }

  const handleTogglePublish = async (id: number, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublished: !isPublished,
          publishedAt: !isPublished ? new Date().toISOString() : null,
        }),
      })
      if (!response.ok) throw new Error("Failed to update career")
      const updated = await response.json()
      setCareers(careers.map((c) => (c.id === id ? updated : c)))
      toast.success(isPublished ? "Job posting unpublished" : "Job posting published")
    } catch (error) {
      console.error("Error updating career:", error)
      toast.error("Failed to update job posting")
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
            <h1 className="text-4xl font-bold text-gray-900">Careers Management</h1>
            <p className="text-gray-600 mt-2">Create and manage job postings</p>
          </div>
          <Link href="/admin/careers/create">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Job Posting
            </Button>
          </Link>
        </div>

        {/* Careers Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {careers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No job postings yet. Create your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {careers.map((career) => (
                    <tr key={career.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{career.title}</p>
                          <p className="text-sm text-gray-500">{career.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{career.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{career.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{career.jobType}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            career.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {career.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(career.id, career.isPublished)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title={career.isPublished ? "Unpublish" : "Publish"}
                          >
                            {career.isPublished ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <Link href={`/admin/careers/edit/${career.id}`}>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(career.id)}
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
