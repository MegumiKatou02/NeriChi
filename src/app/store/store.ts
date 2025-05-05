'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, SearchResult, Song } from '../types'

interface SongState {
  songs: Song[];
  currentSong: Song | null;
  searchResults: SearchResult | null;
  searchTerm: string;
  selectedLanguage: Language | null;
  isLoading: boolean;
  error: string | null;
  favorites: string[]; 
  recentlyViewed: string[];
  setSongs: (songs: Song[]) => void;
  setCurrentSong: (song: Song | null) => void;
  setSearchResults: (results: SearchResult | null) => void;
  setSearchTerm: (term: string) => void;
  setSelectedLanguage: (language: Language | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addToFavorites: (songId: string) => void;
  removeFromFavorites: (songId: string) => void;
  addToRecentlyViewed: (songId: string) => void;
  clearSearchResults: () => void;
}

export const useSongStore = create<SongState>()(
  persist(
    (set) => ({
      songs: [],
      currentSong: null,
      searchResults: null,
      searchTerm: '',
      selectedLanguage: null,
      isLoading: false,
      error: null,
      favorites: [],
      recentlyViewed: [],
      setSongs: (songs) => set({ songs }),
      setCurrentSong: (song) => set({ currentSong: song }),
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      addToFavorites: (songId) =>
        set((state) => ({
          favorites: state.favorites.includes(songId) ? state.favorites : [...state.favorites, songId],
        })),
      removeFromFavorites: (songId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== songId),
        })),
      addToRecentlyViewed: (songId) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((id) => id !== songId);
          return {
            recentlyViewed: [songId, ...filtered].slice(0, 10),
          };
        }),
      clearSearchResults: () => set({ searchResults: null, searchTerm: '' }),
    }),
    {
      name: 'song-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
);

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userId: string | null;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setUserInfo: (userId: string, username: string, email: string, avatarUrl?: string) => void;
  clearUserInfo: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAdmin: false,
      userId: null,
      username: null,
      email: null,
      avatarUrl: null,
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      setUserInfo: (userId, username, email, avatarUrl) =>
        set({ userId, username, email, avatarUrl, isAuthenticated: true }),
      clearUserInfo: () =>
        set({
          isAuthenticated: false,
          isAdmin: false,
          userId: null,
          username: null,
          email: null,
          avatarUrl: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface UIState {
  isMobileMenuOpen: boolean;
  isAuthModalOpen: boolean;
  authModalType: 'login' | 'register';
  isDarkMode: boolean;
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  viewMode: 'grid' | 'list';
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  setAuthModalType: (type: 'login' | 'register') => void;
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMobileMenuOpen: false,
      isAuthModalOpen: false,
      authModalType: 'login',
      isDarkMode: false,
      toasts: [],
      viewMode: 'grid',
      setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
      setIsAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
      setAuthModalType: (type) => set({ authModalType: type }),
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      addToast: (message, type) =>
        set((state) => ({
          toasts: [...state.toasts, { id: Date.now().toString(), message, type }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        viewMode: state.viewMode,
      }),
    }
  )
); 