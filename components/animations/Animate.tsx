"use client"

import React, { type ReactNode, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// ════════════════════════════════════════════════════════════════════════════════
//  Pure-CSS replacements — no framer-motion dependency
// ════════════════════════════════════════════════════════════════════════════════

// ── Screen-reader only ─────────────────────────────────────────────────────────
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>
}

// ════════════════════════════════════════════════════════════════════════════════
//  ScrollReveal — tiny hook + vanilla HTML, animation driven by CSS
// ════════════════════════════════════════════════════════════════════════════════

function useOnScreen(ref: { current: HTMLElement | null }, margin = "-60px") {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Already visible (e.g. static / SSR fallback)
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("show")
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("show"); io.unobserve(el) } },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
}

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "article" | "li" | "span"
  delayMs?: number
}

/** ScrollReveal — attaches IntersectionObserver and delegates to a CSS class. */
function ScrollReveal({ children, className, as: Tag = "div", delayMs = 0 }: ScrollRevealProps) {
  const elRef = useRef<HTMLElement>(null)

  useOnScreen({ current: elRef.current })

  const animCls = [
    "scroll-reveal",
    delayMs > 0 ? `scroll-reveal-delay-[${delayMs}ms]` : null,
    className,
  ].filter(Boolean).join(" ")

  // Use a callback ref to avoid TS typing issues with polymorphic `Tag ref`
  const setRef = (node: HTMLElement | null) => { elRef.current = node }

  return React.createElement(
    Tag,
    { ref: setRef, className: animCls, style: { animationDelay: delayMs > 0 ? `${delayMs}ms` : undefined } },
    children,
  )
}
// ════════════════════════════════════════════════════════════════════════════════
//  Animate (staggered scroll-reveal container)
// ════════════════════════════════════════════════════════════════════════════════

interface AnimateProps {
  children: ReactNode
  className?: string
  staggerMs?: number
  as?: "div" | "section" | "article" | "main" | "ul"
}

/**
 * Animate — wraps children in a staggered container.
 * Children that should animate individually can be wrapped in `ScrollReveal`.
 */
export function Animate({
  children,
  className,
  staggerMs = 80,
  as: Tag = "div",
}: AnimateProps) {
  return (
    <Tag className={cn("animate-grid", className)} style={{ "--stagger": `${staggerMs}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  )
}

// Apply .animate-grid > * animation to direct children
// injected via CSS (app/globals.css):

// ── FadeSlideItem ───────────────────────────────────────────────────────────────
interface FadeSlideItemProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delayMs?: number
  as?: "div" | "section" | "article" | "li" | "span"
}

/** FadeSlideItem — scroll-reveal wrapper that fades + slides in the given direction. */
export function FadeSlideItem({
  children,
  className,
  direction = "up",
  delayMs = 0,
  as: Tag = "div",
}: FadeSlideItemProps) {
  return (
    <ScrollReveal as={Tag} className={cn(`scroll-reveal-${direction}`, className)} delayMs={delayMs}>
      {children}
    </ScrollReveal>
  )
}

// ── ScaleReveal ─────────────────────────────────────────────────────────────────
interface ScaleRevealProps {
  children: ReactNode
  className?: string
  delayMs?: number
  as?: "div" | "section" | "article"
}

/** ScaleReveal — scroll-reveal that scales from 0.92 → 1 on entry. */
export function ScaleReveal({
  children,
  className,
  delayMs = 0,
  as: Tag = "div",
}: ScaleRevealProps) {
  return (
    <ScrollReveal as={Tag} className={cn("scroll-reveal-scale", className)} delayMs={delayMs}>
      {children}
    </ScrollReveal>
  )
}

// ── Floating ────────────────────────────────────────────────────────────────────
interface FloatingProps {
  children: ReactNode
  yDistance?: number
  durationMs?: number
  className?: string
}

/** Floating — continuous up/down keyframe animation via pure CSS. */
export function Floating({
  children,
  yDistance = 12,
  durationMs = 4000,
  className,
}: FloatingProps) {
  return (
    <div
      className={cn("animate-floating", className)}
      style={{ "--float-y": `${yDistance}px`, "--float-dur": `${durationMs}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// ── Gradient text helper ────────────────────────────────────────────────────────
interface GradientTextProps {
  children: ReactNode
  from?: string
  via?: string
  to?: string
  className?: string
}

export function GradientText({
  children,
  from = "from-indigo-500",
  via = "via-purple-500",
  to = "to-pink-500",
  className,
}: GradientTextProps) {
  return (
    <span className={cn(`bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent`, className)}>
      {children}
    </span>
  )
}
