import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore'
import { db } from '@/app/firebase/config'

export async function POST(req: NextRequest) {
  const songData = await req.json()

  const docRef = await addDoc(collection(db, 'pendingSongs'), {
    ...songData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    likes: 0,
  })

  return NextResponse.json({ success: true, id: docRef.id })
}

export async function GET() {
  const snapshot = await getDocs(collection(db, 'pendingSongs'))

  const songs = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt && typeof data.createdAt.toDate === 'function'
          ? data.createdAt.toDate().toISOString()
          : null,
      updatedAt:
        data.updatedAt && typeof data.updatedAt.toDate === 'function'
          ? data.updatedAt.toDate().toISOString()
          : null,
    }
  })

  return NextResponse.json(songs)
}
