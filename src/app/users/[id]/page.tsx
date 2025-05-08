import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/firebase/config'
import { User } from '@/app/types'
import UserProfile from '@/app/components/user/UserProfile'
import Image from 'next/image'
import { FiCalendar, FiUser } from 'react-icons/fi'

interface UserPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const { id } = await params

  if (!id) notFound()

  const userId = id ?? null
  if (!userId) notFound()

  try {
    const userDoc = await getDoc(doc(db, 'users', userId))

    if (!userDoc.exists()) {
      return {
        title: 'Người dùng không tồn tại',
      }
    }

    const userData = userDoc.data() as Omit<User, 'uid'>
    return {
      title: `${userData.displayName || 'Người dùng'} | NeriChi`,
      description: `Trang cá nhân của ${userData.displayName || 'người dùng'} trên NeriChi - Thư viện lời bài hát`,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Trang người dùng | NeriChi',
    }
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params

  if (!id) notFound()

  const userId = id ?? null
  if (!userId) notFound()

  try {
    const userDoc = await getDoc(doc(db, 'users', userId))

    if (!userDoc.exists()) {
      notFound()
    }

    const userData = {
      uid: userId,
      ...userDoc.data(),
      createdAt: userDoc.data().createdAt?.toDate(),
    } as User

    const memberSince = new Date(userData.createdAt).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Trang người dùng</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 sm:mb-0 sm:mr-6">
                {userData.photoURL ? (
                  <Image
                    src={userData.photoURL}
                    alt={userData.displayName || 'Ảnh đại diện'}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary text-white text-3xl font-semibold rounded-full">
                    {userData.displayName ? (
                      userData.displayName.charAt(0).toUpperCase()
                    ) : (
                      <FiUser size={36} />
                    )}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {userData.displayName || 'Người dùng ẩn danh'}
                </h2>
                {userData.email && (
                  <div className="mt-1 text-gray-500 dark:text-gray-400">{userData.email}</div>
                )}
                <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                  <FiCalendar className="mr-1" />
                  <span>Tham gia: {memberSince}</span>
                </div>
                {userData.isAdmin && (
                  <div className="mt-2">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                      Quản trị viên
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <UserProfile user={userData} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching user:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Đã xảy ra lỗi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Không thể tải thông tin người dùng. Vui lòng thử lại sau.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Quay về trang chủ
          </a>
        </div>
      </div>
    )
  }
}
