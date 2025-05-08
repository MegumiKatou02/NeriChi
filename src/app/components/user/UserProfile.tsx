'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiCalendar, FiMusic, FiHeart, FiUser } from 'react-icons/fi'
import { User } from '@/app/types'
import { useSongs } from '@/app/hooks/useSongs'
import { Song } from '@/app/types'
import SongCard from '../song/SongCard'

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  const { getUserSongs, getUserFavorites } = useSongs()
  const [contributedSongs, setContributedSongs] = useState<Song[]>([])
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([])
  const [activeTab, setActiveTab] = useState<'contributed' | 'favorites'>('contributed')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserSongs = async () => {
      setLoading(true)
      try {
        const contributed = await getUserSongs(user.uid)
        const favorites = await getUserFavorites(user.uid)
        setContributedSongs(contributed)
        setFavoriteSongs(favorites)
      } catch (error) {
        console.error('Lỗi khi tải bài hát:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserSongs()
  }, [user.uid, getUserSongs, getUserFavorites])

  const memberSince = new Date(user.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-4 sm:mb-6">
            <div className="text-center sm:text-left sm:ml-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {user.displayName || 'Người dùng ẩn danh'}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiCalendar className="mr-1" />
                  <span>Tham gia: {memberSince}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiMusic className="mr-1" />
                  <span>{contributedSongs.length} bài hát đã đóng góp</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiHeart className="mr-1" />
                  <span>{favoriteSongs.length} bài hát yêu thích</span>
                </div>
              </div>
            </div>
          </div>

          {user.isAdmin && (
            <div className="mt-2 flex justify-center sm:justify-start">
              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                Quản trị viên
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('contributed')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'contributed'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <FiMusic className="inline-block mr-2" />
              Bài hát đã đóng góp
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'favorites'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <FiHeart className="inline-block mr-2" />
              Bài hát yêu thích
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
          ) : activeTab === 'contributed' ? (
            contributedSongs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {contributedSongs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiMusic className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Chưa có bài hát nào
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Người dùng này chưa đóng góp bài hát nào.
                </p>
              </div>
            )
          ) : favoriteSongs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {favoriteSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiHeart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                Chưa có bài hát yêu thích
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Người dùng này chưa lưu bài hát yêu thích nào.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
