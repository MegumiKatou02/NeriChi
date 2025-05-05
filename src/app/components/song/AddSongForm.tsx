'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSongs } from '../../hooks/useSongs';
import { Language } from '../../types';
import { FiMusic, FiUser, FiType, FiFlag, FiAlertCircle } from 'react-icons/fi';

export default function AddSongForm() {
  const router = useRouter();
  const { createSong } = useSongs();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [language, setLanguage] = useState<Language>(Language.VIETNAMESE);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tên bài hát';
    }

    if (!artist.trim()) {
      newErrors.artist = 'Vui lòng nhập tên ca sĩ';
    }

    if (!lyrics.trim()) {
      newErrors.lyrics = 'Vui lòng nhập lời bài hát';
    } else if (lyrics.trim().length < 30) {
      newErrors.lyrics = 'Lời bài hát quá ngắn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await createSong({
        title,
        artist,
        lyrics,
        language,
        contributors: [],
        approved: true,
      });
      setSuccess(true);
      setTitle('');
      setArtist('');
      setLyrics('');
      setLanguage(Language.VIETNAMESE);
      setTimeout(() => {
        router.push('/songs');
      }, 3000);
    } catch (error) {
      console.error('Error adding song:', error);
      setErrors({
        submit: (error as Error).message || 'Đã xảy ra lỗi khi thêm bài hát. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Thêm lời bài hát mới</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Đóng góp lời bài hát yêu thích của bạn để chia sẻ với cộng đồng
        </p>
      </div>

      {success ? (
        <div className="p-6">
          <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-md mb-6">
            <p className="font-medium">Cảm ơn bạn đã đóng góp!</p>
            <p className="mt-1">
              Lời bài hát của bạn đã được gửi và đang chờ xét duyệt. Chúng tôi sẽ xem xét và xuất bản sớm nhất có thể.
            </p>
            <p className="mt-3">Đang chuyển hướng về trang chủ...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md flex items-start">
              <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
              <p>{errors.submit}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tên bài hát <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMusic className="text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`pl-10 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm rounded-md ${
                  errors.title
                    ? 'border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 placeholder-red-300 dark:placeholder-red-700 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
                placeholder="Nhập tên bài hát"
              />
            </div>
            {errors.title && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ca sĩ <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className={`pl-10 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm rounded-md ${
                  errors.artist
                    ? 'border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 placeholder-red-300 dark:placeholder-red-700 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
                placeholder="Nhập tên ca sĩ"
              />
            </div>
            {errors.artist && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.artist}</p>}
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ngôn ngữ <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFlag className="text-gray-400" />
              </div>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="pl-10 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value={Language.VIETNAMESE}>Tiếng Việt</option>
                <option value={Language.ENGLISH}>Tiếng Anh</option>
                <option value={Language.KOREAN}>Tiếng Hàn</option>
                <option value={Language.JAPANESE}>Tiếng Nhật</option>
                <option value={Language.CHINESE}>Tiếng Trung</option>
                <option value={Language.ROMAJI}>Romaji</option>
                <option value={Language.OTHER}>Khác</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Lời bài hát <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FiType className="text-gray-400" />
              </div>
              <textarea
                id="lyrics"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                rows={15}
                className={`pl-10 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm rounded-md ${
                  errors.lyrics
                    ? 'border-red-300 dark:border-red-700 text-red-900 dark:text-red-200 placeholder-red-300 dark:placeholder-red-700 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
                placeholder="Nhập lời bài hát"
              />
            </div>
            {errors.lyrics && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.lyrics}</p>}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Vui lòng nhập lời bài hát đầy đủ và chính xác. Mỗi câu nên được viết trên một dòng.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? 'Đang xử lý...' : 'Gửi bài hát'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 