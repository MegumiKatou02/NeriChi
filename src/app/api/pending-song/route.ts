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

  const songs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  console.log(songs)

  return NextResponse.json(songs)
}
