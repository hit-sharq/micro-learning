import { prisma } from "@/lib/prisma"
import { Career } from "@prisma/client"
import Link from "next/link"
import { ArrowRight, MapPin, Briefcase, DollarSign } from "lucide-react"

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us revolutionize learning. Explore exciting career opportunities at Microlearning Coach.
          </p>
        </div>

        {/* Careers Grid */}
        {careers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No open positions at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {careers.map((career) => (
              <Link key={career.id} href={`/careers/${career.slug}`}>
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {career.title}
                    </h3>
                    <p className="text-gray-600">{career.description}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 py-6 border-y border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        <p className="font-medium text-gray-900">{career.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{career.location}</p>
                      </div>
                    </div>

                    {career.salary && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Salary</p>
                          <p className="font-medium text-gray-900">{career.salary}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-medium text-gray-900">{career.jobType}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-indigo-600 font-medium group-hover:gap-3 transition-all">
                    View Details
                    <ArrowRight className="w-4 h-4" />
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
