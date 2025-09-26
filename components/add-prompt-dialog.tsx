"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface AddPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categories = [
  "content-creation",
  "development",
  "marketing",
  "productivity",
  "social-media",
  "education",
  "general",
]

export function AddPromptDialog({ open, onOpenChange }: AddPromptDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Starting prompt submission...")

    if (!title.trim() || !content.trim() || !category) {
      console.log("[v0] Validation failed - missing required fields")
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const promptData = {
        title: title.trim(),
        description: description.trim() || null,
        content: content.trim(),
        category,
        tags,
        is_public: true, // Force public for anonymous users
        usage_count: 0,
        user_id: null, // Explicitly null for anonymous
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("[v0] Inserting prompt with data:", promptData)

      const { data, error } = await supabase.from("prompts").insert(promptData).select()

      if (error) {
        console.log("[v0] Database error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          stack: error.stack,
        })

        if (error.code === "42501") {
          throw new Error("Database permission denied. Please run the latest RLS policy script.")
        } else if (error.message?.includes("RLS") || error.message?.includes("policy")) {
          throw new Error("Database security policy error. Please ensure RLS policies allow anonymous access.")
        } else {
          throw error
        }
      }

      console.log("[v0] Prompt inserted successfully:", data)

      toast({
        title: "Prompt added",
        description: "Your prompt has been saved successfully.",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setContent("")
      setCategory("")
      setTags([])
      setTagInput("")
      setIsPublic(true)
      onOpenChange(false)

      setTimeout(() => {
        console.log("[v0] Reloading page to show new prompt")
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      console.error("[v0] Error adding prompt:", error)

      let errorMessage = "Failed to save the prompt. Please try again."

      if (error.message?.includes("permission denied") || error.message?.includes("RLS")) {
        errorMessage = "Database permission error. Please run the latest SQL script to fix RLS policies."
      } else if (error.code === "23505") {
        errorMessage = "A prompt with this title already exists."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto smooth-transition minimal-shadow">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold">Add New Prompt</DialogTitle>
          <DialogDescription className="text-base font-extralight">
            Create a new AI prompt to add to your library
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter prompt title"
              required
              className="smooth-transition font-extralight"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this prompt does"
              className="smooth-transition font-extralight"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-medium">
              Category *
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="smooth-transition font-extralight">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="font-extralight">
                    {cat.replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="content" className="text-sm font-medium">
              Prompt Content *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your AI prompt here..."
              rows={6}
              required
              className="smooth-transition font-extralight resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                className="smooth-transition font-extralight"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="smooth-transition bg-transparent"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 smooth-transition hover-lift font-extralight"
                  >
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="smooth-transition font-normal"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="smooth-transition font-normal min-w-[120px]">
              {isLoading ? "Adding..." : "Add Prompt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
