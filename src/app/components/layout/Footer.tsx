'use client';

import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">NeriChi</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Nơi tìm kiếm, lưu trữ và chia sẻ lời bài hát yêu thích của bạn.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <FiFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <FiTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <FiInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">YouTube</span>
                <FiYoutube size={24} />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                  Nerichi
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/about"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Liên hệ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Chính sách bảo mật
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Điều khoản sử dụng
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                  Tài nguyên
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/songs"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Tất cả bài hát
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/top"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Xếp hạng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/add-song"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Thêm lời bài hát
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                  Ngôn ngữ
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/songs?language=vietnamese"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Tiếng Việt
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/songs?language=english"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Tiếng Anh
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/songs?language=korean"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Tiếng Hàn
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/songs?language=japanese"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Tiếng Nhật
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                  Tài khoản
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/profile"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Hồ sơ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/saved-songs"
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Bài hát đã lưu
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {currentYear} NeriChi. Đã đăng ký bản quyền.
          </p>
        </div>
      </div>
    </footer>
  );
} 