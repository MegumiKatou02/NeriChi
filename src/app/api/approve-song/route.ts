import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/app/firebase/config'

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json()

    const pendingSongRef = doc(db, 'pendingSongs', id)
    const songSnapshot = await getDoc(pendingSongRef)

    if (!songSnapshot.exists()) {
      return NextResponse.json({ error: 'Không tìm thấy bài hát' }, { status: 404 })
    }

    const songData = songSnapshot.data()

    const approvedSongRef = doc(db, 'songs', id)
    await setDoc(approvedSongRef, {
      ...songData,
      approved: true,
      updatedAt: serverTimestamp(),
    })

    await deleteDoc(pendingSongRef)

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error approving song:', error)
    return NextResponse.json({ error: 'Failed to approve song' }, { status: 500 })
  }
}
