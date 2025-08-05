"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Eye, Download } from "lucide-react"

export default function CompletedPage() {
  const { user } = useAuth()

  if (!user || user.role !== "service-center") {
    return <div>Access denied</div>
  }

  const completedClients = [
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa@example.com",
      phone: "+1 (555) 678-9012",
      submissionDate: "2024-01-10",
      completionDate: "2024-01-18",
      status: "Approved",
      documents: ["ID_Proof.pdf", "Address_Proof.pdf", "Insurance_Certificate.pdf"],
      reviewedBy: "Mike Wilson",
    },
    {
      id: 7,
      name: "Robert Taylor",
      email: "robert@example.com",
      phone: "+1 (555) 789-0123",
      submissionDate: "2024-01-08",
      completionDate: "2024-01-17",
      status: "Approved",
      documents: ["ID_Proof.pdf", "Bank_Statement.pdf"],
      reviewedBy: "Mike Wilson",
    },
    {
      id: 8,
      name: "Maria Garcia",
      email: "maria@example.com",
      phone: "+1 (555) 890-1234",
      submissionDate: "2024-01-05",
      completionDate: "2024-01-16",
      status: "Rejected",
      documents: ["ID_Proof.pdf", "Address_Proof.pdf"],
      reviewedBy: "Mike Wilson",
    },
    {
      id: 9,
      name: "James Wilson",
      email: "james@example.com",
      phone: "+1 (555) 901-2345",
      submissionDate: "2024-01-03",
      completionDate: "2024-01-15",
      status: "Approved",
      documents: ["ID_Proof.pdf", "Insurance_Certificate.pdf", "Medical_Certificate.pdf"],
      reviewedBy: "Mike Wilson",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const approvedCount = completedClients.filter((client) => client.status === "Approved").length
  const rejectedCount = completedClients.filter((client) => client.status === "Rejected").length

  return (
    <DashboardLayout breadcrumbs={[{ label: "Completed" }]}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Completed Reviews</h1>
          <p className="text-muted-foreground">Recently completed client verifications</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedClients.length}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">Successfully verified</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <CheckCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">Did not meet requirements</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter completed reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="this-month">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Completed Reviews Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Completed Client Reviews</CardTitle>
            <CardDescription>All completed client verification reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviewed By</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.submissionDate}</TableCell>
                    <TableCell className="text-muted-foreground">{client.completionDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.reviewedBy}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{client.documents.length} files</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export
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
