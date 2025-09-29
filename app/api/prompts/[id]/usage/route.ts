/**
 * API route for incrementing prompt usage count
 */

import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse } from '@/lib/types'

/**
 * Create Supabase client with service role key
 */
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  }

  return createServerClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * POST /api/prompts/[id]/usage
 * Increment usage count for a prompt
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<{ usage_count: number }>>> {
  try {
    const { id } = params
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid prompt ID' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    // Increment usage count atomically
    const { data, error } = await supabase
      .rpc('increment_usage_count', { prompt_id: id })

    if (error) {
      console.error('[API] Usage count increment error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update usage count' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { usage_count: data },
      message: 'Usage count updated'
    })

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
