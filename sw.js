// sw.js
const CACHE_NAME = 'solarstock-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap'
];

// 1. Instalación: Cacheamos los archivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache abierto');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activación: Borramos caches viejos si actualizamos la app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Borrando cache viejo:', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Fetch: Estrategia "Stale While Revalidate" (Red si es posible, si no, Cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return fetch(event.request).then((networkResponse) => {
        // Si la petición fue exitosa, actualizamos la cache
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse);
          });
        }
        return networkResponse || cachedResponse;
      }).catch(() => {
        // Si falla la red (offline), devolvemos la cache
        return cachedResponse;
      });
    })
  );
});