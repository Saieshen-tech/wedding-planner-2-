"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

interface SparkleAnimationProps {
  trigger: boolean
  onComplete?: () => void
}

export function SparkleAnimation({ trigger, onComplete }: SparkleAnimationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (trigger) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        onComplete?.()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="relative">
        {[...Array(8)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute h-6 w-6 text-amber-400 animate-ping"
            style={{
              left: `${Math.cos((i * Math.PI) / 4) * 50}px`,
              top: `${Math.sin((i * Math.PI) / 4) * 50}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <div className="h-12 w-12 rounded-full bg-amber-400/20 animate-pulse" />
      </div>
    </div>
  )
}
