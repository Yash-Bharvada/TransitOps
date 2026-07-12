'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface SidebarContextValue {
  isOpen: boolean
  isMobile: boolean
  mounted: boolean
  toggle: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextValue>({
  isOpen: true,
  isMobile: false,
  mounted: false,
  toggle: () => {},
  close: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setIsOpen(false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isMobile,
        mounted,
        toggle: () => setIsOpen((v: boolean) => !v),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function SidebarContentWrapper({ children }: { children: ReactNode }) {
  const { isOpen, mounted } = useSidebar()
  const pathname = usePathname()

  // Use stable SSR default (sidebar open = ml-72) to avoid hydration mismatch
  const effectiveIsOpen = mounted ? isOpen : true

  if (pathname === '/login' || pathname === '/signup') {
    return (
      <main className="flex-1 min-w-0 h-screen overflow-y-auto no-scrollbar">
        {children}
      </main>
    )
  }

  return (
    <main
      className={`flex-1 min-w-0 h-screen overflow-y-auto no-scrollbar transition-all duration-500 ease-out p-4 md:p-6 pt-16 md:pt-6 ${
        effectiveIsOpen ? 'md:ml-72' : 'md:ml-20'
      }`}
    >
      {children}
    </main>
  )
}
