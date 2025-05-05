'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '../components/layout/MainLayout';
import SearchBox from '../components/ui/SearchBox';
import SongList from '../components/song/SongList';
import { useSongs } from '../hooks/useSongs';
import { useSongStore } from '../store/store';
import { FiSearch, FiMusic } from 'react-icons/fi';
import { Language } from '../types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const languageParam = searchParams?.get('language') as Language | null;
  const { search, searchResults, loading } = useSongs();
  const { setSearchTerm, selectedLanguage, setSelectedLanguage } = useSongStore();

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      if (languageParam) {
        setSelectedLanguage(languageParam);
      }
    }
  }, [query, languageParam, setSearchTerm, setSelectedLanguage]);

  useEffect(() => {
    if (query) {
      search(query, selectedLanguage || undefined);
    }
  }, [query, selectedLanguage, search]);

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Tìm kiếm</h1>
          <SearchBox initialQuery={query} className="mb-4" />
        </div>

        {query ? (
          <>
            {loading ? (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                <FiSearch size={48} className="mx-auto mb-4 animate-pulse" />
                <p className="text-lg">Đang tìm kiếm &quot;{query}&quot;...</p>
              </div>
            ) : searchResults && searchResults.songs.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                    Kết quả tìm kiếm cho &quot;{query}&quot;
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Tìm thấy {searchResults.songs.length} kết quả{' '}
                    {selectedLanguage && `cho ngôn ngữ: ${getLanguageDisplay(selectedLanguage)}`}
                  </p>
                </div>
                <SongList initialSongs={searchResults.songs} title="" />

                {searchResults.artists.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Nghệ sĩ liên quan</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {searchResults.artists.map((artist) => (
                        <div
                          key={artist}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                          onClick={() => {
                            search(artist);
                            setSearchTerm(artist);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="bg-primary/10 rounded-full p-3 mr-3">
                              <FiMusic className="text-primary" size={20} />
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">{artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <FiMusic size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Không tìm thấy kết quả phù hợp
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Thử tìm kiếm với từ khóa khác hoặc duyệt bài hát theo ngôn ngữ bên dưới.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {Object.values(Language).slice(0, 4).map((lang) => (
                    <button
                      key={lang}
                      className="px-4 py-2 bg-primary/10 dark:bg-primary/5 hover:bg-primary/20 rounded-md text-primary"
                      onClick={() => {
                        setSelectedLanguage(lang);
                        search(query, lang);
                      }}
                    >
                      {getLanguageDisplay(lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <FiSearch size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nhập từ khóa để tìm kiếm bài hát
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Tìm kiếm theo tên bài hát, ca sĩ hoặc một phần lời bài hát.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 