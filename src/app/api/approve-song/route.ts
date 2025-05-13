import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/app/firebase/config'

export async function POST(req: NextRequest) {
  try {
    const { id, originalSongId } = await req.json()

    console.log('Approving song:', id, 'Original song ID:', originalSongId);
    
    if (!id) {
      console.error('Missing required parameter: id');
      return NextResponse.json({ error: 'Missing required parameter: id' }, { status: 400 })
    }
    
    const pendingSongRef = doc(db, 'pendingSongs', id)
    const pendingSongSnapshot = await getDoc(pendingSongRef)
    
    if (!pendingSongSnapshot.exists()) {
      console.error('Pending song not found:', id);
      return NextResponse.json({ error: 'Pending song not found' }, { status: 404 })
    }
    
    const pendingSongData = pendingSongSnapshot.data()
    console.log('Pending song data:', JSON.stringify(pendingSongData, null, 2));

    
    try {
      if (originalSongId) {
        const originalSongRef = doc(db, 'songs', originalSongId)
        const originalSongSnapshot = await getDoc(originalSongRef)
        
        if (originalSongSnapshot.exists()) {
          console.log('Original song found, updating lyrics');

          const {
            createdAt,
            updatedAt,
            originalSongId,
            id,
            ...cleanedData
          } = pendingSongData;

          console.log(createdAt, updatedAt, originalSongId, id);
          

          const versions = cleanedData.versions;

          const versionContributors = Object.values(versions as Record<string, { contributors?: string[] }>)
            .flatMap(version => version.contributors || []);

          const existingContributors = cleanedData.info?.contributors || [];
          const allContributors = [...existingContributors, ...versionContributors];

          const uniqueContributors = Array.from(new Set(allContributors));

          cleanedData.info = {
            ...cleanedData.info,
            contributors: uniqueContributors
          };

          console.log('cleanedData', cleanedData);

          await setDoc(originalSongRef, {
            ...cleanedData,
            updatedAt: serverTimestamp()
          }, { merge: true })
        } 
        else {
          console.log('Original song not found, creating new song');
          
          await setDoc(doc(db, 'songs', id), {
            ...pendingSongData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        }
      } else {
        console.log('Creating new song (no original song ID)');
        
        await setDoc(doc(db, 'songs', id), {
          ...pendingSongData,
          info: {
            ...pendingSongData.info,
            approved: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }
        })
      }
      
      await deleteDoc(pendingSongRef)
      
      console.log('Song approved successfully:', id);
      return NextResponse.json({ success: true, id })
    } catch (innerError) {
      console.error('Inner error in song approval process:', innerError);
      throw innerError;
    }
  } catch (error) {
    console.error('Error approving song:', error)
    return NextResponse.json({ error: 'Failed to approve song' }, { status: 500 })
  }
}
