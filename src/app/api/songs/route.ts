import { NextRequest, NextResponse } from 'next/server'
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit as limitFn,
  startAfter,
} from 'firebase/firestore'
import { db } from '@/app/firebase/config'
import { Timestamp } from 'firebase/firestore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limitParam = parseInt(searchParams.get('limit') || '100', 10)
    const startAfterParam = searchParams.get('startAfter')

    const songsRef = collection(db, 'songs')
    let q

    if (startAfterParam) {
      const startAfterTimestamp = Timestamp.fromMillis(parseInt(startAfterParam, 10))
      q = query(
        songsRef,
        orderBy('info.createdAt', 'desc'),
        startAfter(startAfterTimestamp),
        limitFn(limitParam),
      )
    } else {
      q = query(songsRef, orderBy('info.createdAt', 'desc'), limitFn(limitParam))
    }

    const snapshot = await getDocs(q)

    const songs = snapshot.docs.map((doc) => {
      const data = doc.data()
      const createdAt = data.info?.createdAt || data.createdAt
      const updatedAt = data.info?.updatedAt || data.updatedAt

      return {
        id: doc.id,
        ...data,
        createdAt:
          createdAt && typeof createdAt.toDate === 'function'
            ? createdAt.toDate().toISOString()
            : null,
        updatedAt:
          updatedAt && typeof updatedAt.toDate === 'function'
            ? updatedAt.toDate().toISOString()
            : null,
      }
    })

    return NextResponse.json(songs)
  } catch (error) {
    console.error('Lỗi lấy bài hát:', error)
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách bài hát' }, { status: 500 })
  }
}
