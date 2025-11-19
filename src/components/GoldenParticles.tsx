import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

const GoldenParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bottom-0 rounded-full blur-[1px] animate-float-up dark:bg-gradient-to-t dark:from-primary/50 dark:to-accent/30 bg-gradient-to-t from-[hsl(0,0%,60%)]/50 to-[hsl(0,0%,70%)]/35"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: document.documentElement.classList.contains('dark')
              ? '0 0 20px rgba(217, 179, 112, 0.6), 0 0 35px rgba(217, 179, 112, 0.4)'
              : '0 0 20px rgba(192, 192, 192, 0.8), 0 0 35px rgba(192, 192, 192, 0.6)',
          }}
        />
      ))}
    </div>
  );
};

export default GoldenParticles;
