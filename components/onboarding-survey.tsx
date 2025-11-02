"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, DollarSign, Users, Heart, Sparkles, ArrowRight, ArrowLeft, X } from "lucide-react"
import { ConfettiAnimation } from "./confetti-animation"

interface SurveyData {
  hasVenue: boolean | null
  location: string
  weddingDate: string
  budget: number
  guestCount: number
  readyToStart: boolean | null
}

interface OnboardingSurveyProps {
  onComplete: (data: SurveyData) => void
  onSkip: () => void
}

const provinces = [
  "Western Cape",
  "Gauteng",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
]

export function OnboardingSurvey({ onComplete, onSkip }: OnboardingSurveyProps) {
  const [step, setStep] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    hasVenue: null,
    location: "",
    weddingDate: "",
    budget: 0,
    guestCount: 100,
    readyToStart: null,
  })

  const totalSteps = 6
  const progress = ((step + 1) / (totalSteps + 2)) * 100

  const updateData = (field: keyof SurveyData, value: any) => {
    setSurveyData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      setShowConfetti(true)
      setTimeout(() => {
        onComplete(surveyData)
      }, 2000)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSkipQuestion = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-[#F5E6D3] to-[#FFE4E1] p-4">
      {showConfetti && <ConfettiAnimation />}

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
        <Card className="border-[#D4AF37]/20 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-5">
              <Sparkles className="h-full w-full text-[#D4AF37]" />
            </div>
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-[#D4AF37]" />
                  <span className="text-sm font-medium text-[#8B7355]">
                    Step {step + 1} of {totalSteps + 1}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={onSkip} className="text-[#8B7355] hover:text-[#D4AF37]">
                  <X className="mr-1 h-4 w-4" />
                  Skip for Now
                </Button>
              </div>
              <Progress value={progress} className="h-2 bg-[#F5E6D3]" />
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                    className="mb-6 inline-block"
                  >
                    <Heart className="h-16 w-16 text-[#FFB6C1]" />
                  </motion.div>
                  <h2 className="mb-4 font-serif text-4xl text-[#8B7355]">Let's Personalize Your Wedding Journey</h2>
                  <p className="mb-8 text-lg text-[#A0826D]">
                    Answer a few quick questions to create your perfect planning experience
                  </p>
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-[#D4AF37] text-white hover:bg-[#B8941F] shadow-lg"
                  >
                    Start Survey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="venue"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <MapPin className="mx-auto mb-4 h-12 w-12 text-[#D4AF37]" />
                    <h3 className="mb-2 font-serif text-3xl text-[#8B7355]">Have you booked your wedding venue?</h3>
                    <p className="text-[#A0826D]">This helps us customize your checklist</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => {
                        updateData("hasVenue", true)
                        handleNext()
                      }}
                      variant={surveyData.hasVenue === true ? "default" : "outline"}
                      size="lg"
                      className={
                        surveyData.hasVenue === true ? "bg-[#D4AF37] text-white" : "border-[#D4AF37] text-[#8B7355]"
                      }
                    >
                      Yes, I have
                    </Button>
                    <Button
                      onClick={() => {
                        updateData("hasVenue", false)
                        handleNext()
                      }}
                      variant={surveyData.hasVenue === false ? "default" : "outline"}
                      size="lg"
                      className={
                        surveyData.hasVenue === false ? "bg-[#D4AF37] text-white" : "border-[#D4AF37] text-[#8B7355]"
                      }
                    >
                      Not yet
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="location"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <MapPin className="mx-auto mb-4 h-12 w-12 text-[#D4AF37]" />
                    <h3 className="mb-2 font-serif text-3xl text-[#8B7355]">
                      Where in South Africa do you want to get married?
                    </h3>
                    <p className="text-[#A0826D]">We'll show you local vendors and venues</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="province" className="text-[#8B7355]">
                        Select Province
                      </Label>
                      <select
                        id="province"
                        value={surveyData.location}
                        onChange={(e) => updateData("location", e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#D4AF37]/30 bg-white p-3 text-[#8B7355] focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="">Choose a province...</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="custom-location" className="text-[#8B7355]">
                        Or enter a specific city/town
                      </Label>
                      <Input
                        id="custom-location"
                        placeholder="e.g., Cape Town, Johannesburg, Durban"
                        value={surveyData.location}
                        onChange={(e) => updateData("location", e.target.value)}
                        className="mt-2 border-[#D4AF37]/30 focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="date"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-[#D4AF37]" />
                    <h3 className="mb-2 font-serif text-3xl text-[#8B7355]">What's your wedding date?</h3>
                    <p className="text-[#A0826D]">We'll create a countdown and timeline for you</p>
                  </div>
                  <div>
                    <Input
                      type="date"
                      value={surveyData.weddingDate}
                      onChange={(e) => updateData("weddingDate", e.target.value)}
                      className="w-full border-[#D4AF37]/30 p-4 text-lg focus:border-[#D4AF37]"
                    />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="budget"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <DollarSign className="mx-auto mb-4 h-12 w-12 text-[#D4AF37]" />
                    <h3 className="mb-2 font-serif text-3xl text-[#8B7355]">What's your total budget?</h3>
                    <p className="text-[#A0826D]">This helps us track your spending</p>
                  </div>
                  <div>
                    <Label htmlFor="budget" className="text-[#8B7355]">
                      Budget in South African Rand (R)
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#8B7355]">{""}</span>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="150000"
                        value={surveyData.budget || ""}
                        onChange={(e) => updateData("budget", Number.parseInt(e.target.value) || 0)}
                        className="border-[#D4AF37]/30 pl-10 p-4 text-lg focus:border-[#D4AF37]"
                      />
                    </div>
                    {surveyData.budget > 0 && (
                      <p className="mt-2 text-sm text-[#A0826D]">Budget: R {surveyData.budget.toLocaleString()}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="guests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Users className="mx-auto mb-4 h-12 w-12 text-[#D4AF37]" />
                    <h3 className="mb-2 font-serif text-3xl text-[#8B7355]">
                      How many guests are you planning to invite?
                    </h3>
                    <p className="text-[#A0826D]">You can adjust this later</p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="mb-4 text-5xl font-serif text-[#D4AF37]">{surveyData.guestCount}</div>
                      <p className="text-[#8B7355]">guests</p>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={surveyData.guestCount}
                      onChange={(e) => updateData("guestCount", Number.parseInt(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                    <div className="flex justify-between text-sm text-[#A0826D]">
                      <span>10</span>
                      <span>500</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <Sparkles className="mx-auto mb-4 h-12 w-12 text-[#D4AF37]" />
                    <h3 className="mb-2 font-serif text-3xl text-[#8B7355]">Are you ready to start planning now?</h3>
                    <p className="text-[#A0826D]">We'll set up your dashboard accordingly</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => {
                        updateData("readyToStart", true)
                        handleNext()
                      }}
                      variant={surveyData.readyToStart === true ? "default" : "outline"}
                      size="lg"
                      className={
                        surveyData.readyToStart === true ? "bg-[#D4AF37] text-white" : "border-[#D4AF37] text-[#8B7355]"
                      }
                    >
                      Yes, let's do this!
                    </Button>
                    <Button
                      onClick={() => {
                        updateData("readyToStart", false)
                        handleNext()
                      }}
                      variant={surveyData.readyToStart === false ? "default" : "outline"}
                      size="lg"
                      className={
                        surveyData.readyToStart === false
                          ? "bg-[#D4AF37] text-white"
                          : "border-[#D4AF37] text-[#8B7355]"
                      }
                    >
                      Not yet
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 7 && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: 2 }}
                    className="mb-6 inline-block"
                  >
                    <Sparkles className="h-20 w-20 text-[#D4AF37]" />
                  </motion.div>
                  <h2 className="mb-4 font-serif text-4xl text-[#8B7355]">Your Dashboard Is Now Ready!</h2>
                  <p className="mb-8 text-lg text-[#A0826D]">We've personalized everything just for you</p>
                  <Button
                    onClick={() => onComplete(surveyData)}
                    size="lg"
                    className="bg-[#D4AF37] text-white hover:bg-[#B8941F] shadow-lg"
                  >
                    Go to My Dashboard
                    <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {step > 0 && step < 7 && (
              <div className="mt-8 flex items-center justify-between border-t border-[#D4AF37]/20 pt-6">
                <Button onClick={handleBack} variant="ghost" className="text-[#8B7355] hover:text-[#D4AF37]">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button onClick={handleSkipQuestion} variant="ghost" className="text-[#A0826D] hover:text-[#8B7355]">
                    Skip Question
                  </Button>
                  <Button onClick={handleNext} className="bg-[#D4AF37] text-white hover:bg-[#B8941F]">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
