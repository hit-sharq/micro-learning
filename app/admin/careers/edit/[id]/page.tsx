"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Career {
  id: number
  title: string
  slug: string
  description: string
  content: string
  department: string
  location: string
  jobType: string
  experience: string
  salary?: string
  requirements: string[]
  benefits: string[]
}

export default function EditCareerPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [requirements, setRequirements] = useState<string[]>([])
  const [benefits, setBenefits] = useState<string[]>([])
  const [requirementInput, setRequirementInput] = useState("")
  const [benefitInput, setBenefitInput] = useState("")

  const [formData, setFormData] = useState<Career>({
    id: 0,
    title: "",
    slug: "",
    description: "",
    content: "",
    department: "",
    location: "",
    jobType: "FULL_TIME",
    experience: "",
    salary: "",
    requirements: [],
    benefits: [],
  })

  useEffect(() => {
    fetchCareer()
  }, [id])

  const fetchCareer = async () => {
    try {
      const response = await fetch(`/api/admin/careers/${id}`)
      if (!response.ok) throw new Error("Failed to fetch career")
      const data = await response.json()
      setFormData(data)
      setRequirements(data.requirements || [])
      setBenefits(data.benefits || [])
    } catch (error) {
      console.error("Error fetching career:", error)
      toast.error("Failed to load job posting")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addRequirement = () => {
    if (requirementInput.trim() && !requirements.includes(requirementInput.trim())) {
      setRequirements([...requirements, requirementInput.trim()])
      setRequirementInput("")
    }
  }

  const removeRequirement = (req: string) => {
    setRequirements(requirements.filter((r) => r !== req))
  }

  const addBenefit = () => {
    if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
      setBenefits([...benefits, benefitInput.trim()])
      setBenefitInput("")
    }
  }

  const removeBenefit = (benefit: string) => {
    setBenefits(benefits.filter((b) => b !== benefit))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          requirements,
          benefits,
        }),
      })

      if (!response.ok) throw new Error("Failed to update career")

      toast.success("Job posting updated successfully!")
      router.push("/admin/careers")
    } catch (error) {
      console.error("Error updating career:", error)
      toast.error("Failed to update job posting")
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
          <Link href="/admin/careers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Edit Job Posting</h1>
            <p className="text-gray-600 mt-2">Update career opportunity</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Job Title *</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Software Engineer"
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
              placeholder="job-slug"
              required
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Short Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief overview of the position"
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Full Job Description *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Complete job description"
              required
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
            />
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Department *</label>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Engineering, Marketing"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Location *</label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., New York, Remote"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Job Type *</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FREELANCE">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Experience Level</label>
              <Input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g., 2-5 years"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Salary Range</label>
              <Input
                type="text"
                name="salary"
                value={formData.salary || ""}
                onChange={handleInputChange}
                placeholder="e.g., $80k-$120k"
                className="w-full"
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Requirements</label>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                placeholder="Add a requirement and press Enter"
                className="flex-1"
              />
              <Button type="button" onClick={addRequirement} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {requirements.map((req) => (
                <div
                  key={req}
                  className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center justify-between"
                >
                  <span className="text-gray-900">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(req)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Benefits</label>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                placeholder="Add a benefit and press Enter"
                className="flex-1"
              />
              <Button type="button" onClick={addBenefit} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center justify-between"
                >
                  <span className="text-gray-900">{benefit}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(benefit)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {submitting ? "Updating..." : "Update Job Posting"}
            </Button>
            <Link href="/admin/careers">
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
