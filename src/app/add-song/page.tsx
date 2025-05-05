'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/layout/MainLayout';
import AddSongForm from '../components/song/AddSongForm';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/store';
import { FiLock } from 'react-icons/fi';

export default function AddSongPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { setIsAuthModalOpen, setAuthModalType } = useUIStore();

  useEffect(() => {
    if (!loading && !user) {
      setAuthModalType('login');
      setIsAuthModalOpen(true);
    }
  }, [user, loading, setIsAuthModalOpen, setAuthModalType]);

  if (loading) {
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
                Bạn cần đăng nhập để thêm lời bài hát mới. Đăng nhập để tiếp tục.
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Thêm lời bài hát mới</h1>
        <AddSongForm />
      </div>
    </MainLayout>
  );
} 