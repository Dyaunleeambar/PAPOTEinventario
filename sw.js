// ══════════════════════════════════════════════════════
// ☀️ SolarStock — Service Worker
// Versión: 1.0.0 | Estrategia: Cache-First con red como fallback
// ══════════════════════════════════════════════════════

const CACHE_NAME = 'solarstock-v1';
const CACHE_STATIC = 'solarstock-static-v1';
const CACHE_FONTS  = 'solarstock-fonts-v1';

// ── Archivos del app shell (obligatorios para funcionar offline) ──
const ASSETS_CORE = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// ── Recursos de fuentes externas (Google Fonts) ──
const FONT_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

// ══════════════════════════════════════════════════════
// 📦 INSTALL — Pre-cachea el app shell
// ══════════════════════════════════════════════════════
self.addEventListener('install', event => {
  console.log('[SW] Instalando SolarStock v1...');
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        console.log('[SW] Pre-cacheando app shell...');
        return cache.addAll(ASSETS_CORE);
      })
      .then(() => {
        console.log('[SW] App shell cacheada correctamente.');
        // Activa el nuevo SW inmediatamente sin esperar a que cierren las pestañas
        return self.skipWaiting();
      })
      .catch(err => {
        console.warn('[SW] Error al pre-cachear (puede ser normal en local):', err);
        // No bloqueamos la instalación si falla algún ícono aún no generado
        return self.skipWaiting();
      })
  );
});

// ══════════════════════════════════════════════════════
// 🔄 ACTIVATE — Limpia cachés antiguas
// ══════════════════════════════════════════════════════
self.addEventListener('activate', event => {
  console.log('[SW] Activando SolarStock v1...');
  const cachesPermitidas = [CACHE_STATIC, CACHE_FONTS];

  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !cachesPermitidas.includes(key))
          .map(key => {
            console.log('[SW] Eliminando caché obsoleta:', key);
            return caches.delete(key);
          })
      ))
      .then(() => {
        console.log('[SW] Activado. Tomando control de todos los clientes.');
        // Toma control de todas las pestañas abiertas sin recargar
        return self.clients.claim();
      })
  );
});

// ══════════════════════════════════════════════════════
// 🌐 FETCH — Estrategias de caché por tipo de recurso
// ══════════════════════════════════════════════════════
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones que no son GET
  if (request.method !== 'GET') return;

  // Ignorar extensiones del navegador y peticiones chrome-extension
  if (!url.protocol.startsWith('http')) return;

  // ── Estrategia para Google Fonts: Cache-First ──
  if (FONT_ORIGINS.some(origin => url.href.startsWith(origin))) {
    event.respondWith(cacheFirst(request, CACHE_FONTS));
    return;
  }

  // ── Estrategia para el app shell (index.html + manifest): Network-First ──
  // Así siempre se intenta obtener la versión más nueva, pero funciona offline
  if (url.pathname.endsWith('index.html') || url.pathname === '/' || url.pathname.endsWith('manifest.json')) {
    event.respondWith(networkFirst(request, CACHE_STATIC));
    return;
  }

  // ── Estrategia para iconos y assets estáticos: Cache-First ──
  if (url.pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request, CACHE_STATIC));
    return;
  }

  // ── Estrategia por defecto: Network-First con fallback a caché ──
  event.respondWith(networkFirst(request, CACHE_STATIC));
});

// ══════════════════════════════════════════════════════
// 🛠️ ESTRATEGIAS DE CACHÉ
// ══════════════════════════════════════════════════════

/**
 * Cache-First: Devuelve desde caché si existe; si no, va a red y guarda.
 * Ideal para: fuentes, íconos, assets que no cambian.
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.warn('[SW] Cache-First: sin red y sin caché para', request.url);
    return offlineFallback();
  }
}

/**
 * Network-First: Intenta red primero; si falla usa caché.
 * Ideal para: index.html, archivos que pueden actualizarse.
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return offlineFallback();
  }
}

/**
 * Fallback offline: página mínima cuando no hay red ni caché.
 * Solo se muestra si el propio index.html no está en caché (primera visita offline).
 */
function offlineFallback() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>SolarStock — Sin conexión</title>
      <style>
        body {
          background: #0a0e1a; color: #f0f4ff;
          font-family: system-ui, sans-serif;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 100vh; padding: 32px; text-align: center; gap: 16px;
        }
        .icon { font-size: 56px; }
        h1 { font-size: 22px; font-weight: 800; color: #00c2ff; }
        p  { font-size: 14px; color: #8a9bbf; max-width: 280px; }
        button {
          background: #00c2ff; color: #0a0e1a; border: none;
          border-radius: 10px; padding: 12px 24px;
          font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 8px;
        }
      </style>
    </head>
    <body>
      <div class="icon">📡</div>
      <h1>Sin conexión</h1>
      <p>SolarStock no pudo cargar. Verifica tu conexión e intenta de nuevo.</p>
      <button onclick="location.reload()">Reintentar</button>
    </body>
    </html>`,
    {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    }
  );
}

// ══════════════════════════════════════════════════════
// 📬 MENSAJE — Permite forzar actualización desde la app
// ══════════════════════════════════════════════════════
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Actualización forzada solicitada.');
    self.skipWaiting();
  }
});
