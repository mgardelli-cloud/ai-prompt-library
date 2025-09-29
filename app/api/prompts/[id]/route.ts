import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: "Prompt ID is required" },
        { status: 400 }
      )
    }

    console.log("[API] Deleting prompt with ID:", id)

    // Use server-side client which has admin privileges
    const supabase = await createClient()
    
    // First check if the prompt exists
    const { data: existingPrompt, error: selectError } = await supabase
      .from("prompts")
      .select("id, title")
      .eq("id", id)
      .single()
    
    if (selectError || !existingPrompt) {
      console.log("[API] Prompt not found:", selectError?.message)
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      )
    }

    // Delete the prompt
    const { error: deleteError, count } = await supabase
      .from("prompts")
      .delete({ count: 'exact' })
      .eq("id", id)

    if (deleteError) {
      console.error("[API] Delete error:", deleteError)
      return NextResponse.json(
        { error: `Failed to delete prompt: ${deleteError.message}` },
        { status: 500 }
      )
    }

    if (count === 0) {
      console.log("[API] No rows deleted")
      return NextResponse.json(
        { error: "No prompt was deleted. It may have already been removed." },
        { status: 404 }
      )
    }

    console.log(`[API] Successfully deleted ${count} prompt(s)`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted prompt "${existingPrompt.title}"`,
      deletedCount: count
    })

  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
