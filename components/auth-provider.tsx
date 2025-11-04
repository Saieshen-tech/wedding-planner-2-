// components/auth-provider.tsx
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export interface User {
  uid: string
  email: string
  name: string
  weddingDate?: string
  partnerName?: string
  venue?: string
  theme?: string
  notes?: string
}

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.data()
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData?.name || firebaseUser.displayName || '',
          weddingDate: userData?.weddingDate,
          partnerName: userData?.partnerName,
          venue: userData?.venue,
          theme: userData?.theme,
          notes: userData?.notes,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      await updateProfile(firebaseUser, { displayName: name })

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      })

      return { error: undefined }
    } catch (error: any) {
      console.error('Signup error:', error)
      let errorMessage = 'An error occurred during signup'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already exists'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      }
      
      return { error: errorMessage }
    }
  }

  const signin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { error: undefined }
    } catch (error: any) {
      console.error('Signin error:', error)
      let errorMessage = 'Invalid email or password'
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      }
      
      return { error: errorMessage }
    }
  }

  const signout = () => {
    signOut(auth)
    setUser(null)
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const { uid, email, ...updateData } = updates
      await updateDoc(doc(db, 'users', user.uid), updateData)
      setUser({ ...user, ...updateData })
    } catch (error) {
      console.error('Error updating user:', error)
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
