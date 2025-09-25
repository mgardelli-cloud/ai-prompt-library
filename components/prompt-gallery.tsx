"use client"

import { useState, useMemo } from "react"
import { PromptCard } from "./prompt-card"
import { SearchFilters } from "./search-filters"
import { Search } from "lucide-react"

interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  category: string
  tags: string[]
  created_at: string
  updated_at: string
  usage_count: number
  is_public: boolean
}

interface PromptGalleryProps {
  prompts: Prompt[]
}

interface AdvancedFilters {
  query: string
  category: string
  tags: string[]
  includeContent: boolean
  includeDescription: boolean
  includeTags: boolean
  sortBy: "created_at" | "usage_count" | "title"
  sortOrder: "asc" | "desc"
  isPublicOnly: boolean
}

export function PromptGallery({ prompts }: PromptGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters | null>(null)

  // Get unique categories and tags
  const categories = Array.from(new Set(prompts.map((p) => p.category)))
  const allTags = Array.from(new Set(prompts.flatMap((p) => p.tags)))

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let filtered = prompts

    // Use advanced filters if available, otherwise use basic filters
    const filters = advancedFilters || {
      query: searchQuery,
      category: selectedCategory,
      tags: selectedTags,
      includeContent: true,
      includeDescription: true,
      includeTags: true,
      sortBy: "created_at" as const,
      sortOrder: "desc" as const,
      isPublicOnly: false,
    }

    // Filter by search query
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter((prompt) => {
        const matchTitle = prompt.title.toLowerCase().includes(query)
        const matchDescription = filters.includeDescription && prompt.description?.toLowerCase().includes(query)
        const matchContent = filters.includeContent && prompt.content.toLowerCase().includes(query)
        const matchTags = filters.includeTags && prompt.tags.some((tag) => tag.toLowerCase().includes(query))

        return matchTitle || matchDescription || matchContent || matchTags
      })
    }

    // Filter by category
    if (filters.category !== "all") {
      filtered = filtered.filter((prompt) => prompt.category === filters.category)
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter((prompt) => filters.tags.every((tag) => prompt.tags.includes(tag)))
    }

    // Filter by public only
    if (filters.isPublicOnly) {
      filtered = filtered.filter((prompt) => prompt.is_public)
    }

    // Sort prompts
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "usage_count":
          comparison = a.usage_count - b.usage_count
          break
        case "created_at":
        default:
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }

      return filters.sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [prompts, searchQuery, selectedCategory, selectedTags, advancedFilters])

  // Basic filter handler
  const handleFilter = (query: string, category: string, tags: string[]) => {
    setSearchQuery(query)
    setSelectedCategory(category)
    setSelectedTags(tags)
    setAdvancedFilters(null) // Clear advanced filters when using basic search
  }

  // Advanced filter handler
  const handleAdvancedFilter = (filters: AdvancedFilters) => {
    setAdvancedFilters(filters)
    // Update basic filter states for UI consistency
    setSearchQuery(filters.query)
    setSelectedCategory(filters.category)
    setSelectedTags(filters.tags)
  }

  return (
    <div className="space-y-6">
      <SearchFilters
        onFilter={handleFilter}
        onAdvancedFilter={handleAdvancedFilter}
        categories={categories}
        tags={allTags}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""} found
        </p>
        {advancedFilters && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Advanced filters active</span>
            <button onClick={() => setAdvancedFilters(null)} className="text-xs text-primary hover:underline">
              Clear
            </button>
          </div>
        )}
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No prompts found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  )
}
