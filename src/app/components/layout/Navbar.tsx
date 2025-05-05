'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { FiSun, FiMoon, FiMenu, FiX, FiSearch, FiUser, FiHeart, FiLogOut, FiPlus, FiHome, FiMusic, FiBarChart2 } from 'react-icons/fi';
import { useUIStore } from '../../store/store';

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const { 
    isMobileMenuOpen, 
    setIsMobileMenuOpen, 
    setIsAuthModalOpen, 
    setAuthModalType,
    isDarkMode,
    toggleDarkMode
  } = useUIStore();
  const [searchInput, setSearchInput] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const openLoginModal = () => {
    setAuthModalType('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalType('register');
    setIsAuthModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
      setSearchInput('');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      router.push('/');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                LyricsHub
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
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

          {/* Desktop right section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm lời bài hát..."
                className="input w-64 h-9 py-2 pl-9 pr-4 text-sm rounded-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </form>

            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-foreground hover:bg-muted transition-colors"
              aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {/* Auth buttons */}
            {user ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 rounded-full focus:outline-none"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
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
                      <p className="text-sm font-medium text-foreground">{user.displayName || user.email}</p>
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in">
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="text"
                placeholder="Tìm lời bài hát..."
                className="input w-full py-2 pl-9 pr-4 text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </form>
            
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
                    <p className="text-sm font-medium text-foreground">{user.displayName || user.email}</p>
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
                      handleSignOut();
                      setIsMobileMenuOpen(false);
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
                      openLoginModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn btn-secondary text-base w-full"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => {
                      openRegisterModal();
                      setIsMobileMenuOpen(false);
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
  );
} 