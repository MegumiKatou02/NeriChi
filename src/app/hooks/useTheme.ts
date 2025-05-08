'use client'

import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  if (!mounted) {
    return {
      theme: 'light',
      isDark: false,
      toggleTheme: () => {},
    }
  }

  return {
    theme,
    isDark: resolvedTheme === 'dark',
    toggleTheme,
  }
}
