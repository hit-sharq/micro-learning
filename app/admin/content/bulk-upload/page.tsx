"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Upload, FileText, Video, HelpCircle, CheckCircle, AlertCircle } from "lucide-react"

interface UploadFile {
  id: string
  file: File
  status: "pending" | "processing" | "success" | "error"
  progress: number
  error?: string
  lessonData?: any
}

export default function BulkUpload() {
  const router = useRouter()
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const newFiles: UploadFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "pending",
      progress: 0,
    }))

    setUploadFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const processFiles = async () => {
    setIsUploading(true)

    for (const uploadFile of uploadFiles) {
      if (uploadFile.status !== "pending") continue

      try {
        // Update status to processing
        setUploadFiles((prev) =>
          prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "processing", progress: 0 } : f)),
        )

        // Simulate file processing with progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          setUploadFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f)))
        }

        // Process the file based on type
        const formData = new FormData()
        formData.append("file", uploadFile.file)

        const response = await fetch("/api/admin/bulk-upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          setUploadFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id
                ? {
                    ...f,
                    status: "success",
                    progress: 100,
                    lessonData: result.lesson,
                  }
                : f,
            ),
          )
        } else {
          throw new Error("Upload failed")
        }
      } catch (error) {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed",
                }
              : f,
          ),
        )
      }
    }

    setIsUploading(false)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("video/")) return <Video className="w-6 h-6 text-blue-500" />
    if (file.type.includes("pdf") || file.type.includes("document"))
      return <FileText className="w-6 h-6 text-red-500" />
    return <HelpCircle className="w-6 h-6 text-gray-500" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "processing":
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
    }
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bulk Upload</h1>
          <p className="text-gray-600">Upload multiple lessons at once</p>
        </div>
        <Link href="/admin/content" className="btn btn-secondary">
          ← Back to Content
        </Link>
      </div>

      {/* Upload Instructions */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">📋 Upload Instructions</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📄 Text Lessons</h3>
            <p className="text-blue-700">Upload .txt, .md, or .docx files. Content will be extracted automatically.</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">🎥 Video Lessons</h3>
            <p className="text-purple-700">Upload .mp4, .mov, or .avi files. Thumbnails will be generated.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">📊 Bulk Data</h3>
            <p className="text-green-700">Upload .csv or .json files with lesson metadata.</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="card mb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
          <p className="text-gray-600 mb-4">Supports: PDF, DOCX, TXT, MD, MP4, MOV, AVI, CSV, JSON</p>
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md,.mp4,.mov,.avi,.csv,.json"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="btn btn-primary cursor-pointer">
            Choose Files
          </label>
        </div>
      </div>

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Files to Upload ({uploadFiles.length})</h2>
            <div className="flex gap-3">
              <button onClick={() => setUploadFiles([])} className="btn btn-secondary" disabled={isUploading}>
                Clear All
              </button>
              <button
                onClick={processFiles}
                className="btn btn-primary"
                disabled={isUploading || uploadFiles.length === 0}
              >
                {isUploading ? "Processing..." : "Start Upload"}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {uploadFiles.map((uploadFile) => (
              <div key={uploadFile.id} className="flex items-center gap-4 p-4 border rounded-lg">
                {getFileIcon(uploadFile.file)}

                <div className="flex-1">
                  <div className="font-medium">{uploadFile.file.name}</div>
                  <div className="text-sm text-gray-500">{(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB</div>

                  {uploadFile.status === "processing" && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{uploadFile.progress}%</div>
                    </div>
                  )}

                  {uploadFile.error && <div className="text-sm text-red-600 mt-1">{uploadFile.error}</div>}

                  {uploadFile.lessonData && (
                    <div className="text-sm text-green-600 mt-1">✅ Created lesson: {uploadFile.lessonData.title}</div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {getStatusIcon(uploadFile.status)}

                  {uploadFile.status === "pending" && (
                    <button
                      onClick={() => removeFile(uploadFile.id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isUploading}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Statistics */}
      {uploadFiles.length > 0 && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="stat-number">{uploadFiles.length}</div>
            <div className="stat-label">Total Files</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-green-600">{uploadFiles.filter((f) => f.status === "success").length}</div>
            <div className="stat-label">Successful</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-blue-600">
              {uploadFiles.filter((f) => f.status === "processing").length}
            </div>
            <div className="stat-label">Processing</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-red-600">{uploadFiles.filter((f) => f.status === "error").length}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
      )}
    </div>
  )
}
