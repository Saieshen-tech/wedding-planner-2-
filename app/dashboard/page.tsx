"use client"

import { AuthGuard } from "@/components/auth-guard"
import { NavHeader } from "@/components/nav-header"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Users,
  CheckCircle2,
  DollarSign,
  Heart,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Clock,
  MapPin,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/scroll-reveal"
import { OnboardingSurvey } from "@/components/onboarding-survey"

interface DashboardStats {
  totalGuests: number
  confirmedGuests: number
  tasksCompleted: number
  totalTasks: number
  budgetSpent: number
  totalBudget: number
  daysUntilWedding: number
}

interface OnboardingData {
  hasVenue: boolean | null
  location: string
  weddingDate: string
  budget: number
  guestCount: number
  readyToStart: boolean | null
  completed: boolean
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalGuests: 0,
    confirmedGuests: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    budgetSpent: 0,
    totalBudget: 0,
    daysUntilWedding: 0,
  })

  useEffect(() => {
    // Check if onboarding is completed
    const savedOnboarding = localStorage.getItem("wedding_onboarding")
    if (savedOnboarding) {
      const data = JSON.parse(savedOnboarding)
      setOnboardingData(data)
      if (!data.completed) {
        setShowOnboarding(true)
      }
    } else {
      setShowOnboarding(true)
    }

    // Load stats from localStorage
    const guests = JSON.parse(localStorage.getItem("wedding_guests") || "[]")
    const tasks = JSON.parse(localStorage.getItem("wedding_tasks") || "[]")
    const budget = JSON.parse(localStorage.getItem("wedding_budget") || '{"items": [], "total": 0}')

    const confirmedGuests = guests.filter((g: any) => g.rsvp === "confirmed").length
    const completedTasks = tasks.filter((t: any) => t.completed).length
    const budgetSpent = budget.items?.reduce((sum: number, item: any) => sum + (item.spent || 0), 0) || 0

    // Calculate days until wedding
    let daysUntil = 0
    const weddingDate = savedOnboarding ? JSON.parse(savedOnboarding).weddingDate : user?.weddingDate
    if (weddingDate) {
      const wedding = new Date(weddingDate)
      const today = new Date()
      daysUntil = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    }

    setStats({
      totalGuests: guests.length || (savedOnboarding ? JSON.parse(savedOnboarding).guestCount : 0),
      confirmedGuests,
      tasksCompleted: completedTasks,
      totalTasks: tasks.length,
      budgetSpent,
      totalBudget: budget.total || (savedOnboarding ? JSON.parse(savedOnboarding).budget : 0),
      daysUntilWedding: daysUntil,
    })
  }, [user])

  const handleOnboardingComplete = (data: any) => {
    const onboardingData = { ...data, completed: true }
    localStorage.setItem("wedding_onboarding", JSON.stringify(onboardingData))
    setOnboardingData(onboardingData)
    setShowOnboarding(false)

    // Update budget if provided
    if (data.budget > 0) {
      const currentBudget = JSON.parse(localStorage.getItem("wedding_budget") || '{"items": [], "total": 0}')
      currentBudget.total = data.budget
      localStorage.setItem("wedding_budget", JSON.stringify(currentBudget))
    }
  }

  const handleOnboardingSkip = () => {
    const skipData = {
      hasVenue: null,
      location: "",
      weddingDate: "",
      budget: 0,
      guestCount: 0,
      readyToStart: null,
      completed: true,
    }
    localStorage.setItem("wedding_onboarding", JSON.stringify(skipData))
    setOnboardingData(skipData)
    setShowOnboarding(false)
  }

  const handleEditDetails = () => {
    setShowOnboarding(true)
  }

  const taskProgress = stats.totalTasks > 0 ? (stats.tasksCompleted / stats.totalTasks) * 100 : 0
  const budgetProgress = stats.totalBudget > 0 ? (stats.budgetSpent / stats.totalBudget) * 100 : 0
  const guestProgress = stats.totalGuests > 0 ? (stats.confirmedGuests / stats.totalGuests) * 100 : 0

  if (showOnboarding) {
    return <OnboardingSurvey onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <NavHeader />

        <main className="container mx-auto px-4 py-8 text-primary-foreground">
          <ScrollReveal>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mb-8 relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0">
                <img
                  src="/romantic-wedding-hero.jpg"
                  alt="Wedding planning"
                  className="h-full w-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/30" />
              </div>
              <div className="relative p-8 md:p-12">
                <div className="flex items-start justify-between">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      className="mb-3 flex items-center gap-2"
                    >
                      <Sparkles className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium text-primary">Your Wedding Journey</span>
                      {onboardingData?.location && (
                        <>
                          <MapPin className="h-4 w-4 text-primary ml-2" />
                          <span className="text-sm text-muted-foreground">{onboardingData.location}</span>
                        </>
                      )}
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="mb-3 text-5xl font-serif text-foreground md:text-6xl"
                    >
                      Welcome back, {user?.name?.split(" ")[0]}!
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-lg text-muted-foreground"
                    >
                      {stats.daysUntilWedding > 0
                        ? `${stats.daysUntilWedding} days until your special day`
                        : "Set your wedding date to start planning"}
                    </motion.p>
                    {onboardingData && onboardingData.hasVenue !== null && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 text-sm text-muted-foreground"
                      >
                        {onboardingData.hasVenue ? "✓ Venue booked" : "○ Venue not yet booked"}
                      </motion.p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {stats.daysUntilWedding > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="hidden rounded-2xl bg-background/80 p-6 text-center backdrop-blur-sm md:block"
                      >
                        <Calendar className="mx-auto mb-2 h-8 w-8 text-primary" />
                        <div className="text-4xl font-serif text-foreground">{stats.daysUntilWedding}</div>
                        <div className="text-sm text-muted-foreground">days to go</div>
                      </motion.div>
                    )}
                    <Button
                      onClick={handleEditDetails}
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit My Details
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {[
              {
                label: "Guest RSVPs",
                value: `${stats.confirmedGuests}/${stats.totalGuests}`,
                progress: guestProgress,
                icon: Users,
                color: "primary",
                delay: 0.1,
              },
              {
                label: "Tasks Done",
                value: `${stats.tasksCompleted}/${stats.totalTasks}`,
                progress: taskProgress,
                icon: CheckCircle2,
                color: "green-500",
                delay: 0.2,
              },
              {
                label: "Budget Used",
                value: stats.totalBudget > 0 ? `${Math.round(budgetProgress)}%` : "-",
                progress: budgetProgress,
                icon: DollarSign,
                color: "amber-500",
                delay: 0.3,
              },
              {
                label: "Planning Progress",
                value: `${Math.round(taskProgress)}%`,
                progress: taskProgress,
                icon: TrendingUp,
                color: "purple-500",
                delay: 0.4,
              },
            ].map((stat, index) => (
              <ScrollReveal key={index} delay={stat.delay}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card className="group overflow-hidden border-border/50 bg-gradient-to-br from-background to-secondary/20 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="mb-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
                          <p className="text-3xl font-serif text-foreground">{stat.value}</p>
                          <div className="mt-3">
                            <Progress value={stat.progress} className="h-1.5" />
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${stat.color}/10`}
                        >
                          <stat.icon
                            className={`h-7 w-7 text- font-sans shadow-none${stat.color === "primary" ? "primary" : stat.color}`}
                          />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick Actions - Spans 2 columns */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Jump to your planning tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Link href="/guests">
                    <Card className="group cursor-pointer overflow-hidden border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-1 font-serif text-lg">Guest List</h3>
                        <p className="mb-3 text-sm text-muted-foreground">Manage RSVPs and invitations</p>
                        <div className="flex items-center gap-1 text-sm font-medium text-primary">
                          View guests
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/checklist">
                    <Card className="group cursor-pointer overflow-hidden border-border/50 bg-gradient-to-br from-green-500/5 to-green-500/10 transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="mb-1 font-serif text-lg">Checklist</h3>
                        <p className="mb-3 text-sm text-muted-foreground">Track your planning tasks</p>
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          View tasks
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/budget">
                    <Card className="group cursor-pointer overflow-hidden border-border/50 bg-gradient-to-br from-amber-500/5 to-amber-500/10 transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                          <DollarSign className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="mb-1 font-serif text-lg">Budget</h3>
                        <p className="mb-3 text-sm text-muted-foreground">Monitor your expenses</p>
                        <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
                          View budget
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/vendors">
                    <Card className="group cursor-pointer overflow-hidden border-border/50 bg-gradient-to-br from-purple-500/5 to-purple-500/10 transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                          <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="mb-1 font-serif text-lg">Vendors</h3>
                        <p className="mb-3 text-sm text-muted-foreground">Find trusted professionals</p>
                        <div className="flex items-center gap-1 text-sm font-medium text-purple-600">
                          Browse vendors
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
                <img src="/wedding-timeline-illustration.jpg" alt="Timeline" className="h-full w-full object-cover" />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Wedding Timeline
                </CardTitle>
                <CardDescription>Key milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="pb-6">
                    <p className="font-medium">Planning Started</p>
                    <p className="text-sm text-muted-foreground">Your journey begins</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="pb-6">
                    <p className="font-medium">6 Months Before</p>
                    <p className="text-sm text-muted-foreground">Book major vendors</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="pb-6">
                    <p className="font-medium">3 Months Before</p>
                    <p className="text-sm text-muted-foreground">Send invitations</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <Heart className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Your Wedding Day</p>
                    <p className="text-sm text-muted-foreground">Celebrate your love</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
