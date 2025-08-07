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
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase" 
import { useRouter } from "next/navigation"


type ClientRow = {
  id: number
  name: string
  email: string
  progress: number
  status: string
  role: string
  joinDate: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [clients, setClients] = useState<ClientRow[]>([])

useEffect(() => {
  const fetchClients = async () => {
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("client_id, business_name, created_at")

    if (clientError) {
      console.error("Failed to fetch clients", clientError)
      return
    }

    const { data: docData, error: docError } = await supabase
      .from("documents")
      .select("client_id, document_type, status")

    if (docError) {
      console.error("Failed to fetch documents", docError)
      return
    }

    const totalSteps = 4

    const clientList: ClientRow[] = clientData.map((client) => {
      const docs = docData.filter((d) => d.client_id === client.client_id)

      const approvedCount = docs.filter((d) => d.status === "approved").length
      const progress = Math.round((approvedCount / totalSteps) * 100)

      let status = "Pending"
      if (progress === 100) status = "Completed"
      else if (docs.some((d) => d.status === "rejected")) status = "Rejected"
      else if (docs.length > 0) status = "In Progress"

      return {
        id: client.client_id,
        name: client.business_name,
        email: "-", // no email in clients table
        progress,
        status,
        role: "Client", // default/fake until real role logic is added
        joinDate: client.created_at?.split("T")[0] || "-",
      }
    })

    setClients(clientList)
  }

  fetchClients()
}, [])

  if (!user || user.role !== "admin") {
    return <div>Access denied</div>
  }

  const metrics = [
  {
    title: "Total Clients",
    value: clients.length.toString(),
    icon: Users,
    color: "grey"
  },
  {
    title: "Verified",
    value: clients.filter(c => c.status === "Completed").length.toString(),
    icon: CheckCircle,
    color: "blue"
  },
  {
    title: "Pending",
    value: clients.filter(c => c.status === "Pending").length.toString(),
    icon: Clock,
    color: "yellow"
  },
  {
    title: "Rejected",
    value: clients.filter(c => c.status === "Rejected").length.toString(),
    icon: XCircle,
    color: "red"
  }
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
        return "bg-gradient-to-br from-[#00B0F0] to-[#009ACF] text-white"
      case "green":
        return "bg-gradient-to-br from-[#6AA84F] to-[#476E2C] text-white"
      case "yellow":
        return "bg-gradient-to-br from-[#FFD23E] to-[#FFC107] text-white"
      case "red":
        return "bg-gradient-to-br from-[#FF6F61] to-[#E85C50] text-white"
      default:
        return "bg-gradient-to-br from-[#6D6E71] to-[#4E4F52] text-white"
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
              <Button className="w-full" onClick={() => router.push("/admin/document-review")}>Review Documents</Button>
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
