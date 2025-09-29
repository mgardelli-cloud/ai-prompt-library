/**
 * Optimized PromptCard component with modern React patterns
 */

'use client'

import { useState, useCallback, memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, MoreHorizontal, Share2, X } from 'lucide-react'
import { PromptPreviewDialog } from './prompt-preview-dialog'
import { CopyButton } from './copy-button'
import { useToast } from '@/hooks/use-toast'
import type { PromptCardProps } from '@/lib/types'
import { 
  getCategoryColor, 
  formatCategoryName, 
  formatUsageCount,
  truncateText 
} from '@/lib/utils/prompt-utils'
import { deletePrompt, incrementUsageCount, getErrorMessage } from '@/lib/api/prompts'

/**
 * Memoized PromptCard component for optimal performance
 */
export const PromptCard = memo<PromptCardProps>(function PromptCard({ 
  prompt, 
  onDelete,
  onUpdate 
}) {
  const [showPreview, setShowPreview] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toast } = useToast()

  /**
   * Handle copy action with usage tracking
   */
  const handleCopyUsage = useCallback(async () => {
    try {
      await incrementUsageCount(prompt.id)
      onUpdate?.({ ...prompt, usage_count: prompt.usage_count + 1 })
    } catch (error) {
      console.warn('Failed to update usage count:', getErrorMessage(error))
    }
  }, [prompt, onUpdate])

  /**
   * Handle share functionality with fallback
   */
  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: prompt.title,
          text: prompt.description || prompt.title,
          url: window.location.href,
        })
      } else {
        const url = `${window.location.origin}?prompt=${prompt.id}`
        await navigator.clipboard.writeText(url)
        toast({
          title: 'Link copied!',
          description: 'Prompt link has been copied to clipboard.',
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: 'Share failed',
          description: getErrorMessage(error),
          variant: 'destructive',
        })
      }
    } finally {
      setIsMenuOpen(false)
    }
  }, [prompt.id, prompt.title, prompt.description, toast])

  /**
   * Handle delete with confirmation and error handling
   */
  const handleDelete = useCallback(async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${prompt.title}"? This action cannot be undone.`
    )
    
    if (!confirmed) return

    setIsDeleting(true)
    setIsMenuOpen(false)

    try {
      const result = await deletePrompt(prompt.id)
      
      if (result.success) {
        toast({
          title: 'Prompt deleted',
          description: result.message || 'Prompt has been successfully deleted.',
        })
        onDelete?.(prompt.id)
      } else {
        throw new Error(result.error || 'Failed to delete prompt')
      }
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }, [prompt.id, prompt.title, onDelete, toast])

  /**
   * Close menu when clicking outside
   */
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return (
    <>
      <Card className="group h-full flex flex-col bg-card/50 backdrop-blur-sm border-border/50 transition-colors hover:bg-card/70">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-medium text-foreground line-clamp-2 text-balance leading-snug">
                {prompt.title}
              </CardTitle>
              {prompt.description && (
                <CardDescription className="mt-2 line-clamp-2 text-pretty font-extralight leading-relaxed">
                  {truncateText(prompt.description, 150)}
                </CardDescription>
              )}
            </div>
            
            {/* Action Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="opacity-60 group-hover:opacity-100 transition-opacity duration-200 hover:bg-muted/50 shrink-0"
                disabled={isDeleting}
                onClick={handleMenuToggle}
                aria-label="More options"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              
              {isMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-[9998] bg-transparent" 
                    onClick={handleMenuClose}
                    aria-hidden="true"
                  />
                  
                  {/* Menu */}
                  <div 
                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md shadow-xl dark:shadow-2xl py-1 z-[9999] animate-in fade-in duration-150"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <button
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center text-gray-900 dark:text-gray-100 transition-colors"
                      onClick={() => {
                        setShowPreview(true)
                        handleMenuClose()
                      }}
                      role="menuitem"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </button>
                    
                    <button
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center text-gray-900 dark:text-gray-100 transition-colors"
                      onClick={handleShare}
                      role="menuitem"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </button>
                    
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    
                    <button
                      className="w-full px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/30 text-sm flex items-center text-red-600 dark:text-red-400 disabled:opacity-50 transition-colors"
                      disabled={isDeleting}
                      onClick={handleDelete}
                      role="menuitem"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {isDeleting ? 'Deleting...' : 'Delete Prompt'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Category and Usage */}
          <div className="flex items-center gap-3 mt-4">
            <Badge
              variant="secondary"
              className={`${getCategoryColor(prompt.category)} font-extralight`}
            >
              {formatCategoryName(prompt.category)}
            </Badge>
            <span className="text-xs text-muted-foreground font-extralight">
              {formatUsageCount(prompt.usage_count)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {prompt.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs font-extralight hover:bg-muted/50 transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs font-extralight"
                title={`Additional tags: ${prompt.tags.slice(3).join(', ')}`}
              >
                +{prompt.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Copy Button */}
          <div className="mt-auto">
            <CopyButton 
              text={prompt.content} 
              className="w-full" 
              onCopy={handleCopyUsage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <PromptPreviewDialog 
        prompt={prompt} 
        open={showPreview} 
        onOpenChange={setShowPreview} 
      />
    </>
  )
})

export default PromptCard
