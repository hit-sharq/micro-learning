"use client"

import React, { useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import Link from "next/link"
import {
  BookOpen, Menu, X, Moon, Sun, ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
  useClerk,
} from "@clerk/nextjs"

interface NavLink { label: string; href: string }

const navLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Progress", href: "#progress" },
  { label: "Pricing",  href: "#pricing" },
  { label: "Contact",  href: "/contact" },
]

/** Clerk-provided sign-in — redirects to /dashboard */
const ClerkSignIn = () => (
  <SignInButton
    mode="modal"
    forceRedirectUrl="/dashboard"
    signUpUrl="/sign-up"
  >
    <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200">
      Sign In
    </button>
  </SignInButton>
)

/** Clerk-provided sign-up — redirects to /dashboard */
const ClerkSignUp = () => (
  <SignUpButton
    mode="modal"
    forceRedirectUrl="/dashboard"
    signInUrl="/sign-in"
  >
    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer">
      Get Started <ArrowRight className="w-4 h-4" />
    </span>
  </SignUpButton>
)

export function Navbar() {
  const pathname  = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, isLoaded } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const toggleMenu = useCallback(() => setMobileOpen((o) => !o), [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Microlearning</span>
              <span className="text-slate-700 dark:text-slate-300"> Coach</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <span className="block dark:hidden"><Moon className="w-5 h-5" /></span>
              <span className="hidden dark:block"><Sun className="w-5 h-5" /></span>
            </button>

            {/* Auth state */}
            {isLoaded && user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/dashboard">
                  <span className="px-4 py-2 rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all">
                    Dashboard
                  </span>
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 ring-2 ring-indigo-500/30",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <ClerkSignIn />
                <ClerkSignUp />
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <span className={mobileOpen ? "hidden" : "block"}><Menu className="w-5 h-5" /></span>
              <span className={mobileOpen ? "block" : "hidden"}><X className="w-5 h-5" /></span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown ─── */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out",
          mobileOpen
            ? "max-h-96 opacity-100 border-t border-slate-200/50 dark:border-slate-800/50"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 bg-white dark:bg-slate-950 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}

          {isLoaded && user ? (
            <>
              <Link href="/dashboard">
                <span className="block px-4 py-3 rounded-xl text-base font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all">
                  Dashboard
                </span>
              </Link>
              <div className="mt-2 px-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <>
              <div className="mt-3 flex flex-col gap-2 px-4">
                <ClerkSignIn />
                <ClerkSignUp />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
