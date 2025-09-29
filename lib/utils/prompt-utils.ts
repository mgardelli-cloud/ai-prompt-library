/**
 * Utility functions for prompt operations
 */

import type { Prompt, PromptCategory, SearchFilters } from '@/lib/types'

/**
 * Get category color classes for UI display
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'content-creation': 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    development: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300',
    marketing: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
    productivity: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
    'social-media': 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300',
    education: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
    general: 'bg-gray-50 text-gray-700 dark:bg-gray-950/50 dark:text-gray-300',
  }
  return colors[category] || colors.general
}

/**
 * Format category name for display
 */
export function formatCategoryName(category: string): string {
  return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Filter prompts based on search criteria
 */
export function filterPrompts(prompts: Prompt[], filters: Partial<SearchFilters>): Prompt[] {
  let filtered = [...prompts]

  // Filter by search query
  if (filters.query?.trim()) {
    const query = filters.query.toLowerCase()
    filtered = filtered.filter((prompt) => {
      const matchTitle = prompt.title.toLowerCase().includes(query)
      const matchDescription = filters.includeDescription && 
        prompt.description?.toLowerCase().includes(query)
      const matchContent = filters.includeContent && 
        prompt.content.toLowerCase().includes(query)
      const matchTags = filters.includeTags && 
        prompt.tags.some((tag) => tag.toLowerCase().includes(query))

      return matchTitle || matchDescription || matchContent || matchTags
    })
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((prompt) => prompt.category === filters.category)
  }

  // Filter by tags
  if (filters.tags?.length) {
    filtered = filtered.filter((prompt) => 
      filters.tags!.every((tag) => prompt.tags.includes(tag))
    )
  }

  // Filter by public only
  if (filters.isPublicOnly) {
    filtered = filtered.filter((prompt) => prompt.is_public)
  }

  return filtered
}

/**
 * Sort prompts based on criteria
 */
export function sortPrompts(
  prompts: Prompt[], 
  sortBy: SearchFilters['sortBy'] = 'created_at',
  sortOrder: SearchFilters['sortOrder'] = 'desc'
): Prompt[] {
  return [...prompts].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'usage_count':
        comparison = a.usage_count - b.usage_count
        break
      case 'created_at':
      default:
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })
}

/**
 * Get unique categories from prompts array
 */
export function getUniqueCategories(prompts: Prompt[]): string[] {
  return Array.from(new Set(prompts.map(p => p.category)))
}

/**
 * Get unique tags from prompts array
 */
export function getUniqueTags(prompts: Prompt[]): string[] {
  return Array.from(new Set(prompts.flatMap(p => p.tags)))
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Format usage count for display
 */
export function formatUsageCount(count: number): string {
  if (count === 0) return 'Never used'
  if (count === 1) return 'Used once'
  return `Used ${count} times`
}

/**
 * Validate prompt data
 */
export function validatePrompt(prompt: Partial<Prompt>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!prompt.title?.trim()) {
    errors.push('Title is required')
  } else if (prompt.title.length > 200) {
    errors.push('Title must be less than 200 characters')
  }

  if (!prompt.content?.trim()) {
    errors.push('Content is required')
  } else if (prompt.content.length > 10000) {
    errors.push('Content must be less than 10,000 characters')
  }

  if (prompt.description && prompt.description.length > 500) {
    errors.push('Description must be less than 500 characters')
  }

  if (!prompt.category?.trim()) {
    errors.push('Category is required')
  }

  if (!prompt.tags?.length) {
    errors.push('At least one tag is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
