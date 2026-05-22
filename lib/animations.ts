/**
 * Premium Animation System — Framer Motion Variants
 * All animations reference these for consistency.
 * Change a value here → updates site-wide.
 */
import type {
  Variants,
  Transition,
  TargetAndTransition,
} from "framer-motion"

// ── Transition Presets ───────────────────────────────────────────────────────
export const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
  mass: 0.8,
}

export const springGentle: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 16,
  mass: 1,
}

export const easeAnim: Transition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1], // ease-out-expo
}

export const stagger = (offset = 0.08): Transition => ({
  staggerChildren: offset,
  delayChildren: 0,
})

export const staggerFast = (offset = 0.04): Transition => ({
  staggerChildren: offset,
  delayChildren: 0,
})

// ── Fade & Visibility ────────────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: easeAnim },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: easeAnim },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -32 },
  show: { opacity: 1, y: 0, transition: easeAnim },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  show: { opacity: 1, x: 0, transition: easeAnim },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  show: { opacity: 1, x: 0, transition: easeAnim },
}

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: springGentle },
}

// ── Slide Variants ───────────────────────────────────────────────────────────
export const slideUp: Variants = {
  hidden: { y: 60, opacity: 0 },
  show: { y: 0, opacity: 1, transition: easeAnim },
}

export const slideDown: Variants = {
  hidden: { y: -60, opacity: 0 },
  show: { y: 0, opacity: 1, transition: easeAnim },
}

export const slideLeft: Variants = {
  hidden: { x: 60, opacity: 0 },
  show: { x: 0, opacity: 1, transition: easeAnim },
}

export const slideRight: Variants = {
  hidden: { x: -60, opacity: 0 },
  show: { x: 0, opacity: 1, transition: easeAnim },
}

// ── Scale & Rotate ───────────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { scale: 0.92, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: springGentle },
}

export const scaleUp: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: spring },
}

export const flipIn: Variants = {
  hidden: { rotateX: 15, opacity: 0, y: 20 },
  show: { rotateX: 0, opacity: 1, y: 0, transition: springGentle },
}

// ── Spin / Rotate ────────────────────────────────────────────────────────────
export const float: TargetAndTransition = {
  y: [-8, 8, -8],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

export const pulse = 1.05 as const

// ── Hero / Section Container Variants ─────────────────────────────────────────
export const heroContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

export const sectionContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0 },
  },
}

// ── Button Interactions ───────────────────────────────────────────────────────
export const buttonTap: TargetAndTransition = {
  scale: 0.97,
  transition: { type: "spring", stiffness: 400, damping: 17 },
}

export const buttonHover: TargetAndTransition = {
  scale: 1.03,
  y: -2,
  transition: { type: "spring", stiffness: 400, damping: 20 },
}

// ── Card Interactions ─────────────────────────────────────────────────────────
export const cardHover: TargetAndTransition = {
  y: -6,
  transition: easeAnim,
}

export const cardTap: TargetAndTransition = {
  scale: 0.98,
  transition: { type: "spring", stiffness: 500, damping: 30 },
}

// ── List / Grid Item Variant ──────────────────────────────────────────────────
export const listItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: easeAnim },
}

// ── Scroll-triggered section entry (basic fade-up) ─────────────────────────────
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
