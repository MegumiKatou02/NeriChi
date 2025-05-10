import { NextRequest, NextResponse } from 'next/server'
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '@/app/firebase/config'

export async function GET() {
  try {
    const reportsRef = collection(db, 'lyricsReports')
    const q = query(reportsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    const reports = []

    for (const docSnapshot of snapshot.docs) {
      const reportData = docSnapshot.data()

      let song = undefined
      if (reportData.songId) {
        const songDoc = await getDoc(doc(db, 'songs', reportData.songId))
        if (songDoc.exists()) {
          const songData = songDoc.data()
          song = {
            id: reportData.songId,
            ...songData,
            createdAt: songData.createdAt
              ? typeof songData.createdAt.toDate === 'function'
                ? songData.createdAt.toDate()
                : songData.createdAt
              : null,
            updatedAt: songData.updatedAt
              ? typeof songData.updatedAt.toDate === 'function'
                ? songData.updatedAt.toDate()
                : songData.updatedAt
              : null,
          }
        }
      }

      reports.push({
        id: docSnapshot.id,
        ...reportData,
        createdAt: reportData.createdAt
          ? typeof reportData.createdAt.toDate === 'function'
            ? reportData.createdAt.toDate()
            : reportData.createdAt
          : null,
        updatedAt: reportData.updatedAt
          ? typeof reportData.updatedAt.toDate === 'function'
            ? reportData.updatedAt.toDate()
            : reportData.updatedAt
          : null,
        song,
      })
    }

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { songId, reporterId, reason, details } = await req.json()

    if (!songId || !reporterId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const reportRef = collection(db, 'lyricsReports')

    const newReport = await addDoc(reportRef, {
      songId,
      reporterId,
      reason,
      details: details || '',
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json(
      {
        message: 'Report submitted successfully',
        reportId: newReport.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error submitting report:', error)
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
  }
}
