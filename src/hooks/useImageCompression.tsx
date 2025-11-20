import { useCallback } from 'react';

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
}

export const useImageCompression = () => {
  const compressImage = useCallback(async (
    imageUrl: string,
    options: CompressionOptions = {}
  ): Promise<string> => {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.85,
      format = 'image/webp'
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob and then to data URL
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          format,
          quality
        );
      };
      
      img.onerror = () => {
        // If compression fails, return original
        resolve(imageUrl);
      };
      
      img.src = imageUrl;
    });
  }, []);

  return { compressImage };
};
