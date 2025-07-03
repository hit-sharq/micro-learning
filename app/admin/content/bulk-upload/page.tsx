"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react"

interface UploadResult {
  successful: number
  failed: number
  errors: string[]
  lessons: any[]
}

export default function BulkUploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [results, setResults] = useState<UploadResult | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase()
      return ["txt", "md", "json", "csv"].includes(extension || "")
    })

    if (validFiles.length !== acceptedFiles.length) {
      toast.error("Some files were rejected. Only .txt, .md, .json, and .csv files are supported.")
    }

    setFiles((prev) => [...prev, ...validFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/json": [".json"],
      "text/csv": [".csv"],
    },
    multiple: true,
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setFiles([])
    setResults(null)
    setUploadProgress(0)
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload")
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/admin/bulk-upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (response.ok) {
        setResults(data.results)
        toast.success(data.message)
      } else {
        toast.error(data.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "json":
        return "📄"
      case "csv":
        return "📊"
      case "md":
        return "📝"
      case "txt":
        return "📄"
      default:
        return "📄"
    }
  }

  const downloadTemplate = (type: string) => {
    let content = ""
    let filename = ""

    switch (type) {
      case "json":
        content = JSON.stringify(
          {
            title: "Sample Lesson",
            description: "This is a sample lesson description",
            content: "# Sample Lesson Content\n\nThis is the main content of the lesson.",
            type: "READING",
            categoryId: 1,
            difficulty: "BEGINNER",
            estimatedDuration: 15,
            tags: ["sample", "template"],
            isPublished: false,
          },
          null,
          2,
        )
        filename = "lesson-template.json"
        break

      case "csv":
        content = `title,description,content,type,categoryId,difficulty,estimatedDuration,tags,isPublished
"Sample Lesson 1","First sample lesson","# Lesson 1 Content","READING",1,"BEGINNER",10,"sample;beginner",false
"Sample Lesson 2","Second sample lesson","# Lesson 2 Content","VIDEO",1,"INTERMEDIATE",20,"sample;video",false`
        filename = "lessons-template.csv"
        break

      case "markdown":
        content = `# Sample Lesson Title

This is a sample lesson in Markdown format. The title will be extracted from the first heading, and the content will be preserved as-is.

## Learning Objectives

- Understand the basics
- Apply the concepts
- Practice the skills

## Content

Your lesson content goes here...`
        filename = "lesson-template.md"
        break
    }

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bulk Upload Lessons</h1>
        <p className="text-muted-foreground">Upload multiple lessons at once using various file formats</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="templates">Download Templates</TabsTrigger>
          <TabsTrigger value="guide">Format Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* File Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Select Files</CardTitle>
              <CardDescription>
                Drag and drop files or click to browse. Supported formats: .txt, .md, .json, .csv
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-lg">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                    <p className="text-sm text-muted-foreground">Supports .txt, .md, .json, and .csv files</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Selected Files */}
          {files.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Selected Files ({files.length})</CardTitle>
                  <CardDescription>Files ready for upload</CardDescription>
                </div>
                <Button variant="outline" onClick={clearAll} size="sm">
                  Clear All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getFileIcon(file.name)}</span>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {uploading && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <Button onClick={handleUpload} disabled={uploading || files.length === 0} className="min-w-32">
                    {uploading ? "Uploading..." : "Upload Files"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Upload Results
                  {results.failed === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{results.successful}</div>
                    <div className="text-sm text-green-700">Successful</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                    <div className="text-sm text-red-700">Failed</div>
                  </div>
                </div>

                {results.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Errors:</h4>
                    <div className="space-y-1">
                      {results.errors.map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}

                {results.lessons.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Created Lessons:</h4>
                    <div className="space-y-2">
                      {results.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{lesson.type}</Badge>
                              <Badge variant="outline">{lesson.difficulty}</Badge>
                              {lesson.isPublished ? (
                                <Badge variant="default">Published</Badge>
                              ) : (
                                <Badge variant="secondary">Draft</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Templates</CardTitle>
              <CardDescription>
                Download sample files to understand the expected format for bulk uploads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => downloadTemplate("json")}
                >
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-medium">JSON Template</h3>
                    <p className="text-sm text-muted-foreground">Single lesson or array format</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => downloadTemplate("csv")}
                >
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-medium">CSV Template</h3>
                    <p className="text-sm text-muted-foreground">Multiple lessons in spreadsheet format</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => downloadTemplate("markdown")}
                >
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <h3 className="font-medium">Markdown Template</h3>
                    <p className="text-sm text-muted-foreground">Rich text content format</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Format Guide</CardTitle>
              <CardDescription>Learn about supported file formats and their structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Supported File Types</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">📄 Text Files (.txt)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Simple text files where the filename becomes the lesson title and the content is used as-is.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Filename: "Introduction to Programming.txt"</li>
                      <li>• Title: "Introduction to Programming"</li>
                      <li>• Type: Automatically set to "READING"</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">📝 Markdown Files (.md)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Markdown files with rich formatting support. The first heading becomes the title.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Supports all Markdown syntax</li>
                      <li>• First # heading becomes the lesson title</li>
                      <li>• Content preserves formatting</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">📄 JSON Files (.json)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Structured data format supporting single lessons or arrays of lessons.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Single lesson: {"{ title: '...', content: '...' }"}</li>
                      <li>• Multiple lessons: {"[{ lesson1 }, { lesson2 }]"}</li>
                      <li>• Supports all lesson properties</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">📊 CSV Files (.csv)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Spreadsheet format for bulk lesson creation with headers.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• First row must contain column headers</li>
                      <li>• Required: title, description, content, type, difficulty</li>
                      <li>• Tags separated by semicolons</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Required Fields</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Essential Fields</h4>
                    <ul className="text-sm space-y-1">
                      <li>
                        • <strong>title</strong>: Lesson title
                      </li>
                      <li>
                        • <strong>description</strong>: Brief description
                      </li>
                      <li>
                        • <strong>content</strong>: Main lesson content
                      </li>
                      <li>
                        • <strong>type</strong>: READING, VIDEO, INTERACTIVE, QUIZ
                      </li>
                      <li>
                        • <strong>difficulty</strong>: BEGINNER, INTERMEDIATE, ADVANCED
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Optional Fields</h4>
                    <ul className="text-sm space-y-1">
                      <li>
                        • <strong>categoryId</strong>: Category ID (defaults to first category)
                      </li>
                      <li>
                        • <strong>estimatedDuration</strong>: Duration in minutes
                      </li>
                      <li>
                        • <strong>tags</strong>: Comma or semicolon separated
                      </li>
                      <li>
                        • <strong>videoUrl</strong>: For video lessons
                      </li>
                      <li>
                        • <strong>isPublished</strong>: true/false
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
