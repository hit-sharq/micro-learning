"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// ── Props ─────────────────────────────────────────────────────────────────────
interface PremiumCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "elevated" | "glass" | "bordered" | "gradient"
  padding?: "none" | "sm" | "md" | "lg"
  hoverable?: boolean
  onClick?: () => void
  animate?: boolean
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const

export function PremiumCard({
  children,
  className,
  variant = "default",
  padding = "md",
  hoverable = false,
  onClick,
  animate = true,
}: PremiumCardProps) {
  const surfaceClasses = cn(
    "relative rounded-2xl transition-all duration-300",
    paddingMap[padding],
    variant === "default"   && "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60",
    variant === "elevated"  && "bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/60",
    variant === "bordered"  && "bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800",
    variant === "glass"     && "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-xl shadow-black/5",
    variant === "gradient"  && "bg-gradient-to-br from-indigo-500/[0.07] via-purple-500/[0.05] to-pink-500/[0.07] border border-indigo-200/30 dark:border-indigo-800/30",
    onClick && "cursor-pointer",
    hoverable && "hover:shadow-xl hover:shadow-indigo-500/8 hover:-translate-y-1",
    className,
  )

  return (
    <div className={surfaceClasses} onClick={onClick}>
      {(variant === "gradient" || variant === "bordered") && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-indigo-50/40 via-transparent to-pink-50/30 dark:from-indigo-900/20 dark:to-pink-900/15" />
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}

// ── Card sub-parts ─────────────────────────────────────────────────────────────
export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({
  children, className,
}) => <div className={cn("mb-4 pb-4 border-b border-slate-100 dark:border-slate-800", className)}>{children}</div>

export const CardTitle: React.FC<{ children: ReactNode; className?: string; as?: "h2" | "h3" | "h4" }> = ({
  children, className, as: Tag = "h3",
}) => <Tag className={cn("text-lg font-bold text-slate-900 dark:text-white", className)}>{children}</Tag>

export const CardDescription: React.FC<{ children: ReactNode; className?: string }> = ({
  children, className,
}) => <p className={cn("text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1", className)}>{children}</p>

export const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({
  children, className,
}) => <div className={cn("mt-4", className)}>{children}</div>
