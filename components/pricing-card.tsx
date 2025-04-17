"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

interface PricingCardProps {
  title: string
  description: string
  price: string
  features: string[]
  popular?: boolean
  delay?: number
}

export function PricingCard({ title, description, price, features, popular = false, delay = 0 }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={popular ? "lg:-mt-8" : ""}
    >
      <Card
        className={`h-full overflow-hidden transition-all ${popular ? "border-primary gradient-border" : "border-border"} card-hover`}
      >
        {popular && (
          <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground animate-pulse-subtle">
            Most Popular
          </div>
        )}
        <div className="p-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold gradient-text">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold">{price}</span>
            <span className="ml-1 text-muted-foreground">/month</span>
          </div>
          <ul className="mt-6 space-y-2">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.1 + index * 0.1, duration: 0.3 }}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <CardFooter className="p-6 pt-0">
          <Link href="/register" className="w-full">
            <Button className="w-full relative overflow-hidden group">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
