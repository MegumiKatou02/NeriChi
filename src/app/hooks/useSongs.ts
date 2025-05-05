'use client';

import { useState, useEffect, useCallback } from 'react';
import { Language, Song, SearchResult } from '../types';
import { addSong, getSongById, getSongs, saveSong, searchSongs } from '../firebase/services';
import { useAuth } from './useAuth';

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchSongs = useCallback(async (limit_count = 20) => {
    setLoading(true);
    setError(null);
    try {
      const songsData = await getSongs(limit_count);
      setSongs(songsData);
      return songsData;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSongById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const song = await getSongById(id);
      setCurrentSong(song);
      return song;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (searchTerm: string, language?: Language) => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await searchSongs(searchTerm, language);
      setSearchResults(results);
      return results;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSong = useCallback(async (song: Omit<Song, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
    if (!user) throw new Error('Bạn phải đăng nhập để thêm bài hát');

    setLoading(true);
    setError(null);
    try {
      const docRef = await addSong(song);
      await fetchSongs();
      return docRef.id;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, fetchSongs]);

  const saveFavoriteSong = useCallback(async (songId: string) => {
    if (!user) throw new Error('Bạn phải đăng nhập để lưu bài hát');

    setLoading(true);
    setError(null);
    try {
      await saveSong(songId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    songs,
    currentSong,
    searchResults,
    loading,
    error,
    fetchSongs,
    fetchSongById,
    search,
    createSong,
    saveFavoriteSong
  };
} 