"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// ── Props ─────────────────────────────────────────────────────────────────────
interface PremiumButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gradient"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  isLoading?: boolean
  disabled?: boolean
  rightIcon?: ReactNode
  leftIcon?: ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  className?: string
}

// ── Variant style tokens ───────────────────────────────────────────────────────
const variantTokens = {
  primary:
    "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-indigo-500/40",
  secondary:
    "border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800",
  ghost: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
  danger: "bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600 hover:shadow-red-500/40",
  gradient:
    "text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-indigo-500/30",
}

const sizeTokens = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-2.5 text-base gap-2",
  lg: "px-8 py-3.5 text-lg gap-2.5",
}

// ── Component ─────────────────────────────────────────────────────────────────
export function PremiumButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  rightIcon,
  leftIcon,
  onClick,
  type = "button",
  className,
}: PremiumButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
        "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]",
        variantTokens[variant],
        sizeTokens[size],
        fullWidth && "w-full",
        isLoading && "pointer-events-none",
        className,
      )}
    >
      {/* Spinner */}
      {isLoading && (
        <span
          className="inline-block w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-40"
          aria-hidden="true"
        />
      )}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className="whitespace-nowrap">{children}</span>
      {!isLoading && rightIcon && (
        <span className="shrink-0 group-hover:translate-x-0.5 transition-transform duration-200">
          {rightIcon}
        </span>
      )}
    </button>
  )
}
