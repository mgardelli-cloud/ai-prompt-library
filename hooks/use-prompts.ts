/**
 * Custom hook for managing prompts state and operations
 */

import { useState, useCallback, useMemo } from 'react'
import type { Prompt, SearchFilters } from '@/lib/types'
import { filterPrompts, sortPrompts } from '@/lib/utils/prompt-utils'
import { deletePrompt as apiDeletePrompt, incrementUsageCount } from '@/lib/api/prompts'
import { getErrorMessage } from '@/lib/api/prompts'

interface UsePromptsOptions {
  initialPrompts?: Prompt[]
  onError?: (error: string) => void
  onSuccess?: (message: string) => void
}

export function usePrompts(options: UsePromptsOptions = {}) {
  const { initialPrompts = [], onError, onSuccess } = options
  
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts)
  const [isLoading, setIsLoading] = useState(false)
  const [searchFilters, setSearchFilters] = useState<Partial<SearchFilters>>({
    query: '',
    category: 'all',
    tags: [],
    includeContent: true,
    includeDescription: true,
    includeTags: true,
    sortBy: 'created_at',
    sortOrder: 'desc',
    isPublicOnly: false,
  })

  // Filtered and sorted prompts
  const filteredPrompts = useMemo(() => {
    const filtered = filterPrompts(prompts, searchFilters)
    return sortPrompts(
      filtered, 
      searchFilters.sortBy || 'created_at',
      searchFilters.sortOrder || 'desc'
    )
  }, [prompts, searchFilters])

  // Update search filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Reset filters to default
  const resetFilters = useCallback(() => {
    setSearchFilters({
      query: '',
      category: 'all',
      tags: [],
      includeContent: true,
      includeDescription: true,
      includeTags: true,
      sortBy: 'created_at',
      sortOrder: 'desc',
      isPublicOnly: false,
    })
  }, [])

  // Delete prompt
  const deletePromptById = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const result = await apiDeletePrompt(id)
      
      if (result.success) {
        setPrompts(prev => prev.filter(p => p.id !== id))
        onSuccess?.(result.message || 'Prompt deleted successfully')
      } else {
        throw new Error(result.error || 'Failed to delete prompt')
      }
    } catch (error) {
      const message = getErrorMessage(error)
      onError?.(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [onError, onSuccess])

  // Increment usage count
  const incrementPromptUsage = useCallback(async (id: string) => {
    try {
      const result = await incrementUsageCount(id)
      
      if (result.success && result.data) {
        setPrompts(prev => prev.map(p => 
          p.id === id 
            ? { ...p, usage_count: result.data!.usage_count }
            : p
        ))
      }
    } catch (error) {
      // Silently fail for usage count updates
      console.warn('Failed to update usage count:', getErrorMessage(error))
    }
  }, [])

  // Add new prompt to local state
  const addPrompt = useCallback((prompt: Prompt) => {
    setPrompts(prev => [prompt, ...prev])
  }, [])

  // Update prompt in local state
  const updatePrompt = useCallback((updatedPrompt: Prompt) => {
    setPrompts(prev => prev.map(p => 
      p.id === updatedPrompt.id ? updatedPrompt : p
    ))
  }, [])

  // Refresh prompts (for external updates)
  const refreshPrompts = useCallback(() => {
    window.location.reload()
  }, [])

  return {
    // State
    prompts: filteredPrompts,
    allPrompts: prompts,
    isLoading,
    searchFilters,
    
    // Actions
    updateFilters,
    resetFilters,
    deletePromptById,
    incrementPromptUsage,
    addPrompt,
    updatePrompt,
    refreshPrompts,
    
    // Computed
    totalCount: prompts.length,
    filteredCount: filteredPrompts.length,
  }
}
