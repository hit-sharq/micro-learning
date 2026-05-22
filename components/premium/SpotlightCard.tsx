"use client"

import type { ReactNode, MouseEvent } from "react"
import { cn } from "@/lib/utils"

/**
 * PremiumCard with a moving radial-gradient spotlight on mouse move.
 * Pure CSS — no framer-motion.
 */
export function SpotlightCard({
  children,
  className,
  gradientColor = "rgba(99, 102, 241, 0.12)",
  spotlightSize = 300,
  borderColor = "hsl(var(--border) / 0.6)",
}: {
  children: ReactNode
  className?: string
  gradientColor?: string
  spotlightSize?: number
  borderColor?: string
}) {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty("--spot-x", `${x}px`)
    el.style.setProperty("--spot-y", `${y}px`)
  }

  return (
    <div
      className={cn(
        "group relative rounded-2xl border p-8 overflow-hidden bg-white/60 dark:bg-slate-900/60",
        "backdrop-blur-sm transition-all duration-300",
        "hover:border-indigo-300/50 dark:hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10",
        className,
      )}
      style={{
        background: `radial-gradient(circle at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%), hsl(var(--card))`,
      }}
      onMouseMove={handleMouseMove}
    >
      {/* dynamic radial-gradient background layer */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle ${spotlightSize}px at var(--spot-x, 50%) var(--spot-y, 50%), ${gradientColor}, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
