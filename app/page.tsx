"use client"

import React, { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import "./login.css"
import { useSearchParams } from "next/navigation"

// ➤ Moved searchParams logic into separate component
function RedirectHandler({ onRedirect }: { onRedirect: (redirect: string) => void }) {
  const searchParams = useSearchParams()

  React.useEffect(() => {
    const redirect = searchParams?.get("redirect") || "/"
    onRedirect(redirect)
  }, [searchParams, onRedirect]) // ✅ only runs after mount

  return null
}


export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [redirect, setRedirect] = useState("/")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (!success) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("Login failed.")
        setIsLoading(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profileError || !profile) {
        setError("Unable to retrieve user role.")
        setIsLoading(false)
        return
      }

      // Redirect to role-based dashboard
      switch (profile.role) {
        case "Admin":
          router.push("/admin")
          break
        case "Client":
          router.push("/client")
          break
        case "Service_Center":
          router.push("/service-center")
          break
        default:
          router.push(redirect || "/") // use redirect param
      }

    } catch (err) {
      console.error(err)
      setError("An error occurred during login.")
    }

    setIsLoading(false)
  }

  return (
    <div className="login-page">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Handle search params safely */}
      <Suspense fallback={null}>
        <RedirectHandler onRedirect={setRedirect} />
      </Suspense>

      {/* Logo */}
      <div className="logo-wrapper">
        <Image src="/images/Color.png" alt="mySAGE Logo" width={150} height={50} className="mysage-logo" />
      </div>

      {/* Login Box */}
      <div className="login-box">
        <Image src="/images/accountshub.png" alt="AccountsHub" width={160} height={50} className="login-logo-img" />
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && (
            <div className="error-message">
              <AlertCircle className="mr-2 inline h-4 w-4 text-red-500" />
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "LOG IN"}
          </button>
        </form>
      </div>

      <div className="powered-by-text">POWERED BY HUBONE SYSTEMS</div>
      <p className="footer-text">© 2014–2025 HubOne Systems Inc. – All Rights Reserved</p>
    </div>
  )
}


// "use client"

// import React, { useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { ThemeToggle } from "@/components/theme-toggle"
// import { AlertCircle } from "lucide-react"
// import { useAuth } from "@/components/auth-provider" // ✅ Needed for login context
// import { supabase } from "@/lib/supabase"
// import Image from "next/image"
// import "./login.css"

// export default function LoginPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const redirect = searchParams?.get("redirect") || "/"

//   const { login } = useAuth() // ✅ Context login
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault()
//   setError("")
//   setIsLoading(true)

//   try {
//     const success = await login(email, password)

//     if (!success) {
//       setError("Invalid email or password")
//       setIsLoading(false)
//       return
//     }

//     // 1. Get current session user ID
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) {
//       setError("Login failed.")
//       setIsLoading(false)
//       return
//     }

//     // 2. Fetch role from `users` table
//     const { data: profile, error: profileError } = await supabase
//       .from("users")
//       .select("role")
//       .eq("id", user.id)
//       .single()

//     if (profileError || !profile) {
//       setError("Unable to retrieve user role.")
//       setIsLoading(false)
//       return
//     }

//     // 3. Redirect based on role
//     switch (profile.role) {
//       case "Admin":
//         router.push("/admin")
//         break
//       case "Client":
//         router.push("/client")
//         break
//       case "Service_Center":
//         router.push("/service-center")
//         break
//       default:
//         router.push("/") // fallback
//     }

//   } catch (err) {
//     console.error(err)
//     setError("An error occurred during login.")
//   }

//   setIsLoading(false)
// }


//   return (
//     <div className="login-page">
//       <div className="absolute top-4 right-4">
//         <ThemeToggle />
//       </div>

//       <div className="logo-wrapper">
//         <Image src="/images/Color.png" alt="mySAGE Logo" width={150} height={50} className="mysage-logo" />
//       </div>

//       <div className="login-box">
//         <Image src="/images/accountshub.png" alt="AccountsHub" width={160} height={50} className="login-logo-img" />
//         <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//           <label>Email Address</label>
//           <input
//             type="email"
//             placeholder="user@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="********"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           {error && (
//             <div className="error-message">
//               <AlertCircle className="mr-2 inline h-4 w-4 text-red-500" />
//               {error}
//             </div>
//           )}

//           <button type="submit" className="login-btn" disabled={isLoading}>
//             {isLoading ? "Logging in..." : "LOG IN"}
//           </button>
//         </form>
//       </div>

//       <div className="powered-by-text">POWERED BY HUBONE SYSTEMS</div>
//       <p className="footer-text">© 2014–2025 HubOne Systems Inc. – All Rights Reserved</p>
//     </div>
//   )
// }


// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useAuth } from "@/components/auth-provider"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { ThemeToggle } from "@/components/theme-toggle"
// import { Shield, AlertCircle } from "lucide-react"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const { login, user } = useAuth()

//   if (user) {
//     return null // Will redirect via AuthProvider
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setIsLoading(true)

//     const success = login(email, password)
//     if (!success) {
//       setError("Invalid email or password")
//     }

//     setIsLoading(false)
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
//       <div className="absolute top-4 right-4">
//         <ThemeToggle />
//       </div>

//       <Card className="w-full max-w-md shadow-lg bg-card/50 backdrop-blur">
//         <CardHeader className="space-y-1 text-center">
//           <div className="flex items-center justify-center gap-2 mb-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
//               <Shield className="h-6 w-6" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl font-bold">Gentyx ClientHub</CardTitle>
//           <CardDescription>Sign in to your account to continue</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="h-11"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="h-11"
//               />
//             </div>

//             {error && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <Button type="submit" className="w-full h-11" disabled={isLoading}>
//               {isLoading ? "Signing in..." : "Sign In"}
//             </Button>
//           </form>

//           <div className="mt-6 space-y-3">
//             <div className="text-center text-sm text-muted-foreground">Demo Accounts</div>
//             <div className="space-y-2 text-xs">
//               <div className="flex justify-between items-center p-2 rounded-md bg-muted/50">
//                 <span>Client:</span>
//                 <code className="text-xs">client@demo.com</code>
//               </div>
//               <div className="flex justify-between items-center p-2 rounded-md bg-muted/50">
//                 <span>Admin:</span>
//                 <code className="text-xs">admin@gentyx.com</code>
//               </div>
//               <div className="flex justify-between items-center p-2 rounded-md bg-muted/50">
//                 <span>Service:</span>
//                 <code className="text-xs">service@center.com</code>
//               </div>
//               <div className="text-center text-muted-foreground">
//                 Password: <code>demo123</code>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
