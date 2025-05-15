import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  try {
    const data = await request.json()

    const pendingSongsCollection = collection(db, 'pendingSongs')

    const addedDoc = await addDoc(pendingSongsCollection, {
      ...data,
      createdAt: serverTimestamp(),
      originalSongId: id,
      views: 0,
      likes: 0,
      info: {
        ...data.info,
        approved: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    })

    return NextResponse.json({ success: true, id: addedDoc.id })
  } catch (error) {
    console.error('Error updating song:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const songData = await request.json()

  const originalSongId = id

  const docRef = await addDoc(collection(db, 'pendingSongs'), {
    ...songData,
    originalSongId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return NextResponse.json({ success: true, id: docRef.id })
}
