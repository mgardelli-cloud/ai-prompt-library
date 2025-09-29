/**
 * Ultra-Modern Homepage with sophisticated animations and UX
 */

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/server'
import PromptGalleryUltra from '@/components/prompt-gallery-ultra'
import { Header } from '@/components/header'
import type { Prompt } from '@/lib/types'
import { 
  AnimatedContainer, 
  AnimatedText, 
  AnimatedSpinner 
} from '@/components/ui/animated'

/**
 * Ultra-modern loading component
 */
function UltraLoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative">
        <AnimatedSpinner size="lg" className="text-primary" />
        <motion.div
          className="absolute inset-0 border-2 border-primary/20 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <AnimatedText delay={0.5}>
        <p className="mt-6 text-muted-foreground font-light">Loading amazing prompts...</p>
      </AnimatedText>
    </div>
  )
}

/**
 * Ultra-modern error display
 */
function UltraErrorDisplay({ error }: { error: string }) {
  return (
    <motion.div
      className="mb-12 p-8 glass rounded-3xl border border-destructive/20 shadow-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center shrink-0">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            ⚠️
          </motion.div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-destructive mb-3 text-lg">Connection Issue</h3>
          <p className="text-destructive/80 font-light leading-relaxed mb-4">
            {error}
          </p>
          
          <motion.details 
            className="group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <summary className="text-sm text-destructive/60 cursor-pointer font-medium hover:text-destructive/80 transition-colors">
              What can you do?
            </summary>
            <motion.div 
              className="mt-3 text-sm text-destructive/60 font-light space-y-2 pl-4 border-l-2 border-destructive/20"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p>• Check your internet connection</p>
              <p>• Refresh the page</p>
              <p>• Contact support if the problem persists</p>
            </motion.div>
          </motion.details>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Ultra-modern hero section
 */
function UltraHeroSection() {
  return (
    <AnimatedContainer className="mb-16 text-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl" />
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
        animate={{ 
          x: [0, -40, 0],
          y: [0, 20, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 text-balance tracking-tight">
            <span className="gradient-text">AI Prompt</span>
            <br />
            <span className="text-muted-foreground font-light">Library</span>
          </h1>
        </motion.div>
        
        <AnimatedText delay={0.3}>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed mb-8">
            Discover, save, and organize your favorite AI prompts with our 
            <span className="text-foreground font-medium"> ultra-modern</span> platform
          </p>
        </AnimatedText>
        
        <motion.div
          className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live & Updated</span>
          </div>
          <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>AI-Powered</span>
          </div>
          <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span>Ultra-Modern</span>
          </div>
        </motion.div>
      </div>
    </AnimatedContainer>
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
 * Ultra-modern main page component
 */
export default async function UltraHomePage() {
  const { prompts, error } = await fetchPrompts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 page-transition">
      <Header />
      
      <main className="container mx-auto px-6 py-12 relative">
        {/* Hero Section */}
        <UltraHeroSection />

        {/* Error Display */}
        {error && <UltraErrorDisplay error={error} />}

        {/* Main Content */}
        <Suspense fallback={<UltraLoadingSpinner />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <PromptGalleryUltra prompts={prompts} />
          </motion.div>
        </Suspense>
      </main>
    </div>
  )
}

// Enable static generation for better performance
export const dynamic = 'force-dynamic' // Required for Supabase
export const revalidate = 60 // Revalidate every minute
