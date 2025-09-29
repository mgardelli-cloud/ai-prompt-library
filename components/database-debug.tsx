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
      
      // Test 1: Authentication status
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      let authStatus = "❌ Not authenticated"
      if (user) {
        authStatus = `✅ Authenticated as: ${user.email || user.id}`
      } else if (authError) {
        authStatus = `❌ Auth Error: ${authError.message}`
      }
      
      // Test 2: Basic connection
      const { data: testData, error: testError } = await supabase
        .from("prompts")
        .select("count", { count: 'exact', head: true })
      
      if (testError) {
        setResult(`${authStatus}\n❌ Connection Error: ${testError.message}`)
        return
      }
      
      // Test 3: Select permissions
      const { data: selectData, error: selectError } = await supabase
        .from("prompts")
        .select("id, title, created_at")
        .limit(3)
      
      if (selectError) {
        setResult(`${authStatus}\n❌ Select Error: ${selectError.message}`)
        return
      }
      
      // Test 4: Insert permissions (try to insert a test record)
      const testPrompt = {
        title: "TEST_DELETE_ME",
        content: "This is a test prompt for delete testing",
        description: "Test prompt - safe to delete",
        category: "general",
        tags: ["test"],
        is_public: true
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from("prompts")
        .insert(testPrompt)
        .select("id")
        .single()
      
      let insertStatus = "❌ Insert failed"
      let testPromptId = null
      
      if (insertError) {
        insertStatus = `❌ Insert Error: ${insertError.message}`
      } else if (insertData) {
        insertStatus = "✅ Insert OK"
        testPromptId = insertData.id
      }
      
      // Test 5: Delete permissions (try to delete the test record we just created)
      let deleteStatus = "⏭️ Skipped (no test prompt)"
      
      if (testPromptId) {
        const { data: deleteData, error: deleteError, count } = await supabase
          .from("prompts")
          .delete({ count: 'exact' })
          .eq("id", testPromptId)
        
        if (deleteError) {
          deleteStatus = `❌ Delete Error: ${deleteError.message}`
        } else if (count === 0) {
          deleteStatus = "❌ Delete failed: No rows affected (RLS policy issue)"
        } else {
          deleteStatus = `✅ Delete OK: ${count} row(s) deleted`
        }
      }
      
      setResult(`
🔐 Authentication: ${authStatus}
✅ Database Connection: OK
✅ Total prompts: ${testData?.length || 0}
✅ Select permissions: OK
${insertStatus}
${deleteStatus}

🔍 Sample prompts:
${selectData?.map((p, i) => `${i + 1}. "${p.title}" (ID: ${p.id})`).join('\n') || "No prompts found"}

💡 If delete fails but insert works, check RLS policies in Supabase dashboard.
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
