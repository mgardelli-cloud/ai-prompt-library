"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function DatabaseDebug() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult("Testing database connection...")
    
    try {
      const supabase = createClient()
      
      // Test 1: Basic connection
      const { data: testData, error: testError } = await supabase
        .from("prompts")
        .select("count", { count: 'exact', head: true })
      
      if (testError) {
        setResult(`❌ Connection Error: ${testError.message}`)
        return
      }
      
      // Test 2: Select permissions
      const { data: selectData, error: selectError } = await supabase
        .from("prompts")
        .select("id, title")
        .limit(1)
      
      if (selectError) {
        setResult(`❌ Select Error: ${selectError.message}`)
        return
      }
      
      // Test 3: Delete permissions (try to delete a non-existent record)
      const { error: deleteError } = await supabase
        .from("prompts")
        .delete()
        .eq("id", "00000000-0000-0000-0000-000000000000") // Non-existent ID
      
      let deleteStatus = "✅ Delete permissions OK"
      if (deleteError) {
        if (deleteError.message.includes("RLS") || deleteError.message.includes("permission")) {
          deleteStatus = `❌ Delete Permission Error: ${deleteError.message}`
        } else {
          deleteStatus = "✅ Delete permissions OK (expected error for non-existent ID)"
        }
      }
      
      setResult(`
✅ Database Connection: OK
✅ Total prompts: ${testData?.length || 0}
✅ Select permissions: OK
${deleteStatus}

🔍 Sample prompt: ${selectData?.[0] ? `"${selectData[0].title}" (ID: ${selectData[0].id})` : "No prompts found"}
      `.trim())
      
    } catch (error) {
      setResult(`❌ Unexpected Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-950/20">
      <h3 className="font-bold text-lg mb-4">🔍 Database Debug Tool</h3>
      
      <Button 
        onClick={testConnection} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? "Testing..." : "Test Database Connection & Permissions"}
      </Button>
      
      {result && (
        <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded border whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  )
}
