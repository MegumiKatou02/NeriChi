'use client'

import { useEffect, useState } from 'react'
import { useSongs } from '../../hooks/useSongs'
import SongCard from './SongCard'
import { Song, Language } from '../../types'
import { FiMusic, FiLoader, FiFilter, FiChevronDown, FiGrid, FiList } from 'react-icons/fi'

interface SongListProps {
  initialSongs?: Song[]
  title?: string
  emptyMessage?: string
  showFilters?: boolean
}

export default function SongList({
  initialSongs,
  title = 'Bài hát mới nhất',
  emptyMessage = 'Không có bài hát nào.',
  showFilters = false,
}: SongListProps) {
  const { songs, loading, error, fetchSongs } = useSongs()
  const [displaySongs, setDisplaySongs] = useState<Song[]>([])
  const [language, setLanguage] = useState<Language | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showLanguageFilter, setShowLanguageFilter] = useState(false)
  const [showSortFilter, setShowSortFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const songsPerPage = 6

  useEffect(() => {
    if (!initialSongs) {
      fetchSongs()
    } else {
      setDisplaySongs(initialSongs)
    }
  }, [initialSongs, fetchSongs])

  useEffect(() => {
    if (!initialSongs && songs) {
      let filtered = [...songs]

      if (language !== 'all') {
        filtered = filtered.filter((song) => song.language === language)
      }

      if (sortBy === 'newest') {
        filtered.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      } else if (sortBy === 'popular') {
        filtered.sort((a, b) => b.views - a.views)
      }

      setDisplaySongs(filtered)
      setCurrentPage(1)
    }
  }, [initialSongs, songs, language, sortBy])

  const indexOfLastSong = currentPage * songsPerPage
  const indexOfFirstSong = indexOfLastSong - songsPerPage
  const currentSongs = displaySongs.slice(indexOfFirstSong, indexOfLastSong)
  const totalPages = Math.ceil(displaySongs.length / songsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading && !initialSongs) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FiLoader size={30} className="animate-spin text-primary" />
      </div>
    )
  }

  if (error && !initialSongs) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md">
        <p>Đã xảy ra lỗi khi tải bài hát. Vui lòng thử lại sau.</p>
      </div>
    )
  }

  if (!displaySongs.length) {
    return (
      <div className="text-center py-12">
        <FiMusic size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">{emptyMessage}</h3>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {title && <h2 className="text-2xl font-bold text-foreground">{title}</h2>}

        {showFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex border  rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'bg-card text-muted-foreground'}`}
                title="Xem dạng lưới"
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-muted text-foreground' : 'bg-card text-muted-foreground'}`}
                title="Xem dạng danh sách"
              >
                <FiList size={18} />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowLanguageFilter(!showLanguageFilter)}
                className="flex items-center gap-1 px-3 py-2 border  rounded-md bg-card hover:bg-muted"
              >
                <FiFilter size={16} />
                <span>Ngôn ngữ</span>
                <FiChevronDown size={16} />
              </button>

              {showLanguageFilter && (
                <div className="absolute right-0 mt-1 w-48 bg-card rounded-md shadow-lg z-10 border  animate-fade-in">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setLanguage('all')
                        setShowLanguageFilter(false)
                      }}
                      className={`flex w-full px-4 py-2 text-sm hover:bg-muted ${language === 'all' ? 'text-primary' : 'text-foreground'}`}
                    >
                      Tất cả
                    </button>
                    {Object.values(Language).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang)
                          setShowLanguageFilter(false)
                        }}
                        className={`flex w-full px-4 py-2 text-sm hover:bg-muted ${language === lang ? 'text-primary' : 'text-foreground'}`}
                      >
                        {lang === Language.VIETNAMESE && 'Tiếng Việt'}
                        {lang === Language.ENGLISH && 'Tiếng Anh'}
                        {lang === Language.KOREAN && 'Tiếng Hàn'}
                        {lang === Language.JAPANESE && 'Tiếng Nhật'}
                        {lang === Language.CHINESE && 'Tiếng Trung'}
                        {lang === Language.OTHER && 'Ngôn ngữ khác'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSortFilter(!showSortFilter)}
                className="flex items-center gap-1 px-3 py-2 border  rounded-md bg-card hover:bg-muted"
              >
                <span>Sắp xếp</span>
                <FiChevronDown size={16} />
              </button>

              {showSortFilter && (
                <div className="absolute right-0 mt-1 w-48 bg-card rounded-md shadow-lg z-10 border  animate-fade-in">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSortBy('newest')
                        setShowSortFilter(false)
                      }}
                      className={`flex w-full px-4 py-2 text-sm hover:bg-muted ${sortBy === 'newest' ? 'text-primary' : 'text-foreground'}`}
                    >
                      Mới nhất
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('popular')
                        setShowSortFilter(false)
                      }}
                      className={`flex w-full px-4 py-2 text-sm hover:bg-muted ${sortBy === 'popular' ? 'text-primary' : 'text-foreground'}`}
                    >
                      Phổ biến nhất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {currentSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}

      {displaySongs.length > songsPerPage && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md border  bg-card hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                  currentPage === i + 1
                    ? 'bg-primary text-primary-foreground'
                    : 'border  bg-card hover:bg-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md border  bg-card hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            >
              Sau
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}
