/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Language, Song, SongInfo, SongVersion } from '../types'
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
    where('info.approved', '==', true),
    orderBy('info.createdAt', 'desc'),
    limit(limit_count),
  )

  // type SongVersion = {
  //     lyrics: string;
  //     contributors: string[];
  //     createdAt?: { toDate: () => Date };
  //     updatedAt?: { toDate: () => Date };
  //   }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      info: {
        ...data.info,
        createdAt:
          data.info?.createdAt && typeof data.info.createdAt.toDate === 'function'
            ? data.info.createdAt.toDate()
            : null,
        updatedAt:
          data.info?.updatedAt && typeof data.info.updatedAt.toDate === 'function'
            ? data.info.updatedAt.toDate()
            : null,
      },
      versions: Object.entries(data.versions || {}).reduce((acc, [lang, versionData]) => {
        const version = versionData as Record<string, any>;
        return {
          ...acc,
          [lang]: {
            lyrics: version.lyrics || '',
            contributors: version.contributors || [],
            createdAt:
              version.createdAt && typeof version.createdAt.toDate === 'function'
                ? version.createdAt.toDate()
                : null,
            updatedAt:
              version.updatedAt && typeof version.updatedAt.toDate === 'function'
                ? version.updatedAt.toDate()
                : null,
          },
        }
      }, {} as Record<string, SongVersion>),
    } as Song
  })
}

export const getSongById = async (id: string) => {
  const songRef = doc(db, 'songs', id)
  const songDoc = await getDoc(songRef)

  if (!songDoc.exists()) return null

  await updateDoc(songRef, { 'info.views': increment(1) })

  const data = songDoc.data()
  return {
    id: songDoc.id,
    info: {
      ...data.info,
      createdAt:
        data.info?.createdAt && typeof data.info.createdAt.toDate === 'function'
          ? data.info.createdAt.toDate()
          : null,
      updatedAt:
        data.info?.updatedAt && typeof data.info.updatedAt.toDate === 'function'
          ? data.info.updatedAt.toDate()
          : null,
    },
    versions: Object.entries(data.versions || {}).reduce((acc, [lang, versionData]) => {
      const version = versionData as Record<string, any>;
      return {
        ...acc,
        [lang]: {
          lyrics: version.lyrics || '',
          contributors: version.contributors || [],
          createdAt:
            version.createdAt && typeof version.createdAt.toDate === 'function'
              ? version.createdAt.toDate()
              : null,
          updatedAt:
            version.updatedAt && typeof version.updatedAt.toDate === 'function'
              ? version.updatedAt.toDate()
              : null,
        },
      }
    }, {} as Record<string, SongVersion>),
  } as Song
}

export const searchSongs = async (searchTerm: string, language?: Language) => {
  const songsRef = collection(db, 'songs')
  const q = query(songsRef, where('info.approved', '==', true))

  const snapshot = await getDocs(q)

  const filteredSongs = snapshot.docs
    .map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        info: {
          ...data.info,
          createdAt:
            data.info?.createdAt && typeof data.info.createdAt.toDate === 'function'
              ? data.info.createdAt.toDate()
              : null,
          updatedAt:
            data.info?.updatedAt && typeof data.info.updatedAt.toDate === 'function'
              ? data.info.updatedAt.toDate()
              : null,
        },
        versions: Object.entries(data.versions || {}).reduce((acc, [lang, versionData]) => {
          const version = versionData as Record<string, any>;
          return {
            ...acc,
            [lang]: {
              lyrics: version.lyrics || '',
              contributors: version.contributors || [],
              createdAt:
                version.createdAt && typeof version.createdAt.toDate === 'function'
                  ? version.createdAt.toDate()
                  : null,
              updatedAt:
                version.updatedAt && typeof version.updatedAt.toDate === 'function'
                  ? version.updatedAt.toDate()
                  : null,
            },
          }
        }, {} as Record<string, SongVersion>),
      } as Song
    })
    .filter((song) => {
      const hasLanguageVersion = language ? !!song.versions[language] : true
      
      const infoMatches = 
        song.info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.info.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (song.info.altNames && song.info.altNames.some(altName => 
          altName.toLowerCase().includes(searchTerm.toLowerCase())
        ))
        
      const lyricsMatches = Object.values(song.versions).some(version => 
        version.lyrics.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      return hasLanguageVersion && (infoMatches || lyricsMatches)
    })

  return {
    songs: filteredSongs,
    artists: [...new Set(filteredSongs.map((song) => song.info.artist))],
    totalResults: filteredSongs.length,
  }
}

export const addSong = async (
  songInfo: Omit<SongInfo, 'createdAt' | 'updatedAt' | 'views' | 'likes'>,
  initialVersion: { lyrics: string; language: Language }
) => {
  const user = auth.currentUser
  if (!user) throw new Error('Bạn phải đăng nhập để thêm bài hát')

  const timestamp = serverTimestamp()
  
  const songInfoData = {
    ...songInfo,
    contributors: [user.uid],
    createdAt: timestamp,
    updatedAt: timestamp,
    views: 0,
    likes: 0,
  }
  
  const versionData = {
    lyrics: initialVersion.lyrics,
    contributors: [user.uid],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  
  const songData = {
    info: songInfoData,
    versions: {
      [initialVersion.language]: versionData
    }
  }

  return addDoc(collection(db, 'songs'), songData)
}

export const addSongVersion = async (
  songId: string,
  language: Language,
  lyrics: string
) => {
  const user = auth.currentUser
  if (!user) throw new Error('Bạn phải đăng nhập để thêm phiên bản bài hát')
  
  const songRef = doc(db, 'songs', songId)
  const songDoc = await getDoc(songRef)
  
  if (!songDoc.exists()) {
    throw new Error('Bài hát không tồn tại')
  }
  
  const timestamp = serverTimestamp()
  const versionData = {
    lyrics,
    contributors: [user.uid],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  
  await updateDoc(songRef, {
    [`versions.${language}`]: versionData,
    'info.updatedAt': timestamp
  })
  
  return { success: true }
}

export const saveSong = async (songId: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('Bạn phải đăng nhập để lưu bài hát')

  const userPrefsRef = doc(db, 'userPreferences', user.uid)
  const userPrefsDoc = await getDoc(userPrefsRef)

  const songRef = doc(db, 'songs', songId)
  await updateDoc(songRef, { 'info.likes': increment(1) })

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
    where('info.approved', '==', true),
    orderBy(`info.${sortBy}`, 'desc'),
    limit(limit_count),
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      info: {
        ...data.info,
        createdAt:
          data.info?.createdAt && typeof data.info.createdAt.toDate === 'function'
            ? data.info.createdAt.toDate()
            : null,
        updatedAt:
          data.info?.updatedAt && typeof data.info.updatedAt.toDate === 'function'
            ? data.info.updatedAt.toDate()
            : null,
      },
      versions: Object.entries(data.versions || {}).reduce((acc, [lang, versionData]) => {
        const version = versionData as Record<string, any>;
        return {
          ...acc,
          [lang]: {
            lyrics: version.lyrics || '',
            contributors: version.contributors || [],
            createdAt:
              version.createdAt && typeof version.createdAt.toDate === 'function'
                ? version.createdAt.toDate()
                : null,
            updatedAt:
              version.updatedAt && typeof version.updatedAt.toDate === 'function'
                ? version.updatedAt.toDate()
                : null,
          },
        }
      }, {} as Record<string, SongVersion>),
    } as Song
  })
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
  await updateDoc(songRef, { 'info.likes': increment(-1) })

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
      where('info.contributors', 'array-contains', userId),
      where('info.approved', '==', true),
      orderBy('info.createdAt', 'desc'),
    )

    const querySnapshot = await getDocs(q)
    const songs: Song[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      songs.push({
        id: doc.id,
        info: {
          ...data.info,
          createdAt:
            data.info?.createdAt && typeof data.info.createdAt.toDate === 'function'
              ? data.info.createdAt.toDate()
              : null,
          updatedAt:
            data.info?.updatedAt && typeof data.info.updatedAt.toDate === 'function'
              ? data.info.updatedAt.toDate()
              : null,
        },
        versions: Object.entries(data.versions || {}).reduce((acc, [lang, versionData]) => {
          const version = versionData as Record<string, any>;
          return {
            ...acc,
            [lang]: {
              lyrics: version.lyrics || '',
              contributors: version.contributors || [],
              createdAt:
                version.createdAt && typeof version.createdAt.toDate === 'function'
                  ? version.createdAt.toDate()
                  : null,
              updatedAt:
                version.updatedAt && typeof version.updatedAt.toDate === 'function'
                  ? version.updatedAt.toDate()
                  : null,
            },
          }
        }, {} as Record<string, SongVersion>),
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
        info: {
          ...data.info,
          createdAt:
            data.info?.createdAt && typeof data.info.createdAt.toDate === 'function'
              ? data.info.createdAt.toDate()
              : null,
          updatedAt:
            data.info?.updatedAt && typeof data.info.updatedAt.toDate === 'function'
              ? data.info.updatedAt.toDate()
              : null,
        },
        versions: Object.entries(data.versions || {}).reduce((acc, [lang, versionData]) => {
          const version = versionData as Record<string, any>;
          return {
            ...acc,
            [lang]: {
              lyrics: version.lyrics || '',
              contributors: version.contributors || [],
              createdAt:
                version.createdAt && typeof version.createdAt.toDate === 'function'
                  ? version.createdAt.toDate()
                  : null,
              updatedAt:
                version.updatedAt && typeof version.updatedAt.toDate === 'function'
                  ? version.updatedAt.toDate()
                  : null,
            },
          }
        }, {} as Record<string, SongVersion>),
      } as Song)
    })

    return songs
  } catch (error) {
    console.error('Error getting user favorite songs:', error)
    throw error
  }
}
