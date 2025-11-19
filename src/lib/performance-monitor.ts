/**
 * Утилита для мониторинга и оптимизации производительности на мобильных устройствах
 */

export const performanceMonitor = {
  // Проверяем поддержку современных API
  supportsWebP: () => {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  },

  // Получаем информацию о производительности устройства
  getDevicePerformance: () => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    return {
      isLowEnd: memory <= 2 || cores <= 2,
      isMobile: /Mobile|Android|iPhone/i.test(navigator.userAgent),
      connectionType: connection?.effectiveType || '4g',
      saveData: connection?.saveData || false,
      memory,
      cores
    };
  },

  // Очищаем кеш при нехватке памяти
  setupMemoryPressureHandler: () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(({ usage, quota }) => {
        const percentUsed = ((usage || 0) / (quota || 1)) * 100;
        console.log(`Storage used: ${percentUsed.toFixed(2)}%`);
        
        // Если использовано более 80% хранилища, очищаем кеш
        if (percentUsed > 80) {
          console.warn('Storage quota exceeded 80%, clearing cache...');
          caches.keys().then(keys => {
            keys.forEach(key => {
              if (key.includes('images-cache') || key.includes('videos-cache')) {
                caches.delete(key);
              }
            });
          });
          
          // Очищаем IndexedDB кеш
          const dbRequest = indexedDB.deleteDatabase('ImageCacheDB');
          dbRequest.onsuccess = () => console.log('IndexedDB cache cleared');
        }
      });
    }
  },

  // Оптимизируем производительность скролла только на мобильных
  optimizeScrollPerformance: () => {
    const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
    if (!isMobile) return; // Не применяем на ПК
    
    let ticking = false;
    
    const optimizeScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.body.classList.add('is-scrolling');
          
          setTimeout(() => {
            document.body.classList.remove('is-scrolling');
          }, 100);
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', optimizeScroll, { passive: true });
  },

  // Добавляем глобальные стили для оптимизации только на мобильных
  injectOptimizationStyles: () => {
    const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const isLowEnd = deviceMemory <= 2;
    
    const style = document.createElement('style');
    style.textContent = `
      /* Оптимизация только для мобильных устройств */
      @media (max-width: 768px) {
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        ${isLowEnd ? `
        /* Отключаем тяжелые эффекты во время скролла только на слабых устройствах */
        .is-scrolling .animate-float,
        .is-scrolling .animate-gold-pulse {
          animation-play-state: paused !important;
        }
        ` : ''}
        
        /* Уменьшаем сложность shadow только на мобильных */
        .hover\\:shadow-\\[0_0_60px_rgba\\(217\\,179\\,112\\,0\\.8\\)\\]:hover {
          box-shadow: 0 0 40px rgba(217,179,112,0.6) !important;
        }
      }
    `;
    document.head.appendChild(style);
  },

  // Инициализация всех оптимизаций
  init: () => {
    performanceMonitor.setupMemoryPressureHandler();
    performanceMonitor.optimizeScrollPerformance();
    performanceMonitor.injectOptimizationStyles();
    
    const deviceInfo = performanceMonitor.getDevicePerformance();
    console.log('Device performance info:', deviceInfo);
  }
};
