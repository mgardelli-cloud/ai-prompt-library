"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { AddPromptDialog } from "./add-prompt-dialog"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm smooth-transition">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center smooth-transition hover:bg-primary/20">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-xl text-foreground tracking-tight">AI Prompt Library</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 hover-lift smooth-transition font-medium"
              size="lg"
            >
              <Plus className="w-4 h-4" />
              <span className="font-normal">Add Prompt</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <AddPromptDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </header>
  )
}
