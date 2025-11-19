import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}

const InteractiveParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      });
    }
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => {
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const force = Math.min(100 / (distance + 1), 2);

          let newX = particle.x + particle.speedX + (dx / distance) * force * 0.1;
          let newY = particle.y + particle.speedY + (dy / distance) * force * 0.1;

          if (newX < 0 || newX > window.innerWidth) newX = Math.random() * window.innerWidth;
          if (newY < 0 || newY > window.innerHeight) newY = Math.random() * window.innerHeight;

          return { ...particle, x: newX, y: newY };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [mousePos]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full dark:bg-primary/60 bg-[hsl(0,0%,55%)]/60 blur-[1px]"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transition: 'all 0.1s ease-out',
            boxShadow: document.documentElement.classList.contains('dark')
              ? '0 0 25px rgba(217, 179, 112, 0.6), 0 0 40px rgba(217, 179, 112, 0.4)'
              : '0 0 25px rgba(192, 192, 192, 0.8), 0 0 40px rgba(192, 192, 192, 0.6)',
          }}
        />
      ))}
    </div>
  );
};

export default InteractiveParticles;
