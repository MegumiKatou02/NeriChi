'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiEye, FiShare2, FiHeart, FiMusic, FiCheckCircle } from 'react-icons/fi'
import { Song } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { useSongs } from '../../hooks/useSongs'
import { useUIStore } from '../../store/store'
import ContributorAvatars from '../shared/ContributorAvatars'

interface SongCardProps {
  song: Song
}

export default function SongCard({ song }: SongCardProps) {
  const { user } = useAuth()
  const { saveFavoriteSong, checkSavedStatus } = useSongs()
  const { setIsAuthModalOpen } = useUIStore()
  const [isSaving, setIsSaving] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        const status = await checkSavedStatus(song.id)
        setIsFavorite(status)
      }
    }

    checkFavoriteStatus()
  }, [user, checkSavedStatus, song.id])

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    try {
      setIsSaving(true)
      await saveFavoriteSong(song.id)
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Lỗi khi lưu bài hát:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowShareOptions(!showShareOptions)
  }

  const shareTo = (platform: 'facebook' | 'twitter' | 'copy', e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}/songs/${song.id}`
    const title = `${song.title} - ${song.artist} | NeriChi`

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
        )
        break
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank',
        )
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }

    setShowShareOptions(false)
  }

  return (
    <Link href={`/songs/${song.id}`} className="block group">
      <div className="card hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
        <div className="px-5 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <FiMusic className="text-primary w-6 h-6" />
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="text-lg font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {song.title}
              </h3>
              <p className="text-muted-foreground truncate">{song.artist}</p>
            </div>
          </div>

          {song.contributors && song.contributors.length > 0 && (
            <div className="mt-4 ml-16">
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">Người đóng góp:</div>
                <ContributorAvatars contributors={song.contributors} size="sm" maxDisplay={4} />
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 bg-muted dark:bg-card border-t  flex justify-between items-center">
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <FiEye className="mr-1" />
              <span>{song.views.toLocaleString()}</span>
            </div>
            {/* <div className="flex items-center">
              <FiHeart className="mr-1" />
              <span>{song.likes.toLocaleString()}</span>
            </div> */}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-2 rounded-full hover:bg-background dark:hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
              title={isFavorite ? 'Hủy lưu bài hát' : 'Lưu bài hát'}
            >
              <FiHeart
                className={`w-5 h-5 ${isSaving ? 'animate-pulse' : ''} ${isFavorite ? 'text-red-500 fill-red-500' : ''}`}
              />
            </button>

            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-background dark:hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                title="Chia sẻ"
              >
                <FiShare2 className="w-5 h-5" />
              </button>

              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg z-[999] border  animate-fade-in py-1">
                  <button
                    onClick={(e) => shareTo('facebook', e)}
                    className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <span className="w-5 h-5 mr-2 flex-shrink-0">
                      <svg className="h-full w-full" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </span>
                    Facebook
                  </button>
                  <button
                    onClick={(e) => shareTo('twitter', e)}
                    className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <span className="w-5 h-5 mr-2 flex-shrink-0">
                      <svg className="h-full w-full" fill="#1DA1F2" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </span>
                    Twitter
                  </button>
                  <button
                    onClick={(e) => shareTo('copy', e)}
                    className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    {copied ? (
                      <>
                        <FiCheckCircle className="w-5 h-5 mr-2 text-success" />
                        Đã sao chép
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Sao chép link
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
