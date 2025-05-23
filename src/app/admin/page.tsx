'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Trash,
  Edit,
  Check,
  RefreshCw,
  Save,
  ArrowLeft,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react'
import type { Song } from '../types'
import { auth, db } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { updateDoc, doc, deleteDoc } from 'firebase/firestore'

enum Language {
  VIETNAMESE = 'vietnamese',
  ENGLISH = 'english',
  KOREAN = 'korean',
  JAPANESE = 'japanese',
  CHINESE = 'chinese',
  ROMAJI = 'romaji',
  OTHER = 'other',
}

interface LyricsReport {
  id: string
  songId: string
  reporterId: string
  reason: string
  details: string
  status: 'pending' | 'reviewed' | 'resolved'
  createdAt: Date
  updatedAt: Date
  song?: Song
  reporterName?: string
  reporterEmail?: string
}

const getLangDisplayName = (lang: Language): string => {
  const langMap: Record<string, string> = {
    [Language.VIETNAMESE]: 'Tiếng Việt',
    [Language.ENGLISH]: 'Tiếng Anh',
    [Language.KOREAN]: 'Tiếng Hàn',
    [Language.JAPANESE]: 'Tiếng Nhật',
    [Language.CHINESE]: 'Tiếng Trung',
    [Language.ROMAJI]: 'Tiếng Nhật (Romaji)',
    [Language.OTHER]: 'Khác',
  }
  return langMap[lang] || lang
}

export default function AdminPage() {
  type status = 'approved' | 'pending'

  const [pendingSongs, setPendingSongs] = useState<Song[]>([])
  const [approvedSongs, setApprovedSongs] = useState<Song[]>([])
  const [filteredApprovedSongs, setFilteredApprovedSongs] = useState<Song[]>([])
  const [lyricsReports, setLyricsReports] = useState<LyricsReport[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [editingTab, setEditingTab] = useState<status | null>(null)
  const [reportDetailModal, setReportDetailModal] = useState<null | LyricsReport>(null)
  const router = useRouter()
  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID
  const [altNamesInput, setAltNamesInput] = useState<string[]>([])

  const [activeLanguageTab, setActiveLanguageTab] = useState<Language>(Language.VIETNAMESE)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [lastDocTimestamp, setLastDocTimestamp] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')

  const fetchLyricsReports = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/report-lyrics')
      if (!response.ok) {
        throw new Error('Failed to fetch reports')
      }
      const reports = await response.json()
      setLyricsReports(reports)
    } catch (err) {
      console.error('Failed to fetch lyrics reports', err)
      setErrorMessage('Failed to load lyrics reports. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSongs = useCallback(async () => {
    setLoading(true)
    try {
      const pendingRes = await fetch('/api/pending-song', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const pendingData = await pendingRes.json()
      setPendingSongs(pendingData)

      const approvedRes = await fetch('/api/songs?limit=100')
      const approvedData = await approvedRes.json()
      setApprovedSongs(approvedData)
      setFilteredApprovedSongs(approvedData)
      setTotalPages(Math.ceil(approvedData.length / itemsPerPage))

      if (approvedData.length > 0) {
        const lastDoc = approvedData[approvedData.length - 1]
        if (lastDoc.createdAt) {
          setLastDocTimestamp(new Date(lastDoc.createdAt).getTime().toString())
        }
        setHasMore(approvedData.length >= 100)
      }
    } catch (err) {
      console.error('Failed to fetch songs', err)
      setErrorMessage('Failed to load songs. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [itemsPerPage])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.uid === adminUid) {
          fetchSongs()
          fetchLyricsReports()
        } else {
          router.push('/profile')
        }
      } else {
        router.push('/profile')
      }
      setLoading(false)
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, adminUid])

  useEffect(() => {
    if (editingSong) {
      setAltNamesInput(editingSong.info?.altNames || [])

      if (editingSong.versions) {
        const availableLanguages = Object.keys(editingSong.versions) as Language[]
        if (availableLanguages.length > 0) {
          setActiveLanguageTab(availableLanguages[0])
        }
      }
    }
  }, [editingSong])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredApprovedSongs(approvedSongs)
      setTotalPages(Math.ceil(approvedSongs.length / itemsPerPage))
    } else {
      const searchTermLower = searchTerm.toLowerCase()
      const filtered = approvedSongs.filter((song) => {
        const titleMatch = song.info?.title?.toLowerCase().includes(searchTermLower)
        const artistMatch = song.info?.artist?.toLowerCase().includes(searchTermLower)
        const altNamesMatch = song.info?.altNames?.some((name) =>
          name.toLowerCase().includes(searchTermLower),
        )

        return titleMatch || artistMatch || altNamesMatch
      })

      setFilteredApprovedSongs(filtered)
      setTotalPages(Math.ceil(filtered.length / itemsPerPage))
      setCurrentPage(1)
    }
  }, [searchTerm, approvedSongs, itemsPerPage])

  const loadMoreSongs = async () => {
    if (!lastDocTimestamp || !hasMore) return

    setLoading(true)
    try {
      const approvedRes = await fetch(`/api/songs?limit=100&startAfter=${lastDocTimestamp}`)
      const newSongs = await approvedRes.json()

      if (newSongs.length > 0) {
        const lastDoc = newSongs[newSongs.length - 1]
        if (lastDoc.createdAt) {
          setLastDocTimestamp(new Date(lastDoc.createdAt).getTime().toString())
        }

        const updatedSongs = [...approvedSongs, ...newSongs]
        setApprovedSongs(updatedSongs)
        setFilteredApprovedSongs(updatedSongs)
        setTotalPages(Math.ceil(updatedSongs.length / itemsPerPage))
        setHasMore(newSongs.length >= 100)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load more songs', err)
      setErrorMessage('Failed to load more songs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredApprovedSongs.slice(startIndex, endIndex)
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const approveSong = async (id: string, originalSongId: string | null | undefined) => {
    try {
      setLoading(true)
      const res = await fetch('/api/approve-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, originalSongId }),
      })

      if (!res.ok) {
        throw new Error('Failed to approve song')
      }

      const approvedSong = pendingSongs.find((song) => song.id === id)
      if (approvedSong) {
        setApprovedSongs((prev) => [...prev, approvedSong])
        setPendingSongs((prev) => prev.filter((song) => song.id !== id))
      }

      setSuccessMessage('Song approved successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error approving song:', err)
      setErrorMessage('Failed to approve song. Please try again.')
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const deleteSong = async (id: string, collection: 'songs' | 'pendingSongs') => {
    if (!confirm('Are you sure you want to delete this song?')) {
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`/api/songs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collection }),
      })

      if (!res.ok) {
        throw new Error('Failed to delete song')
      }

      if (collection === 'pendingSongs') {
        setPendingSongs((prev) => prev.filter((song) => song.id !== id))
      } else {
        setApprovedSongs((prev) => prev.filter((song) => song.id !== id))
      }

      setSuccessMessage('Song deleted successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error deleting song:', err)
      setErrorMessage('Failed to delete song. Please try again.')
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const updateReportStatus = async (
    reportId: string,
    newStatus: 'pending' | 'reviewed' | 'resolved',
  ) => {
    try {
      setLoading(true)

      const report = lyricsReports.find((r) => r.id === reportId)
      const reportRef = doc(db, 'lyricsReports', reportId)
      await updateDoc(reportRef, {
        status: newStatus,
        updatedAt: new Date(),
      })

      if (newStatus === 'resolved' && report && report.songId && report.reporterId) {
        await fetch(`/api/songs/${report.songId}/add-contributor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: report.reporterId }),
        })
      }

      setLyricsReports((prev) =>
        prev.map((report) =>
          report.id === reportId ? { ...report, status: newStatus, updatedAt: new Date() } : report,
        ),
      )

      setSuccessMessage(`Report marked as ${newStatus}`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error updating report status:', err)
      setErrorMessage('Failed to update report status. Please try again.')
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const deleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return
    }

    try {
      setLoading(true)

      const reportRef = doc(db, 'lyricsReports', reportId)
      await deleteDoc(reportRef)

      setLyricsReports((prev) => prev.filter((report) => report.id !== reportId))

      setSuccessMessage('Report deleted successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error deleting report:', err)
      setErrorMessage('Failed to delete report. Please try again.')
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (song: Song, tab: status) => {
    setEditingSong({ ...song })
    setEditingTab(tab)
  }

  const cancelEditing = () => {
    setEditingSong(null)
  }

  const handleAddAltNameInput = () => setAltNamesInput([...altNamesInput, ''])
  const handleRemoveAltNameInput = (idx: number) =>
    setAltNamesInput(altNamesInput.filter((_, i) => i !== idx))
  const handleAltNameInputChange = (idx: number, value: string) =>
    setAltNamesInput(altNamesInput.map((n, i) => (i === idx ? value : n)))

  const saveSongChanges = async () => {
    if (!editingSong) return

    try {
      setLoading(true)

      // const collection = editingTab === 'approved' ? 'songs' : 'pendingSongs'

      const updatedSong = {
        ...editingSong,
        info: {
          ...editingSong.info,
          altNames: altNamesInput.filter(Boolean),
          updatedAt: new Date(),
        },
        status: editingTab,
      }

      const res = await fetch(`/api/songs/${editingSong.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSong),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('Server response:', errorData)
        throw new Error(`Failed to update song: ${errorData.error || res.status}`)
      }

      if (editingTab === 'approved') {
        setApprovedSongs((prev) =>
          prev.map((song) => (song.id === editingSong.id ? updatedSong : song)),
        )
      } else {
        setPendingSongs((prev) =>
          prev.map((song) => (song.id === editingSong.id ? updatedSong : song)),
        )
      }

      setEditingSong(null)
      setSuccessMessage('Song updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error updating song:', err)
      setErrorMessage('Failed to update song. Please try again.')
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const getReportReasonText = (reason: string) => {
    const reasonMap: Record<string, string> = {
      wrong_lyrics: 'Lời không chính xác',
      missing_lyrics: 'Thiếu một phần lời',
      wrong_punctuation: 'Lỗi chính tả/dấu câu',
      wrong_formatting: 'Lỗi định dạng',
      other: 'Lý do khác',
    }

    return reasonMap[reason] || reason
  }

  if (editingSong) {
    const availableLanguages = Object.keys(editingSong.versions || {}) as Language[]
    const currentLyrics = editingSong.versions[activeLanguageTab]?.lyrics || ''

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-6 gap-2">
          <button
            onClick={cancelEditing}
            className="flex items-center text-gray-600 hover:text-blue-500"
          >
            <ArrowLeft size={18} className="mr-1" /> Back to List
          </button>
          <h1 className="text-2xl font-bold ml-4">
            {editingSong.originalSongId ? 'Edit Pending Lyrics' : 'Edit Song'}
            {editingSong.originalSongId && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                lyrics mới cho bài {editingSong.originalSongId.slice(0, 6)}...
              </span>
            )}
          </h1>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={editingSong.info?.title || ''}
                onChange={(e) =>
                  setEditingSong({
                    ...editingSong,
                    info: { ...editingSong.info, title: e.target.value },
                  })
                }
                className="w-full border rounded p-2"
                disabled={!!editingSong.originalSongId}
              />
              {editingSong.originalSongId && (
                <p className="text-xs text-gray-500 mt-1">
                  Title không thể thay đổi khi thêm lyrics mới
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Tên thay thế (Alt name)</label>
              <div className="space-y-2 mt-1">
                {altNamesInput.map((name, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleAltNameInputChange(idx, e.target.value)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder={`Tên thay thế #${idx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAltNameInput(idx)}
                      className="text-red-500 hover:text-red-700 px-2 py-1"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddAltNameInput}
                  className="text-primary hover:underline text-sm mt-1"
                >
                  + Thêm tên thay thế
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Artist</label>
              <input
                type="text"
                name="artist"
                value={editingSong.info?.artist || ''}
                onChange={(e) =>
                  setEditingSong({
                    ...editingSong,
                    info: { ...editingSong.info, artist: e.target.value },
                  })
                }
                className="w-full border rounded p-2"
                disabled={!!editingSong.originalSongId}
              />
              {editingSong.originalSongId && (
                <p className="text-xs text-gray-500 mt-1">
                  Artist không thể thay đổi khi thêm lyrics mới
                </p>
              )}
            </div>
          </div>

          {availableLanguages.length > 1 && !editingSong.originalSongId && (
            <div>
              <label className="block mb-1 font-medium">Ngôn ngữ</label>
              <div className="flex border-b mb-4">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    className={`py-2 px-4 border-b-2 ${
                      activeLanguageTab === lang
                        ? 'border-blue-500 text-blue-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setActiveLanguageTab(lang)}
                  >
                    {getLangDisplayName(lang)}
                  </button>
                ))}
                <button
                  onClick={() => {
                    const newLang = Object.values(Language).find(
                      (l) => !availableLanguages.includes(l),
                    )
                    if (newLang) {
                      setEditingSong({
                        ...editingSong,
                        versions: {
                          ...editingSong.versions,
                          [newLang]: {
                            lyrics: '',
                            contributors: editingSong.info?.contributors || [],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                          },
                        },
                      })
                      setActiveLanguageTab(newLang)
                    }
                  }}
                  className="ml-2 py-1 px-2 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                >
                  + Thêm ngôn ngữ
                </button>
              </div>
            </div>
          )}

          {editingSong.originalSongId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Language</label>
                <select
                  name="language"
                  value={activeLanguageTab || 'vietnamese'}
                  onChange={(e) => {
                    const oldLang = activeLanguageTab
                    const newLang = e.target.value as Language
                    if (oldLang && editingSong.versions[oldLang]) {
                      const updatedVersions = { ...editingSong.versions }
                      updatedVersions[newLang] = updatedVersions[oldLang]
                      delete updatedVersions[oldLang]
                      setEditingSong({
                        ...editingSong,
                        versions: updatedVersions,
                      })
                      setActiveLanguageTab(newLang)
                    }
                  }}
                  className="w-full border rounded p-2"
                >
                  <option value="vietnamese">Vietnamese</option>
                  <option value="english">English</option>
                  <option value="korean">Korean</option>
                  <option value="japanese">Japanese</option>
                  <option value="romaji">Japanese (Romaji)</option>
                  <option value="chinese">Chinese</option>
                  <option value="other">Other</option>
                </select>
                <p className="text-xs text-blue-500 font-medium mt-1">
                  Đây là lyrics mới {activeLanguageTab} cho bài gốc
                </p>
              </div>
            </div>
          ) : (
            <div>
              <label className="block mb-1 font-medium">Đổi ngôn ngữ</label>
              <div className="flex items-end gap-2">
                <div className="w-full sm:w-1/2">
                  <select
                    name="languageChange"
                    value={activeLanguageTab}
                    onChange={(e) => {
                      const newLang = e.target.value as Language
                      if (activeLanguageTab !== newLang) {
                        if (editingSong.versions[newLang]) {
                          if (
                            window.confirm(
                              `Ngôn ngữ ${getLangDisplayName(newLang)} đã tồn tại. Bạn có muốn ghi đè không?`,
                            )
                          ) {
                            const updatedVersions = { ...editingSong.versions }
                            updatedVersions[newLang] = {
                              ...updatedVersions[activeLanguageTab],
                              lyrics: updatedVersions[activeLanguageTab]?.lyrics || '',
                              contributors: updatedVersions[activeLanguageTab]?.contributors || [],
                              createdAt: new Date(),
                              updatedAt: new Date(),
                            }
                            delete updatedVersions[activeLanguageTab]

                            setEditingSong({
                              ...editingSong,
                              versions: updatedVersions,
                            })
                            setActiveLanguageTab(newLang)
                          }
                        } else {
                          const updatedVersions = { ...editingSong.versions }
                          updatedVersions[newLang] = updatedVersions[activeLanguageTab]
                          delete updatedVersions[activeLanguageTab]

                          setEditingSong({
                            ...editingSong,
                            versions: updatedVersions,
                          })
                          setActiveLanguageTab(newLang)
                        }
                      }
                    }}
                    className="w-full border rounded p-2"
                  >
                    {Object.values(Language).map((lang) => (
                      <option key={lang} value={lang}>
                        {getLangDisplayName(lang)}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-500">Thay đổi ngôn ngữ cho phiên bản lyrics này</p>
              </div>
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">
              Lyrics {getLangDisplayName(activeLanguageTab)}
            </label>
            <textarea
              name="lyrics"
              value={currentLyrics}
              onChange={(e) => {
                const lang = activeLanguageTab
                if (lang) {
                  setEditingSong({
                    ...editingSong,
                    versions: {
                      ...editingSong.versions,
                      [lang]: {
                        ...editingSong.versions[lang],
                        lyrics: e.target.value,
                      },
                    },
                  })
                }
              }}
              rows={15}
              className="w-full border rounded p-2 font-mono"
            ></textarea>
            {!editingSong.originalSongId && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Bạn có chắc muốn xóa lyrics ${getLangDisplayName(activeLanguageTab)} không?`,
                      )
                    ) {
                      const updatedVersions = { ...editingSong.versions }
                      delete updatedVersions[activeLanguageTab]
                      setEditingSong({
                        ...editingSong,
                        versions: updatedVersions,
                      })
                      if (Object.keys(updatedVersions).length > 0) {
                        setActiveLanguageTab(Object.keys(updatedVersions)[0] as Language)
                      } else {
                        setActiveLanguageTab(Language.VIETNAMESE)
                      }
                    }
                  }}
                  className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                  disabled={Object.keys(editingSong.versions || {}).length <= 1}
                >
                  Xóa lyrics này
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={cancelEditing}
              className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={saveSongChanges}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 border-b-2 ${
            activeTab === 'pending'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Songs
        </button>
        <button
          className={`py-2 px-4 border-b-2 ${
            activeTab === 'approved'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Songs
        </button>
        <button
          className={`py-2 px-4 border-b-2 ${
            activeTab === 'reports'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('reports')}
        >
          Lyrics Reports
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={activeTab === 'reports' ? fetchLyricsReports : fetchSongs}
          className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>

        {activeTab === 'approved' && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Tìm theo tên hoặc ca sĩ..."
              className="pl-10 pr-4 py-1 border rounded w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {activeTab === 'pending' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border-b text-left">Title</th>
                <th className="py-2 px-3 border-b text-left">Artist</th>
                <th className="py-2 px-3 border-b text-left">Language</th>
                <th className="py-2 px-3 border-b text-left">Type</th>
                <th className="py-2 px-3 border-b text-left">Date</th>
                <th className="py-2 px-3 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSongs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No pending songs found
                  </td>
                </tr>
              ) : (
                pendingSongs.map((song) => (
                  <tr key={song.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border-b">{song.info?.title}</td>
                    <td className="py-2 px-3 border-b">{song.info?.artist}</td>
                    <td className="py-2 px-3 border-b">
                      {Object.keys(song.versions || {}).length > 0
                        ? Object.keys(song.versions)[0]
                        : 'N/A'}
                    </td>
                    <td className="py-2 px-3 border-b">
                      {song.originalSongId ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Lyrics mới ({song.originalSongId.slice(0, 6)}...)
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Bài hát mới
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-b">
                      {new Date(song.info?.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveSong(song.id, song.originalSongId)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => startEditing(song, 'pending')}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteSong(song.id, 'pendingSongs')}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash size={18} />
                        </button>
                        <button
                          onClick={() => {
                            const language = Object.keys(song.versions || {})[0] as Language
                            const lyrics = song.versions[language]?.lyrics || ''
                            alert(`Lyrics (${language}):\n\n${lyrics}`)
                          }}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Xem lyrics"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'approved' && (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 border-b text-left">Title</th>
                  <th className="py-2 px-3 border-b text-left">Artist</th>
                  <th className="py-2 px-3 border-b text-left">Language</th>
                  <th className="py-2 px-3 border-b text-left">Views</th>
                  <th className="py-2 px-3 border-b text-left">Likes</th>
                  <th className="py-2 px-3 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApprovedSongs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      {searchTerm
                        ? 'Không tìm thấy bài hát nào'
                        : 'Không có bài hát nào đã được duyệt'}
                    </td>
                  </tr>
                ) : (
                  getCurrentPageItems().map((song) => (
                    <tr key={song.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border-b flex items-center gap-2">
                        <span>{song.info?.title}</span>
                        {song && song.id && (
                          <a
                            // onClick={() => router.push(`/songs/${song.id}`)}
                            className="p-1 text-gray-500 hover:text-primary"
                            title="Xem bài hát"
                            href={`/songs/${song.id}`}
                            target="_blank"
                          >
                            <Eye size={16} />
                          </a>
                        )}
                      </td>
                      <td className="py-2 px-3 border-b">{song.info?.artist}</td>
                      <td className="py-2 px-3 border-b">
                        {Object.keys(song.versions || {}).length > 0
                          ? Object.keys(song.versions)[0]
                          : 'N/A'}
                      </td>
                      <td className="py-2 px-3 border-b">{song.info?.views || 0}</td>
                      <td className="py-2 px-3 border-b">{song.info?.likes || 0}</td>
                      <td className="py-2 px-3 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(song, 'approved')}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteSong(song.id, 'songs')}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredApprovedSongs.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="border rounded px-2 py-1 mr-2"
                >
                  <option value="10">10 / trang</option>
                  <option value="20">20 / trang</option>
                  <option value="50">50 / trang</option>
                </select>
                <span className="text-sm text-gray-600">
                  {`Trang ${currentPage} / ${totalPages}`}
                </span>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded border mr-1 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageToShow = i + 1
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      if (i === 0) return currentPage - 2
                      if (i === 1) return currentPage - 1
                      if (i === 2) return currentPage
                      if (i === 3) return currentPage + 1
                      if (i === 4) return currentPage + 2
                    }
                  }
                  return pageToShow
                }).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 mx-1 rounded ${
                      currentPage === page ? 'bg-blue-500 text-white' : 'border hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded border ml-1 disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {hasMore && (
                <button
                  onClick={loadMoreSongs}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
                >
                  {loading ? <RefreshCw size={16} className="mr-1 animate-spin" /> : null}
                  Tải thêm bài hát
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border-b text-left">Song</th>
                <th className="py-2 px-3 border-b text-left">Reason</th>
                <th className="py-2 px-3 border-b text-left">Details</th>
                <th className="py-2 px-3 border-b text-left">Status</th>
                <th className="py-2 px-3 border-b text-left">Reported On</th>
                <th className="py-2 px-3 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lyricsReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No lyrics reports found
                  </td>
                </tr>
              ) : (
                lyricsReports.map((report) => {
                  const song = report.song
                  return (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border-b">
                        {song ? (
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-medium">{song.info?.title || 'Không rõ'}</div>
                              <div className="text-sm text-gray-500">
                                {song.info?.artist || 'Không rõ'}
                              </div>
                            </div>
                            {song && song.id && (
                              <a
                                // onClick={() => router.push(`/songs/${song.id}`)}
                                className="p-1 text-gray-500 hover:text-primary"
                                title="Xem bài hát"
                                href={`/songs/${song.id}`}
                                target="_blank"
                              >
                                <Eye size={16} />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">Unknown song</span>
                        )}
                      </td>
                      <td className="py-2 px-3 border-b">{getReportReasonText(report.reason)}</td>
                      <td className="py-2 px-3 border-b">
                        <div className="max-w-xs truncate flex items-center gap-2">
                          <span>{report.details.slice(0, 20) || '-'}</span>
                          <button
                            className="text-blue-600 hover:underline text-xs"
                            onClick={() => setReportDetailModal(report)}
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-3 border-b">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${
                              report.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : report.status === 'reviewed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                        >
                          {report.status === 'pending'
                            ? 'Đang chờ'
                            : report.status === 'reviewed'
                              ? 'Đã xem xét'
                              : 'Đã giải quyết'}
                        </span>
                      </td>
                      <td className="py-2 px-3 border-b">
                        {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-2 px-3 border-b">
                        <div className="flex space-x-2">
                          {report.status === 'pending' && (
                            <button
                              onClick={() => updateReportStatus(report.id, 'reviewed')}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Mark as Reviewed"
                            >
                              <AlertCircle size={18} />
                            </button>
                          )}
                          {(report.status === 'pending' || report.status === 'reviewed') && (
                            <button
                              onClick={() => updateReportStatus(report.id, 'resolved')}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Mark as Resolved"
                            >
                              <Check size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete Report"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {reportDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setReportDetailModal(null)}
            >
              Đóng
            </button>
            <h2 className="text-xl font-bold mb-4">Chi tiết báo cáo lời bài hát</h2>
            <div className="mb-2">
              <b>Bài hát:</b>{' '}
              {reportDetailModal.song ? reportDetailModal.song.info?.title : 'Không rõ'}
            </div>
            <div className="mb-2">
              <b>Người báo cáo:</b>{' '}
              {reportDetailModal.reporterName || reportDetailModal.reporterId || 'Ẩn danh'}
            </div>
            {reportDetailModal.reporterEmail && (
              <div className="mb-2">
                <b>Email:</b> {reportDetailModal.reporterEmail}
              </div>
            )}
            <div className="mb-2">
              <b>Lý do:</b> {getReportReasonText(reportDetailModal.reason)}
            </div>
            <div className="mb-2">
              <b>Ngày báo cáo:</b> {new Date(reportDetailModal.createdAt).toLocaleString('vi-VN')}
            </div>
            <div className="mb-2">
              <b>Chi tiết:</b>
            </div>
            <div className="whitespace-pre-line border rounded p-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              {reportDetailModal.details}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
