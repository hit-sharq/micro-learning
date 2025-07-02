"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
  variant?: "default" | "ghost" | "outline"
}

export function BackButton({ href, label = "Back", className = "", variant = "ghost" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  const baseClasses =
    "inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
  }

  return (
    <button onClick={handleBack} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  )
}
