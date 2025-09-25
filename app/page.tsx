import { createClient } from "@/lib/supabase/server"
import { PromptGallery } from "@/components/prompt-gallery"
import { Header } from "@/components/header"

export default async function HomePage() {
  const supabase = await createClient()

  let prompts = []
  let error = null

  try {
    console.log("[v0] Attempting to fetch prompts from database...")

    // First, let's try to verify the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "prompts")
      .eq("table_schema", "public")

    console.log("[v0] Table check result:", { tableCheck, tableError })

    // Now try to fetch prompts with explicit schema reference
    const { data: promptsData, error: promptsError } = await supabase
      .schema("public")
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false })

    if (promptsError) {
      console.error("[v0] Error fetching prompts:", promptsError)
      error = promptsError
    } else {
      console.log("[v0] Successfully fetched prompts:", promptsData?.length || 0)
      prompts = promptsData || []
    }
  } catch (err) {
    console.error("[v0] Unexpected error:", err)
    error = err
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">AI Prompt Library</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Discover, save, and organize your favorite AI prompts
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h3 className="font-medium text-destructive mb-2">Database Error</h3>
            <p className="text-sm text-destructive/80">
              {error.message || "Failed to load prompts. Please check the database connection."}
            </p>
            <details className="mt-2">
              <summary className="text-xs text-destructive/60 cursor-pointer">Technical Details</summary>
              <pre className="text-xs mt-1 text-destructive/60 overflow-auto">{JSON.stringify(error, null, 2)}</pre>
            </details>
          </div>
        )}

        <PromptGallery prompts={prompts} />
      </main>
    </div>
  )
}
