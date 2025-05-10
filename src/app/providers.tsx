'use client'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { ReactNode, useEffect, useState } from 'react'
import { theme } from '@chakra-ui/react'

const chakraTheme = {
  ...theme,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
}

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    localStorage.removeItem('chakra-ui-color-mode')
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ColorModeScript initialColorMode="light" />
      <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>
    </ThemeProvider>
  )
}
