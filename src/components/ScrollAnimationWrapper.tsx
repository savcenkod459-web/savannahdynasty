import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'none';
  className?: string;
  delay?: number;
}

const ScrollAnimationWrapper = ({ 
  children, 
  animation = 'fade', 
  className = '',
  delay = 0
}: ScrollAnimationWrapperProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ 
    threshold: 0.05, 
    triggerOnce: true 
  });

  const getAnimationClass = () => {
    if (!isVisible || animation === 'none') return 'opacity-0 translate-y-12';
    
    switch (animation) {
      case 'fade':
        return 'animate-[fadeInUp_1s_cubic-bezier(0.4,0,0.2,1)_forwards]';
      case 'slide-up':
        return 'animate-[slide-up_1s_cubic-bezier(0.4,0,0.2,1)_forwards]';
      case 'slide-left':
        return 'animate-[slide-left_1s_cubic-bezier(0.4,0,0.2,1)_forwards]';
      case 'slide-right':
        return 'animate-[slide-right_1s_cubic-bezier(0.4,0,0.2,1)_forwards]';
      case 'scale':
        return 'animate-[scaleIn_1s_cubic-bezier(0.4,0,0.2,1)_forwards]';
      default:
        return '';
    }
  };

  return (
    <div 
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={{
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimationWrapper;
