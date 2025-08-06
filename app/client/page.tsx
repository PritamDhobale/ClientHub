"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileUpload } from "@/components/file-upload"
import { Upload, FileText, CheckCircle, Clock, AlertCircle, User as UserIcon, Shield, FileCheck, Award, Eye, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

type DocumentType = {
  file_name: string
  file_url: string
  status: string
  uploaded_at: string
}

export default function ClientDashboard() {
  const router = useRouter()
  const { user } = useAuth()

  if (!user || user.role !== "client") {
    return <div>Access denied</div>
  }

const [documents, setDocuments] = useState<any[]>([])

const getStepStatus = (type: string): string => {
  const relevant = documents.filter((doc) =>
    doc.document_type?.toLowerCase().includes(type.toLowerCase())
  )
  return relevant[0]?.status || "pending"
}

const getLastUpdated = (type: string): string | null => {
  const relevant = documents
    .filter((doc) => doc.document_type?.toLowerCase().includes(type.toLowerCase()))
    .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
  return relevant[0]?.uploaded_at?.split("T")[0] || null
}

const onboardingSteps = [
  {
    id: "profile",
    title: "Profile Verification",
    status: getStepStatus("Profile"),
    lastUpdated: getLastUpdated("Profile"),
    icon: UserIcon,
    description: "Personal information verified",
  },
  {
    id: "kyc",
    title: "KYC Review",
    status: getStepStatus("KYC"),
    lastUpdated: getLastUpdated("KYC"),
    icon: Shield,
    description: "Identity documents under review",
  },
  {
    id: "insurance",
    title: "Insurance Verification",
    status: getStepStatus("Insurance"),
    lastUpdated: getLastUpdated("Insurance"),
    icon: FileCheck,
    description: "Insurance documents required",
  },
  {
    id: "final",
    title: "Final Approval",
    status: getStepStatus("Final"),
    lastUpdated: getLastUpdated("Final"),
    icon: Award,
    description: "Awaiting final approval",
  },
]


useEffect(() => {
  if (!user?.id) return; // Prevent running before user is loaded

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("file_name, file_url, status, uploaded_at, document_type")
      .eq("uploaded_by", user.id); // Correct use of id

    if (error) {
      console.error("Failed to load documents:", error.message);
    } else {
      setDocuments(data || []);
    }
  };

  if (user.role === "client") {
    fetchDocuments();
  }
}, [user?.id]); // 👈 dependency only on user ID


  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
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
      case "completed":
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const completedSteps = onboardingSteps.filter((step) => step.status === "completed").length
  const progressPercentage = (completedSteps / onboardingSteps.length) * 100

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
  if (!selectedFile || !documentType) return;

  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser?.user) {
    console.error("Failed to get auth user:", authError);
    return;
  }

  const uid = authUser.user.id;

  const { data: clientRecord, error: clientError } = await supabase
    .from("clients")
    .select("client_id")
    .eq("created_by", uid)  // 👈 use your actual column name
    .maybeSingle();

  if (clientError || !clientRecord) {
  console.error("Client not found for user:", clientError || "No record");
  return;
}

  const clientId = clientRecord.client_id;

  const fileExt = selectedFile.name.split(".").pop();
  const filePath = `${documentType}/${uid}/${Date.now()}.${fileExt}`;

  const { data, error: uploadError } = await supabase.storage
    .from("client-documents")
    .upload(filePath, selectedFile);

  if (uploadError) {
    console.error("Upload failed:", uploadError);
    return;
  }

  const { error: insertError } = await supabase.from("documents").insert([
  {
    uploaded_by: uid,
    client_id: clientId,
    file_name: selectedFile.name,
    file_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-documents/${filePath}`,
    status: "pending",
    uploaded_at: new Date().toISOString(),
    file_type: selectedFile.type,
    document_type: documentType,
  },
]);



  if (insertError) {
    console.error("Insert failed:", insertError);
    return;
  }

  alert("Uploaded successfully!");
  setSelectedFile(null);
  setDocumentType("");
};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {/* Top Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload Documents</CardTitle>
              <Upload className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full" onClick={() => router.push("/client/upload-documents")}>
                Upload Files
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Onboarding Progress</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">Total uploaded</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">In Progress</div>
              <p className="text-xs text-muted-foreground">KYC Review</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="onboarding-status" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="onboarding-status">Onboarding Status</TabsTrigger>
            <TabsTrigger value="my-documents">My Documents</TabsTrigger>
            <TabsTrigger value="upload-documents">Upload Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="onboarding-status" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Onboarding Progress</CardTitle>
                <CardDescription>Complete all steps to finish your onboarding process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {onboardingSteps.map((step) => {
                  const StepIcon = step.icon
                  return (
                    <div key={step.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              step.status === "completed"
                                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                : step.status === "in-progress"
                                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                            }`}
                          >
                            <StepIcon className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium">{step.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                          {step.lastUpdated && (
                            <p className="text-xs text-muted-foreground mt-1">Last updated: {step.lastUpdated}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(step.status)}>
                          {getStatusIcon(step.status)}
                          <span className="ml-1 capitalize">{step.status.replace("-", " ")}</span>
                        </Badge>
                        <Button variant="outline" size="sm">
                          {step.status === "pending" ? "Start" : "View"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-documents" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>View and manage your uploaded documents</CardDescription>
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
                    {documents.map((doc, index) => (
                      <TableRow key={index}>
                        <TableCell className="capitalize">
                          {doc.document_type || "Unknown"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {doc.file_name.split("/").pop()} {/* Filename */}
                        </TableCell>
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
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

           {/* TabsContent value="upload-documents" */}
          <TabsContent value="upload-documents" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Select a type and upload required documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="documentType" className="text-sm font-medium">
                      Document Type
                    </label>
                    <select
                      id="documentType"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                      <option value="">Select document type</option>
                      <option value="Bank Statements">Bank Statements</option>
                      <option value="Credit Card Statements">Credit Card Statements</option>
                      <option value="Tax Returns">Tax Returns</option>
                      <option value="Payroll Reports">Payroll Reports</option>
                      <option value="Asset List">Asset List</option>
                      <option value="Loan Statements">Loan Statements</option>
                      <option value="W-9 Forms">W-9 Forms</option>
                      <option value="Profile">Profile</option>
                      <option value="KYC">KYC</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                    onChange={handleFileChange}
                  />

                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || !documentType}
                    className="mt-2"
                  >
                    Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
