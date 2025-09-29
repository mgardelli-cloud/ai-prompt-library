"use client"

import { useEffect, useRef } from "react"

export function HtmlNativeTest() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create a simple HTML dropdown with vanilla JavaScript
    const container = containerRef.current
    const button = container.querySelector('.dropdown-button') as HTMLButtonElement
    const menu = container.querySelector('.dropdown-menu') as HTMLDivElement

    if (!button || !menu) return

    const toggleMenu = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("🟢 HTML Native button clicked")
      
      const isVisible = menu.style.display === 'block'
      menu.style.display = isVisible ? 'none' : 'block'
      
      console.log("🟢 Menu visibility:", menu.style.display)
    }

    const hideMenu = (e: Event) => {
      if (!menu.contains(e.target as Node) && e.target !== button) {
        menu.style.display = 'none'
      }
    }

    button.addEventListener('click', toggleMenu)
    document.addEventListener('click', hideMenu)

    // Add click handlers to menu items
    const items = menu.querySelectorAll('.menu-item')
    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        console.log(`🟢 HTML Native menu item ${index + 1} clicked`)
        menu.style.display = 'none'
      })
    })

    return () => {
      button.removeEventListener('click', toggleMenu)
      document.removeEventListener('click', hideMenu)
      items.forEach((item, index) => {
        item.removeEventListener('click', () => {})
      })
    }
  }, [])

  return (
    <div ref={containerRef} className="p-6 border-2 border-green-500 rounded-lg bg-white">
      <h3 className="mb-4 font-bold text-lg">🟢 HTML NATIVE TEST (No React/Radix)</h3>
      
      <div className="relative inline-block">
        <button 
          className="dropdown-button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          HTML Native Dropdown ▼
        </button>
        
        <div 
          className="dropdown-menu absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-[99999]"
          style={{ display: 'none' }}
        >
          <div className="py-1">
            <button className="menu-item block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
              HTML Item 1
            </button>
            <button className="menu-item block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
              HTML Item 2
            </button>
            <hr className="my-1 border-gray-200" />
            <button className="menu-item block w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-600">
              HTML Delete
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 bg-yellow-100 p-2 rounded">
        🔍 <strong>Test HTML Puro:</strong> Se questo funziona ma Radix no, il problema è con Radix/React.
        Se anche questo non funziona, il problema è nell'ambiente browser/CSS.
      </div>
    </div>
  )
}
