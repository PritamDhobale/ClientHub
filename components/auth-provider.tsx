"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  email: string
  name: string
  role: "client" | "admin" | "service-center"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const demoAccounts = [
  { email: "client@demo.com", password: "demo123", name: "John Smith", role: "client" as const },
  { email: "admin@gentyx.com", password: "demo123", name: "Sarah Johnson", role: "admin" as const },
  { email: "service@center.com", password: "demo123", name: "Mike Wilson", role: "service-center" as const },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const savedUser = localStorage.getItem("gentyx-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading && user && pathname === "/") {
      router.push(`/${user.role === "service-center" ? "service-center" : user.role}`)
    }
  }, [user, isLoading, pathname, router])

  const login = (email: string, password: string) => {
    const account = demoAccounts.find((acc) => acc.email === email && acc.password === password)
    if (account) {
      const userData = { email: account.email, name: account.name, role: account.role }
      setUser(userData)
      localStorage.setItem("gentyx-user", JSON.stringify(userData))
      router.push(`/${account.role === "service-center" ? "service-center" : account.role}`)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("gentyx-user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
