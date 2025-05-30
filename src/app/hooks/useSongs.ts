'use client'

import { useState, useCallback } from 'react'
import { Language, Song, SearchResult } from '../types'
import {
  getSongById,
  getSongs,
  saveSong,
  searchSongs,
  getTopSongs,
  isSongSaved,
  removeSavedSong,
  getUserSongs,
  getUserFavorites,
} from '../firebase/services'
import { useAuth } from './useAuth'
import { auth } from '../firebase/config'

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [topSongs, setTopSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  const fetchSongs = useCallback(async (limit_count = 20) => {
    setLoading(true)
    setError(null)
    try {
      const songsData = await getSongs(limit_count)
      setSongs(songsData)
      return songsData
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSongById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const song = await getSongById(id)
      setCurrentSong(song)
      return song
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const search = useCallback(async (searchTerm: string, language?: Language) => {
    if (!searchTerm.trim()) {
      setSearchResults(null)
      return null
    }

    setLoading(true)
    setError(null)
    try {
      const results = await searchSongs(searchTerm, language)
      setSearchResults(results)
      return results
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createSong = useCallback(
    async (song: {
      info: {
        title: string
        artist: string
        contributors?: string[]
        approved?: boolean
        altNames?: string[]
      }
      versions?: Record<
        string,
        {
          lyrics: string
          language: Language
          contributors?: string[]
        }
      >
    }) => {
      if (!user) throw new Error('Bạn phải đăng nhập để thêm bài hát')

      setLoading(true)
      setError(null)
      try {
        const user = auth.currentUser
        if (!user) throw new Error('Bạn phải đăng nhập để thêm bài hát')

        if (!song.info.contributors) {
          song.info.contributors = []
        }

        song.info.contributors.push(user.uid)

        const response = await fetch('/api/pending-song', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...song,
            altNames: song.info?.altNames ?? [],
          }),
        })

        if (!response.ok) {
          throw new Error('Lỗi khi thêm bài hát vào danh sách chờ')
        }
      } catch (err) {
        setError(err as Error)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [user],
  )

  const saveFavoriteSong = useCallback(
    async (songId: string) => {
      if (!user) throw new Error('Bạn phải đăng nhập để lưu bài hát')

      setLoading(true)
      setError(null)
      try {
        const isSaved = await isSongSaved(songId)
        if (isSaved) {
          await removeSavedSong(songId)
        } else {
          await saveSong(songId)
        }
      } catch (err) {
        setError(err as Error)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [user],
  )

  const checkSavedStatus = useCallback(
    async (songId: string) => {
      if (!user) return false

      try {
        return await isSongSaved(songId)
      } catch (err) {
        console.error('Lỗi khi kiểm tra trạng thái lưu:', err)
        return false
      }
    },
    [user],
  )

  const removeFavoriteSong = useCallback(
    async (songId: string) => {
      if (!user) throw new Error('Bạn phải đăng nhập để xóa bài hát khỏi danh sách đã lưu')

      setLoading(true)
      setError(null)
      try {
        await removeSavedSong(songId)
      } catch (err) {
        setError(err as Error)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [user],
  )

  const fetchTopSongs = useCallback(
    async (sortBy: 'views' | 'likes' = 'views', limit_count = 20) => {
      setLoading(true)
      setError(null)
      try {
        const songsData = await getTopSongs(sortBy, limit_count)
        setTopSongs(songsData)
        return songsData
      } catch (err) {
        setError(err as Error)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const fetchUserSongs = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const userSongs = await getUserSongs(userId)
      return userSongs
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUserFavorites = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const favoriteSongs = await getUserFavorites(userId)
      return favoriteSongs
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reportLyrics = useCallback(
    async (songId: string, reportData: { reason: string; details: string }) => {
      if (!user) throw new Error('Bạn phải đăng nhập để báo cáo lời bài hát')

      setLoading(true)
      setError(null)
      try {
        const user = auth.currentUser
        if (!user) throw new Error('Bạn phải đăng nhập để thêm bài hát')

        const response = await fetch('/api/report-lyrics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            songId,
            reporterId: user.uid,
            reporterEmail: user.email,
            reason: reportData.reason,
            details: reportData.details,
          }),
        })

        if (!response.ok) {
          throw new Error('Lỗi khi thêm bài hát vào danh sách chờ')
        }
      } catch (err) {
        setError(err as Error)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [user],
  )

  return {
    songs,
    currentSong,
    searchResults,
    topSongs,
    loading,
    error,
    fetchSongs,
    fetchSongById,
    fetchTopSongs,
    search,
    createSong,
    saveFavoriteSong,
    checkSavedStatus,
    removeFavoriteSong,
    getUserSongs: fetchUserSongs,
    getUserFavorites: fetchUserFavorites,
    reportLyrics,
  }
}
