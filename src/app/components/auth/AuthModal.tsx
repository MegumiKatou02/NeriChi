'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useUIStore } from '../../store/store'
import { FiX, FiMail, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '@/app/hooks/useAuth'
import { FcGoogle } from 'react-icons/fc'

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalType, setAuthModalType } = useUIStore()
  const { register, login, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const closeModal = useCallback(() => {
    setIsAuthModalOpen(false)
    setError(null)
  }, [setIsAuthModalOpen, setError])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !loading) {
        closeModal()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        closeModal()
      }
    }

    if (isAuthModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isAuthModalOpen, closeModal, loading])

  const switchMode = () => {
    setAuthModalType(authModalType === 'login' ? 'register' : 'login')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (authModalType === 'register') {
        const result = await register(email, password, displayName)
        if (result) {
          closeModal()
        }
      } else {
        const result = await login(email, password)
        if (result) {
          closeModal()
        }
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await signInWithGoogle()
      if (result) {
        closeModal()
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <div
        ref={modalRef}
        className="bg-card relative rounded-lg shadow-xl w-full max-w-md mx-auto animate-slide-up overflow-hidden"
      >
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            className="p-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
            onClick={closeModal}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {authModalType === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {authModalType === 'login'
              ? 'Đăng nhập để sử dụng đầy đủ tính năng'
              : 'Tạo tài khoản để truy cập vào tất cả tính năng'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center">
              <FiAlertCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalType === 'register' && (
              <div className="space-y-1">
                <label htmlFor="displayName" className="block text-sm font-medium text-foreground">
                  Tên hiển thị
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="displayName"
                    className="input pl-10"
                    placeholder="Nhập tên hiển thị"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="input pl-10"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  id="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={switchMode}
              >
                {authModalType === 'login' ? 'Tạo tài khoản mới' : 'Đã có tài khoản'}
              </button>
              {authModalType === 'login' && (
                <button type="button" className="text-primary hover:underline font-medium">
                  Quên mật khẩu?
                </button>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full py-2" disabled={loading}>
              {loading ? 'Đang xử lý...' : authModalType === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-border rounded-md bg-card hover:bg-muted transition-colors text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                <span>Google</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            {authModalType === 'login'
              ? 'Khi đăng nhập, bạn đồng ý với các Điều khoản dịch vụ và Chính sách quyền riêng tư của chúng tôi.'
              : 'Bằng cách đăng ký, bạn đồng ý với các Điều khoản dịch vụ và Chính sách quyền riêng tư của chúng tôi.'}
          </p>
        </div>
      </div>
    </div>
  )
}
