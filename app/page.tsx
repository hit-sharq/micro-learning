import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const { userId } = await auth()

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect("/dashboard")
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <nav className="home-nav">
          <div className="nav-brand">
            <h1>Microlearning Coach</h1>
          </div>
          <div className="nav-actions">
            <Link href="/sign-in" className="btn btn-secondary">
              Sign In
            </Link>
            <Link href="/sign-up" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Master Skills with <span className="hero-highlight">Bite-Sized</span> Learning
            </h1>
            <p className="hero-description">
              Transform your learning journey with personalized, micro-lessons designed to fit your busy schedule and
              learning style.
            </p>
            <div className="hero-actions">
              <Link href="/sign-up" className="btn btn-primary btn-large">
                Start Learning Free
              </Link>
              <Link href="/sign-in" className="btn btn-secondary btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose Microlearning Coach?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Personalized Learning</h3>
                <p>AI-powered recommendations tailored to your learning style, pace, and goals.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Bite-Sized Lessons</h3>
                <p>Learn in 5-10 minute sessions that fit perfectly into your busy schedule.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Progress Tracking</h3>
                <p>Visual progress tracking with streaks, achievements, and detailed analytics.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎮</div>
                <h3>Gamified Experience</h3>
                <p>Earn points, unlock achievements, and compete with friends to stay motivated.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Multi-Device Sync</h3>
                <p>Learn anywhere, anytime with seamless synchronization across all devices.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3>Spaced Repetition</h3>
                <p>Scientifically-proven learning techniques to maximize retention and recall.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="container">
          <p>&copy; 2024 Microlearning Coach. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
