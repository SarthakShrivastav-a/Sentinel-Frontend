"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Base URL for all API requests
const API_BASE_URL = "http://localhost:8080"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem("auth_token")
    if (storedToken) {
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.text()
      localStorage.setItem("auth_token", data)
      setToken(data)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      return await response.text()
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = async () => {
    localStorage.removeItem("auth_token")
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}