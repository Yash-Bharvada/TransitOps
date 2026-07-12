'use client'

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ isOpen }: { isOpen: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // To prevent hydration mismatch, we wait until mounted to render the exact icon
  if (!mounted) {
    return (
      <div className={cn("flex items-center p-2 rounded-lg text-muted-foreground/50", isOpen ? "justify-start w-full gap-3" : "justify-center")}>
        <div className="size-5" />
        {isOpen && <span className="text-sm font-medium">Theme</span>}
      </div>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 text-muted-foreground hover:text-foreground group",
        isOpen ? "justify-start w-full gap-3" : "justify-center"
      )}
      title="Toggle Theme"
    >
      <div className="relative size-5 flex items-center justify-center flex-shrink-0">
        {isDark ? (
           <Sun className="size-5 transition-transform group-hover:rotate-90" />
        ) : (
           <Moon className="size-5 transition-transform group-hover:-rotate-12" />
        )}
      </div>
      {isOpen && (
        <span className="text-sm font-medium animate-fade-in-scale whitespace-nowrap">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  )
}
