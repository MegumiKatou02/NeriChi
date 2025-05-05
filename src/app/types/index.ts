export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    isAdmin?: boolean;
    createdAt: Date;
  }
  
  export interface Song {
    id: string;
    title: string;
    artist: string;
    lyrics: string;
    language: Language;
    contributors: string[];
    createdAt: Date;
    updatedAt: Date;
    approved: boolean;
    views: number;
    likes: number;
  }
  
  export interface SearchResult {
    songs: Song[];
    artists: string[];
    totalResults: number;
  }
  
  export enum Language {
    VIETNAMESE = "vietnamese",
    ENGLISH = "english", 
    KOREAN = "korean",
    JAPANESE = "japanese",
    CHINESE = "chinese",
    OTHER = "other"
  }
  
  export interface UserPreferences {
    userId: string;
    theme: "light" | "dark" | "system";
    savedSongs: string[];
    history: {
      songId: string;
      viewedAt: Date;
    }[];
  } 