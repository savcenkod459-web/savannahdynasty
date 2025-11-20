import { useState, useEffect } from 'react';
import { useImageCache } from './useImageCache';
import { useMediaOptimization } from './useMediaOptimization';
import { useIsMobile } from './use-mobile';

interface UseOptimizedImageProps {
  src: string;
  lowQualitySrc?: string;
}

export const useOptimizedImage = ({ src, lowQualitySrc }: UseOptimizedImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(src); // Start with actual image, not lowQuality
  const [isLoading, setIsLoading] = useState(false); // Don't show loading initially
  const [error, setError] = useState(false);
  const { getFromCache, saveToCache } = useImageCache();
  const { imageQuality } = useMediaOptimization();
  const isMobile = useIsMobile();

  useEffect(() => {
    let isMounted = true;
    let img: HTMLImageElement | null = null;
    
    const loadImage = async () => {
      if (!src) return;
      
      // Check cache first
      const cachedImage = getFromCache(src);
      if (cachedImage && isMounted) {
        setCurrentSrc(cachedImage);
        setIsLoading(false);
        return;
      }

      // Load image directly without compression to avoid CORS issues
      img = new Image();
      
      img.onload = () => {
        if (isMounted) {
          setCurrentSrc(src);
          setIsLoading(false);
          saveToCache(src, src);
        }
      };
      
      img.onerror = () => {
        if (isMounted) {
          setError(true);
          setIsLoading(false);
        }
      };
      
      img.src = src;
    };

    loadImage();

    return () => {
      isMounted = false;
      if (img) {
        img.onload = null;
        img.onerror = null;
      }
    };
  }, [src, getFromCache, saveToCache]);

  const generateSrcSet = () => {
    if (!currentSrc) return undefined;
    
    const baseUrl = currentSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const isWebP = currentSrc.endsWith('.webp');
    const extension = isWebP ? '.webp' : (currentSrc.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg');
    
    // Generate responsive sizes: small (480px), medium (768px), large (1200px)
    const sizes = [
      { width: 480, suffix: '-small' },
      { width: 768, suffix: '-medium' },
      { width: 1200, suffix: '' }
    ];
    
    return sizes.map(size => 
      `${baseUrl}${size.suffix}${extension} ${size.width}w`
    ).join(', ');
  };
  
  const generateSizes = () => {
    if (isMobile) {
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw';
    }
    return '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px';
  };

  return {
    currentSrc,
    isLoading,
    error,
    imageQuality,
    isMobile,
    generateSrcSet,
    generateSizes,
  };
};