'use client'

import { ReactNode, useEffect } from 'react'
import { useUIStore } from '../store/store'

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { isDarkMode } = useUIStore()

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

  return <>{children}</>
}
