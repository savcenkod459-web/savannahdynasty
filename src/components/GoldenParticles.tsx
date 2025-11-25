import { useEffect, useState } from 'react';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

const GoldenParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const { isLowEnd, isMobile } = useDevicePerformance();

  useEffect(() => {
    const newParticles: Particle[] = [];
    // Optimized particle count for better performance
    const particleCount = isLowEnd ? 2 : isMobile ? 4 : 8;
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 12 + 18,
        delay: Math.random() * 5,
      });
    }
    setParticles(newParticles);
  }, [isMobile, isLowEnd]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bottom-0 rounded-full blur-sm animate-float-up dark:bg-gradient-to-t dark:from-primary/25 dark:to-accent/10 bg-gradient-to-t from-[hsl(0,0%,75%)]/25 to-[hsl(0,0%,85%)]/15 will-change-transform"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: 'var(--theme) === "dark" ? "0 0 15px hsl(43 96% 56% / 0.4), 0 0 25px hsl(43 96% 56% / 0.3)" : "0 0 15px hsl(0 0% 75% / 0.4), 0 0 25px hsl(0 0% 75% / 0.3)"',
          }}
        />
      ))}
    </div>
  );
};

export default GoldenParticles;
