import { useState, useEffect } from 'react';

export type NetworkQuality = 'high' | 'medium' | 'low' | 'offline';
export type VideoQuality = '1080p' | '720p' | '480p' | '360p';

interface NetworkSpeedResult {
  quality: NetworkQuality;
  effectiveType: string;
  downlink: number;
  recommendedVideoQuality: VideoQuality;
  isSlowConnection: boolean;
}

export const useNetworkSpeed = (): NetworkSpeedResult => {
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>('high');
  const [effectiveType, setEffectiveType] = useState('4g');
  const [downlink, setDownlink] = useState(10);

  useEffect(() => {
    // Check if Network Information API is available
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    const updateNetworkInfo = () => {
      if (connection) {
        const { effectiveType, downlink, saveData } = connection;
        setEffectiveType(effectiveType || '4g');
        setDownlink(downlink || 10);

        // Determine quality based on connection info
        let quality: NetworkQuality = 'high';
        
        if (saveData) {
          quality = 'low';
        } else if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          quality = 'offline';
        } else if (effectiveType === '3g' || downlink < 1.5) {
          quality = 'low';
        } else if (effectiveType === '4g' && downlink < 5) {
          quality = 'medium';
        } else {
          quality = 'high';
        }

        setNetworkQuality(quality);
      } else {
        // Fallback: measure actual download speed
        measureDownloadSpeed();
      }
    };

    const measureDownloadSpeed = async () => {
      try {
        const startTime = performance.now();
        const imageUrl = `https://via.placeholder.com/50?t=${Date.now()}`;
        
        await fetch(imageUrl, { cache: 'no-store' });
        
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // seconds
        const bitsLoaded = 50 * 1024 * 8; // 50KB in bits
        const speedMbps = (bitsLoaded / duration / 1024 / 1024);

        if (speedMbps > 5) {
          setNetworkQuality('high');
          setDownlink(speedMbps);
        } else if (speedMbps > 2) {
          setNetworkQuality('medium');
          setDownlink(speedMbps);
        } else if (speedMbps > 0.5) {
          setNetworkQuality('low');
          setDownlink(speedMbps);
        } else {
          setNetworkQuality('offline');
          setDownlink(speedMbps);
        }
      } catch (error) {
        console.warn('Failed to measure network speed:', error);
        setNetworkQuality('medium');
      }
    };

    updateNetworkInfo();

    // Listen for connection changes
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  // Recommend video quality based on network
  const getRecommendedVideoQuality = (): VideoQuality => {
    switch (networkQuality) {
      case 'high':
        return downlink > 10 ? '1080p' : '720p';
      case 'medium':
        return '480p';
      case 'low':
        return '360p';
      case 'offline':
        return '360p';
      default:
        return '720p';
    }
  };

  return {
    quality: networkQuality,
    effectiveType,
    downlink,
    recommendedVideoQuality: getRecommendedVideoQuality(),
    isSlowConnection: networkQuality === 'low' || networkQuality === 'offline',
  };
};
