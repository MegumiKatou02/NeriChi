'use client'

import { useState, useEffect, Suspense } from 'react'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import '../styles/globals.css'
import Navbar from '@/app/components/layout/Navbar'
import Footer from './components/layout/Footer'
import ThemeProvider from './components/ThemeProvider'
import AuthModal from './components/auth/AuthModal'
import PageSuspense from './components/ui/PageSuspense'
import { usePathname, useSearchParams } from 'next/navigation'
import { useUIStore } from '@/app/store/store'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const { isAuthModalOpen } = useUIStore()

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  useEffect(() => {
    document.body.classList.add('animate-fade-in')
    return () => {
      document.body.classList.remove('animate-fade-in')
    }
  }, [])

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-grow pt-16 animate-slide-in">
              {isNavigating ? (
                <PageSuspense />
              ) : (
                <Suspense fallback={<PageSuspense />}>{children}</Suspense>
              )}
            </main>
            <Footer />
            {isAuthModalOpen && <AuthModal />}
          </div>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
