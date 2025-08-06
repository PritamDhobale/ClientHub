"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, File, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase" 

interface FileUploadProps {
  onUpload?: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export function FileUpload({ onUpload, maxFiles = 10, acceptedTypes = [".pdf", ".doc", ".docx"] }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [documentType, setDocumentType] = useState("")
  const user = supabase.auth.getUser()

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const droppedFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...droppedFiles].slice(0, maxFiles))
    },
    [maxFiles],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, maxFiles))
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
  if (!documentType) {
    alert("Please select a document type before uploading.")
    return
  }

  if (files.length === 0) return

  setUploading(true)
  setUploadProgress(0)

  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    alert("Please log in to upload files.")
    return
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileExt = file.name.split('.').pop()
    const filePath = `${documentType}/${user.id}/${Date.now()}_${file.name}`

    const { data, error: uploadError } = await supabase.storage
      .from("client-documents")
      .upload(filePath, file)

    if (uploadError) {
      console.error(`Upload failed for ${file.name}:`, uploadError.message)
      continue
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-documents/${filePath}`

    const { error: insertError } = await supabase.from("documents").insert([
      {
        uploaded_by: user.email,
        file_name: file.name,
        file_url: publicUrl,
        status: "pending",
        uploaded_at: new Date().toISOString(),
        document_type: documentType,
      },
    ])

    if (insertError) {
      console.error(`Insert failed for ${file.name}:`, insertError.message)
    }

    setUploadProgress(Math.round(((i + 1) / files.length) * 100))
  }

  setUploading(false)
  setUploadComplete(true)
  onUpload?.(files)
}


  if (uploadComplete) {
    return (
      <Card className="p-8 text-center">
        <CardContent className="pt-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Successful!</h3>
          <p className="text-muted-foreground mb-4">
            {files.length} file{files.length > 1 ? "s" : ""} uploaded successfully
          </p>
          <Button
            onClick={() => {
              setFiles([])
              setUploadComplete(false)
              setUploadProgress(0)
            }}
          >
            Upload More Files
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    
    <div className="space-y-4">
      <div>
          <label htmlFor="documentType" className="block text-sm font-medium mb-2">
            Document Type
          </label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
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
      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Upload your documents</h3>
        <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button asChild>
            <span>Choose Files</span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-4">
          Supported formats: {acceptedTypes.join(", ")} (Max 10MB per file)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Selected Files ({files.length})</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading files...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {files.length > 0 && !uploading && (
        <Button onClick={handleUpload} className="w-full">
          Upload {files.length} File{files.length > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  )
}
