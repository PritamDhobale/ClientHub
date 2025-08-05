"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientDetailsModal } from "@/components/client-details-modal"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function ServiceCenterDashboard() {
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
    },
    {
      id: 2,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (555) 234-5678",
      submissionDate: "2024-01-15",
      status: "Pending",
      documents: ["ID_Proof.pdf", "Bank_Statement.pdf"],
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789",
      submissionDate: "2024-01-14",
      status: "Pending",
      documents: ["ID_Proof.pdf", "Address_Proof.pdf"],
    },
  ]

  const reviewQueue = [
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1 (555) 456-7890",
      submissionDate: "2024-01-13",
      status: "Under Review",
      documents: ["ID_Proof.pdf", "Insurance_Certificate.pdf", "Medical_Certificate.pdf"],
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      phone: "+1 (555) 567-8901",
      submissionDate: "2024-01-12",
      status: "Under Review",
      documents: ["ID_Proof.pdf", "Address_Proof.pdf"],
    },
  ]

  const completedClients = [
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa@example.com",
      phone: "+1 (555) 678-9012",
      submissionDate: "2024-01-10",
      status: "Approved",
      documents: ["ID_Proof.pdf", "Address_Proof.pdf", "Insurance_Certificate.pdf"],
    },
    {
      id: 7,
      name: "Robert Taylor",
      email: "robert@example.com",
      phone: "+1 (555) 789-0123",
      submissionDate: "2024-01-08",
      status: "Approved",
      documents: ["ID_Proof.pdf", "Bank_Statement.pdf"],
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

  const ClientTable = ({ clients, showActions = true }: { clients: any[]; showActions?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client Name</TableHead>
          <TableHead>Submission Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Documents</TableHead>
          {showActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>
              <div>
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-muted-foreground">{client.email}</div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{client.submissionDate}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground">{client.documents.length} files</div>
            </TableCell>
            {showActions && (
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <ClientDetailsModal client={client} />
                  {client.status === "Pending" && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Service Center Dashboard</h1>
          <p className="text-muted-foreground">Review and verify client documents and onboarding submissions.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingClients.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviewQueue.length}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedClients.length}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Clients</TabsTrigger>
            <TabsTrigger value="review">Review Queue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Pending Clients</CardTitle>
                <CardDescription>New client submissions awaiting initial review</CardDescription>
              </CardHeader>
              <CardContent>
                <ClientTable clients={pendingClients} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Review Queue</CardTitle>
                <CardDescription>Clients currently under review process</CardDescription>
              </CardHeader>
              <CardContent>
                <ClientTable clients={reviewQueue} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Completed Reviews</CardTitle>
                <CardDescription>Recently completed client verifications</CardDescription>
              </CardHeader>
              <CardContent>
                <ClientTable clients={completedClients} showActions={false} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
