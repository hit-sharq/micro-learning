import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import { AchievementManager } from "@/components/achievement-notification"
import { ThemeProvider } from "@/components/theme"
import { Navbar } from "@/components/premium/Navbar"
import { PremiumFooter } from "@/components/premium/Footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Microlearning Coach — Master Skills in 5 Minutes a Day",
  description:
    "AI-powered, bite-sized lessons tailored to your goals. Join 10,000+ learners building daily skills that stick.",
  keywords:
    "microlearning, online learning, bite-sized courses, skill building, daily learning, AI tutor",
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { background: "#363636", color: "#fff" },
              }}
            />
            <AchievementManager />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
