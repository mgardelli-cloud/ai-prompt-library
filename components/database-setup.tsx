"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Database, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function DatabaseSetup() {
  const [isCreating, setIsCreating] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const createTables = async () => {
    setIsCreating(true)
    setStatus("idle")

    try {
      const supabase = createClient()

      // Create the prompts table
      const { error } = await supabase.rpc("create_prompts_table", {})

      if (error) {
        throw error
      }

      setStatus("success")
      setMessage("Database tables created successfully!")

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      console.error("Error creating tables:", error)
      setStatus("error")
      setMessage(error.message || "Failed to create database tables")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Database Setup Required</CardTitle>
        <CardDescription>
          The database tables need to be created before you can use the AI Prompt Library.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="flex items-start gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <Button onClick={createTables} disabled={isCreating || status === "success"} className="w-full">
          {isCreating ? "Creating Tables..." : "Setup Database"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          This will create the necessary tables in your Supabase database.
        </p>
      </CardContent>
    </Card>
  )
}
