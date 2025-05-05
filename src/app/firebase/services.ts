'use client';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './config';
import { Language, Song } from '../types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export const registerWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logout = async () => {
  return signOut(auth);
};

export const getSongs = async (limit_count = 20) => {
  const songsRef = collection(db, 'songs');
  const q = query(
    songsRef,
    where('approved', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limit_count)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  } as Song));
};

export const getSongById = async (id: string) => {
  const songRef = doc(db, 'songs', id);
  const songDoc = await getDoc(songRef);
  
  if (!songDoc.exists()) return null;
  
  await updateDoc(songRef, { views: increment(1) });
  
  return {
    id: songDoc.id,
    ...songDoc.data(),
    createdAt: songDoc.data().createdAt?.toDate(),
    updatedAt: songDoc.data().updatedAt?.toDate(),
  } as Song;
};

export const searchSongs = async (searchTerm: string, language?: Language) => {
  const songsRef = collection(db, 'songs');
  const q = query(
    songsRef,
    where('approved', '==', true),
  );
  
  const snapshot = await getDocs(q);
  
  const filteredSongs = snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Song))
    .filter(song => {
      const matchesSearch = 
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.lyrics.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLanguage = language ? song.language === language : true;
      
      return matchesSearch && matchesLanguage;
    });
  
  return {
    songs: filteredSongs,
    artists: [...new Set(filteredSongs.map(song => song.artist))],
    totalResults: filteredSongs.length
  };
};

export const addSong = async (song: Omit<Song, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Bạn phải đăng nhập để thêm bài hát');
  
  const songData = {
    ...song,
    contributors: [user.uid],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    likes: 0
  };
  
  return addDoc(collection(db, 'songs'), songData);
};

export const saveSong = async (songId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Bạn phải đăng nhập để lưu bài hát');
  
  const userPrefsRef = doc(db, 'userPreferences', user.uid);
  const userPrefsDoc = await getDoc(userPrefsRef);
  
  const songRef = doc(db, 'songs', songId);
  await updateDoc(songRef, { likes: increment(1) });
  
  if (userPrefsDoc.exists()) {
    const savedSongs = userPrefsDoc.data().savedSongs || [];
    if (!savedSongs.includes(songId)) {
      return updateDoc(userPrefsRef, {
        savedSongs: [...savedSongs, songId]
      });
    }
  } else {
    return setDoc(userPrefsRef, {
      userId: user.uid,
      savedSongs: [songId],
      history: []
    });
  }
};

export const getSavedSongs = async () => {
  const user = auth.currentUser;
  if (!user) return [];
  
  const userPrefsRef = doc(db, 'userPreferences', user.uid);
  const userPrefsDoc = await getDoc(userPrefsRef);
  
  if (!userPrefsDoc.exists()) return [];
  
  const savedSongIds = userPrefsDoc.data().savedSongs || [];
  const songs: Song[] = [];
  
  for (const id of savedSongIds) {
    const song = await getSongById(id);
    if (song) songs.push(song);
  }
  
  return songs;
};

export const getTopSongs = async (sortBy: 'views' | 'likes' = 'views', limit_count = 20) => {
  const songsRef = collection(db, 'songs');
  const q = query(
    songsRef,
    where('approved', '==', true),
    orderBy(sortBy, 'desc'),
    limit(limit_count)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  } as Song));
};

export const isSongSaved = async (songId: string) => {
  const user = auth.currentUser;
  if (!user) return false;
  
  const userPrefsRef = doc(db, 'userPreferences', user.uid);
  const userPrefsDoc = await getDoc(userPrefsRef);
  
  if (!userPrefsDoc.exists()) return false;
  
  const savedSongs = userPrefsDoc.data().savedSongs || [];
  return savedSongs.includes(songId);
};

export const removeSavedSong = async (songId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Bạn phải đăng nhập để xóa bài hát khỏi danh sách đã lưu');
  
  const userPrefsRef = doc(db, 'userPreferences', user.uid);
  const userPrefsDoc = await getDoc(userPrefsRef);
  
  const songRef = doc(db, 'songs', songId);
  await updateDoc(songRef, { likes: increment(-1) });
  
  if (userPrefsDoc.exists()) {
    const savedSongs = userPrefsDoc.data().savedSongs || [];
    const updatedSavedSongs = savedSongs.filter((id: string) => id !== songId);
    
    return updateDoc(userPrefsRef, {
      savedSongs: updatedSavedSongs
    });
  }
  
  return null;
}; 