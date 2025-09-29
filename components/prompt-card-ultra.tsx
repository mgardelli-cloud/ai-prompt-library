/**
 * Ultra-Modern PromptCard with sophisticated animations and UX
 */

'use client'

import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, MoreHorizontal, Share2, X, Copy, Check } from 'lucide-react'
import { PromptPreviewDialog } from './prompt-preview-dialog'
import { useToast } from '@/hooks/use-toast'
import type { PromptCardProps } from '@/lib/types'
import { 
  getCategoryColor, 
  formatCategoryName, 
  formatUsageCount,
  truncateText 
} from '@/lib/utils/prompt-utils'
import { deletePrompt, incrementUsageCount, getErrorMessage } from '@/lib/api/prompts'
import { 
  AnimatedCard, 
  AnimatedButton, 
  AnimatedMenu, 
  AnimatedBadge,
  AnimatedText 
} from '@/components/ui/animated'

/**
 * Ultra-modern animated prompt card
 */
export const PromptCardUltra = memo<PromptCardProps>(function PromptCardUltra({ 
  prompt, 
  onDelete,
  onUpdate 
}) {
  const [showPreview, setShowPreview] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()

  /**
   * Handle copy with visual feedback
   */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      setIsCopied(true)
      
      // Increment usage count
      await incrementUsageCount(prompt.id)
      onUpdate?.({ ...prompt, usage_count: prompt.usage_count + 1 })
      
      // Reset copied state
      setTimeout(() => setIsCopied(false), 2000)
      
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard',
      })
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    }
  }, [prompt, onUpdate, toast])

  /**
   * Handle share with native API fallback
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
   * Handle delete with smooth animation
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
          title: 'Deleted',
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

  return (
    <>
      <AnimatedCard
        className="group relative overflow-hidden bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm border-border/50 hover:border-border transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layout
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <Card className="relative bg-transparent border-none shadow-none h-full flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <AnimatedText delay={0.1}>
                  <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 text-balance leading-snug">
                    {prompt.title}
                  </CardTitle>
                </AnimatedText>
                
                {prompt.description && (
                  <AnimatedText delay={0.2}>
                    <CardDescription className="mt-2 line-clamp-2 text-pretty font-light leading-relaxed">
                      {truncateText(prompt.description, 150)}
                    </CardDescription>
                  </AnimatedText>
                )}
              </div>
              
              {/* Action Menu */}
              <div className="relative">
                <AnimatedButton
                  variant="subtle"
                  className="opacity-60 group-hover:opacity-100 transition-opacity duration-300 hover:bg-muted/50 rounded-full p-2 shrink-0"
                  disabled={isDeleting}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="More options"
                  aria-expanded={isMenuOpen}
                >
                  <motion.div
                    animate={{ rotate: isMenuOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </motion.div>
                </AnimatedButton>
                
                <AnimatedMenu
                  isOpen={isMenuOpen}
                  className="right-0 top-full mt-2 w-48 bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl py-2 z-50"
                >
                  <motion.button
                    className="w-full px-4 py-2 text-left hover:bg-muted/50 text-sm flex items-center gap-3 transition-colors rounded-lg mx-2"
                    onClick={() => {
                      setShowPreview(true)
                      setIsMenuOpen(false)
                    }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span>Preview</span>
                  </motion.button>
                  
                  <motion.button
                    className="w-full px-4 py-2 text-left hover:bg-muted/50 text-sm flex items-center gap-3 transition-colors rounded-lg mx-2"
                    onClick={handleShare}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                    <span>Share</span>
                  </motion.button>
                  
                  <div className="h-px bg-border/50 my-2 mx-4" />
                  
                  <motion.button
                    className="w-full px-4 py-2 text-left hover:bg-destructive/10 text-sm flex items-center gap-3 text-destructive transition-colors rounded-lg mx-2 disabled:opacity-50"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-4 h-4" />
                    <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                  </motion.button>
                </AnimatedMenu>

                {/* Backdrop */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      className="fixed inset-0 z-40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsMenuOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Category and Usage */}
            <motion.div 
              className="flex items-center gap-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatedBadge className={`${getCategoryColor(prompt.category)} font-light text-xs px-3 py-1 rounded-full`}>
                {formatCategoryName(prompt.category)}
              </AnimatedBadge>
              
              <span className="text-xs text-muted-foreground font-light">
                {formatUsageCount(prompt.usage_count)}
              </span>
            </motion.div>
          </CardHeader>

          <CardContent className="pt-0 flex-1 flex flex-col">
            {/* Tags */}
            <motion.div 
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {prompt.tags.slice(0, 3).map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Badge
                    variant="outline"
                    className="text-xs font-light hover:bg-muted/50 transition-colors cursor-default border-border/50"
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
              
              {prompt.tags.length > 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Badge 
                    variant="outline" 
                    className="text-xs font-light border-border/50 cursor-default"
                    title={`Additional tags: ${prompt.tags.slice(3).join(', ')}`}
                  >
                    +{prompt.tags.length - 3}
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            {/* Copy Button */}
            <motion.div 
              className="mt-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AnimatedButton
                onClick={handleCopy}
                className="w-full bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground rounded-xl py-3 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={isDeleting}
              >
                <motion.div
                  className="flex items-center justify-center gap-2"
                  animate={{ scale: isCopied ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Prompt</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatedButton>
            </motion.div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Preview Dialog */}
      <PromptPreviewDialog 
        prompt={prompt} 
        open={showPreview} 
        onOpenChange={setShowPreview} 
      />
    </>
  )
})

export default PromptCardUltra
