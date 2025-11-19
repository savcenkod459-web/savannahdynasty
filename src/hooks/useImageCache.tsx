import { useState, useEffect } from 'react';

interface CacheConfig {
  maxAge?: number; // в миллисекундах, по умолчанию 24 часа
  maxSize?: number; // максимальный размер кэша в MB, по умолчанию 50MB
}

interface CachedImage {
  data: string;
  timestamp: number;
  size: number;
}

const DEFAULT_MAX_AGE = 24 * 60 * 60 * 1000; // 24 часа
const DEFAULT_MAX_SIZE = 50 * 1024 * 1024; // 50MB

export const useImageCache = (config: CacheConfig = {}) => {
  const { maxAge = DEFAULT_MAX_AGE, maxSize = DEFAULT_MAX_SIZE } = config;

  const getCacheKey = (url: string) => `img_cache_${url}`;

  const getFromCache = (url: string): string | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(url));
      if (!cached) return null;

      const cachedImage: CachedImage = JSON.parse(cached);
      const now = Date.now();

      // Проверяем, не истек ли срок действия
      if (now - cachedImage.timestamp > maxAge) {
        localStorage.removeItem(getCacheKey(url));
        return null;
      }

      return cachedImage.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

  const saveToCache = async (url: string, data: string) => {
    try {
      // Вычисляем размер данных (приблизительно)
      const size = new Blob([data]).size;
      
      const cachedImage: CachedImage = {
        data,
        timestamp: Date.now(),
        size
      };

      // Проверяем общий размер кэша
      let totalSize = size;
      const keys = Object.keys(localStorage).filter(key => key.startsWith('img_cache_'));
      
      for (const key of keys) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed: CachedImage = JSON.parse(item);
            totalSize += parsed.size;
          }
        } catch (e) {
          // Игнорируем ошибки парсинга
        }
      }

      // Если превышен лимит, удаляем старые записи
      if (totalSize > maxSize) {
        const sortedKeys = keys
          .map(key => {
            try {
              const item = localStorage.getItem(key);
              if (!item) return null;
              const parsed: CachedImage = JSON.parse(item);
              return { key, timestamp: parsed.timestamp };
            } catch (e) {
              return null;
            }
          })
          .filter((item): item is { key: string; timestamp: number } => item !== null)
          .sort((a, b) => a.timestamp - b.timestamp);

        // Удаляем 25% самых старых записей
        const toRemove = Math.ceil(sortedKeys.length * 0.25);
        for (let i = 0; i < toRemove; i++) {
          localStorage.removeItem(sortedKeys[i].key);
        }
      }

      localStorage.setItem(getCacheKey(url), JSON.stringify(cachedImage));
    } catch (error) {
      console.error('Error saving to cache:', error);
      // Если квота превышена, очищаем весь кэш изображений
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        clearImageCache();
      }
    }
  };

  const clearImageCache = () => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('img_cache_'));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return {
    getFromCache,
    saveToCache,
    clearImageCache
  };
};

// Хук для кэширования данных (не изображений)
export const useDataCache = <T,>(key: string, maxAge: number = DEFAULT_MAX_AGE) => {
  const cacheKey = `data_cache_${key}`;

  const getFromCache = (): T | null => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp > maxAge) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading data from cache:', error);
      return null;
    }
  };

  const saveToCache = (data: T) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving data to cache:', error);
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Error clearing data cache:', error);
    }
  };

  return {
    getFromCache,
    saveToCache,
    clearCache
  };
};
