"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Role = "client" | "admin" | "service-center"

type User = {
  id: string
  email: string
  name: string
  role: Role
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Map DB roles to canonical app roles
function canonicalRole(dbRole?: string): Role {
  switch (dbRole) {
    case "Admin": return "admin"
    case "Client": return "client"
    case "Service_Center": return "service-center"
    default:
      return (dbRole ?? "").toLowerCase().replace("_", "-") as Role
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Restore session on mount
  useEffect(() => {
    let active = true

    const hydrateFromSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const sUser = session?.user
        if (!sUser) {
          if (active) setUser(null)
          return
        }
        const { data: profile } = await supabase
          .from("users")
          .select("role, full_name, email")
          .eq("id", sUser.id)
          .single()

        if (active && profile) {
          setUser({
            id: sUser.id,
            email: sUser.email ?? profile.email ?? "",
            name: profile.full_name || "User",
            role: canonicalRole(profile.role),
          })
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    hydrateFromSession()

    // Keep in sync on auth changes (login/logout/token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sUser = session?.user
      if (!sUser) {
        setUser(null)
        return
      }
      const { data: profile } = await supabase
        .from("users")
        .select("role, full_name, email")
        .eq("id", sUser.id)
        .single()

      if (profile) {
        setUser({
          id: sUser.id,
          email: sUser.email ?? profile.email ?? "",
          name: profile.full_name || "User",
          role: canonicalRole(profile.role),
        })
      }
    })

    return () => {
      active = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  // Redirect from "/" to role-based dashboard
  useEffect(() => {
    if (!isLoading && user && pathname === "/") {
      router.push(`/${user.role === "service-center" ? "service-center" : user.role}`)
    }
  }, [user, isLoading, pathname, router])

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !authData.user) {
      console.error("Login failed:", error?.message)
      return false
    }

    const { id, email: userEmail } = authData.user
    const { data: profile, error: roleError } = await supabase
      .from("users")
      .select("role, full_name, email")
      .eq("id", id)
      .single()

    if (roleError || !profile) {
      console.error("Failed to fetch user role:", roleError?.message)
      return false
    }

    setUser({
      id,
      email: userEmail ?? profile.email ?? "",
      name: profile.full_name || "User",
      role: canonicalRole(profile.role),
    })

    return true
  }

  // Bullet-proof logout
  const logout = async () => {
    try {
      // Clear UI state immediately so protected layouts unmount
      setUser(null)
      // Sign out across tabs
      await supabase.auth.signOut()
    } finally {
      // Go to a neutral page that doesn't auto-redirect
      router.replace("/")
      router.refresh()
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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


// ------------------------------------------------------------------------------------------------
// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import { supabase } from "@/lib/supabase"

// type Role = "client" | "admin" | "service-center"

// type User = {
//   id: string
//   email: string
//   name: string
//   role: Role
// }

// type AuthContextType = {
//   user: User | null
//   login: (email: string, password: string) => Promise<boolean>
//   logout: () => void
//   isLoading: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// // Map DB roles to canonical app roles
// function canonicalRole(dbRole?: string): Role {
//   switch (dbRole) {
//     case "Admin": return "admin"
//     case "Client": return "client"
//     case "Service_Center": return "service-center" // underscore -> hyphen
//     default:
//       // fallback: lowercase + replace first underscore with hyphen
//       return (dbRole ?? "").toLowerCase().replace("_", "-") as Role
//   }
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()
//   const pathname = usePathname()

//   // Restore session on mount
//   useEffect(() => {
//     let active = true
//     const restoreUser = async () => {
//       try {
//         const { data: { session } } = await supabase.auth.getSession()
//         const sUser = session?.user
//         if (!sUser) {
//           if (active) setUser(null)
//           return
//         }

//         const { data: profile } = await supabase
//           .from("users")
//           .select("role, full_name, email")
//           .eq("id", sUser.id)
//           .single()

//         if (active && profile) {
//           setUser({
//             id: sUser.id,
//             email: sUser.email ?? profile.email ?? "",
//             name: profile.full_name || "User",
//             role: canonicalRole(profile.role),
//           })
//         }
//       } finally {
//         if (active) setIsLoading(false)
//       }
//     }
//     restoreUser()

//     // Keep in sync on auth changes (login/logout/refresh)
//     const { data: sub } = supabase.auth.onAuthStateChange(async () => {
//       const { data: { session } } = await supabase.auth.getSession()
//       const sUser = session?.user
//       if (!sUser) {
//         setUser(null)
//         return
//       }
//       const { data: profile } = await supabase
//         .from("users")
//         .select("role, full_name, email")
//         .eq("id", sUser.id)
//         .single()
//       if (profile) {
//         setUser({
//           id: sUser.id,
//           email: sUser.email ?? profile.email ?? "",
//           name: profile.full_name || "User",
//           role: canonicalRole(profile.role),
//         })
//       }
//     })

//     return () => {
//       active = false
//       sub?.subscription?.unsubscribe?.()
//     }
//   }, [])

//   // Redirect from "/" to role-based dashboard
//   useEffect(() => {
//     if (!isLoading && user && pathname === "/") {
//       router.push(`/${user.role === "service-center" ? "service-center" : user.role}`)
//     }
//   }, [user, isLoading, pathname, router])

//   // Login
//   const login = async (email: string, password: string): Promise<boolean> => {
//     const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })
//     if (error || !authData.user) {
//       console.error("Login failed:", error?.message)
//       return false
//     }

//     const { id, email: userEmail } = authData.user
//     const { data: profile, error: roleError } = await supabase
//       .from("users")
//       .select("role, full_name, email")
//       .eq("id", id)
//       .single()

//     if (roleError || !profile) {
//       console.error("Failed to fetch user role:", roleError?.message)
//       return false
//     }

//     setUser({
//       id,
//       email: userEmail ?? profile.email ?? "",
//       name: profile.full_name || "User",
//       role: canonicalRole(profile.role),
//     })

//     return true
//   }

//   const logout = async () => {
//     await supabase.auth.signOut()
//     setUser(null)
//     router.push("/")
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// -------------------------------------------------------------------------------------------


// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import { supabase } from "@/lib/supabase"

// type User = {
//   id: string
//   email: string
//   name: string
//   role: "client" | "admin" | "service-center"
// }

// type AuthContextType = {
//   user: User | null
//   login: (email: string, password: string) => Promise<boolean>
//   logout: () => void
//   isLoading: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()
//   const pathname = usePathname()

//   // ✅ Restore user session from Supabase on mount
//   useEffect(() => {
//     const restoreUser = async () => {
//       const { data: { session } } = await supabase.auth.getSession()

//       if (session?.user) {
//         const { id, email } = session.user

//         const { data: profile, error: roleError } = await supabase
//           .from("users")
//           .select("role, full_name")
//           .eq("id", id)
//           .single()

//         if (!roleError && profile) {
//           const userData: User = {
//             id,
//             email: email ?? "",
//             name: profile.full_name || "User",
//             role: profile.role.toLowerCase() as User["role"]
//           }

//           setUser(userData)
//         }
//       }

//       setIsLoading(false)
//     }

//     restoreUser()
//   }, [])

//   // ⏩ Redirect to role-based dashboard
//   useEffect(() => {
//     if (!isLoading && user && pathname === "/") {
//       router.push(`/${user.role === "service-center" ? "service-center" : user.role}`)
//     }
//   }, [user, isLoading, pathname, router])

//   // 🔐 Login with Supabase
//   const login = async (email: string, password: string): Promise<boolean> => {
//     const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })

//     if (error || !authData.user) {
//       console.error("Login failed:", error?.message)
//       return false
//     }

//     const { id, email: userEmail } = authData.user

//     const { data: profile, error: roleError } = await supabase
//       .from("users")
//       .select("role, full_name")
//       .eq("id", id)
//       .single()

//     if (roleError || !profile) {
//       console.error("Failed to fetch user role:", roleError?.message)
//       return false
//     }

//     const userData: User = {
//       id,
//       email: userEmail ?? "",
//       name: profile.full_name || "User",
//       role: profile.role.toLowerCase() as User["role"],
//     }

//     setUser(userData)
//     return true
//   }

//   const logout = async () => {
//     await supabase.auth.signOut()
//     setUser(null)
//     router.push("/")
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
