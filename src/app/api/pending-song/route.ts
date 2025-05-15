import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore'
import { db } from '@/app/firebase/config'
import { FieldValue } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  const songData = await req.json()

  const originalSongId = req.nextUrl.searchParams.get('originalSongId') || null

  songData.info = {
    ...songData.info,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  if (songData.versions) {
    interface SongVersion {
      lyrics: string
      language?: string
      contributors: string[]
      createdAt: Date | FieldValue
      updatedAt: Date | FieldValue
    }

    ;(Object.values(songData.versions) as SongVersion[]).forEach((version) => {
      if (version) {
        version.createdAt = serverTimestamp()
        version.updatedAt = serverTimestamp()
      }
    })
  }

  const docRef = await addDoc(collection(db, 'pendingSongs'), {
    ...songData,
    originalSongId,
  })

  return NextResponse.json({ success: true, id: docRef.id })
}

export async function GET() {
  const snapshot = await getDocs(collection(db, 'pendingSongs'))

  const songs = snapshot.docs.map((doc) => {
    const data = doc.data()

    if (data.info.createdAt && typeof data.info.createdAt.toDate === 'function') {
      data.info.createdAt = data.info.createdAt.toDate()
    }

    if (data.info.updatedAt && typeof data.info.updatedAt.toDate === 'function') {
      data.info.updatedAt = data.info.updatedAt.toDate()
    }

    return {
      ...data,
      id: doc.id,
    }
  })

  return NextResponse.json(songs)
}
