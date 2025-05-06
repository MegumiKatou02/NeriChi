import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

type status = 'pending' | 'approved';

export async function PUT(
  req: NextRequest,
  context: { params: { id: string; status: status } }
) {
  try {
    const { id, status } = context.params;
    console.log(id, status);
    
    const songData = await req.json();
    
    const collectionName = status === 'approved' ? 'songs' : 'pendingSongs';
    const songRef = doc(db, collectionName, id);
    
    const songDoc = await getDoc(songRef);
    if (!songDoc.exists()) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      );
    }
    
    await updateDoc(songRef, {
      ...songData,
      updatedAt: serverTimestamp(),
    });
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error updating song:', error);
    return NextResponse.json(
      { error: 'Failed to update song' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { collection: collectionName } = await req.json();
    
    if (collectionName !== 'songs' && collectionName !== 'pendingSongs') {
      return NextResponse.json(
        { error: 'Invalid collection name' },
        { status: 400 }
      );
    }
    
    const songRef = doc(db, collectionName, id);
    
    const songDoc = await getDoc(songRef);
    if (!songDoc.exists()) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      );
    }
    
    await deleteDoc(songRef);
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json(
      { error: 'Failed to delete song' },
      { status: 500 }
    );
  }
}