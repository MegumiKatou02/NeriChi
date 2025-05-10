'use client'

import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
  fullWidth?: boolean
}

export default function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  return (
    <div className={fullWidth ? 'w-full' : 'container mx-auto px-4 sm:px-6 lg:px-8'}>
      {children}
    </div>
  )
}
