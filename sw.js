/* Travel AI service worker — build 4.3.1
   The app shell is cached so the site opens instantly and works with no signal.
   Country facts are embedded in app.js, so search and country details work fully
   offline. Rates, weather and AI answers need a connection and fail gracefully. */

const CACHE = 'travel-ai-4.3.1';

const SHELL = [
  './',
  './index.html',
  './css/styles.css?v=4.3.1',
  './js/config.js?v=4.3.1',
  './js/app.js?v=4.3.1',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll fails the whole install if one file 404s, so add individually.
      .then(cache => Promise.all(SHELL.map(url => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Live data and the AI backend must never be served from cache.
  if (url.origin !== self.location.origin) return;

  // Navigations: try the network first so a new deploy is picked up, fall back to cache.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          // Never let a 404 or error page replace the cached app shell.
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // config.js holds the backend URL: network first, so a changed API_URL applies on the first load.
  if (url.pathname.endsWith('/js/config.js')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Static assets: serve from cache immediately, refresh in the background.
  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
