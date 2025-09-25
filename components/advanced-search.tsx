"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react"

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  categories: string[]
  tags: string[]
}

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

export function AdvancedSearch({ onSearch, categories, tags }: AdvancedSearchProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
    tags: [],
    includeContent: true,
    includeDescription: true,
    includeTags: true,
    sortBy: "created_at",
    sortOrder: "desc",
    isPublicOnly: false,
  })

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag]
    setFilters({ ...filters, tags: newTags })
  }

  const handleSearch = () => {
    onSearch(filters)
    setOpen(false)
  }

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      query: "",
      category: "all",
      tags: [],
      includeContent: true,
      includeDescription: true,
      includeTags: true,
      sortBy: "created_at",
      sortOrder: "desc",
      isPublicOnly: false,
    }
    setFilters(defaultFilters)
    onSearch(defaultFilters)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
          <DialogDescription>Customize your search with advanced filters</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query</Label>
            <Input
              id="search-query"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="Enter search terms..."
            />
          </div>

          <div className="space-y-2">
            <Label>Search In</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-content"
                  checked={filters.includeContent}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeContent: !!checked })}
                />
                <Label htmlFor="include-content" className="text-sm">
                  Prompt content
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-description"
                  checked={filters.includeDescription}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeDescription: !!checked })}
                />
                <Label htmlFor="include-description" className="text-sm">
                  Description
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-tags"
                  checked={filters.includeTags}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeTags: !!checked })}
                />
                <Label htmlFor="include-tags" className="text-sm">
                  Tags
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
              <SelectTrigger>
                <SelectValue />
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
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value: any) => setFilters({ ...filters, sortBy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Created</SelectItem>
                  <SelectItem value="usage_count">Usage Count</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value: any) => setFilters({ ...filters, sortOrder: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="public-only"
              checked={filters.isPublicOnly}
              onCheckedChange={(checked) => setFilters({ ...filters, isPublicOnly: !!checked })}
            />
            <Label htmlFor="public-only" className="text-sm">
              Show public prompts only
            </Label>
          </div>

          <div className="flex justify-between gap-2 pt-4">
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSearch}>Apply Filters</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
