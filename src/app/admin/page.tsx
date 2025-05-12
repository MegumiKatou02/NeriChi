'use client'

import { useEffect, useState } from 'react'
import { Trash, Edit, Check, RefreshCw, Save, ArrowLeft, AlertCircle, Eye } from 'lucide-react'
import type { Song } from '../types'
import { auth, db } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { updateDoc, doc, deleteDoc } from 'firebase/firestore'

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
}

export default function AdminPage() {
  type status = 'approved' | 'pending'

  const [pendingSongs, setPendingSongs] = useState<Song[]>([])
  const [approvedSongs, setApprovedSongs] = useState<Song[]>([])
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
  }, [router, adminUid])

  const fetchSongs = async () => {
    setLoading(true)
    try {
      const pendingRes = await fetch('/api/pending-song')
      const pendingData = await pendingRes.json()
      setPendingSongs(pendingData)

      const approvedRes = await fetch('/api/songs')
      const approvedData = await approvedRes.json()
      setApprovedSongs(approvedData)
    } catch (err) {
      console.error('Failed to fetch songs', err)
      setErrorMessage('Failed to load songs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchLyricsReports = async () => {
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
  }

  const approveSong = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch('/api/approve-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
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

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    if (!editingSong) return

    setEditingSong({
      ...editingSong,
      [e.target.name]: e.target.value,
    })
  }

  const saveSongChanges = async () => {
    if (!editingSong) return

    try {
      setLoading(true)

      const updatedSong = {
        ...editingSong,
        updatedAt: new Date(),
        createdAt: editingSong.createdAt instanceof Date ? editingSong.createdAt : new Date(editingSong.createdAt || Date.now()),
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
        throw new Error('Failed to update song')
      }

      if (editingSong.approved) {
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
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-6 gap-2">
          <button
            onClick={cancelEditing}
            className="flex items-center text-gray-600 hover:text-blue-500"
          >
            <ArrowLeft size={18} className="mr-1" /> Back to List
          </button>
          <h1 className="text-2xl font-bold ml-4">Edit Song</h1>
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
                value={editingSong.title}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Artist</label>
              <input
                type="text"
                name="artist"
                value={editingSong.artist}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Language</label>
              <select
                name="language"
                value={editingSong.language}
                onChange={handleEditChange}
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
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Lyrics</label>
            <textarea
              name="lyrics"
              value={editingSong.lyrics}
              onChange={handleEditChange}
              rows={15}
              className="w-full border rounded p-2 font-mono"
            ></textarea>
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
      </div>

      {activeTab === 'pending' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border-b text-left">Title</th>
                <th className="py-2 px-3 border-b text-left">Artist</th>
                <th className="py-2 px-3 border-b text-left">Language</th>
                <th className="py-2 px-3 border-b text-left">Date</th>
                <th className="py-2 px-3 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSongs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No pending songs found
                  </td>
                </tr>
              ) : (
                pendingSongs.map((song) => (
                  <tr key={song.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border-b">{song.title}</td>
                    <td className="py-2 px-3 border-b">{song.artist}</td>
                    <td className="py-2 px-3 border-b">{song.language}</td>
                    <td className="py-2 px-3 border-b">
                      {new Date(song.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveSong(song.id)}
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
              {approvedSongs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No approved songs found
                  </td>
                </tr>
              ) : (
                approvedSongs.map((song) => (
                  <tr key={song.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border-b flex items-center gap-2">
                      <span>{song.title}</span>
                      {song && song.id && (
                        <button
                          onClick={() => router.push(`/songs/${song.id}`)}
                          className="p-1 text-gray-500 hover:text-primary"
                          title="Xem bài hát"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                    </td>
                    <td className="py-2 px-3 border-b">{song.artist}</td>
                    <td className="py-2 px-3 border-b">{song.language}</td>
                    <td className="py-2 px-3 border-b">{song.views}</td>
                    <td className="py-2 px-3 border-b">{song.likes || 0}</td>
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
                  const song = report.song;
                  return (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border-b">
                        {song ? (
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-medium">{song.title}</div>
                              <div className="text-sm text-gray-500">{song.artist}</div>
                            </div>
                            {song && song.id && (
                              <button
                                onClick={() => router.push(`/songs/${song.id}`)}
                                className="p-1 text-gray-500 hover:text-primary"
                                title="Xem bài hát"
                              >
                                <Eye size={16} />
                              </button>
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
                          {report.details && report.details.length > 1 && (
                            <button
                              className="text-blue-600 hover:underline text-xs"
                              onClick={() => setReportDetailModal(report)}
                            >
                              Xem chi tiết
                            </button>
                          )}
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
                  );
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
            <div className="mb-2"><b>Bài hát:</b> {reportDetailModal.song ? reportDetailModal.song.title : 'Không rõ'}</div>
            <div className="mb-2"><b>Người báo cáo:</b> {reportDetailModal.reporterName || reportDetailModal.reporterId || 'Ẩn danh'}</div>
            <div className="mb-2"><b>Lý do:</b> {getReportReasonText(reportDetailModal.reason)}</div>
            <div className="mb-2"><b>Ngày báo cáo:</b> {new Date(reportDetailModal.createdAt).toLocaleString('vi-VN')}</div>
            <div className="mb-2"><b>Chi tiết:</b></div>
            <div className="whitespace-pre-line border rounded p-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              {reportDetailModal.details}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
