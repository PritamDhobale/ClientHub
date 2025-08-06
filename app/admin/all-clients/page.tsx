"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Eye, Edit, Trash2, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ClientWithUser = {
  client_id: string;
  business_name: string;
  status?: string;
  created_by: string;
  created_at: string;
  assigned_service_center: string | null;

  // These come from users (nested object from Supabase join)
  users?: {
    email?: string;
    full_name?: string;
    role?: string;
  };

  // Derived or computed on frontend
  email?: string;
  full_name?: string;
  role?: string;
  progress?: number;
}


export default function AllClientsPage() {
  const { user } = useAuth()
const [clients, setClients] = useState<ClientWithUser[]>([])
const [filteredClients, setFilteredClients] = useState<ClientWithUser[]>([])
const [statusFilter, setStatusFilter] = useState("all")
const [roleFilter, setRoleFilter] = useState("all")
const [searchQuery, setSearchQuery] = useState("")

useEffect(() => {
  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*, users:users!clients_created_by_fkey (email, full_name, role)")

    if (error) {
      console.error("Error fetching clients:", error)
      return
    }

    console.log("Fetched clients:", data)

    if (data) {
      const cleanedData = data.map((client) => ({
        ...client,
        role: client.users?.role ?? "Client",
        email: client.users?.email ?? "",
        full_name: client.users?.full_name ?? "",
        progress: 0 // You can customize this based on actual progress logic
      }))
      setClients(cleanedData)
      setFilteredClients(cleanedData)
    }
  }

  fetchClients()
}, [])

useEffect(() => {
  let result = [...clients]

  if (statusFilter !== "all") {
    result = result.filter(client => client.status?.toLowerCase() === statusFilter)
  }

  if (roleFilter !== "all") {
    result = result.filter(client =>
      (client.role || "").toLowerCase() === roleFilter.toLowerCase()
    )
  }

  if (searchQuery.trim() !== "") {
    result = result.filter(client =>
      client.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  setFilteredClients(result)
}, [clients, statusFilter, roleFilter, searchQuery])

// ✅ Now you can safely conditionally render
if (!user || user.role !== "admin") {
  return <div>Access denied</div>
}

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

  return (
    <DashboardLayout breadcrumbs={[{ label: "All Clients" }]}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">All Clients</h1>
          <p className="text-muted-foreground">Manage and view all clients in the system</p>
        </div>

        {/* Filters */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Client List</CardTitle>
            <CardDescription>All registered clients and their information</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.client_id}>
                    <TableCell className="font-medium">{client.full_name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{client.email || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">—</TableCell> {/* phone not available yet */}
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={client.progress || 0} className="w-16" />
                        <span className="text-sm text-muted-foreground">{client.progress || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status || "")}>{client.status || "—"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={(client.role || "client").toLowerCase()}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="service_center">Service Center</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(client.created_at).toLocaleDateString("en-GB")}
                    </TableCell>
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
      </div>
    </DashboardLayout>
  )
}
