'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import MainLayout from '@/app/components/layout/MainLayout'
import { useSongs } from '@/app/hooks/useSongs'
import SongDetail from '@/app/components/song/SongDetail'
import { FiAlertCircle } from 'react-icons/fi'
import Link from 'next/link'
import SkeletonSongPage from '@/app/components/ui/SkeletonSongPage'

export default function SongDetailPage() {
  const { id } = useParams() as { id: string }
  const { fetchSongById, currentSong, error } = useSongs()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSongData = async () => {
      setLoading(true)
      try {
        await fetchSongById(id)
      } catch (error) {
        console.error('Error fetching song:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSongData()
  }, [id, fetchSongById])

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<SkeletonSongPage />}>
          {loading ? (
            <SkeletonSongPage />
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-6 rounded-md flex items-start">
              <FiAlertCircle className="mt-0.5 mr-3 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-medium">Đã xảy ra lỗi</h3>
                <p className="mt-1">Không thể tải thông tin bài hát. Vui lòng thử lại sau.</p>
                <Link
                  href="/songs"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Quay lại danh sách bài hát
                </Link>
              </div>
            </div>
          ) : currentSong ? (
            <SongDetail song={currentSong} />
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-6 rounded-md flex items-start">
              <FiAlertCircle className="mt-0.5 mr-3 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-medium">Không tìm thấy bài hát</h3>
                <p className="mt-1">Bài hát bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <Link
                  href="/songs"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Xem các bài hát khác
                </Link>
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </MainLayout>
  )
}
