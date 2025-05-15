'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from './components/layout/MainLayout'
import { useSongs } from '@/app/hooks/useSongs'
import { FiMusic, FiSearch, FiHeart, FiGlobe } from 'react-icons/fi'
import { Language } from './types'
import SongCard from './components/song/SongCard'
import { Song } from './types'
import SkeletonCard from './components/ui/SkeletonCard'

export default function HomePage() {
  const router = useRouter()
  const { fetchSongs } = useSongs()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const songsPerPage = 6

  useEffect(() => {
    const fetchLatestSongs = async () => {
      try {
        setLoading(true)
        const response = await fetchSongs()

        const totalSongs = response.length

        const calculatedTotalPages = Math.ceil(totalSongs / songsPerPage)
        setTotalPages(calculatedTotalPages)

        const startIndex = (currentPage - 1) * songsPerPage
        const endIndex = startIndex + songsPerPage
        const paginatedSongs = response.slice(startIndex, endIndex)

        setSongs(paginatedSongs)
      } catch (error) {
        console.error('Error fetching songs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestSongs()
  }, [fetchSongs, currentPage, songsPerPage])

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <MainLayout>
      <section className="pt-10 pb-20 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Khám phá lời bài hát yêu thích của bạn
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Tìm kiếm, lưu trữ và chia sẻ lời bài hát từ hàng ngàn bài hát Việt Nam và quốc tế.
          </p>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="py-3 pl-10 pr-4 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 block border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Tên bài hát, ca sĩ hoặc một phần lời..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="py-3 px-6 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-center items-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                <FiSearch size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Tìm kiếm nhanh chóng
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Tìm kiếm lời bài hát trong vài giây với kết quả chính xác.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-center items-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                <FiHeart size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Lưu bài hát yêu thích
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Lưu lại những bài hát bạn yêu thích để xem lại bất cứ lúc nào.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-center items-center h-12 w-12 rounded-md bg-primary/10 text-primary mx-auto mb-4">
                <FiGlobe size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Đa dạng ngôn ngữ
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Hỗ trợ nhiều ngôn ngữ bài hát từ Việt, Anh, Hàn, Nhật và nhiều hơn nữa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Bài hát mới nhất</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => <SkeletonCard key={index} />)
              : songs.map((song) => <SongCard key={song.id} song={song} />)}
          </div>

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
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <MainLayout>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            Khám phá theo ngôn ngữ
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Object.values(Language).map((lang) => (
              <div
                key={lang}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/songs?language=${lang}`)}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <FiMusic className="mr-2 text-primary" />
                  {lang === Language.VIETNAMESE && 'Tiếng Việt'}
                  {lang === Language.ENGLISH && 'Tiếng Anh'}
                  {lang === Language.KOREAN && 'Tiếng Hàn'}
                  {lang === Language.JAPANESE && 'Tiếng Nhật'}
                  {lang === Language.ROMAJI && 'Tiếng Nhật (Romaji)'}
                  {lang === Language.CHINESE && 'Tiếng Trung'}
                  {lang === Language.OTHER && 'Ngôn ngữ khác'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Khám phá các bài hát {lang === Language.VIETNAMESE && 'tiếng Việt'}
                  {lang === Language.ENGLISH && 'tiếng Anh'}
                  {lang === Language.KOREAN && 'tiếng Hàn (K-Pop)'}
                  {lang === Language.JAPANESE && 'tiếng Nhật (J-Pop)'}
                  {lang === Language.ROMAJI && 'tiếng Nhật (J-Pop)'}
                  {lang === Language.CHINESE && 'tiếng Trung (C-Pop)'}
                  {lang === Language.OTHER && 'nhiều ngôn ngữ khác'}
                </p>
              </div>
            ))}
          </div>
        </MainLayout>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-8 md:p-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Đóng góp lời bài hát
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Bạn biết lời bài hát yêu thích mà chúng tôi chưa có? Hãy chia sẻ với cộng đồng!
            </p>
            <button
              onClick={() => router.push('/add-song')}
              className="py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Thêm lời bài hát
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
