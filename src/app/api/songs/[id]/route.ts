import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/app/firebase/config'

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const { status, ...songData } = await req.json()

    if (status !== 'approved' && status !== 'pending') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const collectionName = status === 'approved' ? 'songs' : 'pendingSongs'
    console.log(`Updating song ${id} in collection ${collectionName}`)
    
    const songRef = doc(db, collectionName, id)

    const songDoc = await getDoc(songRef)
    if (!songDoc.exists()) {
      console.error(`Song ${id} not found in collection ${collectionName}`)
      
      const alternativeCollection = collectionName === 'songs' ? 'pendingSongs' : 'songs'
      const altSongRef = doc(db, alternativeCollection, id)
      const altSongDoc = await getDoc(altSongRef)
      
      if (altSongDoc.exists()) {
        console.log(`Found song ${id} in alternative collection ${alternativeCollection}`)
        return NextResponse.json({ 
          error: `Song exists in ${alternativeCollection}, not in ${collectionName}` 
        }, { status: 409 })
      }
      
      return NextResponse.json({ error: 'Song not found in any collection' }, { status: 404 })
    }

    const existingData = songDoc.data();
    
    const updatedData = {
      ...songData,
      status,
      createdAt: existingData.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    console.log('Updating with data:', JSON.stringify(updatedData, null, 2))
    
    await updateDoc(songRef, updatedData)

    return NextResponse.json({ success: true, id, collection: collectionName })
  } catch (error) {
    console.error('Error updating song:', error)
    return NextResponse.json({ error: 'Failed to update song' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const { collection: collectionName } = await req.json()

    if (collectionName !== 'songs' && collectionName !== 'pendingSongs') {
      return NextResponse.json({ error: 'Invalid collection name' }, { status: 400 })
    }

    const songRef = doc(db, collectionName, id)

    const songDoc = await getDoc(songRef)
    if (!songDoc.exists()) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    }

    await deleteDoc(songRef)

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error deleting song:', error)
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 })
  }
}
