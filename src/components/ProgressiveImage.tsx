import { useState, useEffect, memo } from "react";
import { useMediaOptimization } from "@/hooks/useMediaOptimization";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  lowQualitySrc?: string;
  onClick?: () => void;
}

const ProgressiveImageComponent = ({ 
  src, 
  alt, 
  className = "", 
  lowQualitySrc,
  onClick 
}: ProgressiveImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isLoading, setIsLoading] = useState(true);
  const { imageQuality } = useMediaOptimization();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsLoading(true);
    
    // Create a new image to preload the high-quality version
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Генерируем srcset для адаптивных изображений
  const generateSrcSet = () => {
    if (!isMobile) return undefined;
    
    const baseUrl = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const extension = src.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
    
    return `${baseUrl}-small${extension} 480w, ${baseUrl}-medium${extension} 768w, ${src} 1200w`;
  };

  return (
    <img
      src={currentSrc}
      srcSet={generateSrcSet()}
      sizes={isMobile ? "(max-width: 768px) 100vw, 768px" : "100vw"}
      alt={alt}
      className={`${className} ${isLoading && lowQualitySrc ? 'blur-sm scale-105' : 'blur-0 scale-100'} transition-all duration-500`}
      onClick={onClick}
      loading="lazy"
      decoding="async"
      fetchPriority={imageQuality === 'high' ? 'high' : 'low'}
    />
  );
};

export const ProgressiveImage = memo(ProgressiveImageComponent);
