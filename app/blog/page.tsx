import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowRight, Calendar, Tag } from "lucide-react"

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and stories about microlearning and personal development
          </p>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`}>
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full flex flex-col">
                  {/* Featured Image */}
                  {blog.featuredImage && (
                    <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                      <img
                        src={blog.featuredImage || "/placeholder.svg"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Category */}
                    {blog.category && (
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-600">{blog.category}</span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {blog.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{blog.description}</p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {blog.publishedAt && new Date(blog.publishedAt).toLocaleDateString()}
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
