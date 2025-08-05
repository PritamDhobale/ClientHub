"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClientDetailsModal } from "@/components/client-details-modal"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function ReviewQueuePage() {
  const { user } = useAuth()

  if (!user || user.role !== "service-center") {
    return <div>Access denied</div>
  }

  const reviewQueue = [
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1 (555) 456-7890",
      submissionDate: "2024-01-13",
      status: "Under Review",
      documents: ["ID_Proof.pdf", "Insurance_Certificate.pdf", "Medical_Certificate.pdf"],
      assignedTo: "Mike Wilson",
      reviewStarted: "2024-01-16",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      phone: "+1 (555) 567-8901",
      submissionDate: "2024-01-12",
      status: "Under Review",
      documents: ["ID_Proof.pdf", "Address_Proof.pdf"],
      assignedTo: "Mike Wilson",
      reviewStarted: "2024-01-15",
    },
    {
      id: 6,
      name: "Amanda Taylor",
      email: "amanda@example.com",
      phone: "+1 (555) 678-9012",
      submissionDate: "2024-01-11",
      status: "Under Review",
      documents: ["ID_Proof.pdf", "Bank_Statement.pdf", "Employment_Letter.pdf"],
      assignedTo: "Mike Wilson",
      reviewStarted: "2024-01-14",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: "Review Queue" }]}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
          <p className="text-muted-foreground">Clients currently under review process</p>
        </div>

        {/* Summary Card */}
        <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewQueue.length}</div>
            <p className="text-xs text-muted-foreground">Clients in review process</p>
          </CardContent>
        </Card>

        {/* Review Queue Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Active Reviews</CardTitle>
            <CardDescription>Clients currently being reviewed by the service center team</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Review Started</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewQueue.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.submissionDate}</TableCell>
                    <TableCell className="text-muted-foreground">{client.reviewStarted}</TableCell>
                    <TableCell className="text-muted-foreground">{client.assignedTo}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{client.documents.length} files</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <ClientDetailsModal client={client} />
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete Review
                        </Button>
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
