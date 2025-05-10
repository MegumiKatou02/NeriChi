'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiHeart,
  FiLogOut,
  FiPlus,
  FiHome,
  FiMusic,
  FiBarChart2,
} from 'react-icons/fi'
import { useUIStore } from '../../store/store'
import Image from 'next/image'

export default function Navbar() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsAuthModalOpen,
    setAuthModalType,
    isDarkMode,
    toggleDarkMode,
  } = useUIStore()
  const [searchInput, setSearchInput] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearchModal(true)
      } else if (e.key === 'Escape') {
        setShowSearchModal(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearchModal])

  const openLoginModal = () => {
    setAuthModalType('login')
    setIsAuthModalOpen(true)
  }

  const openRegisterModal = () => {
    setAuthModalType('register')
    setIsAuthModalOpen(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`)
      setSearchInput('')
      setShowSearchModal(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
      router.push('/')
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error)
    }
  }

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  NeriChi
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-1">
                  <FiHome className="h-4 w-4" />
                  <span>Trang chủ</span>
                </span>
              </Link>
              <Link
                href="/songs"
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-1">
                  <FiMusic className="h-4 w-4" />
                  <span>Bài hát</span>
                </span>
              </Link>
              <Link
                href="/top"
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-1">
                  <FiBarChart2 className="h-4 w-4" />
                  <span>Xếp hạng</span>
                </span>
              </Link>
              {user && (
                <Link
                  href="/add-song"
                  className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <FiPlus className="h-4 w-4" />
                    <span>Thêm bài hát</span>
                  </span>
                </Link>
              )}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowSearchModal(true)}
                className="flex items-center px-3 py-1.5 text-sm border border-border rounded-md bg-muted/50 text-muted-foreground hover:text-foreground transition-colors w-64"
              >
                <FiSearch className="mr-2 h-4 w-4" />
                <span className="flex-grow text-left">Tìm lời bài hát...</span>
                <kbd className="hidden md:flex items-center text-xs bg-background px-1.5 py-0.5 rounded border border-border">
                  <span className="mr-0.5">Ctrl</span>K
                </kbd>
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-foreground hover:bg-muted transition-colors relative overflow-hidden group theme-transition"
                aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
              >
                <div className="relative z-10 flex items-center justify-center">
                  {isDarkMode ? (
                    <FiSun className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                  ) : (
                    <FiMoon className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
                  )}
                </div>
                <span
                  className={`absolute inset-0 rounded-full bg-muted transform scale-0 transition-transform duration-300 group-hover:scale-100 ${isDarkMode ? 'bg-orange-100/10' : 'bg-blue-100/50'}`}
                ></span>
              </button>

              {user ? (
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 rounded-full focus:outline-none"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-card rounded-md shadow-lg overflow-hidden border border-border animate-fade-in">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {user.displayName || user.email}
                        </p>
                        {user.email && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                        )}
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FiUser className="mr-2 h-4 w-4" />
                          Hồ sơ
                        </Link>
                        <Link
                          href="/saved-songs"
                          className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FiHeart className="mr-2 h-4 w-4" />
                          Bài hát đã lưu
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                        >
                          <FiLogOut className="mr-2 h-4 w-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={openLoginModal}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={openRegisterModal}
                    className="btn btn-primary px-4 py-2 h-9 text-sm"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-2 mr-2 rounded-full text-foreground hover:bg-muted"
              >
                <FiSearch className="h-5 w-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 mr-2 rounded-full text-foreground hover:bg-muted"
              >
                {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>
              <button
                type="button"
                className="p-2 rounded-md text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">{isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}</span>
                {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border animate-fade-in">
            <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiHome className="mr-2 h-5 w-5" />
                Trang chủ
              </Link>
              <Link
                href="/songs"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiMusic className="mr-2 h-5 w-5" />
                Bài hát
              </Link>
              <Link
                href="/top"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiBarChart2 className="mr-2 h-5 w-5" />
                Xếp hạng
              </Link>
              {user && (
                <Link
                  href="/add-song"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiPlus className="mr-2 h-5 w-5" />
                  Thêm bài hát
                </Link>
              )}
            </div>

            <div className="pt-2 pb-3 border-t border-border">
              <div className="px-4 space-y-1">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground">
                        {user.displayName || user.email}
                      </p>
                      {user.email && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                      )}
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiUser className="mr-2 h-5 w-5" />
                      Hồ sơ
                    </Link>
                    <Link
                      href="/saved-songs"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiHeart className="mr-2 h-5 w-5" />
                      Bài hát đã lưu
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                    >
                      <FiLogOut className="mr-2 h-5 w-5" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 px-3 py-2">
                    <button
                      onClick={() => {
                        openLoginModal()
                        setIsMobileMenuOpen(false)
                      }}
                      className="btn btn-secondary text-base w-full"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => {
                        openRegisterModal()
                        setIsMobileMenuOpen(false)
                      }}
                      className="btn btn-primary text-base w-full"
                    >
                      Đăng ký
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {showSearchModal && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-16 sm:pt-24">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => setShowSearchModal(false)}
          ></div>
          <div className="relative w-full max-w-lg p-4 bg-card rounded-lg shadow-xl border border-border animate-in fade-in slide-in-from-top-10 duration-200">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center border-b border-border pb-2">
                <FiSearch className="h-5 w-5 text-muted-foreground mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm lời bài hát, nghệ sĩ, album..."
                  className="w-full bg-transparent p-2 text-foreground placeholder:text-muted-foreground focus:outline-none"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <kbd className="hidden sm:flex items-center text-xs bg-muted/70 px-1.5 py-0.5 rounded border border-border ml-2">
                  Esc
                </kbd>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="btn btn-ghost px-4 py-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2"
                  disabled={!searchInput.trim()}
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
