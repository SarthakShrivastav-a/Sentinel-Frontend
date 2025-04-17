"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className="flex flex-col justify-center space-y-4 perspective-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.div
        className="perspective-card-content"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary glow">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-2 mt-4">
          <h3 className="text-xl font-bold gradient-text">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
