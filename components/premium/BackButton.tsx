"use client"

import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { PremiumButton } from "./Button"
import { cn } from "@/lib/utils"

export interface BackButtonProps {
  /** Text replacement for the default "Back" label */
  label?: string
  /** href to navigate to — app-relative or absolute; set false or undefined to use window.back() */
  href?: string | false
  /** Optional onclick for programmatic return */
  onClick?: () => void
  /** Placement — "absolute" pins the button overlaying the page header, "static" keeps it normal flow */
  placement?: "absolute" | "static"
  /** Additional classes */
  className?: string
}

export function BackButton({
  label = "Back",
  href = false,
  onClick,
  placement = "absolute",
  className,
}: BackButtonProps) {
  const handleClick = onClick || (() => window.history.length > 1 ? window.history.back() : window.location.assign("/"))
  const content = (
    <PremiumButton
      variant="ghost"
      size="sm"
      leftIcon={<ArrowLeft className="w-4 h-4" />}
      onClick={handleClick}
      className={cn("gap-1.5", className)}
    >
      {label}
    </PremiumButton>
  )

  if (placement === "absolute") {
    return <div className="absolute top-4 left-4 z-40 pt-2 sm:top-8 sm:left-8">{content}</div>
  }

  return content
}
