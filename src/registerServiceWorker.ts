import { Workbox } from 'workbox-window';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('[SW] New content available; preparing update...');
        // Показываем уведомление пользователю о новой версии
        if (confirm('Доступна новая версия приложения. Обновить?')) {
          wb.messageSkipWaiting();
          window.location.reload();
        }
      } else {
        console.log('[SW] Content cached for offline use.');
      }
    });

    wb.addEventListener('waiting', () => {
      console.log('[SW] New service worker waiting to activate.');
    });

    wb.addEventListener('controlling', () => {
      console.log('[SW] Service worker controlling page.');
      window.location.reload();
    });

    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log('[SW] Service worker activated!');
      }
    });

    wb.register()
      .then((registration) => {
        console.log('[SW] Registration successful:', registration);
        
        // Проверка обновлений каждые 60 минут
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((error) => {
        console.error('[SW] Registration failed:', error);
      });
  } else {
    console.warn('[SW] Service workers not supported');
  }
}
