"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Zap } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"
import { motion } from "framer-motion"
import { LoginAnimation } from "@/components/login-animation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mesh p-4">
      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
        <Zap className="h-6 w-6 text-primary animate-pulse-subtle" />
        <span className="text-xl font-bold gradient-text">StreamLine</span>
      </Link>

      <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex items-center justify-center"
        >
          <LoginAnimation />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Card className="w-full backdrop-blur bg-background/50 border-primary/20 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold gradient-text">Log in</CardTitle>
              <CardDescription>Enter your email and password to access your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                </motion.div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline underline-offset-4">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <Button type="submit" className="w-full gradient-border" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 mr-2 rounded-full border-2 border-primary border-r-transparent animate-spin" />
                        Logging in...
                      </span>
                    ) : (
                      "Log in"
                    )}
                  </Button>
                </motion.div>
                <motion.div
                  className="text-center text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-primary hover:underline underline-offset-4">
                    Sign up
                  </Link>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
