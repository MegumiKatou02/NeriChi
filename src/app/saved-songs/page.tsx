'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/layout/MainLayout';
import SongList from '../components/song/SongList';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/store';
import { getSavedSongs } from '../firebase/services';
import { Song } from '../types';
import { FiHeart, FiLoader, FiAlertCircle, FiLock } from 'react-icons/fi';

export default function SavedSongsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { setIsAuthModalOpen, setAuthModalType } = useUIStore();
  const [savedSongs, setSavedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSavedSongs() {
      if (!user) return;

      try {
        setLoading(true);
        const songs = await getSavedSongs();
        setSavedSongs(songs);
      } catch (err) {
        console.error('Lỗi khi tải bài hát đã lưu:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      fetchSavedSongs();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Đang tải...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="py-12 text-center">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-6 max-w-2xl mx-auto">
              <FiLock size={48} className="mx-auto text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cần đăng nhập</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Bạn cần đăng nhập để xem bài hát đã lưu. Đăng nhập để tiếp tục.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setAuthModalType('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Quay lại trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bài hát đã lưu</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Bài hát bạn đã lưu sẽ xuất hiện ở đây để bạn có thể truy cập nhanh chóng.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <FiLoader size={30} className="mx-auto animate-spin text-primary mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Đang tải bài hát đã lưu...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-6 rounded-md flex items-start">
            <FiAlertCircle className="mt-0.5 mr-3 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-lg font-medium">Đã xảy ra lỗi</h3>
              <p className="mt-1">Không thể tải bài hát đã lưu. Vui lòng thử lại sau.</p>
            </div>
          </div>
        ) : savedSongs.length === 0 ? (
          <div className="py-16 text-center">
            <FiHeart size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chưa có bài hát nào được lưu
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Khi bạn lưu bài hát, chúng sẽ xuất hiện ở đây để bạn có thể truy cập dễ dàng.
            </p>
            <button
              onClick={() => router.push('/songs')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Khám phá bài hát
            </button>
          </div>
        ) : (
          <SongList initialSongs={savedSongs} title="" />
        )}
      </div>
    </MainLayout>
  );
} 