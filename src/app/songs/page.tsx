'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSongs } from '../hooks/useSongs'
import MainLayout from '../components/layout/MainLayout'
import SongCard from '../components/song/SongCard'
import SkeletonCard from '../components/ui/SkeletonCard'
import { useSearchParams } from 'next/navigation'
import { Language, Song } from '../types'

export default function SongsPage() {
  const searchParams = useSearchParams()
  const languageParam = searchParams.get('language') as Language | null

  const { fetchSongs } = useSongs()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const songsPerPage = 8

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)

  useEffect(() => {
    if (languageParam) {
      setSelectedLanguage(languageParam)
    } else {
      setSelectedLanguage(null)
    }
    setCurrentPage(1)
  }, [languageParam])

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true)

        const response = await fetchSongs()

        const filteredSongs = selectedLanguage
          ? response.filter(
              (song) => song.language.toLowerCase() === selectedLanguage.toLowerCase(),
            )
          : response

        const totalSongs = filteredSongs.length
        const calculatedTotalPages = Math.ceil(totalSongs / songsPerPage)
        setTotalPages(calculatedTotalPages || 1)

        const startIndex = (currentPage - 1) * songsPerPage
        const endIndex = startIndex + songsPerPage
        const paginatedSongs = filteredSongs.slice(startIndex, endIndex)

        setSongs(paginatedSongs)
      } catch (error) {
        console.error('Error loading songs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSongs()
  }, [fetchSongs, currentPage, selectedLanguage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {selectedLanguage
              ? `Bài hát ${
                  selectedLanguage === 'vietnamese'
                    ? 'Tiếng Việt'
                    : selectedLanguage === 'english'
                      ? 'Tiếng Anh'
                      : selectedLanguage === 'korean'
                        ? 'Tiếng Hàn'
                        : selectedLanguage === 'japanese'
                          ? 'Tiếng Nhật'
                          : selectedLanguage === 'chinese'
                            ? 'Tiếng Trung'
                            : 'Khác'
                }`
              : 'Tất cả bài hát'}
          </h1>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
            </div>
          }
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
            </div>
          ) : songs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {selectedLanguage
                  ? `Không tìm thấy bài hát nào bằng tiếng ${
                      selectedLanguage === 'vietnamese'
                        ? 'Việt'
                        : selectedLanguage === 'english'
                          ? 'Anh'
                          : selectedLanguage === 'korean'
                            ? 'Hàn'
                            : selectedLanguage === 'japanese'
                              ? 'Nhật'
                              : selectedLanguage === 'chinese'
                                ? 'Trung'
                                : 'khác'
                    }`
                  : 'Không tìm thấy bài hát nào'}
              </p>
            </div>
          )}
        </Suspense>

        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                }`}
              >
                Trước
              </button>

              <div className="flex gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNumber: number
                  if (totalPages <= 5) {
                    pageNumber = i + 1
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i
                  } else {
                    pageNumber = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === pageNumber
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                }`}
              >
                Sau
              </button>
            </nav>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
