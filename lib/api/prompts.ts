/**
 * API utilities for prompt operations
 */

import type { Prompt, PromptInsert, PromptUpdate, ApiResponse, DeletePromptResponse } from '@/lib/types'

/**
 * Base API configuration
 */
const API_BASE = '/api/prompts'

/**
 * Generic API error handler
 */
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.error || `HTTP ${response.status}`,
        response.status,
        data.code
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred'
    )
  }
}

/**
 * Delete a prompt by ID
 */
export async function deletePrompt(id: string): Promise<DeletePromptResponse> {
  return apiRequest<DeletePromptResponse>(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Create a new prompt
 */
export async function createPrompt(prompt: PromptInsert): Promise<ApiResponse<Prompt>> {
  return apiRequest<Prompt>(API_BASE, {
    method: 'POST',
    body: JSON.stringify(prompt),
  })
}

/**
 * Update an existing prompt
 */
export async function updatePrompt(id: string, updates: PromptUpdate): Promise<ApiResponse<Prompt>> {
  return apiRequest<Prompt>(`${API_BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

/**
 * Increment usage count for a prompt
 */
export async function incrementUsageCount(id: string): Promise<ApiResponse<{ usage_count: number }>> {
  return apiRequest<{ usage_count: number }>(`${API_BASE}/${id}/usage`, {
    method: 'POST',
  })
}

/**
 * Test API connection and permissions
 */
export async function testConnection(): Promise<ApiResponse<{
  promptCount: number
  hasServiceRoleKey: boolean
  environment: string
}>> {
  return apiRequest<{
    promptCount: number
    hasServiceRoleKey: boolean
    environment: string
  }>(`${API_BASE}/test-connection`)
}

/**
 * Handle API errors with user-friendly messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.'
      case 401:
        return 'You are not authorized to perform this action.'
      case 403:
        return 'Access denied. You do not have permission.'
      case 404:
        return 'The requested item was not found.'
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return error.message
    }
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}
