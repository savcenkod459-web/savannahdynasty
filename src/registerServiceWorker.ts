import { Workbox } from 'workbox-window';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('New content is available; refresh recommended.');
        // Silent update - auto reload after user finishes current session
        if (document.visibilityState === 'hidden') {
          window.location.reload();
        }
      } else {
        console.log('Content is cached for offline use.');
      }
    });

    wb.addEventListener('waiting', () => {
      console.log('A new service worker is waiting to activate.');
    });

    wb.addEventListener('controlling', () => {
      console.log('Service worker now controlling the page.');
    });

    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log('Service worker activated for the first time!');
      }
    });

    wb.register().catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
  }
}
