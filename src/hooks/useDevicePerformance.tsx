import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface DevicePerformance {
  isLowEnd: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
}

export const useDevicePerformance = (): DevicePerformance => {
  const isMobile = useIsMobile();
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    // Detect low-end devices
    const detectLowEnd = () => {
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4;
      
      // Check device memory (if available)
      const memory = (navigator as any).deviceMemory || 4;
      
      // Check connection speed
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const effectiveType = connection?.effectiveType || '4g';
      const slowConnection = effectiveType === '2g' || effectiveType === 'slow-2g' || effectiveType === '3g';
      
      // Check if save data mode is enabled
      const saveData = connection?.saveData || false;
      
      // Consider low-end if:
      // - Mobile with <= 2 cores or <= 2GB RAM
      // - Slow connection or save data mode
      // - Low device pixel ratio (< 1.5)
      const pixelRatio = window.devicePixelRatio || 1;
      const isLow = isMobile && (
        cores <= 2 || 
        memory <= 2 || 
        slowConnection || 
        saveData ||
        pixelRatio < 1.5
      );
      
      setIsLowEnd(isLow);
    };

    detectLowEnd();
    
    // Re-check when connection changes
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener('change', detectLowEnd);
      return () => connection.removeEventListener('change', detectLowEnd);
    }
  }, [isMobile]);

  return { isLowEnd, isMobile, reducedMotion };
};
