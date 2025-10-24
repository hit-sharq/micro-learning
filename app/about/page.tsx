import Link from "next/link"
import { ArrowRight, Users, Target, Zap } from "lucide-react"
import "./about.css"

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-container">
        {/* Hero Section */}
        <div className="about-hero">
          <h1 className="about-title">About Microlearning Coach</h1>
          <p className="about-subtitle">
            Empowering learners worldwide with personalized, bite-sized education that fits into your busy life.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="about-mvv-grid">
          <div className="about-mvv-card">
            <Target className="about-mvv-icon indigo" />
            <h3 className="about-mvv-title">Our Mission</h3>
            <p className="about-mvv-description">
              To make quality education accessible to everyone, everywhere, through bite-sized, personalized learning
              experiences.
            </p>
          </div>

          <div className="about-mvv-card">
            <Zap className="about-mvv-icon purple" />
            <h3 className="about-mvv-title">Our Vision</h3>
            <p className="about-mvv-description">
              A world where learning is personalized, engaging, and accessible to everyone, regardless of their
              background or circumstances.
            </p>
          </div>

          <div className="about-mvv-card">
            <Users className="about-mvv-icon emerald" />
            <h3 className="about-mvv-title">Our Values</h3>
            <p className="about-mvv-description">
              We believe in accessibility, innovation, and community. Every learner deserves personalized support and
              recognition.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="about-story">
          <h2 className="about-story-title">Our Story</h2>
          <div className="about-story-content">
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

        {/* Why Choose Us Section */}
        <div className="about-why-choose">
          <h2 className="about-why-title">Why Choose Us?</h2>
          <div className="about-features-grid">
            {[
              { title: "Personalized Learning", desc: "Tailored to your pace and style" },
              { title: "Expert Content", desc: "Created by industry professionals" },
              { title: "Progress Tracking", desc: "Monitor your growth in real-time" },
              { title: "Community Support", desc: "Learn together with others" },
            ].map((item, i) => (
              <div key={i} className="about-feature-card">
                <h4 className="about-feature-title">{item.title}</h4>
                <p className="about-feature-description">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="about-cta">
          <h2 className="about-cta-title">Ready to Start Learning?</h2>
          <p className="about-cta-subtitle">Join thousands of learners transforming their education today.</p>
          <Link href="/lessons" className="about-cta-button">
            Explore Lessons <ArrowRight className="about-cta-icon" />
          </Link>
        </div>
      </section>
    </main>
  )
}
