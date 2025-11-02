"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiAnimationProps {
  trigger: boolean
  onComplete?: () => void
}

export function ConfettiAnimation({ trigger, onComplete }: ConfettiAnimationProps) {
  const [show, setShow] = useState(false)
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  useEffect(() => {
    if (trigger) {
      setShow(true)
      const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        color: [
          "oklch(0.85 0.04 15)",
          "oklch(0.78 0.05 45)",
          "oklch(0.75 0.05 280)",
          "oklch(0.72 0.06 140)",
          "oklch(0.68 0.06 75)",
        ][Math.floor(Math.random() * 5)],
      }))
      setConfetti(pieces)

      const timer = setTimeout(() => {
        setShow(false)
        onComplete?.()
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  if (!show) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-full"
          style={{
            left: `${piece.left}%`,
            top: "-10px",
            backgroundColor: piece.color,
            width: "6px",
            height: "6px",
          }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [1, 1, 0.8, 0],
            rotate: 720,
          }}
          transition={{
            duration: 2.5,
            delay: piece.delay,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}
    </div>
  )
}
