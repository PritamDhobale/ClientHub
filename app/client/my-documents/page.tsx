"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertCircle, Eye, Download } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function MyDocumentsPage() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<any[]>([])

  useEffect(() => {
  if (!user?.id) return;

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("file_name, file_url, status, uploaded_at, document_type")
      .eq("uploaded_by", user.id) // ✅ correct: match UUID
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Failed to load documents:", error.message);
    } else {
      setDocuments(data || []);
    }
  };

  if (user.role === "client") {
    fetchDocuments();
  }
}, [user?.id]);


  if (!user || user.role !== "client") {
    return <div>Access denied</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
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
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: "My Documents" }]}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-muted-foreground">View and manage your uploaded documents</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>All documents you have uploaded for the onboarding process</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, index) => {
                  const type = doc.document_type || "Unknown"
                  const filename = doc.file_name.split("/").pop()

                  return (
                    <TableRow key={index}>
                      <TableCell className="capitalize">{type}</TableCell>
                      <TableCell className="font-medium">{filename}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusIcon(doc.status)}
                          <span className="ml-1 capitalize">{doc.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          </a>
                          <a href={doc.file_url} download>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
