import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  loading = 'lazy',
  onClick 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-muted/10", className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        loading={loading}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onClick={onClick}
      />
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20" />
      )}
    </div>
  );
};
