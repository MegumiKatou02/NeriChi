import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import '../styles/globals.css'
import Navbar from '@/app/components/layout/Navbar'
import Footer from './components/layout/Footer'
import ThemeProvider from './components/ThemeProvider'
import UIHandler from './components/UIHandler'
import NavigationHandler from './components/NavigationHandler'
import { Suspense } from 'react'
import PageSuspense from './components/ui/PageSuspense'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-grow pt-16 animate-slide-in">
              <Suspense fallback={<PageSuspense />}>
                <NavigationHandler>{children}</NavigationHandler>
              </Suspense>
            </main>
            <Footer />
            <UIHandler />
          </div>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
