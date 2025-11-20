const CACHE_VERSION = 'savannah-dynasty-v2.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Статические ресурсы для немедленного кэширования
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
];

// Максимальное количество элементов в динамическом кэше
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 100;

// Лимит кэша (очистка старых элементов)
const limitCacheSize = (cacheName, maxSize) => {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > maxSize) {
        cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxSize));
      }
    });
  });
};

// Install - агрессивное кэширование статических ресурсов
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - очистка старых кэшей
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - умная стратегия кэширования
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Игнорируем запросы к Supabase и внешним API
  if (url.origin !== location.origin || 
      url.hostname.includes('supabase') ||
      url.hostname.includes('chrome-extension')) {
    return;
  }

  // Стратегия для изображений и медиа: Cache First
  if (request.destination === 'image' || 
      request.destination === 'video' ||
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|avif)$/i)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache => {
        return cache.match(request).then(cachedResponse => {
          if (cachedResponse) {
            console.log('[SW] Cache hit for image:', url.pathname);
            return cachedResponse;
          }

          return fetch(request).then(networkResponse => {
            // Кэшируем только успешные ответы
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
              limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE);
            }
            return networkResponse;
          }).catch(() => {
            // Fallback для изображений при офлайне
            return new Response(
              '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect fill="#f0f0f0" width="400" height="300"/><text fill="#999" x="50%" y="50%" text-anchor="middle" dy=".3em">Image offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
        });
      })
    );
    return;
  }

  // Стратегия для шрифтов: Cache First
  if (request.destination === 'font' || 
      url.pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            return caches.open(STATIC_CACHE).then(cache => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Стратегия для скриптов и стилей: Stale While Revalidate
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.match(/\.(js|css)$/i)) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.match(request).then(cachedResponse => {
          const fetchPromise = fetch(request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          // Возвращаем кэш сразу, обновляем в фоне
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Стратегия для HTML: Network First
  if (request.destination === 'document' || 
      request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            return caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, networkResponse.clone());
              limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
              return networkResponse;
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then(cachedResponse => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Дефолтная стратегия: Network First с Fallback
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, networkResponse.clone());
            limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
            return networkResponse;
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});

// Сообщения от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        return self.clients.matchAll();
      }).then((clients) => {
        clients.forEach(client => client.postMessage({ type: 'CACHE_CLEARED' }));
      })
    );
  }
});

console.log('[SW] Service Worker loaded successfully');
