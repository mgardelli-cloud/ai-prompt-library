/**
 * Optimized HomePage with improved error handling and performance
 */

import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import PromptGallery from '@/components/prompt-gallery-optimized'
import { Header } from '@/components/header'
import type { Prompt } from '@/lib/types'

/**
 * Loading component for Suspense fallback
 */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

/**
 * Error display component
 */
function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="mb-8 p-6 bg-destructive/5 border border-destructive/10 rounded-2xl">
      <h3 className="font-medium text-destructive mb-3">Database Error</h3>
      <p className="text-sm text-destructive/80 font-extralight leading-relaxed">
        {error}
      </p>
      <details className="mt-4">
        <summary className="text-xs text-destructive/60 cursor-pointer font-medium">
          What can you do?
        </summary>
        <div className="text-xs mt-2 text-destructive/60 font-extralight space-y-1">
          <p>• Check your internet connection</p>
          <p>• Refresh the page</p>
          <p>• Contact support if the problem persists</p>
        </div>
      </details>
    </div>
  )
}

/**
 * Fetch prompts with proper error handling
 */
async function fetchPrompts(): Promise<{ prompts: Prompt[]; error: string | null }> {
  try {
    const supabase = await createClient()
    
    const { data: promptsData, error: promptsError } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })

    if (promptsError) {
      console.error('[HomePage] Error fetching prompts:', promptsError)
      return {
        prompts: [],
        error: promptsError.message || 'Failed to load prompts. Please check the database connection.'
      }
    }

    console.log('[HomePage] Successfully fetched prompts:', promptsData?.length || 0)
    return {
      prompts: promptsData || [],
      error: null
    }
  } catch (err) {
    console.error('[HomePage] Unexpected error:', err)
    return {
      prompts: [],
      error: err instanceof Error ? err.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Main page component
 */
export default async function HomePage() {
  const { prompts, error } = await fetchPrompts()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-semibold text-foreground mb-4 text-balance tracking-tight">
            AI Prompt Library
          </h1>
          <p className="text-xl text-muted-foreground text-pretty font-extralight max-w-2xl mx-auto leading-relaxed">
            Discover, save, and organize your favorite AI prompts
          </p>
        </div>

        {/* Error Display */}
        {error && <ErrorDisplay error={error} />}

        {/* Main Content */}
        <Suspense fallback={<LoadingSpinner />}>
          <PromptGallery prompts={prompts} />
        </Suspense>
      </main>
    </div>
  )
}

// Enable static generation for better performance
export const dynamic = 'force-dynamic' // Required for Supabase
export const revalidate = 60 // Revalidate every minute
