/**
 * Optimized PromptGallery component with modern React patterns
 */

'use client'

import { memo, useMemo } from 'react'
import { Search } from 'lucide-react'
import { SearchFilters } from './search-filters'
import PromptCard from './prompt-card-optimized'
import { usePrompts } from '@/hooks/use-prompts'
import { useToast } from '@/hooks/use-toast'
import type { PromptGalleryProps, SearchFilters as SearchFiltersType } from '@/lib/types'
import { getUniqueCategories, getUniqueTags } from '@/lib/utils/prompt-utils'

/**
 * Memoized empty state component
 */
const EmptyState = memo(function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Search className="w-10 h-10 text-muted-foreground/60" />
      </div>
      <h3 className="text-xl font-medium text-foreground mb-3">No prompts found</h3>
      <p className="text-muted-foreground font-extralight text-lg">
        Try adjusting your search or filters
      </p>
    </div>
  )
})

/**
 * Memoized results header component
 */
const ResultsHeader = memo<{
  count: number
  hasAdvancedFilters: boolean
  onClearFilters: () => void
}>(function ResultsHeader({ count, hasAdvancedFilters, onClearFilters }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground font-extralight">
        {count} prompt{count !== 1 ? 's' : ''} found
      </p>
      {hasAdvancedFilters && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-extralight">
            Advanced filters active
          </span>
          <button
            onClick={onClearFilters}
            className="text-xs text-primary hover:underline transition-colors font-medium"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
})

/**
 * Memoized prompt grid component
 */
const PromptGrid = memo<{
  prompts: PromptGalleryProps['prompts']
  onDeletePrompt: (id: string) => void
  onUpdatePrompt: (prompt: PromptGalleryProps['prompts'][0]) => void
}>(function PromptGrid({ prompts, onDeletePrompt, onUpdatePrompt }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onDelete={onDeletePrompt}
          onUpdate={onUpdatePrompt}
        />
      ))}
    </div>
  )
})

/**
 * Main PromptGallery component
 */
export const PromptGallery = memo<PromptGalleryProps>(function PromptGallery({ 
  prompts: initialPrompts 
}) {
  const { toast } = useToast()

  const {
    prompts,
    searchFilters,
    updateFilters,
    resetFilters,
    deletePromptById,
    updatePrompt,
    filteredCount,
  } = usePrompts({
    initialPrompts,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
    },
    onSuccess: (message) => {
      toast({
        title: 'Success',
        description: message,
      })
    },
  })

  // Memoized unique categories and tags
  const { categories, tags } = useMemo(() => ({
    categories: getUniqueCategories(initialPrompts),
    tags: getUniqueTags(initialPrompts),
  }), [initialPrompts])

  // Check if advanced filters are active
  const hasAdvancedFilters = useMemo(() => {
    return !!(
      searchFilters.query ||
      (searchFilters.category && searchFilters.category !== 'all') ||
      searchFilters.tags?.length ||
      searchFilters.isPublicOnly ||
      searchFilters.sortBy !== 'created_at' ||
      searchFilters.sortOrder !== 'desc'
    )
  }, [searchFilters])

  // Handle filter updates
  const handleFilter = (query: string, category: string, tags: string[]) => {
    updateFilters({
      query,
      category,
      tags,
    })
  }

  // Handle advanced filter updates
  const handleAdvancedFilter = (filters: SearchFiltersType) => {
    updateFilters(filters)
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <SearchFilters
        onFilter={handleFilter}
        onAdvancedFilter={handleAdvancedFilter}
        categories={categories}
        tags={tags}
        searchQuery={searchFilters.query || ''}
        selectedCategory={searchFilters.category || 'all'}
        selectedTags={searchFilters.tags || []}
      />

      {/* Results Header */}
      <ResultsHeader
        count={filteredCount}
        hasAdvancedFilters={hasAdvancedFilters}
        onClearFilters={resetFilters}
      />

      {/* Results */}
      {prompts.length === 0 ? (
        <EmptyState />
      ) : (
        <PromptGrid
          prompts={prompts}
          onDeletePrompt={deletePromptById}
          onUpdatePrompt={updatePrompt}
        />
      )}
    </div>
  )
})

export default PromptGallery
