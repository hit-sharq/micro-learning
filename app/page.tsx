import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const { userId } = await auth()

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
              Master New Skills with
              <span className="hero-highlight"> Microlearning</span>
            </h1>
            <p className="hero-description">
              Learn efficiently with bite-sized lessons, track your progress, and achieve your goals with our
              personalized coaching platform.
            </p>
            <div className="hero-actions">
              <Link href="/sign-up" className="btn btn-primary btn-large">
                Start Learning Today
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
                <div className="feature-icon">📚</div>
                <h3>Bite-sized Lessons</h3>
                <p>Learn complex topics through short, focused lessons that fit into your busy schedule.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Progress Tracking</h3>
                <p>Monitor your learning journey with detailed analytics and achievement badges.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Personalized Learning</h3>
                <p>Get customized lesson recommendations based on your goals and learning style.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h3>Achievement System</h3>
                <p>Stay motivated with our gamified learning experience and unlock rewards.</p>
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
