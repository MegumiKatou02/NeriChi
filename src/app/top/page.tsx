'use client'

import { useEffect, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import { useSongs } from '../hooks/useSongs'
import Link from 'next/link'
import { FiEye, FiHeart, FiCalendar, FiMusic, FiBarChart, FiTrendingUp } from 'react-icons/fi'

type SongWithInfo = {
  id: string
  info: {
    title: string
    artist: string
    createdAt: Date | null
    views: number
  }
}

export default function TopPage() {
  const { fetchTopSongs, loading } = useSongs()
  const [topViewSongs, setTopViewSongs] = useState<SongWithInfo[]>([])
  const [topLikedSongs, setTopLikedSongs] = useState<SongWithInfo[]>([])
  const [activeTab, setActiveTab] = useState<'views' | 'likes'>('views')

  useEffect(() => {
    const loadTopSongs = async () => {
      try {
        const topByViews = await fetchTopSongs('views', 10)
        setTopViewSongs(topByViews as unknown as SongWithInfo[])

        const topByLikes = await fetchTopSongs('likes', 10)
        setTopLikedSongs(topByLikes as unknown as SongWithInfo[])
      } catch (error) {
        console.error('Error fetching top songs:', error)
      }
    }

    loadTopSongs()
  }, [fetchTopSongs])

  const formatDate = (date: Date | null) => {
    if (!date) return 'Không có ngày'
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
            <FiBarChart className="mr-3 text-primary" />
            Bảng xếp hạng
          </h1>
          <p className="text-muted-foreground text-lg">Những bài hát nổi bật nhất trên NeriChi</p>
        </div>

        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('views')}
            className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'views'
                ? 'border-primary text-primary'
                : 'border-transparent hover:text-foreground hover:border-muted'
            }`}
          >
            <FiEye className="mr-2" /> Xem nhiều nhất
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'likes'
                ? 'border-primary text-primary'
                : 'border-transparent hover:text-foreground hover:border-muted'
            }`}
          >
            <FiHeart className="mr-2" /> Yêu thích nhất
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {(activeTab === 'views' ? topViewSongs : topLikedSongs).map((song, index) => (
              <div
                key={song.id}
                className="flex flex-col md:flex-row md:items-center p-4 bg-card rounded-lg border border-border transition-all hover:shadow-md"
              >
                <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/songs/${song.id}`}
                      className="text-lg font-semibold hover:text-primary"
                    >
                      {song.info.title}
                    </Link>
                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                      <FiMusic className="mr-1" /> {song.info.artist}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between md:justify-end md:flex-1 text-sm gap-4">
                  <div className="flex items-center text-muted-foreground">
                    <FiCalendar className="mr-1" /> {formatDate(song.info.createdAt)}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-amber-500">
                      <FiEye className="mr-1" /> {song.info.views.toLocaleString('vi-VN')}
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="md:ml-4 flex items-center text-emerald-500">
                      <FiTrendingUp className="mr-1" /> Top 1
                    </div>
                  )}
                </div>
              </div>
            ))}

            {(activeTab === 'views' ? topViewSongs : topLikedSongs).length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p>Chưa có dữ liệu bài hát nào. Hãy thêm bài hát mới!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
