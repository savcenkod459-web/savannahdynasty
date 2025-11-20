import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const location = useLocation();
  const prevLocation = useRef(location);

  useEffect(() => {
    if (prevLocation.current.pathname !== location.pathname) {
      // Плавная прокрутка вверх при смене страницы
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Применяем оптимизацию рендеринга
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          prevLocation.current = location;
        });
      } else {
        setTimeout(() => {
          prevLocation.current = location;
        }, 1);
      }
    }
  }, [location]);
};
