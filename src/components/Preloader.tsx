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
        
        {/* Floating sparkles and light particles */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(217,179,112,0.8)]" style={{ animation: 'floatParticle 3s ease-in-out infinite', animationDelay: '0s' }} />
          <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_10px_rgba(217,179,112,0.6)]" style={{ animation: 'floatParticle 4s ease-in-out infinite', animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(217,179,112,0.8)]" style={{ animation: 'floatParticle 3.5s ease-in-out infinite', animationDelay: '1s' }} />
          <div className="absolute bottom-0 right-1/3 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_10px_rgba(217,179,112,0.6)]" style={{ animation: 'floatParticle 4.5s ease-in-out infinite', animationDelay: '1.5s' }} />
          
          {/* Additional floating particles */}
          <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(217,179,112,0.7)]" style={{ animation: 'floatParticle 5s ease-in-out infinite', animationDelay: '0.3s' }} />
          <div className="absolute top-2/3 right-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_12px_rgba(217,179,112,0.6)]" style={{ animation: 'floatParticle 4.2s ease-in-out infinite', animationDelay: '0.8s' }} />
          <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(217,179,112,0.7)]" style={{ animation: 'floatParticle 3.8s ease-in-out infinite', animationDelay: '1.2s' }} />
          <div className="absolute top-1/2 right-1/5 w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_rgba(217,179,112,0.6)]" style={{ animation: 'floatParticle 4.8s ease-in-out infinite', animationDelay: '1.8s' }} />
          <div className="absolute top-3/4 left-2/5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_12px_rgba(217,179,112,0.8)]" style={{ animation: 'floatParticle 3.3s ease-in-out infinite', animationDelay: '2.2s' }} />
        </div>
        
        {/* Crown logo with enhanced glow */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center w-32 h-32">
            <Crown 
              className="w-20 h-20 text-primary relative z-10" 
              fill="none"
              strokeWidth={2.5}
              style={{ 
                animation: 'goldPulse 2s ease-in-out infinite, float 3s ease-in-out infinite',
                filter: 'drop-shadow(0 0 25px rgba(217,179,112,0.9)) drop-shadow(0 0 50px rgba(217,179,112,0.7))'
              }} 
            />
            <div className="absolute inset-0 rounded-full blur-3xl animate-pulse" style={{ 
              width: '140%', 
              height: '140%', 
              left: '-20%', 
              top: '-20%',
              background: 'radial-gradient(circle, rgba(217,179,112,0.4) 0%, transparent 70%)',
              animation: 'colorGlow 4s ease-in-out infinite'
            }} />
            <div className="absolute inset-0 rounded-full blur-2xl animate-pulse" style={{ 
              width: '180%', 
              height: '180%', 
              left: '-40%', 
              top: '-40%',
              background: 'radial-gradient(circle, rgba(255,191,0,0.3) 0%, transparent 70%)',
              animation: 'colorGlow 4s ease-in-out infinite',
              animationDelay: '1s'
            }} />
            <div className="absolute inset-0 rounded-full blur-3xl animate-pulse" style={{ 
              width: '220%', 
              height: '220%', 
              left: '-60%', 
              top: '-60%',
              background: 'radial-gradient(circle, rgba(217,179,112,0.2) 0%, transparent 70%)',
              animation: 'colorGlow 4s ease-in-out infinite',
              animationDelay: '2s'
            }} />
          </div>
          
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
