"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Share2, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

export function DropdownTest() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="mb-4">Dropdown Test Component</h3>
      
      {/* Test 1: Controlled dropdown */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Test 1: Controlled</h4>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
              Controlled Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => console.log("Item 1 clicked")}>
                <Eye className="w-4 h-4 mr-2" />
                Item 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Item 2 clicked")}>
                <Share2 className="w-4 h-4 mr-2" />
                Item 2
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log("Item 3 clicked")}>
                <X className="w-4 h-4 mr-2" />
                Item 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>

      {/* Test 2: Uncontrolled dropdown */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Test 2: Uncontrolled</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
              Uncontrolled Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => console.log("Uncontrolled Item 1")}>
                <Eye className="w-4 h-4 mr-2" />
                Uncontrolled Item 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Uncontrolled Item 2")}>
                <Share2 className="w-4 h-4 mr-2" />
                Uncontrolled Item 2
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>

      {/* Test 3: Icon-only button like in PromptCard */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Test 3: Icon-only (like PromptCard)</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-60 hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log("Icon menu item 1")}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Icon menu item 2")}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log("Icon menu item 3")}>
                <X className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>

      <div className="text-xs text-muted-foreground">
        Open browser console to see click events
      </div>
    </div>
  )
}
