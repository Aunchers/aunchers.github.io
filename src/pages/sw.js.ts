import { execSync } from 'node:child_process';

export const prerender = true;

// the cache name carries the commit, so a new deploy throws the old one away
function buildVersion() {
  try {
    return execSync('git rev-parse --short=7 HEAD', {
      encoding: 'utf8',
      windowsHide: true,
    }).trim();
  } catch {
    return 'dev';
  }
}

const source = `// cached shell + offline fallback
const VERSION = ${JSON.stringify(buildVersion())};
const CACHE = 'aunchers-' + VERSION;
const OFFLINE = '/offline/';

// cache the offline page and everything it needs (css, fonts, icons)
async function precache() {
  const cache = await caches.open(CACHE);
  const page = await fetch(OFFLINE, { cache: 'reload' });
  if (!page.ok) return;

  cache.put(OFFLINE, page.clone());

  const html = await page.text();
  const urls = new Set();
  const pattern = /(?:href|src)="([^"]+)"/g;
  let match;

  while ((match = pattern.exec(html))) {
    const url = new URL(match[1], self.location.origin);
    if (url.origin !== self.location.origin) continue;
    if (url.pathname === OFFLINE || url.pathname === '/sw.js') continue;
    urls.add(url.pathname + url.search);
  }

  await Promise.all(Array.from(urls, (url) => cache.add(url).catch(() => {})));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.indexOf('aunchers-') === 0 && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // pages: try the network, keep a copy, fall back to cache then offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((hit) => hit || caches.match(OFFLINE)),
        ),
    );
    return;
  }

  // assets are hashed by the build, so serve from cache first
  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
`;

export function GET() {
  return new Response(source, {
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
