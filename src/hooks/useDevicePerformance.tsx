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
      const connection = (navigator as any).connection;
      const slowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
      
      // Consider low-end if:
      // - Mobile with <= 2 cores or <= 2GB RAM
      // - Slow connection
      const isLow = isMobile && (cores <= 2 || memory <= 2 || slowConnection);
      
      setIsLowEnd(isLow);
    };

    detectLowEnd();
  }, [isMobile]);

  return { isLowEnd, isMobile, reducedMotion };
};
