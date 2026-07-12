'use client'

import {
  BarChart3Icon,
  FuelIcon,
  LayoutDashboardIcon,
  MapIcon,
  SettingsIcon,
  TruckIcon,
  UsersIcon,
  WrenchIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navGroups = [
  {
    title: 'OPERATIONS',
    items: [
      { title: 'Dashboard', href: '/', icon: LayoutDashboardIcon, badge: 'Live' },
      { title: 'Vehicles', href: '/vehicles', icon: TruckIcon, badge: null },
      { title: 'Drivers', href: '/drivers', icon: UsersIcon, badge: null },
      { title: 'Trips', href: '/trips', icon: MapIcon, badge: 'Active' },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { title: 'Maintenance', href: '/maintenance', icon: WrenchIcon, badge: '3' },
      { title: 'Fuel & Expenses', href: '/expenses', icon: FuelIcon, badge: null },
    ]
  },
  {
    title: 'INSIGHTS',
    items: [
      { title: 'Reports', href: '/reports', icon: BarChart3Icon, badge: 'New' },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { title: 'Settings', href: '/settings', icon: SettingsIcon, badge: null },
    ]
  }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <TruckIcon className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">TransitOps</span>
            <span className="text-xs text-sidebar-foreground/70">Fleet Management</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-semibold tracking-widest">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={isActive}
                        tooltip={item.title}
                        className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                      >
                        <item.icon aria-hidden="true" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            {item.badge}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-xs text-sidebar-foreground/60">TransitOps v2.4.1</p>
      </SidebarFooter>
    </Sidebar>
  )
}
