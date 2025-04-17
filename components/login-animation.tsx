"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function LoginAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    // Create a lock icon
    const drawLock = () => {
      if (!ctx) return

      // Lock body
      ctx.fillStyle = "hsl(142, 76%, 56%)"
      ctx.beginPath()
      ctx.roundRect(150, 180, 100, 80, 10)
      ctx.fill()

      // Lock shackle
      ctx.strokeStyle = "hsl(142, 76%, 56%)"
      ctx.lineWidth = 12
      ctx.beginPath()
      ctx.arc(200, 180, 40, Math.PI, 2 * Math.PI)
      ctx.stroke()

      // Keyhole
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
      ctx.beginPath()
      ctx.arc(200, 210, 10, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillRect(195, 210, 10, 20)
    }

    // Create particles
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = `hsla(142, 76%, ${50 + Math.random() * 20}%, ${Math.random() * 0.3})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particlesArray: Particle[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      // Draw lock
      drawLock()

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      <motion.div
        className="absolute text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold gradient-text mb-2">Secure Monitoring</h2>
        <p className="text-muted-foreground">Log in to access your dashboard and monitor your websites in real-time.</p>
      </motion.div>
    </motion.div>
  )
}
