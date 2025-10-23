import Link from "next/link"
import { ArrowRight, Users, Target, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">About Microlearning Coach</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Empowering learners worldwide with personalized, bite-sized education that fits into your busy life.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
            <Target className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-600">
              To make quality education accessible to everyone, everywhere, through bite-sized, personalized learning
              experiences.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
            <Zap className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Vision</h3>
            <p className="text-slate-600">
              A world where learning is personalized, engaging, and accessible to everyone, regardless of their
              background or circumstances.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
            <Users className="w-12 h-12 text-emerald-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Values</h3>
            <p className="text-slate-600">
              We believe in accessibility, innovation, and community. Every learner deserves personalized support and
              recognition.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Microlearning Coach was founded on the belief that education should be accessible, personalized, and
              engaging. We recognized that traditional learning methods often don't fit into modern, busy lifestyles.
            </p>
            <p>
              Our platform combines cutting-edge technology with proven learning science to deliver bite-sized lessons
              that maximize retention and engagement. Whether you're learning a new skill, preparing for an exam, or
              pursuing personal growth, we're here to support your journey.
            </p>
            <p>
              Today, thousands of learners use Microlearning Coach to achieve their educational goals. We're committed
              to continuously improving our platform and expanding our course offerings to serve learners worldwide.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Personalized Learning", desc: "Tailored to your pace and style" },
              { title: "Expert Content", desc: "Created by industry professionals" },
              { title: "Progress Tracking", desc: "Monitor your growth in real-time" },
              { title: "Community Support", desc: "Learn together with others" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100"
              >
                <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of learners transforming their education today.</p>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-all"
          >
            Explore Lessons <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
