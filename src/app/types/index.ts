export interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string
  isAdmin?: boolean
  createdAt: Date
}

export interface SongInfo {
  title: string
  altNames?: string[]
  artist: string
  createdAt: Date
  updatedAt: Date
  views: number
  likes: number
  approved: boolean
  contributors: string[]
   language: string;
}

export interface SongVersion {
  lyrics: string
  language?: string 
  contributors: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Song {
  id: string
  info: SongInfo
  versions: {
    [key in Language]?: SongVersion
  }
  originalSongId?: string
}

export interface SearchResult {
  songs: Song[]
  artists: string[]
  totalResults: number
}

export enum Language {
  VIETNAMESE = 'vietnamese',
  ENGLISH = 'english',
  KOREAN = 'korean',
  JAPANESE = 'japanese',
  CHINESE = 'chinese',
  ROMAJI = 'romaji',
  OTHER = 'other',
}

export interface UserPreferences {
  userId: string
  theme: 'light' | 'dark' | 'system'
  savedSongs: string[]
  history: {
    songId: string
    viewedAt: Date
  }[]
}
