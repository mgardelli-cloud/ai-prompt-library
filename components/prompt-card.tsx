"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: prompt.description || prompt.title,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy URL to clipboard
      const url = `${window.location.origin}?prompt=${prompt.id}`
      await navigator.clipboard.writeText(url)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "content-creation": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      development: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      marketing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      productivity: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "social-media": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      education: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      general: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    }
    return colors[category] || colors.general
  }

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 text-balance">
                {prompt.title}
              </CardTitle>
              {prompt.description && (
                <CardDescription className="mt-1 line-clamp-2 text-pretty">{prompt.description}</CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowPreview(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Badge variant="secondary" className={getCategoryColor(prompt.category)}>
              {prompt.category.replace("-", " ")}
            </Badge>
            <span className="text-xs text-muted-foreground">Used {prompt.usage_count} times</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-1 mb-4">
            {prompt.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{prompt.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="mt-auto">
            <CopyButton text={prompt.content} className="w-full" onCopy={handleCopyUsage} />
          </div>
        </CardContent>
      </Card>

      <PromptPreviewDialog prompt={prompt} open={showPreview} onOpenChange={setShowPreview} />
    </>
  )
}
