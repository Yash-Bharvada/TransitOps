'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3Icon,
  FuelIcon,
  LayoutDashboardIcon,
  MapIcon,
  SettingsIcon,
  TruckIcon,
  UsersIcon,
  WrenchIcon,
  Menu,
  X,
  ChevronRight,
  LogOutIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/sidebar-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { useDashboard } from '@/components/dashboard-context'
import { useAuth } from '@/components/auth-context'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  badgeColor?: 'primary' | 'success' | 'warning' | 'error' | 'info'
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'OPERATIONS',
    items: [
      { title: 'Dashboard', href: '/', icon: LayoutDashboardIcon, badge: 'Live' },
      { title: 'Vehicles', href: '/vehicles', icon: TruckIcon },
      { title: 'Drivers', href: '/drivers', icon: UsersIcon },
      { title: 'Trips', href: '/trips', icon: MapIcon, badge: 'Active' },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { title: 'Maintenance', href: '/maintenance', icon: WrenchIcon, badge: 3 },
      { title: 'Fuel & Expenses', href: '/expenses', icon: FuelIcon },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { title: 'Reports', href: '/reports', icon: BarChart3Icon, badge: 'New' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { title: 'Settings', href: '/settings', icon: SettingsIcon },
    ],
  },
]

const badgeColorMap = {
  primary: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white',
  success: 'bg-gradient-to-r from-success-500 to-emerald-400 text-white',
  warning: 'bg-gradient-to-r from-warning-500 to-amber-400 text-white',
  error: 'bg-gradient-to-r from-error-500 to-red-400 text-white',
  info: 'bg-gradient-to-r from-info-500 to-cyan-400 text-white',
}

export function UltraPremiumSidebar() {
  const pathname = usePathname()
  const { isOpen, isMobile, mounted, toggle, close } = useSidebar()
  const { dashboardData } = useDashboard()
  const { logout } = useAuth()

  const activeTrips = dashboardData ? ((dashboardData.trips?.pending || 0) + (dashboardData.trips?.dispatched || 0)) : null;
  const pendingMaintenance = dashboardData?.maintenance?.pending;

  // Use stable SSR-safe defaults before mount to prevent hydration mismatch
  const effectiveIsOpen = mounted ? isOpen : true
  const effectiveIsMobile = mounted ? isMobile : false

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggle}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all duration-300 shadow-premium-lg"
        suppressHydrationWarning
      >
        {effectiveIsOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {effectiveIsOpen && effectiveIsMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          `
            fixed left-0 top-0 h-screen z-40
            bg-background border-r border-border
            transition-all duration-500 ease-out
            flex flex-col
            shadow-premium-2xl
          `,
          effectiveIsOpen ? 'w-72' : 'w-20',
          effectiveIsMobile && !effectiveIsOpen && '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between group">
          <Link href="/" className="flex items-center gap-3 flex-1 min-w-0">
            {/* Logo */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 flex items-center justify-center shadow-glow-primary group-hover:shadow-glow-accent transition-all duration-300">
              <TruckIcon className="size-6 text-white" />
            </div>

            {/* Brand Text */}
            {effectiveIsOpen && (
              <div className="min-w-0 animate-fade-in-scale">
                <p className="text-foreground font-bold text-lg truncate">TransitOps</p>
                <p className="text-muted-foreground text-xs truncate">Fleet Management</p>
              </div>
            )}
          </Link>

          {/* Toggle Button */}
          <button
            onClick={toggle}
            className="hidden md:flex p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 text-muted-foreground hover:text-foreground ml-2"
          >
            <ChevronRight
              className={cn(
                'size-5 transition-transform duration-500',
                !effectiveIsOpen && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              {/* Group Label */}
              {effectiveIsOpen && (
                <p className="text-muted-foreground text-xs font-bold tracking-widest mb-3 px-3 animate-fade-in-scale">
                  {group.title}
                </p>
              )}

              {/* Group Items */}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  let displayBadge = item.badge;
                  if (item.title === 'Trips' && activeTrips !== null) displayBadge = activeTrips > 0 ? activeTrips : undefined;
                  if (item.title === 'Maintenance' && pendingMaintenance !== undefined) displayBadge = pendingMaintenance > 0 ? pendingMaintenance : undefined;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => effectiveIsMobile && close()}
                      className={cn(
                        `
                          relative flex items-center gap-3 px-3 py-3 rounded-lg
                          transition-all duration-300 group/item
                          overflow-hidden
                        `,
                        isActive
                          ? `
                            bg-gradient-to-r from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20
                            text-primary-700 dark:text-white
                            border-l-2 border-primary-500
                            shadow-sm dark:shadow-glow-primary
                          `
                          : `
                            text-muted-foreground hover:text-foreground
                            hover:bg-black/5 dark:hover:bg-white/5
                          `
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary-400 to-accent-400 animate-pulse-glow" />
                      )}

                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <Icon
                          className={cn(
                            'size-5 transition-all duration-300',
                            isActive && 'group-hover/item:scale-110'
                          )}
                        />
                      </div>

                      {/* Label */}
                      {effectiveIsOpen && (
                        <span className="flex-1 text-sm font-medium truncate animate-fade-in-scale">
                          {item.title}
                        </span>
                      )}

                      {/* Badge */}
                      {displayBadge && effectiveIsOpen && (
                        <div
                          className={cn(
                            'flex-shrink-0 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap',
                            badgeColorMap[item.badgeColor || 'primary'],
                            'animate-fade-in-scale'
                          )}
                        >
                          {displayBadge}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-4">
          <ThemeToggle isOpen={effectiveIsOpen} />
          
          {effectiveIsOpen ? (
            <div className="animate-fade-in-scale">
              <button 
                onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mb-4"
              >
                <LogOutIcon className="size-4" />
                <span>Sign Out</span>
              </button>

              <p className="text-muted-foreground text-xs font-bold tracking-widest mb-2">
                STATUS
              </p>
              <div className="flex items-center gap-2 text-foreground text-xs">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                <span>System Operational</span>
              </div>
              <p className="text-muted-foreground/60 text-xs mt-2">v2.4.1</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={logout}
                className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOutIcon className="size-5" />
              </button>
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
