/**
 * Optimized API routes for prompt operations
 */

import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse, DeletePromptResponse } from '@/lib/types'

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
 * Create standardized error response
 */
function createErrorResponse(
  message: string, 
  status: number = 500,
  code?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      ...(code && { code })
    },
    { status }
  )
}

/**
 * Create standardized success response
 */
function createSuccessResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      ...(data && { data }),
      ...(message && { message })
    },
    { status }
  )
}

/**
 * DELETE /api/prompts/[id]
 * Delete a prompt by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<DeletePromptResponse>> {
  try {
    const { id } = params
    
    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      return createErrorResponse('Invalid prompt ID', 400, 'INVALID_ID')
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return createErrorResponse('Invalid UUID format', 400, 'INVALID_UUID')
    }

    console.log(`[API] Deleting prompt: ${id}`)

    const supabase = createAdminClient()
    
    // Check if prompt exists first
    const { data: existingPrompt, error: selectError } = await supabase
      .from('prompts')
      .select('id, title')
      .eq('id', id)
      .single()
    
    if (selectError || !existingPrompt) {
      console.log(`[API] Prompt not found: ${id}`)
      return createErrorResponse('Prompt not found', 404, 'PROMPT_NOT_FOUND')
    }

    // Delete the prompt
    const { error: deleteError, count } = await supabase
      .from('prompts')
      .delete({ count: 'exact' })
      .eq('id', id)

    if (deleteError) {
      console.error('[API] Delete error:', deleteError)
      return createErrorResponse(
        `Failed to delete prompt: ${deleteError.message}`,
        500,
        'DELETE_FAILED'
      )
    }

    if (count === 0) {
      console.log('[API] No rows deleted')
      return createErrorResponse(
        'No prompt was deleted. It may have already been removed.',
        404,
        'ALREADY_DELETED'
      )
    }

    console.log(`[API] Successfully deleted ${count} prompt(s)`)
    
    return createSuccessResponse(
      { deletedCount: count },
      `Successfully deleted prompt "${existingPrompt.title}"`
    )

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    
    if (error instanceof Error && error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return createErrorResponse(
        'Server configuration error. Please contact support.',
        500,
        'CONFIG_ERROR'
      )
    }
    
    return createErrorResponse(
      'Internal server error',
      500,
      'INTERNAL_ERROR'
    )
  }
}

/**
 * PATCH /api/prompts/[id]
 * Update a prompt by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = params
    
    if (!id || typeof id !== 'string') {
      return createErrorResponse('Invalid prompt ID', 400, 'INVALID_ID')
    }

    const body = await request.json()
    
    // Validate request body
    if (!body || typeof body !== 'object') {
      return createErrorResponse('Invalid request body', 400, 'INVALID_BODY')
    }

    console.log(`[API] Updating prompt: ${id}`)

    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('prompts')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[API] Update error:', error)
      return createErrorResponse(
        `Failed to update prompt: ${error.message}`,
        500,
        'UPDATE_FAILED'
      )
    }

    if (!data) {
      return createErrorResponse('Prompt not found', 404, 'PROMPT_NOT_FOUND')
    }

    console.log(`[API] Successfully updated prompt: ${id}`)
    
    return createSuccessResponse(
      data,
      'Prompt updated successfully'
    )

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR')
  }
}
