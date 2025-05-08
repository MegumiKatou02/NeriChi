import Link from 'next/link'
import { FiUser, FiHome } from 'react-icons/fi'

export default function UserNotFound() {
  return (
    <div className="container py-10 mx-auto max-w-5xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-6">
            <FiUser className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Không tìm thấy người dùng
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Người dùng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>

          <Link
            href="/"
            className="inline-flex items-center px-5 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FiHome className="mr-2" />
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
