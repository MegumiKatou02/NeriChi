import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/firebase/config'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await req.json()
    const songId = (await params).id
    if (!userId || !songId) {
      return NextResponse.json({ error: 'Missing userId or songId' }, { status: 400 })
    }

    const songRef = doc(db, 'songs', songId)
    const songSnap = await getDoc(songRef)
    if (!songSnap.exists()) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    }

    await updateDoc(songRef, {
      contributors: arrayUnion(userId),
    })

    return NextResponse.json({ message: 'Contributor added successfully' })
  } catch (error) {
    console.error('Error adding contributor:', error)
    return NextResponse.json({ error: 'Failed to add contributor' }, { status: 500 })
  }
}
