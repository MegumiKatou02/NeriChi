'use client'

import { useState, useEffect } from 'react'
import { FiCopy, FiHeart, FiShare2, FiEye, FiFlag, FiUsers, FiGlobe } from 'react-icons/fi'
import { Song, Language } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { useSongs } from '../../hooks/useSongs'
import ContributorAvatars from '../shared/ContributorAvatars'
import { useRouter } from 'next/navigation'

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
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [lyrics, setLyrics] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    if (song.versions) {
      const availableLanguages = Object.keys(song.versions) as Language[]
      
      let initialLanguage: Language | null = null
      if (availableLanguages.includes(Language.VIETNAMESE)) {
        initialLanguage = Language.VIETNAMESE
      } else if (availableLanguages.length > 0) {
        initialLanguage = availableLanguages[0]
      }
      
      if (initialLanguage) {
        setSelectedLanguage(initialLanguage)
        setLyrics(song.versions[initialLanguage]?.lyrics || '')
      }
    }
  }, [song])

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language)
    setLyrics(song.versions[language]?.lyrics || '')
  }

  const handleCopyLyrics = () => {
    if (lyrics) {
      navigator.clipboard.writeText(lyrics)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
    }
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
    const title = `${song.info.title} - ${song.info.artist} | Nerichi`

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{song.info.title}</h1>
        <p className="mt-1 text-xl text-gray-500 dark:text-gray-400">{song.info.artist}</p>
        {song.info.altNames && song.info.altNames.length > 0 && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
            <span className="font-medium">Tên khác:</span> {song.info.altNames.join(' • ')}
          </div>
        )}
      </div>

      <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-900/50 flex flex-wrap justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3 items-center mb-2 sm:mb-0">
          <FiGlobe className="text-gray-500 dark:text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {Object.keys(song.versions).map((langKey) => (
              <button
                key={langKey}
                onClick={() => handleLanguageChange(langKey as Language)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedLanguage === langKey
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {languageDisplay[langKey as Language]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FiEye className="mr-1" />
            <span>{song.info.views.toLocaleString()} lượt xem</span>
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
        <div className="whitespace-pre-line text-gray-900 dark:text-gray-100 lyrics-content">
          {lyrics || 'Không có lời bài hát cho ngôn ngữ này.'}
        </div>
        {user && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => router.push(`/add-song?songId=${song.id}`)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Thêm lời nhạc ngôn ngữ khác
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
            <div className="flex items-center">
            <FiUsers className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Người đóng góp:</span>
            {selectedLanguage && song.versions[selectedLanguage]?.contributors ? (
              <ContributorAvatars 
                contributors={song.versions[selectedLanguage]?.contributors || []} 
                size="sm"
                maxDisplay={5}
              />
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500">Không có thông tin</span>
            )}
          </div>
          <button
            onClick={handleShowReportModal}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 flex items-center"
          >
            <FiFlag className="mr-1" />
            Báo cáo
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {selectedLanguage && song.versions[selectedLanguage]?.updatedAt && (
            <span>
              Cập nhật: {formatDate(new Date(song.versions[selectedLanguage]?.updatedAt || song.info.updatedAt))}
            </span>
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={handleCloseReportModal}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
              onClick={(e) => e.stopPropagation()}
            >
              {reportSubmitted ? (
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-center flex-col text-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center">
                      <h3
                        className="text-xl leading-6 font-medium text-gray-900 dark:text-gray-100 mb-2"
                        id="modal-headline"
                      >
                        Cảm ơn bạn đã báo cáo!
                      </h3>
                      <div className="mt-4 mb-4">
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          Chúng tôi đã nhận được báo cáo của bạn về bài hát <span className="font-medium">{song.info.title}</span> và sẽ xem xét nó sớm nhất có thể.
                        </p>
                      </div>
                      <div className="mt-5 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-blue-800 dark:text-blue-200 text-sm mb-5">
                        Nếu báo cáo của bạn được chấp nhận, bạn sẽ được thêm vào danh sách người đóng góp cho bài hát này.
                      </div>
                      <button
                        onClick={handleCloseReportModal}
                        className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitReport} className="mt-5">
                      <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-6">
                        <div className="sm:flex sm:items-start">
                          <div className="w-full text-center sm:mt-0 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4" id="modal-headline">
                              Báo cáo lỗi lời bài hát
                            </h3>
                            
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-blue-800 dark:text-blue-200 text-sm">
                              <p>Bạn đang báo cáo lời bài hát <strong>{song.info.title}</strong> - <strong>{selectedLanguage && languageDisplay[selectedLanguage]}</strong></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 sm:px-6 pb-4">
                        <div className="mb-5">
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
                        <div className="mb-5">
                          <label
                            htmlFor="reportDetails"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Chi tiết lỗi <span className="text-gray-500 text-xs">(khuyến khích)</span>
                          </label>
                          <textarea
                            id="reportDetails"
                            value={reportDetails}
                            onChange={(e) => setReportDetails(e.target.value)}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            placeholder={`Hãy mô tả chi tiết về lỗi bạn tìm thấy trong phiên bản ${selectedLanguage ? languageDisplay[selectedLanguage] : ''} của bài hát.\n\nNhớ nhắn kèm theo đang báo cáo ở ngôn ngữ nào`}
                          ></textarea>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-5 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                          <p className="font-medium mb-1">Thông tin báo cáo:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Báo cáo của bạn sẽ được gửi đến đội ngũ quản trị viên</li>
                            <li>Chúng tôi sẽ xem xét và cập nhật lời bài hát nếu phù hợp</li>
                            <li>Bạn sẽ được thêm vào danh sách người đóng góp nếu báo cáo được chấp nhận</li>
                          </ul>
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
                                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                            }`}
                          >
                            {isSubmittingReport ? 'Đang gửi...' : 'Gửi báo cáo'}
                          </button>
                        </div>
                      </div>
                    </form>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
