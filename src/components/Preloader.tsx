import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

const Preloader = () => {
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
        {/* Multiple animated circles for luxury effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 border-4 border-primary/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute w-32 h-32 border-4 border-accent/40 rounded-full animate-pulse" style={{ animationDuration: '1.5s' }} />
          <div className="absolute w-24 h-24 border-2 border-primary/50 rounded-full" style={{ animation: 'spin 3s linear infinite' }} />
        </div>
        
        {/* Floating sparkles */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-accent rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-0 right-1/3 w-1.5 h-1.5 bg-accent rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Crown logo with minimal glow */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <Crown 
            className="w-20 h-20 text-primary" 
            strokeWidth={2.5}
            style={{ 
              animation: 'goldPulse 2s ease-in-out infinite, float 3s ease-in-out infinite',
              filter: 'drop-shadow(0 0 8px rgba(217,179,112,0.6))',
              background: 'transparent'
            }} 
          />
          
          <div className="text-center space-y-3">
            <h1 className="font-display font-black text-4xl text-luxury-gradient luxury-text-shadow animate-shimmer drop-shadow-[0_0_20px_rgba(217,179,112,0.6)]">
              SavannahDynasty
            </h1>
            <p className="text-sm text-muted-foreground tracking-[0.3em] uppercase font-semibold">Premium Luxury Cats</p>
            <div className="flex gap-2 justify-center pt-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce shadow-[0_0_10px_rgba(217,179,112,0.8)]" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce shadow-[0_0_10px_rgba(217,179,112,0.8)]" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce shadow-[0_0_10px_rgba(217,179,112,0.8)]" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Preloader;
