import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container navbar-content">
          <Link href="/" className="logo">
            🎯 Microlearning Coach
          </Link>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="btn btn-secondary">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn btn-primary">
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="btn btn-secondary">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="geometric-bg py-20">
        <div className="container text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Master Skills in Minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your learning with bite-sized lessons designed for busy professionals. Learn faster, retain
              more, and build lasting habits.
            </p>

            <div className="flex justify-center gap-4 mb-12">
              <SignedOut>
                <Link href="/sign-up" className="btn btn-primary text-lg px-8 py-4">
                  Start Learning Free
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-4">
                  Continue Learning
                </Link>
              </SignedIn>
              <Link href="#features" className="btn btn-secondary text-lg px-8 py-4">
                Learn More
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid max-w-4xl mx-auto">
            <div className="stat-card">
              <div className="stat-value">5min</div>
              <div className="stat-label">Average Lesson Time</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">1000+</div>
              <div className="stat-label">Micro Lessons</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">95%</div>
              <div className="stat-label">Completion Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Learn Anywhere</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Microlearning?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed around proven learning science to maximize retention and minimize time
              investment.
            </p>
          </div>

          <div className="grid grid-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Learn complex topics in just 5-minute focused sessions that fit into any schedule.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">Personalized Path</h3>
              <p className="text-gray-600">AI-powered recommendations adapt to your learning style and progress.</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="text-gray-600">Visual progress tracking and streak counters keep you motivated.</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-3">Science-Based</h3>
              <p className="text-gray-600">Built on spaced repetition and active recall for maximum retention.</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3">Mobile Ready</h3>
              <p className="text-gray-600">Learn on any device, anywhere. Perfect for commutes and breaks.</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-3">Gamified</h3>
              <p className="text-gray-600">Earn badges, maintain streaks, and compete with friends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 geometric-bg">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already mastering new skills in just minutes a day.
          </p>

          <SignedOut>
            <Link href="/sign-up" className="btn btn-primary text-lg px-8 py-4">
              Start Your Journey Today
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-4">
              Continue Your Journey
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-4 gap-8">
            <div>
              <div className="logo text-white mb-4">🎯 Microlearning Coach</div>
              <p className="text-gray-400">Empowering learners worldwide with bite-sized education.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Microlearning Coach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
