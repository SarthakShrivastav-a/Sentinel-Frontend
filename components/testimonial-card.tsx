"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  delay?: number
}

export function TestimonialCard({ quote, name, role, delay = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="flex flex-col justify-center space-y-4 rounded-lg border border-primary/20 p-6 shadow-sm card-hover bg-background/50 backdrop-blur">
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
        >
          "{quote}"
        </motion.p>
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.4, duration: 0.5 }}
        >
          <div className="rounded-full bg-primary/20 p-1 glow">
            <div className="h-8 w-8 rounded-full bg-primary/30" />
          </div>
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}
