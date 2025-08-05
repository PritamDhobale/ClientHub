"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, User, Mail, Phone, FileText, CheckCircle, AlertTriangle, X } from "lucide-react"

interface Client {
  id: number
  name: string
  email: string
  phone: string
  submissionDate: string
  status: string
  documents: string[]
}

interface ClientDetailsModalProps {
  client: Client
  trigger?: React.ReactNode
}

export function ClientDetailsModal({ client, trigger }: ClientDetailsModalProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

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

  const handleDocumentSelect = (document: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments((prev) => [...prev, document])
    } else {
      setSelectedDocuments((prev) => prev.filter((doc) => doc !== document))
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Client Details – {client.name}</DialogTitle>
          <DialogDescription>Review client information and documents</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {client.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {client.phone}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Submission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Date:</span> {client.submissionDate}
                </div>
                <div className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {client.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedDocuments.includes(doc)}
                        onCheckedChange={(checked) => handleDocumentSelect(doc, checked as boolean)}
                      />
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                ))}
              </div>
              {selectedDocuments.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedDocuments.length} document{selectedDocuments.length > 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Request Changes
            </Button>
            <Button variant="destructive" className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
