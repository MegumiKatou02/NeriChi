'use client'

import { useState, useEffect } from 'react'
import { FiMusic, FiHeart } from 'react-icons/fi'
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

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
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
              Bài hát đã đóng góp {contributedSongs.length > 0 && `(${contributedSongs.length})`}
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
              Bài hát yêu thích {favoriteSongs.length > 0 && `(${favoriteSongs.length})`}
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
