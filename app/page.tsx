"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, LineChart, Shield, Zap } from "lucide-react"
import { HeroParticles } from "@/components/hero-particles"
import { FeatureCard } from "@/components/feature-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { PricingCard } from "@/components/pricing-card"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary animate-pulse-subtle" />
            <span className="text-xl font-bold gradient-text">StreamLine</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hover:text-primary transition-all">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="relative overflow-hidden group">
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden hero-gradient">
          <HeroParticles />
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              className="flex flex-col items-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gradient">
                  Monitor Your Website's Health in Real-Time
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Get instant alerts when your website goes down. Track performance metrics and ensure your users always
                  have a smooth experience.
                </p>
              </div>
              <motion.div
                className="space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link href="/register">
                  <Button className="px-8 gradient-border">
                    Start Monitoring <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="px-8 glass-effect">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-grid">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl gradient-text">
                  Everything You Need to Stay Online
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our comprehensive monitoring solution provides all the tools you need to ensure your website is always
                  performing at its best.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <FeatureCard
                icon={Shield}
                title="Uptime Monitoring"
                description="Get notified instantly when your website goes down with our 24/7 monitoring service."
                delay={0.1}
              />
              <FeatureCard
                icon={LineChart}
                title="Performance Metrics"
                description="Track response times, status codes, and content changes to ensure optimal performance."
                delay={0.2}
              />
              <FeatureCard
                icon={CheckCircle}
                title="SSL Certificate Monitoring"
                description="Never miss an SSL certificate expiration with our automated certificate monitoring."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-dots">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl gradient-text">
                  Trusted by Businesses Worldwide
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our customers have to say about StreamLine's monitoring services.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <TestimonialCard
                quote="StreamLine has been a game-changer for our business. We used to find out about website issues from our customers, but now we're the first to know and can fix problems before they impact our users."
                name="Sarah Johnson"
                role="CTO, TechCorp"
                delay={0.1}
              />
              <TestimonialCard
                quote="The detailed performance metrics have helped us optimize our website and improve load times by 40%. Our customers have noticed the difference, and our conversion rates have improved significantly."
                name="Michael Chen"
                role="E-commerce Director, ShopRight"
                delay={0.2}
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-grid">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl gradient-text">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for your business. All plans include a 14-day free trial.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <PricingCard
                title="Starter"
                description="Perfect for small websites and personal projects."
                price="$19"
                features={["5 monitors", "5-minute check intervals", "Email notifications"]}
                delay={0.1}
              />
              <PricingCard
                title="Professional"
                description="Ideal for growing businesses and e-commerce sites."
                price="$49"
                features={[
                  "20 monitors",
                  "1-minute check intervals",
                  "Email & SMS notifications",
                  "SSL certificate monitoring",
                ]}
                popular={true}
                delay={0.2}
              />
              <PricingCard
                title="Enterprise"
                description="For large businesses with mission-critical websites."
                price="$99"
                features={[
                  "Unlimited monitors",
                  "30-second check intervals",
                  "All notification channels",
                  "Advanced analytics",
                  "Dedicated support",
                ]}
                delay={0.3}
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-glow">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl gradient-text">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of businesses that trust StreamLine for their website monitoring needs.
                </p>
              </div>
              <motion.div
                className="space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link href="/register">
                  <Button size="lg" className="px-8 gradient-border">
                    Start Your Free Trial
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="px-8 glass-effect">
                    Log In
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary animate-pulse-subtle" />
            <span className="text-lg font-bold gradient-text">StreamLine</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} StreamLine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
