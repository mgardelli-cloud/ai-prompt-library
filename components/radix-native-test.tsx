"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { MoreHorizontal, Eye, Share2, X } from "lucide-react"

export function RadixNativeTest() {
  return (
    <div className="p-6 border-2 border-red-500 rounded-lg bg-white">
      <h3 className="mb-4 font-bold text-lg">🔴 RADIX NATIVE TEST (No Custom Wrappers)</h3>
      
      <div className="space-y-4">
        {/* Test 1: Minimal Radix Implementation */}
        <div>
          <h4 className="text-sm font-medium mb-2">Test 1: Minimal Native Radix</h4>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button 
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => console.log("🔴 Native trigger clicked")}
              >
                <MoreHorizontal className="w-4 h-4 inline mr-2" />
                Native Dropdown
              </button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="bg-white border border-gray-300 rounded-md shadow-lg p-1 z-[99999]"
                sideOffset={5}
              >
                <DropdownMenu.Item 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm"
                  onClick={() => console.log("🔴 Native item 1 clicked")}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Native Item 1
                </DropdownMenu.Item>
                
                <DropdownMenu.Item 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm"
                  onClick={() => console.log("🔴 Native item 2 clicked")}
                >
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Native Item 2
                </DropdownMenu.Item>
                
                <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                
                <DropdownMenu.Item 
                  className="px-3 py-2 hover:bg-red-100 cursor-pointer rounded text-sm text-red-600"
                  onClick={() => console.log("🔴 Native delete clicked")}
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Native Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Test 2: Icon-only button */}
        <div>
          <h4 className="text-sm font-medium mb-2">Test 2: Icon-only Native</h4>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button 
                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
                onClick={() => console.log("🔴 Native icon trigger clicked")}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="bg-white border border-gray-300 rounded-md shadow-lg p-1 z-[99999] min-w-[120px]"
                align="end"
                sideOffset={5}
              >
                <DropdownMenu.Item 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm flex items-center"
                  onClick={() => console.log("🔴 Native icon item 1")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenu.Item>
                
                <DropdownMenu.Item 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm flex items-center"
                  onClick={() => console.log("🔴 Native icon item 2")}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Test 3: Controlled state */}
        <div>
          <h4 className="text-sm font-medium mb-2">Test 3: Controlled Native</h4>
          <DropdownMenu.Root 
            onOpenChange={(open) => console.log("🔴 Native state changed:", open)}
          >
            <DropdownMenu.Trigger asChild>
              <button 
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Controlled Native
              </button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="bg-white border border-gray-300 rounded-md shadow-lg p-1 z-[99999]"
                sideOffset={5}
              >
                <DropdownMenu.Item 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm"
                  onClick={() => console.log("🔴 Controlled item clicked")}
                >
                  Controlled Item
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 bg-yellow-100 p-2 rounded">
        🔍 <strong>Istruzioni:</strong> Apri la console del browser e testa questi dropdown. 
        Se anche questi non funzionano, il problema è nell'ambiente/configurazione generale.
      </div>
    </div>
  )
}
