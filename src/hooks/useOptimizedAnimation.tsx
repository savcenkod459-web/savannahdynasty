import { useDevicePerformance } from './useDevicePerformance';

interface AnimationClasses {
  float?: boolean;
  pulse?: boolean;
  blur?: boolean;
  hover?: boolean;
  shadow?: boolean;
  backdrop?: boolean;
}

/**
 * Hook для условного применения анимаций в зависимости от производительности устройства
 * На мобильных и слабых устройствах отключает тяжелые анимации
 */
export const useOptimizedAnimation = () => {
  const { isLowEnd, isMobile, reducedMotion } = useDevicePerformance();
  
  // Если пользователь предпочитает уменьшенное движение, отключаем все анимации
  const shouldDisableAnimations = reducedMotion || isLowEnd;
  
  /**
   * Возвращает классы анимаций только если устройство поддерживает их
   */
  const getAnimationClasses = (classes: AnimationClasses): string => {
    if (shouldDisableAnimations) {
      return '';
    }
    
    const classList: string[] = [];
    
    if (classes.float && !isMobile) {
      classList.push('animate-float');
    }
    
    if (classes.pulse && !isMobile) {
      classList.push('animate-gold-pulse');
    }
    
    if (classes.blur && !isMobile) {
      classList.push('blur-3xl');
    }
    
    if (classes.hover) {
      classList.push('hover-lift', 'hover-scale');
    }
    
    if (classes.shadow && !isMobile) {
      classList.push('shadow-glow');
    }
    
    if (classes.backdrop && !isMobile) {
      classList.push('backdrop-blur-xl');
    }
    
    return classList.join(' ');
  };
  
  /**
   * Проверяет, должна ли анимация быть включена
   */
  const shouldAnimate = (animationType?: 'heavy' | 'light'): boolean => {
    if (reducedMotion) return false;
    if (animationType === 'heavy' && isLowEnd) return false;
    return true;
  };
  
  /**
   * Возвращает оптимизированную задержку анимации
   */
  const getAnimationDelay = (delay: string): string => {
    if (shouldDisableAnimations) return '0s';
    return delay;
  };
  
  return {
    shouldAnimate,
    getAnimationClasses,
    getAnimationDelay,
    isLowEnd,
    isMobile,
    reducedMotion,
  };
};
