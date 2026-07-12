import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { UltraPremiumSidebar } from '@/components/ultra-premium-sidebar'
import { SidebarProvider, SidebarContentWrapper } from '@/components/sidebar-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'TransitOps — Fleet Operations Dashboard',
  description:
    'Enterprise transport operations management: vehicles, drivers, trips, maintenance, fuel, and reporting.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e3a8a' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

import { DashboardProvider } from '@/components/dashboard-context'
import { AuthProvider } from '@/components/auth-context'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-gradient-dark`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <DashboardProvider>
              <SidebarProvider>
                <div className="flex h-screen overflow-hidden">
                  <UltraPremiumSidebar />
                  <SidebarContentWrapper>
                    {children}
                  </SidebarContentWrapper>
                </div>
              </SidebarProvider>
            </DashboardProvider>
          </AuthProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
