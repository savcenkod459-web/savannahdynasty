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
          className="absolute bottom-0 rounded-full blur-sm animate-float-up dark:bg-gradient-to-t dark:from-primary/40 dark:to-accent/20 bg-gradient-to-t from-[hsl(0,0%,70%)]/20 to-[hsl(0,0%,80%)]/10"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: '0 0 10px hsl(0 0% 70% / 0.3), 0 0 20px hsl(0 0% 70% / 0.2)',
          }}
        />
      ))}
    </div>
  );
};

export default GoldenParticles;
