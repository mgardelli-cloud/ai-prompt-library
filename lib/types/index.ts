/**
 * Core types for the AI Prompt Library application
 */

// Database types
export interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  category: string
  tags: string[]
  created_at: string
  updated_at?: string
  usage_count: number
  is_public: boolean
  user_id?: string | null
}

export interface PromptInsert extends Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'usage_count'> {
  usage_count?: number
}

export interface PromptUpdate extends Partial<Omit<Prompt, 'id' | 'created_at'>> {}

// UI Component types
export interface PromptCardProps {
  prompt: Prompt
  onDelete?: (id: string) => void
  onUpdate?: (prompt: Prompt) => void
}

export interface PromptGalleryProps {
  prompts: Prompt[]
}

// Search and filter types
export interface SearchFilters {
  query: string
  category: string
  tags: string[]
  includeContent: boolean
  includeDescription: boolean
  includeTags: boolean
  sortBy: 'created_at' | 'usage_count' | 'title'
  sortOrder: 'asc' | 'desc'
  isPublicOnly: boolean
}

export interface FilterState extends Partial<SearchFilters> {}

// API types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface DeletePromptResponse extends ApiResponse {
  deletedCount?: number
}

// Error types
export interface AppError {
  message: string
  code?: string
  details?: unknown
}

// Constants
export const PROMPT_CATEGORIES = [
  'content-creation',
  'development', 
  'marketing',
  'productivity',
  'social-media',
  'education',
  'general'
] as const

export type PromptCategory = typeof PROMPT_CATEGORIES[number]

export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'usage_count', label: 'Usage Count' },
  { value: 'title', label: 'Title' }
] as const

export const SORT_ORDERS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' }
] as const
