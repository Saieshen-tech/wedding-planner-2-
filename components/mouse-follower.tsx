"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-50 mix-blend-screen"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{
          type: "spring",
          damping: 40,
          stiffness: 150,
          mass: 0.8,
        }}
      >
        <div className="relative h-6 w-6">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-sm" />
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none fixed z-50 mix-blend-screen"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
        }}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 120,
          mass: 1,
        }}
      >
        <div className="h-3 w-3 rounded-full bg-accent/15 blur-sm" />
      </motion.div>
    </>
  )
}
