import { memo } from "react";
import { useOptimizedImage } from "@/hooks/useOptimizedImage";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  lowQualitySrc?: string;
}

const OptimizedImageComponent = ({ 
  src, 
  alt, 
  className = "", 
  onClick,
  lowQualitySrc 
}: OptimizedImageProps) => {
  const { currentSrc, isLoading, error, imageQuality, generateSrcSet, generateSizes } = useOptimizedImage({ src, lowQualitySrc });

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted`}>
        <span className="text-sm text-muted-foreground">Failed to load image</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      srcSet={generateSrcSet()}
      sizes={generateSizes()}
      alt={alt}
      className={`${className} ${isLoading && lowQualitySrc ? 'blur-sm scale-105' : 'blur-0 scale-100'} transition-all duration-500`}
      onClick={onClick}
      loading="lazy"
      decoding="async"
      fetchPriority={imageQuality === 'high' ? 'high' : 'low'}
    />
  );
};

export const OptimizedImage = memo(OptimizedImageComponent);
