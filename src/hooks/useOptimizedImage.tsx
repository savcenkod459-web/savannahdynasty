import { useState, useEffect } from 'react';
import { useImageCache } from './useImageCache';
import { useMediaOptimization } from './useMediaOptimization';
import { useIsMobile } from './use-mobile';

interface UseOptimizedImageProps {
  src: string;
  lowQualitySrc?: string;
}

export const useOptimizedImage = ({ src, lowQualitySrc }: UseOptimizedImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { getFromCache, saveToCache } = useImageCache();
  const { imageQuality } = useMediaOptimization();
  const isMobile = useIsMobile();

  useEffect(() => {
    let isMounted = true;
    let img: HTMLImageElement | null = null;
    
    const loadImage = async () => {
      if (!src) return;
      
      setIsLoading(true);
      setError(false);

      // Check cache first
      const cachedImage = getFromCache(src);
      if (cachedImage && isMounted) {
        setCurrentSrc(cachedImage);
        setIsLoading(false);
        return;
      }

      img = new Image();
      
      // Progressive image loading strategy with WebP support
      const getImageVariants = (source: string) => {
        const baseUrl = source.replace(/\.(jpg|jpeg|png)$/i, '');
        const originalExt = source.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';
        
        return {
          webp: `${baseUrl}.webp`,
          original: source,
          fallback: source.replace(/\.(jpg|jpeg|png)$/i, originalExt)
        };
      };
      
      const tryLoad = (source: string) => {
        return new Promise<string>((resolve, reject) => {
          if (!img) return reject();
          img.src = source;
          img.onload = () => resolve(source);
          img.onerror = () => reject();
        });
      };

      try {
        const variants = getImageVariants(src);
        
        // Try WebP first (best compression), then fallback to original
        let loadedSrc: string;
        try {
          loadedSrc = await tryLoad(variants.webp);
        } catch {
          // Fallback to original format
          loadedSrc = await tryLoad(variants.original);
        }
        
        if (isMounted) {
          setCurrentSrc(loadedSrc);
          setIsLoading(false);
          saveToCache(src, loadedSrc);
        }
      } catch {
        if (isMounted) {
          setError(true);
          setIsLoading(false);
        }
      }
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