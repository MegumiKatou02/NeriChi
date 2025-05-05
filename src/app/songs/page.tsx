'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';
import SongList from '@/app/components/song/SongList';
import SearchBox from '@/app/components/ui/SearchBox';
import { useSongs } from '@/app/hooks/useSongs';
import { Language } from '@/app/types';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import { useSongStore } from '@/app/store/store';

export default function SongsPage() {
  const searchParams = useSearchParams();
  const languageParam = searchParams?.get('language') as Language | null;
  const { fetchSongs, songs } = useSongs();
  const { selectedLanguage, setSelectedLanguage } = useSongStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    if (languageParam) {
      setSelectedLanguage(languageParam);
    }
  }, [languageParam, setSelectedLanguage]);

  const filteredSongs = selectedLanguage
    ? songs.filter((song) => song.language === selectedLanguage)
    : songs;

  const getLanguageDisplay = (lang: Language): string => {
    switch(lang) {
      case Language.VIETNAMESE:
        return 'Tiếng Việt';
      case Language.ENGLISH:
        return 'Tiếng Anh';
      case Language.KOREAN:
        return 'Tiếng Hàn';
      case Language.JAPANESE:
        return 'Tiếng Nhật';
      case Language.ROMAJI:
        return 'Tiếng Nhật (Romaji)';
      case Language.CHINESE:
        return 'Tiếng Trung';
      case Language.OTHER:
        return 'Khác';
      default:
        return 'Không xác định';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Danh sách bài hát</h1>
          <SearchBox className="mb-4" />

          <div className="mt-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary"
            >
              <FiFilter className="mr-2" />
                <span>Lọc theo</span>
              <FiChevronDown className={`ml-1 transition-transform ${isFilterOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                <button
                  onClick={() => setSelectedLanguage(null)}
                  className={`px-3 py-2 rounded-md text-sm ${
                    selectedLanguage === null
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Tất cả
                </button>
                {Object.values(Language).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-2 rounded-md text-sm ${
                      selectedLanguage === lang
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {getLanguageDisplay(lang)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {selectedLanguage ? (
            <SongList 
              initialSongs={filteredSongs} 
              title={`Bài hát ${getLanguageDisplay(selectedLanguage)}`} 
              emptyMessage={`Không có bài hát ${getLanguageDisplay(selectedLanguage)} nào.`}
            />
          ) : (
            <SongList initialSongs={songs} title="Tất cả bài hát" />
          )}
        </div>
      </div>
    </MainLayout>
  );
} 