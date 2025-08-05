"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClientDetailsModal } from "@/components/client-details-modal"
import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react"

export default function DocumentReviewPage() {
  const { user } = useAuth()

  if (!user || user.role !== "admin") {
    return <div>Access denied</div>
  }

  const pendingDocuments = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      submissionDate: "2024-01-16",
      status: "Pending",
      documents: ["ID_Proof.pdf", "Address_Proof.pdf", "Insurance_Certificate.pdf"],
      documentType: "KYC Documents",
    },
    {
      id: 2,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (555) 234-5678",
      submissionDate: "2024-01-15",
      status: "Under Review",
      documents: ["ID_Proof.pdf", "Bank_Statement.pdf"],
      documentType: "Financial Documents",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789",
      submissionDate: "2024-01-14",
      status: "Pending",
      documents: ["Insurance_Certificate.pdf", "Medical_Certificate.pdf"],
      documentType: "Insurance Documents",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1 (555) 456-7890",
      submissionDate: "2024-01-13",
      status: "Under Review",
      documents: ["ID_Proof.pdf", "Address_Proof.pdf", "Employment_Letter.pdf"],
      documentType: "Identity Documents",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Under Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4" />
      case "Under Review":
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Rejected":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: "Document Review" }]}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Document Review</h1>
          <p className="text-muted-foreground">Review and approve pending document submissions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingDocuments.filter((doc) => doc.status === "Pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Documents awaiting review</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingDocuments.filter((doc) => doc.status === "Under Review").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently being reviewed</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingDocuments.reduce((acc, client) => acc + client.documents.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Files to review</p>
            </CardContent>
          </Card>
        </div>

        {/* Documents Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Pending Document Reviews</CardTitle>
            <CardDescription>Documents submitted by clients awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDocuments.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{client.documentType}</TableCell>
                    <TableCell className="text-muted-foreground">{client.submissionDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        {getStatusIcon(client.status)}
                        <span className="ml-1">{client.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{client.documents.length} files</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <ClientDetailsModal client={client} />
                        {client.status === "Pending" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
