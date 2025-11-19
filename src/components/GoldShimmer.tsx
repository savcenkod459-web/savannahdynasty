import { useEffect, useState } from 'react';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';

interface Shimmer {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const GoldShimmer = () => {
  const [shimmers, setShimmers] = useState<Shimmer[]>([]);
  const { isLowEnd, isMobile } = useDevicePerformance();

  useEffect(() => {
    const newShimmers: Shimmer[] = [];
    // Reduce shimmers on mobile, especially low-end devices
    const shimmerCount = isLowEnd ? 2 : isMobile ? 4 : 10;
    for (let i = 0; i < shimmerCount; i++) {
      newShimmers.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 150 + 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
      });
    }
    setShimmers(newShimmers);
  }, [isMobile, isLowEnd]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {shimmers.map((shimmer) => (
        <div
          key={shimmer.id}
          className="absolute rounded-full opacity-0 animate-shimmer-pulse will-change-transform"
          style={{
            left: `${shimmer.x}%`,
            top: `${shimmer.y}%`,
            width: `${shimmer.size}px`,
            height: `${shimmer.size}px`,
            background: 'radial-gradient(circle, rgba(217, 179, 112, 0.15) 0%, transparent 70%)',
            animationDuration: `${shimmer.duration}s`,
            animationDelay: `${shimmer.delay}s`,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  );
};

export default GoldShimmer;