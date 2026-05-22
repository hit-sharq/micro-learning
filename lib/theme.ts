/**
 * Premium Theme Configuration
 * Single source of truth for all design tokens.
 * Swap entire sections to re-brand across industries (SaaS, portfolio, education, etc.)
 */

export const theme = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  brand: {
    name: "Microlearning Coach",
    tagline: "Master Skills in 5 Minutes a Day",
    logoIcon: "BookOpen",
  },

  // ── Color Palette (swap to re-theme) ──────────────────────────────────────
  colors: {
    // Primary accent
    primary: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",  // ← core brand color
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    // Secondary accent
    secondary: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7c3aed",
      800: "#6b21a8",
      900: "#581c87",
    },
    // Surface tokens (CSS variables will be generated from these)
    surface: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      card: "hsl(var(--card))",
      cardForeground: "hsl(var(--card-foreground))",
      muted: "hsl(var(--muted))",
      mutedForeground: "hsl(var(--muted-foreground))",
      border: "hsl(var(--border))",
      ring: "hsl(var(--ring))",
    },
    // Static fills useful for editor Sims
    indigo: {
      50: "#eef2ff",
      100: "#e0e7ff",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
    },
    purple: {
      400: "#c084fc",
      500: "#a855f7",
    },
    pink: {
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
    },
    success: {
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
    },
    warning: {
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
    },
    danger: {
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
    },
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  },

  // ── Typography ────────────────────────────────────────────────────────────
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      display: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      mono: ["JetBrains Mono", "Fira Code", "monospace"],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // ── Spacing Scale ─────────────────────────────────────────────────────────
  spacing: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
    40: "10rem",
    48: "12rem",
    56: "14rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  },

  // ── Border Radius ─────────────────────────────────────────────────────────
  borderRadius: {
    none: "0",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },

  // ── Shadows ───────────────────────────────────────────────────────────────
  shadows: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    glow: "0 0 40px rgba(99, 102, 241, 0.15)",
    "glow-lg": "0 0 80px rgba(99, 102, 241, 0.2)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },

  // ── Gradients ─────────────────────────────────────────────────────────────
  gradients: {
    primary: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
    primarySoft: "linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)",
    hero: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    heroLight: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #faf5ff 100%)",
    surface: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    dark: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    mesh:
      "radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), " +
      "radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.12) 0px, transparent 50%), " +
      "radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.1) 0px, transparent 50%), " +
      "radial-gradient(at 80% 50%, rgba(99, 102, 241, 0.08) 0px, transparent 50%), " +
      "radial-gradient(at 0% 100%, rgba(168, 85, 247, 0.15) 0px, transparent 50%)",
  },

  // ── Animation Timing ──────────────────────────────────────────────────────
  animation: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "350ms cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  // ── Breakpoints (mirrors Tailwind) ────────────────────────────────────────
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },

  // ── Layout Presets ────────────────────────────────────────────────────────
  layout: {
    container: "mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl",
    section: "py-16 sm:py-20 lg:py-28",
    sectionNarrow: "py-8 sm:py-12 lg:py-16",
    gap: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
      "2xl": "4rem",
      "3xl": "6rem",
    },
  },

  // ── Navigation Presets ────────────────────────────────────────────────────
  nav: {
    height: "4rem",       // 64px
    mobileHeight: "3.5rem",
    maxWidth: "1400px",
  },
} as const

// ── Responsive breakpoint helper ─────────────────────────────────────────────
export const bp = {
  sm: `(min-width: 640px)`,
  md: `(min-width: 768px)`,
  lg: `(min-width: 1024px)`,
  xl: `(min-width: 1280px)`,
  "2xl": `(min-width: 1400px)`,
} as const

export type Theme = typeof theme
