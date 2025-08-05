"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClientDetailsModal } from "@/components/client-details-modal"
import { CheckCircle, Clock } from "lucide-react"

export default function PendingClientsPage() {
  const { user } = useAuth()

  if (!user || user.role !== "service-center") {
    return <div>Access denied</div>
  }

  const pendingClients = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      submissionDate: "2024-01-16",
      status: "Pending",
      documents: ["ID_Proof.pdf", "Address_Proof.pdf", "Insurance_Certificate.pdf"],
      priority: "High",
    },
    {
      id: 2,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (555) 234-5678",
      submissionDate: "2024-01-15",
      status: "Pending",
      documents: ["ID_Proof.pdf", "Bank_Statement.pdf"],
      priority: "Medium",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789",
      submissionDate: "2024-01-14",
      status: "Pending",
      documents: ["ID_Proof.pdf", "Address_Proof.pdf"],
      priority: "Low",
    },
    {
      id: 4,
      name: "Jennifer Wilson",
      email: "jennifer@example.com",
      phone: "+1 (555) 456-7890",
      submissionDate: "2024-01-13",
      status: "Pending",
      documents: ["ID_Proof.pdf", "Insurance_Certificate.pdf", "Medical_Certificate.pdf"],
      priority: "High",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: "Pending Clients" }]}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Pending Clients</h1>
          <p className="text-muted-foreground">New client submissions awaiting initial review</p>
        </div>

        {/* Summary Card */}
        <Card className="shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingClients.length}</div>
            <p className="text-xs text-muted-foreground">Clients awaiting verification</p>
          </CardContent>
        </Card>

        {/* Pending Clients Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Pending Client Submissions</CardTitle>
            <CardDescription>Review and verify new client submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.submissionDate}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(client.priority)}>{client.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        <Clock className="h-4 w-4 mr-1" />
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
                          Verify
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
