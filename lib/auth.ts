"use client"

import Cookies from "js-cookie"

export interface User {
  id: string
  email: string
  name: string
  weddingDate?: string
  partnerName?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const AUTH_COOKIE = "wedding_auth_token"
const USER_STORAGE = "wedding_users"

// Simulate JWT token generation
function generateToken(user: User): string {
  return btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))
}

// Get all users from localStorage
function getUsers(): Record<string, User & { password: string }> {
  if (typeof window === "undefined") return {}
  const users = localStorage.getItem(USER_STORAGE)
  return users ? JSON.parse(users) : {}
}

// Save users to localStorage
function saveUsers(users: Record<string, User & { password: string }>) {
  localStorage.setItem(USER_STORAGE, JSON.stringify(users))
}

export const auth = {
  // Sign up new user
  signup: async (email: string, password: string, name: string): Promise<{ user: User; error?: string }> => {
    const users = getUsers()

    if (users[email]) {
      return { user: null as any, error: "Email already exists" }
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
    }

    users[email] = { ...user, password }
    saveUsers(users)

    const token = generateToken(user)
    Cookies.set(AUTH_COOKIE, token, { expires: 7, sameSite: "strict" })

    return { user }
  },

  // Sign in existing user
  signin: async (email: string, password: string): Promise<{ user: User; error?: string }> => {
    const users = getUsers()
    const userWithPassword = users[email]

    if (!userWithPassword || userWithPassword.password !== password) {
      return { user: null as any, error: "Invalid email or password" }
    }

    const { password: _, ...user } = userWithPassword
    const token = generateToken(user)
    Cookies.set(AUTH_COOKIE, token, { expires: 7, sameSite: "strict" })

    return { user }
  },

  // Sign out
  signout: () => {
    Cookies.remove(AUTH_COOKIE)
  },

  // Get current user from cookie
  getCurrentUser: (): User | null => {
    const token = Cookies.get(AUTH_COOKIE)
    if (!token) return null

    try {
      const decoded = JSON.parse(atob(token))
      if (decoded.exp < Date.now()) {
        Cookies.remove(AUTH_COOKIE)
        return null
      }

      const users = getUsers()
      const user = Object.values(users).find((u) => u.id === decoded.userId)
      if (!user) return null

      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch {
      return null
    }
  },

  // Update user profile
  updateUser: (updates: Partial<User>): User | null => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) return null

    const users = getUsers()
    const userWithPassword = users[currentUser.email]
    if (!userWithPassword) return null

    const updatedUser = { ...userWithPassword, ...updates }
    users[currentUser.email] = updatedUser
    saveUsers(users)

    const { password: _, ...user } = updatedUser
    return user
  },
}
