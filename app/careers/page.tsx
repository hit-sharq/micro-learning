import { prisma } from "@/lib/prisma"
import { Career } from "@prisma/client"
import Link from "next/link"
import { ArrowRight, MapPin, Briefcase, DollarSign, Users, Rocket, Heart, Zap } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CareersPage() {
  let careers: Career[] = []
  try {
    careers = await prisma.career.findMany({
      where: {
        isPublished: true,
        expiresAt: { gte: new Date() },
      },
      orderBy: { publishedAt: "desc" },
    })
  } catch (error) {
    console.error("Failed to fetch careers:", error)
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
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Help us revolutionize learning. Explore exciting career opportunities at Microlearning Coach.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Join Microlearning Coach?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Be part of a team that's transforming education through innovative technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Innovation</h3>
              <p className="text-slate-600">Work on cutting-edge learning technology</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Impact</h3>
              <p className="text-slate-600">Make a real difference in education worldwide</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Collaboration</h3>
              <p className="text-slate-600">Work with passionate, talented colleagues</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Growth</h3>
              <p className="text-slate-600">Continuous learning and professional development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Open Positions</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Find your next opportunity to shape the future of learning
            </p>
          </div>

          {/* Careers Grid */}
          {careers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-12 h-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Open Positions</h3>
              <p className="text-slate-600 text-lg max-w-md mx-auto">
                We're always growing! Check back soon for exciting new opportunities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {careers.map((career) => (
                <Link key={career.id} href={`/careers/${career.slug}`}>
                  <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 p-8 h-full flex flex-col border border-slate-200/50">
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                        {career.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">{career.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8 py-6 border-y border-slate-200/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Department</p>
                          <p className="font-semibold text-slate-900">{career.department}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Location</p>
                          <p className="font-semibold text-slate-900">{career.location}</p>
                        </div>
                      </div>

                      {career.salary && (
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Salary</p>
                            <p className="font-semibold text-slate-900">{career.salary}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Type</p>
                          <p className="font-semibold text-slate-900">{career.jobType}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                        View Details
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div className="text-sm text-slate-500">
                        Posted {career.publishedAt ? new Date(career.publishedAt).toLocaleDateString() : 'Recently'}
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
