import { useEffect, useState } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

const SparkEffect = () => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const newSparks: Spark[] = [];
    for (let i = 0; i < 20; i++) {
      newSparks.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
        rotation: Math.random() * 360,
      });
    }
    setSparks(newSparks);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            animation: `sparkle ${spark.duration}s ease-in-out ${spark.delay}s infinite`,
            transform: `rotate(${spark.rotation}deg)`,
          }}
        >
          <div
            className="relative"
            style={{
              width: `${spark.size}px`,
              height: `${spark.size}px`,
            }}
          >
            {/* Vertical line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-[hsl(0,0%,60%)] to-transparent dark:via-primary opacity-80 dark:opacity-100" 
              style={{
                boxShadow: document.documentElement.classList.contains('dark')
                  ? '0 0 8px rgba(217, 179, 112, 0.6)'
                  : '0 0 8px rgba(192, 192, 192, 0.8)',
              }}
            />
            {/* Horizontal line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-gradient-to-r from-transparent via-[hsl(0,0%,60%)] to-transparent dark:via-primary opacity-80 dark:opacity-100"
              style={{
                boxShadow: document.documentElement.classList.contains('dark')
                  ? '0 0 8px rgba(217, 179, 112, 0.6)'
                  : '0 0 8px rgba(192, 192, 192, 0.8)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SparkEffect;
