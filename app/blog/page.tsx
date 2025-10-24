import { prisma } from "@/lib/prisma"
import { Blog } from "@prisma/client"
import Link from "next/link"
import { ArrowRight, Calendar, Tag, BookOpen, Lightbulb, TrendingUp, Users } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  let blogs: Blog[] = []
  try {
    blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    })
  } catch (error) {
    console.error("Failed to fetch blogs:", error)
    // Handle error gracefully, e.g., show empty state
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Our Blog
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Insights, tips, and stories about microlearning and personal development
            </p>
          </div>
        </div>
      </section>

      {/* Featured Topics Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Explore Our Topics</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover insights that can transform your learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Learning Tips</h3>
              <p className="text-slate-600">Practical strategies for effective learning</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Success Stories</h3>
              <p className="text-slate-600">Real experiences from our community</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Research Insights</h3>
              <p className="text-slate-600">Latest findings in learning science</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Community</h3>
              <p className="text-slate-600">Connect with fellow learners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Latest Posts</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Stay updated with our latest insights and discoveries
            </p>
          </div>

          {/* Blog Grid */}
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Blog Posts Yet</h3>
              <p className="text-slate-600 text-lg max-w-md mx-auto">
                We're working on amazing content! Check back soon for our latest insights.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`}>
                  <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden h-full flex flex-col border border-slate-200/50">
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
                    <div className="p-8 flex flex-col flex-grow">
                      {/* Category */}
                      {blog.category && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <Tag className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{blog.category}</span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                        {blog.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">{blog.description}</p>

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-200/50">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar className="w-4 h-4" />
                          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Recently'}
                        </div>
                        <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
