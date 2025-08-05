"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileUpload } from "@/components/file-upload"
import { Upload, FileText, CheckCircle, Clock, AlertCircle, User, Shield, FileCheck, Award, Eye } from "lucide-react"

export default function ClientDashboard() {
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
      description: "Personal information verified",
    },
    {
      id: "kyc",
      title: "KYC Review",
      status: "in-progress",
      lastUpdated: "2024-01-16",
      icon: Shield,
      description: "Identity documents under review",
    },
    {
      id: "insurance",
      title: "Insurance Verification",
      status: "pending",
      lastUpdated: null,
      icon: FileCheck,
      description: "Insurance documents required",
    },
    {
      id: "final",
      title: "Final Approval",
      status: "pending",
      lastUpdated: null,
      icon: Award,
      description: "Awaiting final approval",
    },
  ]

  const documents = [
    { name: "ID_Proof.pdf", uploadDate: "2024-01-15", status: "approved" },
    { name: "Address_Proof.pdf", uploadDate: "2024-01-15", status: "approved" },
    { name: "Insurance_Certificate.pdf", uploadDate: "2024-01-16", status: "pending" },
    { name: "Bank_Statement.pdf", uploadDate: "2024-01-16", status: "rejected" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
      case "pending":
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
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const completedSteps = onboardingSteps.filter((step) => step.status === "completed").length
  const progressPercentage = (completedSteps / onboardingSteps.length) * 100

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {/* Top Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload Documents</CardTitle>
              <Upload className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full">
                Upload Files
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Onboarding Progress</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">Total uploaded</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">In Progress</div>
              <p className="text-xs text-muted-foreground">KYC Review</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="onboarding-status" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="onboarding-status">Onboarding Status</TabsTrigger>
            <TabsTrigger value="my-documents">My Documents</TabsTrigger>
            <TabsTrigger value="upload-documents">Upload Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="onboarding-status" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Onboarding Progress</CardTitle>
                <CardDescription>Complete all steps to finish your onboarding process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {onboardingSteps.map((step) => {
                  const StepIcon = step.icon
                  return (
                    <div key={step.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-4">
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
                          <h3 className="text-sm font-medium">{step.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                          {step.lastUpdated && (
                            <p className="text-xs text-muted-foreground mt-1">Last updated: {step.lastUpdated}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(step.status)}>
                          {getStatusIcon(step.status)}
                          <span className="ml-1 capitalize">{step.status.replace("-", " ")}</span>
                        </Badge>
                        <Button variant="outline" size="sm">
                          {step.status === "pending" ? "Start" : "View"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-documents" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>View and manage your uploaded documents</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell className="text-muted-foreground">{doc.uploadDate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(doc.status)}>
                            {getStatusIcon(doc.status)}
                            <span className="ml-1 capitalize">{doc.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload-documents" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Upload required documents for your onboarding process</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
