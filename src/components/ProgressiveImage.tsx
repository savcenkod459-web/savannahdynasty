import { memo } from "react";
import { useOptimizedImage } from "@/hooks/useOptimizedImage";

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
  const { currentSrc, isLoading, imageQuality, generateSrcSet, generateSizes } = useOptimizedImage({ 
    src, 
    lowQualitySrc: lowQualitySrc || src 
  });

  return (
    <img
      src={currentSrc}
      srcSet={generateSrcSet()}
      sizes={generateSizes()}
      alt={alt}
      className={`${className} transition-opacity duration-300`}
      onClick={onClick}
      loading="lazy"
      decoding="async"
      fetchPriority={imageQuality === 'high' ? 'high' : 'low'}
    />
  );
};

export const ProgressiveImage = memo(ProgressiveImageComponent);
