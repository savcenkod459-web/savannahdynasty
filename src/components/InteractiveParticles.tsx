import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    const newParticles: Particle[] = [];
    const particleCount = isMobile ? 5 : 15;
    for (let i = 0; i < particleCount; i++) {
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
  }, [isMobile]);

  useEffect(() => {
    // Отключаем интерактивность на мобильных для производительности
    if (isMobile) return;
    
    let rafId: number;
    let lastUpdate = 0;
    const throttleDelay = 50;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
        lastUpdate = now;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  useEffect(() => {
    // На мобильных - более редкие обновления
    const updateInterval = isMobile ? 100 : 50;
    
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => {
          // На мобильных - статичные частицы без интерактивности
          if (isMobile) {
            let newX = particle.x + particle.speedX;
            let newY = particle.y + particle.speedY;
            
            if (newX < 0 || newX > window.innerWidth) newX = Math.random() * window.innerWidth;
            if (newY < 0 || newY > window.innerHeight) newY = Math.random() * window.innerHeight;
            
            return { ...particle, x: newX, y: newY };
          }
          
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
    }, updateInterval);

    return () => clearInterval(interval);
  }, [mousePos, isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-[hsl(0,0%,70%)]/30 dark:bg-primary/50 blur-[2px] will-change-transform"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transition: 'all 0.1s ease-out',
            boxShadow: '0 0 20px hsl(0 0% 70% / 0.4), 0 0 30px hsl(0 0% 70% / 0.25)',
          }}
        />
      ))}
    </div>
  );
};

export default InteractiveParticles;
