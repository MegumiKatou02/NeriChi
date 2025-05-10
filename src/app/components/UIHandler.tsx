'use client'

import { useUIStore } from '@/app/store/store'
import AuthModal from './auth/AuthModal'

export default function UIHandler() {
  const { isAuthModalOpen } = useUIStore()
  return isAuthModalOpen ? <AuthModal /> : null
}
