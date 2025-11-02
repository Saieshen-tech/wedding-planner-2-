"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, auth } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signin: (email: string, password: string) => Promise<{ error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>
  signout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = auth.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const signin = async (email: string, password: string) => {
    const { user, error } = await auth.signin(email, password)
    if (!error) {
      setUser(user)
    }
    return { error }
  }

  const signup = async (email: string, password: string, name: string) => {
    const { user, error } = await auth.signup(email, password, name)
    if (!error) {
      setUser(user)
    }
    return { error }
  }

  const signout = () => {
    auth.signout()
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    const updatedUser = auth.updateUser(updates)
    if (updatedUser) {
      setUser(updatedUser)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signin, signup, signout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
