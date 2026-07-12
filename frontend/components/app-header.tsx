'use client'

import { LogOutIcon, MoonIcon, SearchIcon, SettingsIcon, SunIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function AppHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-card px-4 md:gap-4">
      <SidebarTrigger className="-ml-1" />
      <div className="hidden max-w-md flex-1 md:block lg:mx-auto">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Search vehicles, drivers, trips..."
            aria-label="Search vehicles, drivers, trips"
          />
        </InputGroup>
      </div>
      <div className="ml-auto flex items-center gap-1 md:ml-0">
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
          <SearchIcon />
        </Button>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle dark mode"
          >
            {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    JD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">Jordan Diaz</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <div className="flex flex-col gap-1 px-2 py-1.5">
              <p className="text-sm font-medium">Jordan Diaz</p>
              <p className="text-xs text-muted-foreground">Fleet Manager</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/settings" className="flex w-full" />}>
                <UserIcon aria-hidden="true" className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/settings" className="flex w-full" />}>
                <SettingsIcon aria-hidden="true" className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {}} variant="destructive" className="text-red-600 dark:text-red-400">
                <LogOutIcon aria-hidden="true" className="mr-2 size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
