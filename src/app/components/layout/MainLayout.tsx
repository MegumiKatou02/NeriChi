'use client'

import { ReactNode, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import AuthModal from '../auth/AuthModal'
import { useUIStore } from '@/app/store/store'

interface MainLayoutProps {
  children: ReactNode
  fullWidth?: boolean
}

export default function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  const { isAuthModalOpen, isDarkMode } = useUIStore()

  useEffect(() => {
    document.body.classList.add('animate-fade-in')
    return () => {
      document.body.classList.remove('animate-fade-in')
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('theme-transition')

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    const timeoutId = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition')
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [isDarkMode])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main
        className={`flex-grow pt-16 ${fullWidth ? '' : 'container mx-auto px-4 sm:px-6 lg:px-8'} animate-slide-in`}
      >
        {children}
      </main>
      <Footer />
      {isAuthModalOpen && <AuthModal />}
    </div>
  )
}
