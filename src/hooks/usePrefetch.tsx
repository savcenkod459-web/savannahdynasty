import { useEffect, useRef } from 'react';

interface PrefetchOptions {
  threshold?: number; // Distance from bottom to trigger prefetch (in pixels)
  enabled?: boolean;
}

export const usePrefetch = (
  onPrefetch: () => void,
  options: PrefetchOptions = {}
) => {
  const { threshold = 800, enabled = true } = options;
  const prefetchedRef = useRef(false);

  useEffect(() => {
    if (!enabled || prefetchedRef.current) return;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      
      // If user is near bottom
      if (documentHeight - scrollPosition < threshold) {
        if (!prefetchedRef.current) {
          prefetchedRef.current = true;
          onPrefetch();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onPrefetch, threshold, enabled]);

  const reset = () => {
    prefetchedRef.current = false;
  };

  return { reset };
};

// Hook for preloading images
export const useImagePrefetch = () => {
  const prefetchImage = (url: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  };

  const prefetchImages = async (urls: string[]) => {
    try {
      await Promise.all(urls.map(url => prefetchImage(url)));
    } catch (error) {
      console.warn('Some images failed to prefetch:', error);
    }
  };

  return { prefetchImage, prefetchImages };
};
