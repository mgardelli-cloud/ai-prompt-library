import { createClient } from "@/lib/supabase/server"
import { PromptGallery } from "@/components/prompt-gallery"
import { Header } from "@/components/header"

export default async function HomePage() {
  const supabase = await createClient()

  let prompts = []
  let error: string | null = null

  try {
    console.log("[v0] Attempting to fetch prompts from database...")

    // Directly fetch prompts - if table doesn't exist, we'll get a clear error
    const { data: promptsData, error: promptsError } = await supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false })

    if (promptsError) {
      console.error("[v0] Error fetching prompts:", promptsError)
      error = promptsError.message || "Database connection failed"
    } else {
      console.log("[v0] Successfully fetched prompts:", promptsData?.length || 0)
      prompts = promptsData || []
    }
  } catch (err) {
    console.error("[v0] Unexpected error:", err)
    error = err instanceof Error ? err.message : "An unexpected error occurred"
  }

  return (
    <div className="min-h-screen bg-background smooth-transition">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-semibold text-foreground mb-4 text-balance tracking-tight">AI Prompt Library</h1>
          <p className="text-xl text-muted-foreground text-pretty font-extralight max-w-2xl mx-auto leading-relaxed">
            Discover, save, and organize your favorite AI prompts
          </p>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-destructive/5 border border-destructive/10 rounded-2xl smooth-transition minimal-shadow">
            <h3 className="font-medium text-destructive mb-3">Database Error</h3>
            <p className="text-sm text-destructive/80 font-extralight leading-relaxed">
              {error}
            </p>
            <details className="mt-4">
              <summary className="text-xs text-destructive/60 cursor-pointer font-medium">Technical Details</summary>
              <pre className="text-xs mt-2 text-destructive/60 overflow-auto font-extralight">
                {error}
              </pre>
            </details>
          </div>
        )}

        <PromptGallery prompts={prompts} />
      </main>
    </div>
  )
}
