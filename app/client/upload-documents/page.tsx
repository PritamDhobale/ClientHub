"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"

export default function UploadDocumentsPage() {
  const { user } = useAuth()

  if (!user || user.role !== "client") {
    return <div>Access denied</div>
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: "Upload Documents" }]}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>
          <p className="text-muted-foreground">Upload required documents for your onboarding process</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>
              Please upload all required documents. Supported formats: PDF, DOC, DOCX (Max 10MB per file)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
