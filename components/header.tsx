"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { AddPromptDialog } from "./add-prompt-dialog"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">AI Prompt Library</span>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Prompt
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <AddPromptDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </header>
  )
}
