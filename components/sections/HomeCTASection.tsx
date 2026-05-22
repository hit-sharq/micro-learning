"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { PremiumButton } from "@/components/premium"
import { PremiumBadge } from "@/components/premium"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────
interface HomeCTASectionProps {
  badgeText?: string
  headline?: string
  description?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  className?: string
}

/** HomeCTASection — high-impact conversion section. */
export function HomeCTASection({
  badgeText = "It's completely free to start",
  headline = "Ready to Transform Your Learning?",
  description = "Join thousands of learners who are already building the skills that matter. Start your journey today — no credit card required.",
  primaryCta = { label: "Start Learning Now", href: "/sign-up" },
  secondaryCta = { label: "View Plans", href: "#pricing" },
  className,
}: HomeCTASectionProps) {
  return (
    <section className={cn("relative py-20 sm:py-28 lg:py-32 overflow-hidden", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
          {/* Orbs / glow */}
          <div className="absolute inset-0 -z-[1]">
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-400/30 blur-[80px]" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-400/30 blur-[80px]" />
          </div>

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-16 sm:py-24 lg:py-32 text-center">
            <div className="animate-fade-in-up mb-8"
              style={{ animationDelay: "0ms", animationFillMode: "backwards" }}>
              <PremiumBadge
                variant="gradient"
                icon="sparkles"
                size="md"
                className="!px-5 !py-1.5 !text-sm mb-8"
              >
                {badgeText}
              </PremiumBadge>
            </div>

            <h2 className="animate-fade-in-up text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight"
              style={{ animationDelay: "80ms", animationFillMode: "backwards" }}>
              {headline}
            </h2>

            <p className="animate-fade-in-up text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-14"
              style={{ animationDelay: "160ms", animationFillMode: "backwards" }}>
              {description}
            </p>

            <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4"
              style={{ animationDelay: "240ms", animationFillMode: "backwards" }}>
              <Link href={primaryCta.href}>
                <PremiumButton
                  variant="gradient"
                  size="lg"
                  className="!bg-white !text-indigo-700 hover:!bg-slate-50 shadow-2xl shadow-black/20 text-base sm:text-lg px-10 sm:px-12 py-4 sm:py-5"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {primaryCta.label}
                </PremiumButton>
              </Link>
              {secondaryCta.href !== "#" && (
                <Link href={secondaryCta.href}>
                  <PremiumButton
                    variant="secondary"
                    size="lg"
                    className="!border-white/40 !text-white hover:!bg-white/10 text-base sm:text-lg px-10 sm:px-12 py-4 sm:py-5"
                  >
                    {secondaryCta.label}
                  </PremiumButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
