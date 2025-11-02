"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, CheckCircle2, Users, ListChecks, DollarSign, MapPin, Sparkles } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedGradient } from "@/components/animated-gradient"
import { MouseFollower } from "@/components/mouse-follower"

export default function LandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const heroRef = useRef(null)

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedGradient />

      <MouseFollower />

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0"
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-serif text-primary">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
              <Heart className="h-7 w-7 fill-primary" />
            </motion.div>
            Forever Yours
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost">Sign In</Button>
              </motion.div>
            </Link>
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 z-0">
          <img
            src="/images/design-mode/background%201%20page%20it%20project.webp"
            alt="Beautiful wedding ceremony"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 py-24 text-center md:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span>Your Dream Wedding Starts Here</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6 text-5xl font-serif leading-tight text-foreground md:text-6xl lg:text-7xl text-balance"
            >
              Plan Your Dream Wedding with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Grace & Ease
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-10 text-lg text-muted-foreground md:text-xl leading-relaxed text-pretty max-w-2xl mx-auto"
            >
              Everything you need to organize your perfect day in one beautiful place. From guest lists to budgets,
              vendors to inspiration boards—we've got you covered.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-2 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <Heart className="h-5 w-5" />
                    Start Planning My Wedding
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-background/50 backdrop-blur text-lg px-8 py-6"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              Free forever • No credit card required • Join 10,000+ happy couples
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="relative container mx-auto px-4 py-16">
        <ScrollReveal>
          <div className="grid gap-4 md:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="relative overflow-hidden rounded-2xl h-64 md:h-80"
            >
              <img
                src="/elegant-wedding-guests.jpg"
                alt="Wedding guests celebration"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-serif text-xl">Manage Your Guests</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="relative overflow-hidden rounded-2xl h-64 md:h-80"
            >
              <img
                src="/wedding-planning-checklist.jpg"
                alt="Wedding planning checklist"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-serif text-xl">Stay Organized</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="relative overflow-hidden rounded-2xl h-64 md:h-80"
            >
              <img
                src="/wedding-budget-planning.jpg"
                alt="Wedding budget planning"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-serif text-xl">Track Your Budget</p>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-20">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-serif text-foreground md:text-5xl">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Powerful tools designed to make wedding planning stress-free, organized, and truly enjoyable
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Guest Management",
              description:
                "Track RSVPs, manage seating arrangements, and keep all your guest information organized in one place.",
              color: "primary",
              delay: 0.1,
              image: "/elegant-wedding-guests.jpg",
            },
            {
              icon: ListChecks,
              title: "Wedding Checklist",
              description:
                "Stay on track with customizable checklists and timelines. Never miss an important task or deadline.",
              color: "green-500",
              delay: 0.2,
              image: "/wedding-planning-checklist.jpg",
            },
            {
              icon: DollarSign,
              title: "Budget Tracker",
              description:
                "Keep your wedding expenses under control with detailed budget tracking and spending insights.",
              color: "amber-500",
              delay: 0.3,
              image: "/wedding-budget-planning.jpg",
            },
            {
              icon: MapPin,
              title: "Vendor Directory",
              description:
                "Discover and connect with trusted South African wedding vendors for every aspect of your big day.",
              color: "blue-500",
              delay: 0.4,
              image: "/elegant-garden-wedding-venue.jpg",
            },
            {
              icon: Sparkles,
              title: "Inspiration Board",
              description:
                "Create your dream wedding moodboard with photos, colors, and ideas that inspire your perfect day.",
              color: "purple-500",
              delay: 0.5,
              image: "/wedding-floral-arrangements.jpg",
            },
            {
              icon: CheckCircle2,
              title: "Progress Tracking",
              description:
                "Visualize your planning progress with intuitive dashboards and stay motivated throughout your journey.",
              color: "rose-500",
              delay: 0.6,
              image: "/wedding-timeline-illustration.jpg",
            },
          ].map((feature, index) => (
            <ScrollReveal key={index} delay={feature.delay}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="border-border/50 transition-all duration-300 h-full overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  </div>
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/10`}
                    >
                      <feature.icon
                        className={`h-7 w-7 text-${feature.color === "primary" ? "primary" : feature.color}`}
                      />
                    </motion.div>
                    <h3 className="mb-3 text-2xl font-serif text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative container mx-auto px-4 py-20 bg-gradient-to-b from-background to-primary/5">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-serif text-foreground md:text-5xl">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Start planning your dream wedding in three simple steps
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Create Your Account",
              description: "Sign up for free and set your wedding date. No credit card required.",
              image: "/romantic-couple-silhouette.jpg",
              delay: 0.1,
            },
            {
              step: "02",
              title: "Plan & Organize",
              description: "Use our tools to manage guests, budget, checklist, and find vendors.",
              image: "/wedding-timeline-illustration.jpg",
              delay: 0.2,
            },
            {
              step: "03",
              title: "Enjoy Your Day",
              description: "Relax knowing everything is organized and ready for your perfect celebration.",
              image: "/elegant-garden-wedding-venue.jpg",
              delay: 0.3,
            },
          ].map((step, index) => (
            <ScrollReveal key={index} delay={step.delay}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center"
              >
                <div className="relative mb-6 mx-auto w-full max-w-sm">
                  <motion.div
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    className="relative overflow-hidden rounded-2xl h-64"
                  >
                    <img
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-serif text-xl font-bold">
                      {step.step}
                    </div>
                  </motion.div>
                </div>
                <h3 className="mb-3 text-2xl font-serif text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative container mx-auto px-4 py-20">
        <ScrollReveal>
          <div className="mb-16 text-center">
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              See what happy couples are saying about Forever Yours
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Sarah & James",
              location: "Cape Town",
              quote:
                "Forever Yours made planning our wedding so much easier. The budget tracker alone saved us thousands!",
              image: "/romantic-couple-silhouette.jpg",
              delay: 0.1,
            },
            {
              name: "Thandi & Michael",
              location: "Johannesburg",
              quote: "The vendor directory helped us find amazing local vendors. Our wedding was absolutely perfect!",
              image: "/elegant-wedding-guests.jpg",
              delay: 0.2,
            },
            {
              name: "Emma & David",
              location: "Durban",
              quote:
                "I loved the inspiration board feature. It helped us visualize our dream wedding and stay organized.",
              image: "/wedding-floral-arrangements.jpg",
              delay: 0.3,
            },
          ].map((testimonial, index) => (
            <ScrollReveal key={index} delay={testimonial.delay}>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('/romantic-wedding-hero.jpg')] opacity-5 bg-cover bg-center" />
                  <CardContent className="relative p-12 text-center">
                    <h2 className="mb-4 text-4xl font-serif text-foreground md:text-5xl">Ready to Start Planning?</h2>
                    <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
                      Join thousands of couples who are planning their dream weddings with Forever Yours
                    </p>
                    <Link href="/signup">
                      <motion.div
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        
                      </motion.div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 py-20">
        <ScrollReveal>
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('/romantic-wedding-hero.jpg')] opacity-5 bg-cover bg-center" />
              <CardContent className="relative p-12 text-center">
                <h2 className="mb-4 text-4xl font-serif text-foreground md:text-5xl">Ready to Start Planning?</h2>
                <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of couples who are planning their dream weddings with Forever Yours
                </p>
                <Link href="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button size="lg" className="gap-2 text-lg px-8 py-6 shadow-xl">
                      <Heart className="h-5 w-5" />
                      Create Your Free Account
                    </Button>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-xl font-serif text-primary">
              <Heart className="h-6 w-6 fill-primary" />
              Forever Yours
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Forever Yours. Making wedding planning beautiful.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
