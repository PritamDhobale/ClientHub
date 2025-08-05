"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertCircle, User, Shield, FileCheck, Award } from "lucide-react"

export default function OnboardingStatusPage() {
  const { user } = useAuth()

  if (!user || user.role !== "client") {
    return <div>Access denied</div>
  }

  const onboardingSteps = [
    {
      id: "profile",
      title: "Profile Verification",
      status: "completed",
      lastUpdated: "2024-01-15",
      icon: User,
      description: "Personal information verified successfully",
      details: "All required personal information has been verified and approved.",
    },
    {
      id: "kyc",
      title: "KYC Review",
      status: "in-progress",
      lastUpdated: "2024-01-16",
      icon: Shield,
      description: "Identity documents under review",
      details: "Your identity documents are currently being reviewed by our verification team.",
    },
    {
      id: "insurance",
      title: "Insurance Verification",
      status: "pending",
      lastUpdated: null,
      icon: FileCheck,
      description: "Insurance documents required",
      details: "Please upload your insurance certificate to proceed with this step.",
    },
    {
      id: "final",
      title: "Final Approval",
      status: "pending",
      lastUpdated: null,
      icon: Award,
      description: "Awaiting final approval",
      details: "Final approval will be processed once all previous steps are completed.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const completedSteps = onboardingSteps.filter((step) => step.status === "completed").length
  const progressPercentage = (completedSteps / onboardingSteps.length) * 100

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
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            step.status === "completed"
                              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                              : step.status === "in-progress"
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                          }`}
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
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(step.status)}>
                        {getStatusIcon(step.status)}
                        <span className="ml-1 capitalize">{step.status.replace("-", " ")}</span>
                      </Badge>
                      <Button variant="outline" size="sm">
                        {step.status === "pending" ? "Start" : step.status === "completed" ? "View" : "Continue"}
                      </Button>
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
