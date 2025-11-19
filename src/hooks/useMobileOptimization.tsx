import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface MobileOptimizationSettings {
  shouldReduceAnimations: boolean;
  shouldLazyLoadImages: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  videoQuality: '360p' | '480p' | '720p' | '1080p';
  enableHeavyEffects: boolean;
  preloadStrategy: 'none' | 'metadata' | 'auto';
  maxConcurrentImages: number;
}

export const useMobileOptimization = (): MobileOptimizationSettings => {
  const isMobile = useIsMobile();
  const [settings, setSettings] = useState<MobileOptimizationSettings>({
    shouldReduceAnimations: false,
    shouldLazyLoadImages: true,
    imageQuality: 'high',
    videoQuality: '1080p',
    enableHeavyEffects: true,
    preloadStrategy: 'metadata',
    maxConcurrentImages: 10,
  });

  useEffect(() => {
    const detectOptimalSettings = () => {
      // Проверяем тип соединения
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      const effectiveType = connection?.effectiveType || '4g';
      const saveData = connection?.saveData || false;
      const downlink = connection?.downlink || 10; // Скорость в Mbps
      
      // Проверяем память устройства
      const deviceMemory = (navigator as any).deviceMemory || 4;
      
      // Проверяем количество ядер процессора
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;

      let shouldReduceAnimations = false;
      let imageQuality: 'low' | 'medium' | 'high' = 'high';
      let videoQuality: '360p' | '480p' | '720p' | '1080p' = '1080p';
      let enableHeavyEffects = true;
      let preloadStrategy: 'none' | 'metadata' | 'auto' = 'metadata';
      let maxConcurrentImages = 10;

      // Режим экономии трафика
      if (saveData) {
        shouldReduceAnimations = true;
        imageQuality = 'low';
        videoQuality = '360p';
        enableHeavyEffects = false;
        preloadStrategy = 'none';
        maxConcurrentImages = 3;
      }
      // Очень медленное соединение (2G)
      else if (effectiveType === '2g' || effectiveType === 'slow-2g' || downlink < 0.5) {
        shouldReduceAnimations = true;
        imageQuality = 'low';
        videoQuality = '360p';
        enableHeavyEffects = false;
        preloadStrategy = 'none';
        maxConcurrentImages = 2;
      }
      // Медленное соединение (3G)
      else if (effectiveType === '3g' || downlink < 1.5) {
        shouldReduceAnimations = false; // Не уменьшаем анимации на 3G
        imageQuality = 'medium';
        videoQuality = '480p';
        enableHeavyEffects = false;
        preloadStrategy = 'metadata';
        maxConcurrentImages = 4;
      }
      // Мобильное устройство с хорошим соединением
      else if (isMobile) {
        shouldReduceAnimations = deviceMemory < 2 && hardwareConcurrency < 2; // Только для очень слабых устройств
        imageQuality = deviceMemory <= 2 ? 'medium' : 'high';
        videoQuality = deviceMemory <= 2 ? '480p' : '720p';
        enableHeavyEffects = deviceMemory >= 4 && hardwareConcurrency >= 4;
        preloadStrategy = 'metadata';
        maxConcurrentImages = deviceMemory <= 2 ? 5 : 8;
      }
      // Слабое десктопное устройство
      else if (deviceMemory <= 2 || hardwareConcurrency <= 2) {
        shouldReduceAnimations = false; // Не уменьшаем на десктопе
        imageQuality = 'high'; // Высокое качество на десктопе
        videoQuality = '720p';
        enableHeavyEffects = true; // Включаем эффекты на десктопе
        preloadStrategy = 'metadata';
        maxConcurrentImages = 10;
      }
      // Мощное устройство с хорошим соединением
      else {
        shouldReduceAnimations = false;
        imageQuality = 'high';
        videoQuality = '1080p';
        enableHeavyEffects = true;
        preloadStrategy = 'auto';
        maxConcurrentImages = 15;
      }

      setSettings({
        shouldReduceAnimations,
        shouldLazyLoadImages: true,
        imageQuality,
        videoQuality,
        enableHeavyEffects,
        preloadStrategy,
        maxConcurrentImages,
      });
    };

    detectOptimalSettings();

    // Отслеживаем изменения соединения
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', detectOptimalSettings);
      return () => connection.removeEventListener('change', detectOptimalSettings);
    }
  }, [isMobile]);

  return settings;
};
