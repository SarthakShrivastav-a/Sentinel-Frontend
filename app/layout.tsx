import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-provider"
import { CursorGlow } from "@/components/cursor-glow"
import { Analytics } from "@/components/analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sentinel - Website Monitoring Made Simple",
  description: "Monitor your website uptime, performance, and more with Sentinel",
  generator: "v0.dev",
  icons: {
    icon: "/placeholder-logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-mesh`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
            <CursorGlow />
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
