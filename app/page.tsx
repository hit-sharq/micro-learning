"use client"

import Link from "next/link"
import { Navbar } from "@/components/premium/Navbar"
import { PremiumFooter } from "@/components/premium/Footer"
import { PremiumButton } from "@/components/premium/Button"
import { PremiumBadge } from "@/components/premium/Badge"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col min-h-screen">
        {/* ══════════════ HERO ══════════════ */}
        <section className="relative overflow-hidden pt-24 sm:pt-32 lg:pt-40 pb-20 sm:pb-28">
          {/* Animated gradient blobs */}
          <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-400/20 blur-[100px] dark:bg-indigo-500/10 animate-blob" />
            <div className="absolute top-10 -right-20 w-96 h-96 rounded-full bg-purple-400/15 blur-[120px] dark:bg-purple-500/8 animate-blob-slow" />
            <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full bg-pink-400/10 blur-[140px] dark:bg-pink-500/5 animate-blob-slower" />
            <div
              className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle,rgba(0,0,0,0.4)1px,transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-semibold mb-8"
                style={{ animationDelay: "0ms", animationFillMode: "backwards" }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Join 10,000+ learners already growing their skills
              </div>

              {/* Headline */}
              <h1 className="animate-fade-in-up text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] sm:leading-[1.05] mb-6 sm:mb-8"
                style={{ animationDelay: "80ms", animationFillMode: "backwards" }}>
                Master Skills in
                <br />
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">5 Minutes a Day</span>
              </h1>

              {/* Description */}
              <p className="animate-fade-in-up text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mb-10 sm:mb-14"
                style={{ animationDelay: "160ms", animationFillMode: "backwards" }}>
                Transform your learning journey with AI-powered, bite-sized lessons that adapt to your schedule, learning style, and goals. Build lasting habits that actually stick.
              </p>

              {/* CTA buttons */}
              <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 sm:mb-20"
                style={{ animationDelay: "240ms", animationFillMode: "backwards" }}>
                <Link href="/sign-up">
                  <PremiumButton
                    variant="gradient"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="shadow-2xl shadow-indigo-500/30 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5"
                  >
                    Start Learning Free
                  </PremiumButton>
                </Link>
                <Link href="/sign-in">
                  <PremiumButton variant="secondary" size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5">
                    Sign In
                  </PremiumButton>
                </Link>
              </div>

              {/* Stats */}
              <div className="animate-fade-in-up grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto"
                style={{ animationDelay: "320ms", animationFillMode: "backwards" }}>
                {stats.map((stat) => (
                  <div key={stat.label}
                    className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{stat.icon}</span>
                    <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent text-slate-900 dark:text-white">{stat.value}</span>
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ FEATURES ══════════════ */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.07)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.05)_0%,transparent_60%)] -z-10" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 ring-1 ring-indigo-200/50 dark:ring-indigo-500/20">
                <SparklesIcon className="w-4 h-4" />
                Features
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
                Why Choose Microlearning Coach?
              </h2>
              <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Our platform combines cutting-edge AI with proven learning science to deliver personalized education that fits your life.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, i) => (
                <div key={feature.title} className="group relative">
                  <div className="relative h-full p-7 sm:p-8 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/8 hover:border-indigo-200/60 dark:hover:border-indigo-500/30 overflow-hidden">
                    {/* Top accent bar */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      feature.accentFrom === "indigo" && "from-indigo-500 to-purple-500",
                      feature.accentFrom === "purple" && "from-purple-500 to-pink-500",
                      feature.accentFrom === "pink" && "from-pink-500 to-amber-400",
                      feature.accentFrom === "emerald" && "from-emerald-500 to-teal-500",
                      feature.accentFrom === "amber" && "from-amber-400 to-orange-500",
                      feature.accentFrom === "blue" && "from-blue-500 to-indigo-500",
                    )} />
                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                      feature.accentFrom === "indigo" && "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-indigo-500/30",
                      feature.accentFrom === "purple" && "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-500/30",
                      feature.accentFrom === "pink" && "bg-gradient-to-br from-pink-500 to-amber-400 text-white shadow-pink-500/30",
                      feature.accentFrom === "emerald" && "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/30",
                      feature.accentFrom === "amber" && "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-400/30",
                      feature.accentFrom === "blue" && "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-blue-500/30",
                    )}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 leading-snug">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <section className="relative py-20 sm:py-28 lg:py-32 bg-slate-50 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">How It Works</h2>
              <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Four simple steps to transform how you learn every day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {steps.map((step) => (
                <div key={step.step}
                  className="group flex flex-col items-start gap-4 p-7 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/8 hover:border-indigo-200/60 dark:hover:border-indigo-500/30">
                  <span className="text-4xl sm:text-5xl">{step.icon}</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{step.step}</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ TESTIMONIALS ══════════════ */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.04)_0%,transparent_60%)] -z-10" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((t) => (
                <blockquote key={t.name}
                  className="p-7 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">{t.avatar}</div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ CTA ══════════════ */}
        <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
              <div className="absolute inset-0 -z-[1]">
                <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-400/30 blur-[80px]" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-400/30 blur-[80px]" />
              </div>
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
              />
              <div className="relative px-8 py-16 sm:px-16 sm:py-24 lg:py-32 text-center">
                <PremiumBadge
                  variant="gradient"
                  icon="sparkles"
                  size="md"
                  className="!px-5 !py-1.5 !text-sm mb-8"
                >
                  It's completely free to start
                </PremiumBadge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                  Ready to Transform Your Learning?
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-14">
                  Join thousands of learners who are already building the skills that matter. Start your journey today — no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/sign-up">
                    <PremiumButton
                      variant="gradient"
                      size="lg"
                      className="!bg-white !text-indigo-700 hover:!bg-slate-50 shadow-2xl shadow-black/20 text-base sm:text-lg px-10 sm:px-12 py-4 sm:py-5"
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Start Learning Now
                    </PremiumButton>
                  </Link>
                  <Link href="#pricing">
                    <PremiumButton
                      variant="secondary"
                      size="lg"
                      className="!border-white/40 !text-white hover:!bg-white/10 text-base sm:text-lg px-10 sm:px-12 py-4 sm:py-5"
                    >
                      View Plans
                    </PremiumButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PremiumFooter />
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// Data — colocated, typed
// ════════════════════════════════════════════════════════════════════════════════
const stats = [
  { value: "10K+", label: "Active Learners", icon: <UsersIcon className="w-5 h-5 text-indigo-500" /> },
  { value: "500+", label: "Expert Lessons", icon: <AwardIcon className="w-5 h-5 text-purple-500" /> },
  { value: "95%", label: "Completion Rate", icon: <TrendingIcon className="w-5 h-5 text-pink-500" /> },
  { value: "4.9★", label: "Average Rating", icon: <StarIcon className="w-5 h-5 text-amber-500" /> },
]

const features = [
  {
    title: "AI-Powered Personalization",
    description: "Our intelligent system adapts to your learning style, pace, and goals, creating a unique path just for you.",
    accentFrom: "indigo" as const,
    icon: <TargetIcon className="w-6 h-6" />,
  },
  {
    title: "Bite-Sized Learning",
    description: "Master complex topics through focused 5-minute sessions that fit your schedule.",
    accentFrom: "purple" as const,
    icon: <ZapIcon className="w-6 h-6" />,
  },
  {
    title: "Gamified Progress",
    description: "Stay motivated with achievements, streaks, and progress tracking that keeps you engaged.",
    accentFrom: "pink" as const,
    icon: <TrophyIcon className="w-6 h-6" />,
  },
  {
    title: "Science-Backed Approach",
    description: "Our methods are grounded in cognitive science, ensuring maximum retention and growth.",
    accentFrom: "emerald" as const,
    icon: <ShieldIcon className="w-6 h-6" />,
  },
  {
    title: "Smart Recommendations",
    description: "Personalized lesson paths powered by adaptive AI that learns with your strengths and preferences.",
    accentFrom: "amber" as const,
    icon: <SparklesIcon className="w-6 h-6" />,
  },
  {
    title: "Expert Crafted Content",
    description: "Learn from industry leaders with carefully curated lessons built by experts who care about your success.",
    accentFrom: "blue" as const,
    icon: <BookOpenIcon className="w-6 h-6" />,
  },
]

const steps = [
  { step: "01", title: "Pick Your Goal", description: "Select from hundreds of skill paths — coding, design, leadership, data science, and more.", icon: "🎯" },
  { step: "02", title: "Learn in 5-Min Bursts", description: "Bite-sized lessons designed around spaced repetition and active recall for maximum retention.", icon: "⚡" },
  { step: "03", title: "Practice Daily", description: "Build muscle memory with smart daily drills. No cramming — just consistent, compounding progress.", icon: "🔥" },
  { step: "04", title: "Track & Grow", description: "Your dashboard shows streaks, mastery levels, and exactly where to focus next.", icon: "📈" },
]

const testimonials = [
  {
    quote: "I went from knowing nothing about React to building production apps in 8 weeks. The 5-minute format makes it impossible to skip.",
    name: "Sarah K.", role: "Frontend Developer", avatar: "SK",
  },
  {
    quote: "The AI tutor catches exactly the gaps I didn't know I had. Every day feels like a tiny revelation.",
    name: "Marcus R.", role: "Product Designer", avatar: "MR",
  },
  {
    quote: "Finally a learning app that earns a spot on my home screen. Gamification + real skill building is a winning combo.",
    name: "Lena W.", role: "Data Analyst", avatar: "LW",
  },
]

// ── Inline SVG icon components (avoids lucide-react client/serve clash) ──────────
function TargetIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>)
}
function ZapIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>)
}
function TrophyIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>)
}
function ShieldIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 5.5-2.36A2 2 0 0 1 12 5c-2.45 0-3.69 1.5-4.5 3.26C6.12 4.2 3.5 4.5 3.5 4.5a1 1 0 0 1 0-.38c.32-1.15.09-2.12-.04-3.03A9.13 9.13 0 0 1 9 1h6c1.25 0 2.45.18 3.5.51.11.9.35 1.87.09 3.03a1 1 0 0 1 0 .37l-.13.13C18.19 5.5 20.5 7 20.5 8V13z"/></svg>)
}
function SparklesIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>)
}
function BookOpenIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>)
}
function UsersIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>)
}
function AwardIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>)
}
function TrendingIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>)
}
function StarIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)
}
function MoonIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>)
}
function SunIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>)
}
function MenuIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>)
}
function XIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>)
}
function ArrowRightIcon(props: { className?: string }) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>)
}
