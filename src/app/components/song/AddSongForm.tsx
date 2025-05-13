'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Language, Song } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { FiMusic, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { getSongById } from '../../firebase/services'
import { auth } from '../../firebase/config'

export default function AddSongForm() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const songId = searchParams.get('songId')
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [language, setLanguage] = useState<Language>(Language.VIETNAMESE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAddingNewLanguage, setIsAddingNewLanguage] = useState(false)
  const [existingSong, setExistingSong] = useState<Song | null>(null)
  const [altNames, setAltNames] = useState<string[]>([''])

  useEffect(() => {
    const fetchSongDetails = async () => {
      if (songId) {
        setIsAddingNewLanguage(true)
        try {
          const song = await getSongById(songId)
          if (song) {
            setExistingSong(song)
            
            setTitle(song.info.title)
            setArtist(song.info.artist)
            
            const availableLanguages = Object.keys(song.versions) as Language[]
            const missingLanguages = Object.values(Language).filter(
              lang => !availableLanguages.includes(lang)
            )
            
            if (missingLanguages.length > 0) {
              setLanguage(missingLanguages[0])
            }
          } else {
            setError('Không tìm thấy bài hát')
          }
        } catch (err) {
          console.error('Lỗi khi lấy thông tin bài hát:', err)
          setError('Không thể tải thông tin bài hát')
        }
      }
    }
    
    fetchSongDetails()
  }, [songId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError('Bạn phải đăng nhập để thêm bài hát')
      return
    }

    if (!title.trim() || !artist.trim() || !lyrics.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bài hát')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (isAddingNewLanguage && existingSong) {
        const filteredAltNames = altNames.filter(name => name.trim() !== '')

        const updatedSong = {
          ...existingSong,
          versions: {
            ...existingSong.versions,
            [language]: {
              lyrics: lyrics.trim(),
              contributors: [user.uid],
              language: language,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          },
          info: {
            ...existingSong.info,
            altNames: [...(existingSong.info.altNames || []), ...filteredAltNames]
          },
          originalSongId: songId
        }

        const token = await auth.currentUser?.getIdToken();
          
        let attempts = 0;
        let success = false;
        let error = null;
        
        while (attempts < 3 && !success) {
          try {
            const response = await fetch(`/api/update-song/${songId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updatedSong),
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            success = true;
          } catch (err) {
            attempts++;
            error = err;
            console.error(`Lỗi lần thử ${attempts}:`, err);
            if (attempts < 3) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        if (!success) {
          throw error || new Error('Lỗi khi cập nhật bài hát');
        }
      } else {
        const songData = {
          info: {
            altNames: altNames.filter(name => name.trim() !== ''),
            title: title.trim(),
            artist: artist.trim(),
            approved: false,
            contributors: [user.uid],
            views: 0,
            likes: 0,
          },
          versions: {
            [language]: {
              lyrics: lyrics.trim(),
              language: language,
              contributors: [user.uid],
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          }
        }

        const apiUrl = songId 
          ? `/api/pending-song?originalSongId=${songId}`
          : '/api/pending-song';

        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(songData),
        });
      }
      
      setSuccess(true)
      setTitle('')
      setArtist('')
      setLyrics('')
      setLanguage(Language.VIETNAMESE)

      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      console.error('Lỗi khi thêm bài hát:', err)
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi thêm bài hát')
    } finally {
      setLoading(false)
    }
  }

  const addAltNameField = () => {
    setAltNames([...altNames, ''])
  }

  const removeAltNameField = (index: number) => {
    setAltNames(altNames.filter((_, i) => i !== index))
  }

  const handleAltNameChange = (index: number, value: string) => {
    const newAltNames = [...altNames]
    newAltNames[index] = value
    setAltNames(newAltNames)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center">
          <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Thêm bài hát thành công!</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Cảm ơn bạn đã đóng góp. Bài hát của bạn đang chờ phê duyệt.
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Đang chuyển hướng về trang chủ...
          </p>
        </div>
      </div>
    )
  }

  const getFormTitle = () => {
    if (isAddingNewLanguage && existingSong) {
      return `Thêm bài hát mới (${songId})`
    }
    return 'Thêm bài hát mới (0)'
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <FiMusic className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{getFormTitle()}</h2>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-md bg-destructive/10 text-destructive flex items-start">
            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên bài hát <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
              disabled={isAddingNewLanguage}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ca sĩ / Nghệ sĩ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
              disabled={isAddingNewLanguage}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên thay thế
            </label>
            {altNames.map((name, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleAltNameChange(index, e.target.value)}
                  placeholder="Tên thay thế"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => removeAltNameField(index)}
                  className="ml-2 px-2 py-2 text-red-500 hover:text-red-700"
                  aria-label="Xóa tên thay thế"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAltNameField}
              className="mt-1 text-sm text-primary hover:text-primary/80"
            >
              + Thêm tên thay thế
            </button>
          </div>

          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ngôn ngữ <span className="text-red-500">*</span>
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
            >
              {Object.values(Language).map((lang) => {
                if (isAddingNewLanguage && existingSong && existingSong.versions[lang]) {
                  return null
                }
                let displayName = ''
                switch (lang) {
                  case Language.VIETNAMESE: displayName = 'Tiếng Việt'; break;
                  case Language.ENGLISH: displayName = 'Tiếng Anh'; break;
                  case Language.KOREAN: displayName = 'Tiếng Hàn'; break;
                  case Language.JAPANESE: displayName = 'Tiếng Nhật'; break;
                  case Language.CHINESE: displayName = 'Tiếng Trung'; break;
                  case Language.ROMAJI: displayName = 'Tiếng Nhật (Romaji)'; break;
                  case Language.OTHER: displayName = 'Khác'; break;
                }
                return (
                  <option key={lang} value={lang}>
                    {displayName}
                  </option>
                )
              })}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lời bài hát <span className="text-red-500">*</span>
            </label>
            <textarea
              id="lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
            ></textarea>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Vui lòng kiểm tra lại chính tả trước khi gửi.
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : isAddingNewLanguage ? 'Thêm lời nhạc' : 'Thêm bài hát'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
