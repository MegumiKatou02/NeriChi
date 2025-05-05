'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/store';
import { useTheme } from '../hooks/useTheme';
import { FiUser, FiMail, FiCalendar, FiLock, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Image from 'next/image'

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const { setIsAuthModalOpen, setAuthModalType } = useUIStore();
  const { toggleTheme, isDark } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setError(null);

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { displayName });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
                Bạn cần đăng nhập để xem trang hồ sơ cá nhân.
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Hồ sơ người dùng</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 sm:mb-0 sm:mr-6">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User Avatar'}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <FiUser size={36} />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.displayName}</h2>
                <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                  <FiMail className="mr-1" />
                  <span>{user.email}</span>
                </div>
                <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                  <FiCalendar className="mr-1" />
                  <span>
                    Tham gia từ {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Thông tin cá nhân</h3>

                {success && (
                  <div className="mb-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-3 rounded-md">
                    Cập nhật thông tin thành công!
                  </div>
                )}

                {error && (
                  <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tên hiển thị
                      </label>
                      <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={user.email}
                        disabled
                        className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Email không thể thay đổi.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tùy chọn</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {isDark ? <FiMoon className="mr-2" /> : <FiSun className="mr-2" />}
                      <span className="text-gray-700 dark:text-gray-300">Chế độ {isDark ? 'tối' : 'sáng'}</span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Chuyển đổi
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Đăng xuất</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Bạn sẽ được đăng xuất khỏi tài khoản hiện tại.
                </p>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiLogOut className="mr-2" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 