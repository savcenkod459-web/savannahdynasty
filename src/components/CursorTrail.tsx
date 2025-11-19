import { useEffect, useState } from 'react';

interface Trail {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  timestamp: number;
}

const CursorTrail = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      const newTrail: Trail = {
        id: nextId,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };

      setTrails((prev) => [...prev.slice(-15), newTrail]);
      setNextId((prev) => prev + 1);

      // Создаем искры с вероятностью 30%
      if (Math.random() > 0.7) {
        const newSparks: Spark[] = [];
        for (let i = 0; i < 3; i++) {
          newSparks.push({
            id: nextId + i + 1000,
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1,
            timestamp: Date.now(),
          });
        }
        setSparks((prev) => [...prev, ...newSparks]);
      }
    };

    const animate = () => {
      const now = Date.now();
      
      // Удаляем старые следы (старше 500ms)
      setTrails((prev) => prev.filter((trail) => now - trail.timestamp < 500));

      // Обновляем и удаляем искры
      setSparks((prev) =>
        prev
          .map((spark) => ({
            ...spark,
            x: spark.x + spark.vx,
            y: spark.y + spark.vy,
            vy: spark.vy + 0.2, // гравитация
            life: spark.life - 0.02,
          }))
          .filter((spark) => spark.life > 0)
      );

      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [nextId]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* След за курсором */}
      {trails.map((trail, index) => {
        const age = Date.now() - trail.timestamp;
        const opacity = Math.max(0, 1 - age / 500);
        const scale = 1 - age / 1000;

        return (
          <div
            key={trail.id}
            className="absolute rounded-full blur-sm bg-gradient-to-r dark:from-primary dark:to-accent from-[hsl(0,0%,60%)] to-[hsl(0,0%,70%)]"
            style={{
              left: `${trail.x}px`,
              top: `${trail.y}px`,
              width: '12px',
              height: '12px',
              opacity: opacity * 0.6,
              transform: `translate(-50%, -50%) scale(${scale})`,
              transition: 'opacity 0.1s ease-out',
            }}
          />
        );
      })}

      {/* Искры */}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute rounded-full dark:bg-primary bg-[hsl(0,0%,65%)]"
          style={{
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            width: '4px',
            height: '4px',
            opacity: spark.life,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${6 * spark.life}px currentColor`,
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;
