"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Share2, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { PromptPreviewDialog } from "./prompt-preview-dialog"
import { CopyButton } from "./copy-button"
import { createClient } from "@/lib/supabase/client"

interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  category: string
  tags: string[]
  created_at: string
  usage_count: number
  is_public: boolean
}

interface PromptCardProps {
  prompt: Prompt
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCopyUsage = async () => {
    const supabase = createClient()
    try {
      await supabase
        .from("prompts")
        .update({ usage_count: prompt.usage_count + 1 })
        .eq("id", prompt.id)
    } catch (error) {
      console.error("Error updating usage count:", error)
    }
  }

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: prompt.title,
          text: prompt.description || prompt.title,
          url: window.location.href,
        })
      } else {
        // Fallback: copy URL to clipboard
        const url = `${window.location.origin}?prompt=${prompt.id}`
        await navigator.clipboard.writeText(url)
      }
    } catch (error) {
      console.error("Error sharing prompt:", error)
      // User cancelled sharing or other error
    }
  }, [prompt.id, prompt.title, prompt.description])

  const handleDelete = useCallback(async () => {
    try {
      if (!confirm(`Are you sure you want to delete "${prompt.title}"? This action cannot be undone.`)) {
        return
      }

      setIsDeleting(true)
      const supabase = createClient()

      console.log("[v0] Deleting prompt with ID:", prompt.id)

      const { error } = await supabase.from("prompts").delete().eq("id", prompt.id)

      if (error) {
        console.error("[v0] Error deleting prompt:", error)
        alert("Failed to delete prompt. Please try again.")
      } else {
        console.log("[v0] Prompt deleted successfully")
        // Reload the page to refresh the prompt list
        window.location.reload()
      }
    } catch (error) {
      console.error("[v0] Unexpected error deleting prompt:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }, [prompt.id, prompt.title])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "content-creation": "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
      development: "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300",
      marketing: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
      productivity: "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
      "social-media": "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
      education: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
      general: "bg-gray-50 text-gray-700 dark:bg-gray-950/50 dark:text-gray-300",
    }
    return colors[category] || colors.general
  }

  return (
    <>
      <Card className="group hover-lift smooth-transition h-full flex flex-col bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-medium text-foreground line-clamp-2 text-balance leading-snug">
                {prompt.title}
              </CardTitle>
              {prompt.description && (
                <CardDescription className="mt-2 line-clamp-2 text-pretty font-extralight leading-relaxed">
                  {prompt.description}
                </CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-60 group-hover:opacity-100 transition-opacity duration-200 hover:bg-muted/50 shrink-0 hover:opacity-100"
                  disabled={isDeleting}
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48" sideOffset={8}>
                <DropdownMenuItem
                  onClick={() => {
                    console.log("[v0] Preview clicked")
                    setShowPreview(true)
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    console.log("[v0] Share clicked")
                    handleShare()
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    console.log("[v0] Delete clicked")
                    handleDelete()
                  }}
                  className="text-destructive focus:text-destructive"
                  disabled={isDeleting}
                >
                  <X className="w-4 h-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete Prompt"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Badge
              variant="secondary"
              className={`${getCategoryColor(prompt.category)} smooth-transition font-extralight`}
            >
              {prompt.category.replace("-", " ")}
            </Badge>
            <span className="text-xs text-muted-foreground font-extralight">Used {prompt.usage_count} times</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-6">
            {prompt.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs smooth-transition font-extralight hover:bg-muted/50"
              >
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 3 && (
              <Badge variant="outline" className="text-xs smooth-transition font-extralight">
                +{prompt.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="mt-auto">
            <CopyButton text={prompt.content} className="w-full smooth-transition" onCopy={handleCopyUsage} />
          </div>
        </CardContent>
      </Card>

      <PromptPreviewDialog prompt={prompt} open={showPreview} onOpenChange={setShowPreview} />
    </>
  )
}
