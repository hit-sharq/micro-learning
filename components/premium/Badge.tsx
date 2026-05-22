"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, CheckCircle, AlertCircle, Info, Zap, Star } from "lucide-react"

// ── Props ─────────────────────────────────────────────────────────────────────
interface PremiumBadgeProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "gradient" | "glass" | "muted"
  size?: "sm" | "md" | "lg"
  icon?: "star" | "sparkles" | "check" | "alert" | "info" | "zap" | "none"
  dot?: boolean
  className?: string
}

// ── Token map ──────────────────────────────────────────────────────────────────
const tokens: Record<string, { bg: string; text: string; border: string; dot?: string }> = {
  primary:   { bg: "bg-indigo-50 dark:bg-indigo-500/15",          text: "text-indigo-700 dark:text-indigo-300",   border: "border-indigo-200/60 dark:border-indigo-500/30" },
  secondary: { bg: "bg-slate-100 dark:bg-slate-800",               text: "text-slate-700 dark:text-slate-300",    border: "border-slate-200 dark:border-slate-700" },
  success:   { bg: "bg-emerald-50 dark:bg-emerald-500/15",         text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200/60 dark:border-emerald-500/30" },
  warning:   { bg: "bg-amber-50 dark:bg-amber-500/15",             text: "text-amber-700 dark:text-amber-300",    border: "border-amber-200/60 dark:border-amber-500/30" },
  danger:    { bg: "bg-red-50 dark:bg-red-500/15",                 text: "text-red-700 dark:text-red-300",        border: "border-red-200/60 dark:border-red-500/30" },
  info:      { bg: "bg-cyan-50 dark:bg-cyan-500/15",               text: "text-cyan-700 dark:text-cyan-300",      border: "border-cyan-200/60 dark:border-cyan-500/30" },
  gradient:  { bg: "bg-gradient-to-r from-indigo-500 to-purple-500", text: "text-white",                             border: "border-transparent" },
  glass:     { bg: "bg-white/50 dark:bg-slate-800/50 backdrop-blur", text: "text-slate-700 dark:text-slate-300",    border: "border-white/40 dark:border-white/10" },
}

const iconMap: Record<string, typeof Sparkles> = {
  star: Star,
  sparkles: Sparkles,
  check: CheckCircle,
  alert: AlertCircle,
  info: Info,
  zap: Zap,
}

const sizeMap = {
  sm: "px-2.5 py-0.5 text-xs gap-1",
  md: "px-3 py-1 text-sm gap-1.5",
  lg: "px-4 py-1.5 text-base gap-2",
}

// ── Component ─────────────────────────────────────────────────────────────────
export function PremiumBadge({
  children,
  variant = "primary",
  size = "sm",
  icon = "none",
  dot = false,
  className,
}: PremiumBadgeProps) {
  const t = tokens[variant]
  const IconComp = icon !== "none" ? iconMap[icon] : null

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border transition-all duration-200",
        "hover:scale-[1.04]",
        t.bg, t.text, t.border,
        sizeMap[size],
        className,
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-pulse" />}
      {IconComp && <IconComp className="w-3.5 h-3.5 shrink-0" />}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  )
}
