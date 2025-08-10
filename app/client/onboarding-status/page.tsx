"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertCircle, User, Shield, FileCheck, Award } from "lucide-react"
import { supabase } from "@/lib/supabase"

type DocumentType = {
  document_type: string
  status: string
  uploaded_at: string
}

export default function OnboardingStatusPage() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<DocumentType[]>([])

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user?.id) return
      const { data, error } = await supabase
        .from("documents")
        .select("document_type, status, uploaded_at")
        .eq("uploaded_by", user.id)

      if (!error && data) {
        setDocuments(data)
      } else {
        console.error("Error fetching documents:", error)
      }
    }

    fetchDocuments()
  }, [user?.id])

  const getStepStatus = (type: string): string => {
    const relevant = documents.filter((doc) =>
      doc.document_type?.toLowerCase().includes(type.toLowerCase())
    )
    return relevant[0]?.status || "pending"
  }

  const getLastUpdated = (type: string): string | null => {
    const relevant = documents
      .filter((doc) => doc.document_type?.toLowerCase().includes(type.toLowerCase()))
      .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
    return relevant[0]?.uploaded_at?.split("T")[0] || null
  }

  const onboardingSteps = [
    {
      id: "profile",
      title: "Profile Verification",
      status: getStepStatus("profile"),
      lastUpdated: getLastUpdated("profile"),
      icon: User,
      description: "Personal information verified successfully",
      details: "All required personal information has been verified and approved.",
    },
    {
      id: "kyc",
      title: "KYC Review",
      status: getStepStatus("kyc"),
      lastUpdated: getLastUpdated("kyc"),
      icon: Shield,
      description: "Identity documents under review",
      details: "Your identity documents are currently being reviewed by our verification team.",
    },
    {
      id: "insurance",
      title: "Insurance Verification",
      status: getStepStatus("insurance"),
      lastUpdated: getLastUpdated("insurance"),
      icon: FileCheck,
      description: "Insurance documents required",
      details: "Please upload your insurance certificate to proceed with this step.",
    },
    {
      id: "final",
      title: "Final Approval",
      status: getStepStatus("final"),
      lastUpdated: getLastUpdated("final"),
      icon: Award,
      description: "Awaiting final approval",
      details: "Final approval will be processed once all previous steps are completed.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
      case "pending":
      case "review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
      case "pending":
      case "review":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const completedSteps = onboardingSteps.filter(
    (step) => step.status === "approved" || step.status === "completed"
  ).length

  const progressPercentage = (completedSteps / onboardingSteps.length) * 100

  // if (!user || user.role !== "client") {
  //   return <div>Access denied</div>
  // }
  if (!user) return <div>Loading…</div>
  if (user.role !== "client") return <div>Access denied</div>
  
  return (
    <DashboardLayout breadcrumbs={[{ label: "Onboarding Status" }]}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Onboarding Status</h1>
          <p className="text-muted-foreground">Track your progress through the onboarding process</p>
        </div>

        {/* Progress Overview */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>
              {completedSteps} of {onboardingSteps.length} steps completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progressPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Steps */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Onboarding Steps</CardTitle>
            <CardDescription>Complete all steps to finish your onboarding process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {onboardingSteps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <div key={step.id} className="relative">
                  {index < onboardingSteps.length - 1 && <div className="absolute left-5 top-12 h-16 w-0.5 bg-muted" />}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${getStatusColor(step.status)}`}
                        >
                          <StepIcon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{step.details}</p>
                        {step.lastUpdated && (
                          <p className="text-xs text-muted-foreground mt-2">Last updated: {step.lastUpdated}</p>
                        )}
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(step.status)}>
                        {getStatusIcon(step.status)}
                        <span className="ml-1 capitalize">{step.status.replace("-", " ")}</span>
                      </Badge>
                      <Button variant="outline" size="sm">
                        {step.status === "pending" ? "Start" : step.status === "approved" ? "View" : "Continue"}
                      </Button>
                    </div> */}
                    <div className="flex items-center">
                      <Badge className={getStatusColor(step.status)}>
                        {getStatusIcon(step.status)}
                        <span className="ml-1 capitalize">{step.status.replace("-", " ")}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
