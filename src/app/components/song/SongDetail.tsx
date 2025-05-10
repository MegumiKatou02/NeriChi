'use client'

import { useState } from 'react'
import { FiCopy, FiHeart, FiShare2, FiEye, FiFlag, FiUsers } from 'react-icons/fi'
import { Song, Language } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { useSongs } from '../../hooks/useSongs'
import ContributorAvatars from '../shared/ContributorAvatars'

const languageDisplay: Record<Language, string> = {
  [Language.VIETNAMESE]: 'Tiếng Việt',
  [Language.ENGLISH]: 'Tiếng Anh',
  [Language.KOREAN]: 'Tiếng Hàn',
  [Language.JAPANESE]: 'Tiếng Nhật',
  [Language.CHINESE]: 'Tiếng Trung',
  [Language.ROMAJI]: 'Tiếng Nhật (Romaji)',
  [Language.OTHER]: 'Khác',
}

interface SongDetailProps {
  song: Song
}

export default function SongDetail({ song }: SongDetailProps) {
  const { user } = useAuth()
  const { saveFavoriteSong, reportLyrics } = useSongs()
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)

  const handleCopyLyrics = () => {
    navigator.clipboard.writeText(song.lyrics)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!user) {
      return
    }

    try {
      setIsSaving(true)
      await saveFavoriteSong(song.id)
    } catch (error) {
      console.error('Lỗi khi lưu bài hát:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = () => {
    setShowShareOptions(!showShareOptions)
  }

  const shareTo = (platform: 'facebook' | 'twitter' | 'copy') => {
    const url = window.location.href
    const title = `${song.title} - ${song.artist} | Nerichi`

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
        break
    }

    setShowShareOptions(false)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const handleShowReportModal = () => {
    setShowReportModal(true)
  }

  const handleCloseReportModal = () => {
    if (!isSubmittingReport) {
      setShowReportModal(false)
      if (reportSubmitted) {
        setReportSubmitted(false)
        setReportReason('')
        setReportDetails('')
      }
    }
  }

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      return
    }

    if (!reportReason) {
      return
    }

    try {
      setIsSubmittingReport(true)
      await reportLyrics(song.id, {
        reason: reportReason,
        details: reportDetails,
      })
      setReportSubmitted(true)
    } catch (error) {
      console.error('Lỗi khi báo cáo lời bài hát:', error)
    } finally {
      setIsSubmittingReport(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{song.title}</h1>
        <p className="mt-1 text-xl text-gray-500 dark:text-gray-400">{song.artist}</p>
      </div>

      <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FiEye className="mr-1" />
            <span>{song.views.toLocaleString()} lượt xem</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopyLyrics}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-primary"
            title={isCopied ? 'Đã sao chép' : 'Sao chép lời bài hát'}
          >
            <FiCopy size={18} />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-primary"
            title="Lưu bài hát"
          >
            <FiHeart size={18} />
          </button>
          <div className="relative">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-primary"
              title="Chia sẻ"
            >
              <FiShare2 size={18} />
            </button>
            {showShareOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => shareTo('facebook')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => shareTo('twitter')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => shareTo('copy')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sao chép link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6">
        <div className="whitespace-pre-line text-lg text-gray-900 dark:text-gray-100 mb-8 leading-7">
          {song.lyrics}
        </div>

        {song.contributors && song.contributors.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <FiUsers className="text-gray-500 dark:text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Người đóng góp
              </h3>
            </div>
            <div className="flex items-center">
              <ContributorAvatars contributors={song.contributors} maxDisplay={8} size="md" />
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-8">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngôn ngữ</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {languageDisplay[song.language]}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày thêm</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formatDate(song.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Cập nhật gần nhất
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formatDate(song.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={handleShowReportModal}
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FiFlag className="mr-1" />
            <span>Báo cáo lời sai</span>
          </button>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={handleCloseReportModal}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {!reportSubmitted ? (
                  <>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                        <FiFlag className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                          Báo cáo lời bài hát
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Vui lòng cho chúng tôi biết lý do bạn cho rằng lời bài hát này có sai
                            sót để chúng tôi có thể xem xét và cập nhật.
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmitReport} className="mt-5">
                      <div className="mb-4">
                        <label
                          htmlFor="reportReason"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Lý do báo cáo <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="reportReason"
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          required
                        >
                          <option value="">-- Chọn lý do --</option>
                          <option value="wrong_lyrics">Lời không chính xác</option>
                          <option value="missing_lyrics">Thiếu một phần lời</option>
                          <option value="wrong_punctuation">Lỗi chính tả/dấu câu</option>
                          <option value="wrong_formatting">Lỗi định dạng</option>
                          <option value="other">Lý do khác</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="reportDetails"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Chi tiết
                        </label>
                        <textarea
                          id="reportDetails"
                          value={reportDetails}
                          onChange={(e) => setReportDetails(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          placeholder="Vui lòng cung cấp thêm thông tin chi tiết về lỗi bạn tìm thấy..."
                        ></textarea>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Báo cáo của bạn sẽ được gửi đến đội ngũ quản trị viên để xem xét. Cảm ơn bạn
                        đã giúp chúng tôi cải thiện nội dung.
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCloseReportModal}
                          className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingReport || !reportReason}
                          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isSubmittingReport || !reportReason
                              ? 'bg-gray-400 dark:bg-gray-600'
                              : 'bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                          }`}
                        >
                          {isSubmittingReport ? 'Đang gửi...' : 'Gửi báo cáo'}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                      <svg
                        className="h-6 w-6 text-green-600 dark:text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-gray-100">
                      Cảm ơn bạn đã báo cáo!
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Báo cáo của bạn đã được gửi thành công. Đội ngũ quản trị viên sẽ xem xét và
                      cập nhật nếu cần thiết.
                    </p>
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={handleCloseReportModal}
                        className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
