"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  text: string
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
  onCopy?: () => void
}

export function CopyButton({
  text,
  className,
  variant = "outline",
  size = "default",
  showText = true,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "The prompt has been copied to your clipboard.",
      })

      onCopy?.()
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the prompt to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-200",
        copied && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        className,
      )}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {showText && <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>}
    </Button>
  )
}
