"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { AdvancedSearch } from "./advanced-search"

interface SearchFilters {
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

interface SearchFiltersProps {
  onFilter: (query: string, category: string, tags: string[]) => void
  onAdvancedFilter?: (filters: SearchFilters) => void
  categories: string[]
  tags: string[]
  searchQuery: string
  selectedCategory: string
  selectedTags: string[]
}

export function SearchFilters({
  onFilter,
  onAdvancedFilter,
  categories,
  tags,
  searchQuery,
  selectedCategory,
  selectedTags,
}: SearchFiltersProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleSearch = (query: string) => {
    setLocalQuery(query)
    onFilter(query, selectedCategory, selectedTags)
  }

  const handleCategoryChange = (category: string) => {
    onFilter(localQuery, category, selectedTags)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    onFilter(localQuery, selectedCategory, newTags)
  }

  const clearFilters = () => {
    setLocalQuery("")
    onFilter("", "all", [])
  }

  const handleAdvancedSearch = (filters: SearchFilters) => {
    if (onAdvancedFilter) {
      onAdvancedFilter(filters)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search prompts..."
            value={localQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AdvancedSearch onSearch={handleAdvancedSearch} categories={categories} tags={tags} />

        {(localQuery || selectedCategory !== "all" || selectedTags.length > 0) && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Filter by tags:</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
