import { useCallback } from 'react';

interface VideoCache {
  url: string;
  blob: Blob;
  timestamp: number;
}

const DB_NAME = 'video_cache';
const STORE_NAME = 'videos';
const DB_VERSION = 1;
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const useVideoCache = () => {
  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }, []);

  const getCachedVideo = useCallback(async (url: string): Promise<string | null> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      return new Promise((resolve, reject) => {
        const request = store.get(url);
        
        request.onsuccess = () => {
          const result = request.result as VideoCache | undefined;
          
          if (result) {
            // Check if cache is still valid
            if (Date.now() - result.timestamp < MAX_CACHE_AGE) {
              const blobUrl = URL.createObjectURL(result.blob);
              resolve(blobUrl);
            } else {
              // Cache expired, delete it
              deleteFromCache(url);
              resolve(null);
            }
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error reading from video cache:', error);
      return null;
    }
  }, [openDB]);

  const cacheVideo = useCallback(async (url: string): Promise<string> => {
    try {
      // Check if already cached
      const cached = await getCachedVideo(url);
      if (cached) return cached;

      // Fetch the video
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch video');

      const blob = await response.blob();
      
      // Check cache size before storing
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Store in IndexedDB
      const videoCache: VideoCache = {
        url,
        blob,
        timestamp: Date.now()
      };

      await new Promise<void>((resolve, reject) => {
        const request = store.put(videoCache);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Clean up old entries if needed
      await cleanupOldEntries();

      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn('Error caching video:', error);
      // Return original URL as fallback
      return url;
    }
  }, [openDB, getCachedVideo]);

  const deleteFromCache = useCallback(async (url: string): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(url);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error deleting from cache:', error);
    }
  }, [openDB]);

  const cleanupOldEntries = useCallback(async (): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');

      const request = index.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const entry = cursor.value as VideoCache;
          
          // Delete entries older than MAX_CACHE_AGE
          if (Date.now() - entry.timestamp > MAX_CACHE_AGE) {
            cursor.delete();
          }
          
          cursor.continue();
        }
      };
    } catch (error) {
      console.warn('Error cleaning up cache:', error);
    }
  }, [openDB]);

  const clearCache = useCallback(async (): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  }, [openDB]);

  return {
    getCachedVideo,
    cacheVideo,
    deleteFromCache,
    clearCache
  };
};
