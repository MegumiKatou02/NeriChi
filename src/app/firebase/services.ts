'use client'

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from './config'
import { Language, Song } from '../types'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

export const registerWithEmail = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password)
  } catch (error: unknown) {
    if (error instanceof Error) {
      const firebaseError = error as { code?: string; message?: string }

      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('Email này đã được sử dụng. Vui lòng thử email khác.')
      } else if (firebaseError.code === 'auth/invalid-email') {
        throw new Error('Email không hợp lệ. Vui lòng thử lại.')
      } else if (firebaseError.code === 'auth/weak-password') {
        throw new Error('Mật khẩu yếu. Vui lòng sử dụng mật khẩu mạnh hơn.')
      }

      console.error('Lỗi đăng ký:', firebaseError.code, firebaseError.message)
      throw new Error('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.')
    }
  }
}

export const loginWithEmail = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }

    if (
      firebaseError.code === 'auth/user-not-found' ||
      firebaseError.code === 'auth/wrong-password'
    ) {
      throw new Error('Email hoặc mật khẩu không đúng. Vui lòng thử lại.')
    } else if (firebaseError.code === 'auth/invalid-email') {
      throw new Error('Email không hợp lệ. Vui lòng thử lại.')
    } else if (firebaseError.code === 'auth/user-disabled') {
      throw new Error('Tài khoản này đã bị vô hiệu hóa.')
    } else if (firebaseError.code === 'auth/too-many-requests') {
      throw new Error('Quá nhiều lần thử đăng nhập không thành công. Vui lòng thử lại sau.')
    }

    console.error('Lỗi đăng nhập:', firebaseError.code, firebaseError.message)
    throw new Error('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau.')
  }
}

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    return await signInWithPopup(auth, provider)
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string }

    if (firebaseError.code === 'auth/popup-closed-by-user') {
      throw new Error('Đăng nhập bị hủy. Vui lòng thử lại.')
    } else if (firebaseError.code === 'auth/popup-blocked') {
      throw new Error('Cửa sổ đăng nhập bị chặn. Vui lòng cho phép popup và thử lại.')
    }

    console.error('Lỗi đăng nhập Google:', firebaseError.code, firebaseError.message)
    throw new Error('Đã xảy ra lỗi khi đăng nhập bằng Google. Vui lòng thử lại sau.')
  }
}

export const logout = async () => {
  return signOut(auth)
}

export const getSongs = async (limit_count = 20) => {
  const songsRef = collection(db, 'songs')
  const q = query(
    songsRef,
    where('approved', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limit_count),
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt && typeof data.createdAt.toDate === 'function'
          ? data.createdAt.toDate()
          : null,
      updatedAt:
        data.updatedAt && typeof data.updatedAt.toDate === 'function'
          ? data.updatedAt.toDate()
          : null,
    } as Song
  })
}

export const getSongById = async (id: string) => {
  const songRef = doc(db, 'songs', id)
  const songDoc = await getDoc(songRef)

  if (!songDoc.exists()) return null

  await updateDoc(songRef, { views: increment(1) })

  return {
    id: songDoc.id,
    ...songDoc.data(),
    createdAt:
      songDoc.data().createdAt && typeof songDoc.data().createdAt.toDate === 'function'
        ? songDoc.data().createdAt.toDate()
        : null,
    updatedAt:
      songDoc.data().updatedAt && typeof songDoc.data().updatedAt.toDate === 'function'
        ? songDoc.data().updatedAt.toDate()
        : null,
  } as Song
}

export const searchSongs = async (searchTerm: string, language?: Language) => {
  const songsRef = collection(db, 'songs')
  const q = query(songsRef, where('approved', '==', true))

  const snapshot = await getDocs(q)

  const filteredSongs = snapshot.docs
    .map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt && typeof doc.data().createdAt.toDate === 'function'
              ? doc.data().createdAt.toDate()
              : null,
          updatedAt:
            doc.data().updatedAt && typeof doc.data().updatedAt.toDate === 'function'
              ? doc.data().updatedAt.toDate()
              : null,
        }) as Song,
    )
    .filter((song) => {
      const matchesSearch =
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.lyrics.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLanguage = language ? song.language === language : true

      return matchesSearch && matchesLanguage
    })

  return {
    songs: filteredSongs,
    artists: [...new Set(filteredSongs.map((song) => song.artist))],
    totalResults: filteredSongs.length,
  }
}

export const addSong = async (
  song: Omit<Song, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>,
) => {
  const user = auth.currentUser
  if (!user) throw new Error('Bạn phải đăng nhập để thêm bài hát')

  const songData = {
    ...song,
    contributors: [user.uid],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    likes: 0,
  }

  return addDoc(collection(db, 'songs'), songData)
}

export const saveSong = async (songId: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('Bạn phải đăng nhập để lưu bài hát')

  const userPrefsRef = doc(db, 'userPreferences', user.uid)
  const userPrefsDoc = await getDoc(userPrefsRef)

  const songRef = doc(db, 'songs', songId)
  await updateDoc(songRef, { likes: increment(1) })

  if (userPrefsDoc.exists()) {
    const savedSongs = userPrefsDoc.data().savedSongs || []
    if (!savedSongs.includes(songId)) {
      return updateDoc(userPrefsRef, {
        savedSongs: [...savedSongs, songId],
      })
    }
  } else {
    return setDoc(userPrefsRef, {
      userId: user.uid,
      savedSongs: [songId],
      history: [],
    })
  }
}

export const getSavedSongs = async () => {
  const user = auth.currentUser
  if (!user) return []

  const userPrefsRef = doc(db, 'userPreferences', user.uid)
  const userPrefsDoc = await getDoc(userPrefsRef)

  if (!userPrefsDoc.exists()) return []

  const savedSongIds = userPrefsDoc.data().savedSongs || []
  const songs: Song[] = []

  for (const id of savedSongIds) {
    const song = await getSongById(id)
    if (song) songs.push(song)
  }

  return songs
}

export const getTopSongs = async (sortBy: 'views' | 'likes' = 'views', limit_count = 20) => {
  const songsRef = collection(db, 'songs')
  const q = query(
    songsRef,
    where('approved', '==', true),
    orderBy(sortBy, 'desc'),
    limit(limit_count),
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt && typeof doc.data().createdAt.toDate === 'function'
            ? doc.data().createdAt.toDate()
            : null,
        updatedAt:
          doc.data().updatedAt && typeof doc.data().updatedAt.toDate === 'function'
            ? doc.data().updatedAt.toDate()
            : null,
      }) as Song,
  )
}

export const isSongSaved = async (songId: string) => {
  const user = auth.currentUser
  if (!user) return false

  const userPrefsRef = doc(db, 'userPreferences', user.uid)
  const userPrefsDoc = await getDoc(userPrefsRef)

  if (!userPrefsDoc.exists()) return false

  const savedSongs = userPrefsDoc.data().savedSongs || []
  return savedSongs.includes(songId)
}

export const removeSavedSong = async (songId: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('Bạn phải đăng nhập để xóa bài hát khỏi danh sách đã lưu')

  const userPrefsRef = doc(db, 'userPreferences', user.uid)
  const userPrefsDoc = await getDoc(userPrefsRef)

  const songRef = doc(db, 'songs', songId)
  await updateDoc(songRef, { likes: increment(-1) })

  if (userPrefsDoc.exists()) {
    const savedSongs = userPrefsDoc.data().savedSongs || []
    const updatedSavedSongs = savedSongs.filter((id: string) => id !== songId)

    return updateDoc(userPrefsRef, {
      savedSongs: updatedSavedSongs,
    })
  }

  return null
}

export async function getUserSongs(userId: string): Promise<Song[]> {
  try {
    const songsCollection = collection(db, 'songs')
    const q = query(
      songsCollection,
      where('contributors', 'array-contains', userId),
      where('approved', '==', true),
      orderBy('createdAt', 'desc'),
    )

    const querySnapshot = await getDocs(q)
    const songs: Song[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      songs.push({
        id: doc.id,
        ...data,
        createdAt:
          data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate()
            : null,
        updatedAt:
          data.updatedAt && typeof data.updatedAt.toDate === 'function'
            ? data.updatedAt.toDate()
            : null,
      } as Song)
    })

    return songs
  } catch (error) {
    console.error('Error getting user contributed songs:', error)
    throw error
  }
}

export async function getUserFavorites(userId: string): Promise<Song[]> {
  try {
    const userPrefsRef = doc(db, 'userPreferences', userId)
    const userPrefsSnap = await getDoc(userPrefsRef)

    if (!userPrefsSnap.exists() || !userPrefsSnap.data().savedSongs) {
      return []
    }

    const savedSongs = userPrefsSnap.data().savedSongs as string[]

    if (savedSongs.length === 0) {
      return []
    }

    const songsCollection = collection(db, 'songs')
    const q = query(songsCollection, where('__name__', 'in', savedSongs))

    const querySnapshot = await getDocs(q)
    const songs: Song[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      songs.push({
        id: doc.id,
        ...data,
        createdAt:
          data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate()
            : null,
        updatedAt:
          data.updatedAt && typeof data.updatedAt.toDate === 'function'
            ? data.updatedAt.toDate()
            : null,
      } as Song)
    })

    return songs
  } catch (error) {
    console.error('Error getting user favorite songs:', error)
    throw error
  }
}
