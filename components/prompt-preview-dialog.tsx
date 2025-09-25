"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2 } from "lucide-react"
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

interface PromptPreviewDialogProps {
  prompt: Prompt
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PromptPreviewDialog({ prompt, open, onOpenChange }: PromptPreviewDialogProps) {
  const handleCopyUsage = async () => {
    const supabase = createClient()
    try {
      await supabase
        .from("prompts")
        .update({ usage_count: prompt.usage_count + 1 })
        .eq("id", prompt.id)
      onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-balance">{prompt.title}</DialogTitle>
          {prompt.description && <DialogDescription className="text-pretty">{prompt.description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{prompt.category.replace("-", " ")}</Badge>
            <span className="text-sm text-muted-foreground">Used {prompt.usage_count} times</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="bg-muted p-4 rounded-lg relative group">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-mono pr-12">{prompt.content}</pre>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={prompt.content} size="icon" showText={false} onCopy={handleCopyUsage} />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <CopyButton text={prompt.content} onCopy={handleCopyUsage} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
