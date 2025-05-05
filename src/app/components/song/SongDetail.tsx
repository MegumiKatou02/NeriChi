'use client';

import { useState } from 'react';
import { FiCopy, FiHeart, FiShare2, FiEye, FiThumbsUp, FiFlag } from 'react-icons/fi';
import { Song, Language } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useSongs } from '../../hooks/useSongs';

const languageDisplay: Record<Language, string> = {
  [Language.VIETNAMESE]: 'Tiếng Việt',
  [Language.ENGLISH]: 'Tiếng Anh',
  [Language.KOREAN]: 'Tiếng Hàn',
  [Language.JAPANESE]: 'Tiếng Nhật',
  [Language.CHINESE]: 'Tiếng Trung',
  [Language.OTHER]: 'Khác',
};

interface SongDetailProps {
  song: Song;
}

export default function SongDetail({ song }: SongDetailProps) {
  const { user } = useAuth();
  const { saveFavoriteSong } = useSongs();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopyLyrics = () => {
    navigator.clipboard.writeText(song.lyrics);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    try {
      setIsSaving(true);
      await saveFavoriteSong(song.id);
    } catch (error) {
      console.error('Lỗi khi lưu bài hát:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareTo = (platform: 'facebook' | 'twitter' | 'copy') => {
    const url = window.location.href;
    const title = `${song.title} - ${song.artist} | Nerichi`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }

    setShowShareOptions(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

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
          <div className="flex items-center">
            <FiThumbsUp className="mr-1" />
            <span>{song.likes.toLocaleString()} thích</span>
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

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-8">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngôn ngữ</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{languageDisplay[song.language]}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày thêm</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(song.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Cập nhật gần nhất</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(song.updatedAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FiFlag className="mr-1" />
            <span>Báo cáo lời sai</span>
          </button>
        </div>
      </div>
    </div>
  );
} 