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
      }, 1000);
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
        className="fixed inset-0 z-[99998] bg-background"
        style={{ 
          opacity: isVisible ? 1 : 0,
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
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-background transition-opacity duration-1000"
        style={{ 
          opacity: isVisible ? 1 : 0, 
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
        {/* Animated circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-primary/20 rounded-full animate-ping" />
          <div className="absolute w-24 h-24 border-4 border-primary/40 rounded-full animate-pulse" />
        </div>
        
        {/* Crown logo */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative">
            <Crown className="w-16 h-16 text-primary animate-gold-pulse drop-shadow-[0_0_30px_rgba(217,179,112,0.8)]" />
            <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="font-display font-black text-3xl text-luxury-gradient luxury-text-shadow animate-shimmer">
              SavannahDynasty
            </h1>
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Preloader;
