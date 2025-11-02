"use client"

import { motion } from "framer-motion"

export function AnimatedGradient() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/8 blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -right-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-accent/8 blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-1/4 left-1/3 h-1/2 w-1/2 rounded-full bg-secondary/15 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, -80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
