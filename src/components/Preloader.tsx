import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

const Preloader = () => {
  // Add keyframes for glow fade-in animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInGlow {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent scrolling when preloader is visible
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Re-enable scrolling after preloader disappears
      setTimeout(() => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }, 800);
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Full screen background overlay */}
      <div 
        className="fixed inset-0 z-[99998] bg-background transition-all duration-800"
        style={{ 
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(1.1)',
          pointerEvents: isVisible ? 'auto' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
        }}
      />
      
      {/* Preloader content */}
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-background transition-all duration-800"
        style={{ 
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          pointerEvents: isVisible ? 'auto' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100dvh',
          overflow: 'hidden'
        }}>
      <div className="relative">
        {/* Crown logo - clean without any effects */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <Crown 
            className="w-20 h-20 text-primary animate-fade-in" 
            strokeWidth={2}
            style={{
              filter: 'drop-shadow(0 0 8px hsl(43 96% 56% / 0.4))',
              animation: 'fadeInGlow 1.2s ease-out forwards'
            }}
          />
          
          <div className="text-center space-y-3">
            <h1 
              className="font-display font-black text-4xl text-primary"
              style={{
                textShadow: '0 0 12px hsl(43 96% 56% / 0.5), 0 0 24px hsl(43 96% 56% / 0.2)',
                animation: 'fadeInGlow 1.2s ease-out 0.2s forwards',
                opacity: 0
              }}
            >
              SavannahDynasty
            </h1>
            <p 
              className="text-sm text-muted-foreground tracking-[0.3em] uppercase font-semibold"
              style={{
                textShadow: '0 0 8px hsl(43 96% 56% / 0.3)',
                animation: 'fadeInGlow 1.2s ease-out 0.4s forwards',
                opacity: 0
              }}
            >Premium Luxury Cats</p>
            <div className="flex gap-2 justify-center pt-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Preloader;
