"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Loader2 } from "lucide-react"

export default function OAuth2Callback() {
  const [error, setError] = useState("")
  const router = useRouter()
  const { setAuthToken } = useAuth()
  
  useEffect(() => {
    // Function to get URL parameters
    const getUrlParams = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search)
        return {
          token: params.get("token"),
          newUser: params.get("newUser") === "true"
        }
      }
      return { token: null, newUser: false }
    }
    
    const { token, newUser } = getUrlParams()
    
    if (token) {
      // Store token
      setAuthToken(token)
      
      // Redirect based on whether user is new or not
      if (newUser) {
        router.push("/complete-profile")
      } else {
        router.push("/dashboard")
      }
    } else {
      setError("Authentication failed. No token received.")
    }
  }, [router, setAuthToken])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {error ? (
        <div className="text-red-500 text-center">
          {error}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Processing your login...</p>
        </div>
      )}
    </div>
  )
}