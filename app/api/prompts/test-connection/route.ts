import { createClient as createServerClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[API] Testing connection...")

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      return NextResponse.json({
        success: false,
        error: "NEXT_PUBLIC_SUPABASE_URL not found"
      }, { status: 500 })
    }

    if (!supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        error: "SUPABASE_SERVICE_ROLE_KEY not found in environment variables"
      }, { status: 500 })
    }

    // Test service role connection
    const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Test basic query
    const { data, error } = await supabase
      .from("prompts")
      .select("count", { count: 'exact', head: true })

    if (error) {
      return NextResponse.json({
        success: false,
        error: `Database connection failed: ${error.message}`
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "API route and database connection working",
      promptCount: data?.length || 0,
      hasServiceRoleKey: true,
      environment: process.env.NODE_ENV
    })

  } catch (error) {
    console.error("[API] Test connection error:", error)
    return NextResponse.json({
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
}
