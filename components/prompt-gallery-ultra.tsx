/**
 * Ultra-Modern PromptGallery with sophisticated animations and UX
 */

'use client'

import { memo, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Sparkles } from 'lucide-react'
import { SearchFilters } from './search-filters'
import PromptCardUltra from './prompt-card-ultra'
import { usePrompts } from '@/hooks/use-prompts'
import { useToast } from '@/hooks/use-toast'
import type { PromptGalleryProps, SearchFilters as SearchFiltersType } from '@/lib/types'
import { getUniqueCategories, getUniqueTags } from '@/lib/utils/prompt-utils'
import { 
  AnimatedContainer, 
  AnimatedText, 
  AnimatedButton,
  AnimatedSpinner 
} from '@/components/ui/animated'
import { staggerContainer, slideVariants } from '@/lib/animations'

/**
 * Animated empty state with sophisticated design
 */
const EmptyState = memo(function EmptyState() {
  return (
    <motion.div
      className="text-center py-24"
      variants={slideVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 1, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Search className="w-12 h-12 text-primary/60" />
      </motion.div>
      
      <AnimatedText delay={0.2}>
        <h3 className="text-2xl font-semibold text-foreground mb-4 gradient-text">
          No prompts found
        </h3>
      </AnimatedText>
      
      <AnimatedText delay={0.3}>
        <p className="text-muted-foreground font-light text-lg max-w-md mx-auto leading-relaxed">
          Try adjusting your search filters or explore different categories
        </p>
      </AnimatedText>
    </motion.div>
  )
})

/**
 * Animated results header with smooth transitions
 */
const ResultsHeader = memo<{
  count: number
  totalCount: number
  hasAdvancedFilters: boolean
  onClearFilters: () => void
  isLoading: boolean
}>(function ResultsHeader({ count, totalCount, hasAdvancedFilters, onClearFilters, isLoading }) {
  return (
    <motion.div 
      className="flex items-center justify-between py-6"
      variants={slideVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-4">
        <AnimatedText>
          <p className="text-sm text-muted-foreground font-light">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <AnimatedSpinner size="sm" />
                Loading...
              </span>
            ) : (
              <>
                <span className="font-medium text-foreground">{count}</span>
                {count !== totalCount && (
                  <span> of <span className="font-medium text-foreground">{totalCount}</span></span>
                )}
                <span> prompt{count !== 1 ? 's' : ''}</span>
              </>
            )}
          </p>
        </AnimatedText>
        
        {hasAdvancedFilters && (
          <motion.div
            className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Filter className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary font-medium">Filtered</span>
          </motion.div>
        )}
      </div>
      
      {hasAdvancedFilters && (
        <AnimatedButton
          onClick={onClearFilters}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-muted/50"
        >
          <X className="w-3 h-3" />
          Clear filters
        </AnimatedButton>
      )}
    </motion.div>
  )
})

/**
 * Animated prompt grid with staggered animations
 */
const PromptGrid = memo<{
  prompts: PromptGalleryProps['prompts']
  onDeletePrompt: (id: string) => void
  onUpdatePrompt: (prompt: PromptGalleryProps['prompts'][0]) => void
  isLoading: boolean
}>(function PromptGrid({ prompts, onDeletePrompt, onUpdatePrompt, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="h-80 bg-muted/30 rounded-2xl skeleton"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <AnimatePresence mode="popLayout">
        {prompts.map((prompt, index) => (
          <motion.div
            key={prompt.id}
            variants={slideVariants}
            layout
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ delay: index * 0.05 }}
          >
            <PromptCardUltra
              prompt={prompt}
              onDelete={onDeletePrompt}
              onUpdate={onUpdatePrompt}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
})

/**
 * Floating search bar with glass morphism
 */
const FloatingSearchBar = memo<{
  onToggleFilters: () => void
  showFilters: boolean
}>(function FloatingSearchBar({ onToggleFilters, showFilters }) {
  return (
    <motion.div
      className="sticky top-4 z-30 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="glass rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">AI Prompt Library</h2>
              <p className="text-xs text-muted-foreground font-light">Discover amazing prompts</p>
            </div>
          </div>
          
          <AnimatedButton
            onClick={onToggleFilters}
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              showFilters 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  )
})

/**
 * Main ultra-modern PromptGallery component
 */
export const PromptGalleryUltra = memo<PromptGalleryProps>(function PromptGalleryUltra({ 
  prompts: initialPrompts 
}) {
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  const {
    prompts,
    searchFilters,
    updateFilters,
    resetFilters,
    deletePromptById,
    updatePrompt,
    filteredCount,
    totalCount,
    isLoading,
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
    <div className="relative">
      {/* Floating Search Bar */}
      <FloatingSearchBar 
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />

      {/* Animated Search Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8 overflow-hidden"
          >
            <div className="glass rounded-2xl p-6 shadow-xl">
              <SearchFilters
                onFilter={handleFilter}
                onAdvancedFilter={handleAdvancedFilter}
                categories={categories}
                tags={tags}
                searchQuery={searchFilters.query || ''}
                selectedCategory={searchFilters.category || 'all'}
                selectedTags={searchFilters.tags || []}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Header */}
      <ResultsHeader
        count={filteredCount}
        totalCount={totalCount}
        hasAdvancedFilters={hasAdvancedFilters}
        onClearFilters={resetFilters}
        isLoading={isLoading}
      />

      {/* Results */}
      <AnimatedContainer className="min-h-[400px]">
        {prompts.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <PromptGrid
            prompts={prompts}
            onDeletePrompt={deletePromptById}
            onUpdatePrompt={updatePrompt}
            isLoading={isLoading}
          />
        )}
      </AnimatedContainer>
    </div>
  )
})

export default PromptGalleryUltra
