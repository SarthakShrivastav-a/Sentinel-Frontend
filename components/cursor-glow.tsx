"use client"

import { useEffect, useState } from "react"

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isActive) setIsActive(true)
    }

    const handleMouseLeave = () => {
      setIsActive(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isActive])

  // Only show on larger screens
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return null
  }

  return (
    <div
      className={`cursor-glow ${isActive ? "active" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  )
}
