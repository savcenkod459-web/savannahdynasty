/**
 * Утилиты для оптимизации производительности
 */

/**
 * Debounce функция для оптимизации частых вызовов
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle функция для ограничения частоты вызовов
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Проверяет, поддерживает ли браузер аппаратное ускорение
 */
export const supportsHardwareAcceleration = (): boolean => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return !!gl;
};

/**
 * Определяет, является ли устройство iOS
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Определяет, является ли устройство Android
 */
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Оптимизирует изображения для текущего устройства
 */
export const getOptimizedImageSize = (baseSize: number): number => {
  const dpr = window.devicePixelRatio || 1;
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    return Math.round(baseSize * Math.min(dpr, 2));
  }
  
  return Math.round(baseSize * dpr);
};

/**
 * Проверяет, поддерживает ли браузер WebP
 */
export const supportsWebP = async (): Promise<boolean> => {
  if (!self.createImageBitmap) return false;

  const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';
  const blob = await fetch(webpData).then(r => r.blob());

  return createImageBitmap(blob).then(
    () => true,
    () => false
  );
};

/**
 * Определяет качество сети
 */
export const getNetworkQuality = (): 'slow' | 'medium' | 'fast' => {
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
  
  if (!connection) return 'fast';
  
  const effectiveType = connection.effectiveType;
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'slow';
  }
  
  if (effectiveType === '3g') {
    return 'medium';
  }
  
  return 'fast';
};

/**
 * Задержка загрузки несущественных ресурсов
 */
export const deferNonCriticalResources = (): void => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Загружаем несущественные скрипты и стили
    });
  } else {
    setTimeout(() => {
      // Fallback для браузеров без requestIdleCallback
    }, 1000);
  }
};
