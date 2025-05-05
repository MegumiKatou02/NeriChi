'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import { useSongs } from '../../hooks/useSongs';
import { Language } from '../../types';
import { useSongStore } from '../../store/store';

interface SearchBoxProps {
  initialQuery?: string;
  onlyShowResults?: boolean;
  className?: string;
}

export default function SearchBox({ initialQuery = '', onlyShowResults = false, className = '' }: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { searchResults, loading, search } = useSongs();
  const { setSearchTerm, selectedLanguage, setSelectedLanguage } = useSongStore();
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
      setSearchTerm(query);
    }, 300);

    return () => clearTimeout(timerId);
  }, [query, setSearchTerm]);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      search(debouncedQuery, selectedLanguage || undefined);
    }
  }, [debouncedQuery, selectedLanguage, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchTerm('');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const language = e.target.value === '' ? null : (e.target.value as Language);
    setSelectedLanguage(language);
  };

  const handleSuggestionClick = (title: string) => {
    setQuery(title);
    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(title)}`);
  };

  return (
    <div ref={searchBoxRef} className={`relative ${className}`}>
      {!onlyShowResults && (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full py-2 pl-10 pr-10 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tìm kiếm bài hát, ca sĩ hoặc lời..."
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>

          <div className="mt-2">
            <select
              value={selectedLanguage || ''}
              onChange={handleLanguageChange}
              className="w-full py-2 px-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tất cả ngôn ngữ</option>
              <option value={Language.VIETNAMESE}>Tiếng Việt</option>
              <option value={Language.ENGLISH}>Tiếng Anh</option>
              <option value={Language.KOREAN}>Tiếng Hàn</option>
              <option value={Language.JAPANESE}>Tiếng Nhật</option>
              <option value={Language.CHINESE}>Tiếng Trung</option>
              <option value={Language.OTHER}>Khác</option>
            </select>
          </div>
        </form>
      )}

      {isFocused && query.trim().length >= 2 && searchResults && searchResults.songs.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 max-h-96 overflow-y-auto">
          <ul className="py-1">
            {searchResults.songs.slice(0, 10).map((song) => (
              <li key={song.id}>
                <button
                  onClick={() => handleSuggestionClick(song.title)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{song.title}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{song.artist}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && debouncedQuery.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Đang tìm kiếm...</p>
        </div>
      )}
    </div>
  );
} 