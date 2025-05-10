'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import PageSuspense from './ui/PageSuspense'

export default function NavigationHandler({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  useEffect(() => {
    document.body.classList.add('animate-fade-in')
    return () => {
      document.body.classList.remove('animate-fade-in')
    }
  }, [])

  return isNavigating ? <PageSuspense /> : children
}
