'use client'

import { useState, useEffect, Suspense } from 'react'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import '../styles/globals.css'
import Header from '@/app/components/layout/Navbar'
import Footer from './components/layout/Footer'
import ThemeProvider from './components/ThemeProvider'
import AuthModal from './components/auth/AuthModal'
import PageSuspense from './components/ui/PageSuspense'
import { usePathname, useSearchParams } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {isNavigating ? (
                <PageSuspense />
              ) : (
                <Suspense fallback={<PageSuspense />}>
                  {children}
                </Suspense>
              )}
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" />
          <AuthModal />
        </ThemeProvider>
      </body>
    </html>
  )
}
