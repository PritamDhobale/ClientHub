"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, CheckCircle, Clock, XCircle, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminDashboard() {
  const { user } = useAuth()

  if (!user || user.role !== "admin") {
    return <div>Access denied</div>
  }

  const metrics = [
    { title: "Total Clients", value: "156", icon: Users, color: "blue" },
    { title: "Verified", value: "89", icon: CheckCircle, color: "green" },
    { title: "Pending", value: "52", icon: Clock, color: "yellow" },
    { title: "Rejected", value: "15", icon: XCircle, color: "red" },
  ]

  const clients = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      progress: 75,
      status: "In Progress",
      role: "Client",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      progress: 100,
      status: "Completed",
      role: "Client",
      joinDate: "2024-01-10",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      progress: 25,
      status: "Pending",
      role: "Service",
      joinDate: "2024-01-18",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      progress: 90,
      status: "Review",
      role: "Client",
      joinDate: "2024-01-12",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      progress: 0,
      status: "Rejected",
      role: "Client",
      joinDate: "2024-01-20",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "In Progress":
      case "Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getMetricColor = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 text-blue-600"
      case "green":
        return "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 text-green-600"
      case "yellow":
        return "from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 text-yellow-600"
      case "red":
        return "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 text-red-600"
      default:
        return "from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 text-gray-600"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage clients, review documents, and oversee the onboarding process.</p>
        </div>

        {/* Top Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.title} className={`shadow-sm bg-gradient-to-br ${getMetricColor(metric.color)}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <Icon className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Client Management Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Client Management</CardTitle>
            <CardDescription>View and manage all clients in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-muted-foreground">{client.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={client.progress} className="w-16" />
                        <span className="text-sm text-muted-foreground">{client.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={client.role.toLowerCase()}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.joinDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Bottom Action Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Document Review</CardTitle>
              <CardDescription>Review pending document submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Review Documents</Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Bulk Actions</CardTitle>
              <CardDescription>Perform actions on multiple clients</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Bulk Approve
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">System Settings</CardTitle>
              <CardDescription>Configure system preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
