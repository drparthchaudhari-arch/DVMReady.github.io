/* global self, caches, clients, fetch */

const CACHE_VERSION = 'dvmready-v3'
const RUNTIME_CACHE = 'dvmready-runtime-v3'
const APP_SHELL_CACHE = 'dvmready-shell-v3'
const CALCULATOR_CACHE = 'dvmready-calculators-v3'
const BACKGROUND_SYNC_TAG = 'dvmready-sync'

// Critical app shell files
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/tools/',
  '/tools/index.html',
  '/assets/css/tokens.css',
  '/assets/css/portal.css',
  '/assets/css/logo-styles.css',
  '/assets/js/nav-status.js',
  '/assets/js/theme-toggle.js',
  '/assets/js/legal-compliance.js',
  '/assets/js/preferences.js',
  '/assets/js/auth-system.js',
  '/assets/js/animations.js',
  '/assets/img/dvmready-logo.png',
  '/assets/img/dvmready-logo-pro.svg',
  '/manifest.json',
]

// Core calculator files for offline access
const CALCULATOR_URLS = [
  '/tools/dose-calculator.html',
  '/tools/fluid-calculator.html',
  '/tools/cri-calculator.html',
  '/tools/emergency-drug-chart.html',
  '/tools/transfusion-helper.html',
  '/tools/toxicity-suite.html',
  '/tools/unit-converter.html',
  '/tools/acid-base-electrolyte.html',
  '/assets/js/dose-calculator.js',
  '/assets/js/fluid-calculator.js',
  '/assets/js/cri-calculator.js',
  '/assets/js/emergency-drug-chart.js',
  '/assets/js/transfusion-helper.js',
  '/assets/js/toxicity-suite.js',
  '/assets/js/unit-converter.js',
  '/assets/js/acid-base-electrolyte.js',
  '/assets/css/calculator-dashboard.css',
  '/assets/css/calculator-print.css',
]

function isSameOrigin(requestUrl) {
  try {
    const url = new URL(requestUrl)
    return url.origin === self.location.origin
  } catch (error) {
    return false
  }
}

function isAssetRequest(pathname) {
  return (
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2')
  )
}

function isCalculatorRequest(pathname) {
  return pathname.startsWith('/tools/') && (
    pathname.endsWith('.html') || 
    pathname.includes('calculator') ||
    pathname.includes('dose') ||
    pathname.includes('fluid') ||
    pathname.includes('cri') ||
    pathname.includes('emergency') ||
    pathname.includes('transfusion') ||
    pathname.includes('toxicity')
  )
}

// Install event - cache app shell and calculators
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    Promise.all([
      // Cache app shell
      caches.open(APP_SHELL_CACHE).then((cache) => {
        console.log('[SW] Caching app shell...')
        return cache.addAll(PRECACHE_URLS)
      }),
      // Cache calculator files
      caches.open(CALCULATOR_CACHE).then((cache) => {
        console.log('[SW] Caching calculator files...')
        return cache.addAll(CALCULATOR_URLS).catch((err) => {
          console.log('[SW] Some calculator files failed to cache:', err)
          // Continue even if some files fail
          return Promise.resolve()
        })
      })
    ]).then(() => {
      console.log('[SW] Caching complete, skipping waiting...')
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.map((key) => {
          // Delete old cache versions
          if (!key.includes(CACHE_VERSION) && key.startsWith('dvmready')) {
            console.log('[SW] Deleting old cache:', key)
            return caches.delete(key)
          }
          return Promise.resolve()
        })
      )
      await clients.claim()
      console.log('[SW] Activation complete')
    })()
  )
})

// Network-first strategy for HTML pages
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html')
    }
    throw error
  }
}

// Stale-while-revalidate for assets
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)
  
  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response && response.status === 200) {
        const cache = await caches.open(RUNTIME_CACHE)
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => null)

  if (cached) {
    return cached
  }

  const fresh = await fetchPromise
  if (fresh) {
    return fresh
  }

  throw new Error('Resource not available offline')
}

// Cache-first for calculator assets
async function calculatorCacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    // Revalidate in background
    fetch(request).then((response) => {
      if (response && response.status === 200) {
        caches.open(CALCULATOR_CACHE).then((cache) => {
          cache.put(request, response)
        })
      }
    }).catch(() => {})
    return cached
  }

  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(CALCULATOR_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    throw error
  }
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const request = event.request
  
  // Skip non-GET requests
  if (!request || request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (!isSameOrigin(request.url)) {
    return
  }

  const url = new URL(request.url)
  const pathname = url.pathname || '/'

  // Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  // Calculator-specific assets
  if (isCalculatorRequest(pathname)) {
    event.respondWith(calculatorCacheFirst(request))
    return
  }

  // Static assets (CSS, JS, images, fonts)
  if (isAssetRequest(pathname)) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Default: network first
  event.respondWith(networkFirst(request))
})

// Message handler for skip waiting
self.addEventListener('message', (event) => {
  if (!event || !event.data) {
    return
  }

  if (event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting requested')
    self.skipWaiting()
  }
  
  // Handle cache version check
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION })
  }
})

// Background sync for offline form submissions
async function notifyClientsForSync() {
  const allClients = await clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  })
  for (const client of allClients) {
    try {
      client.postMessage({ type: 'dvmready-sync-request' })
    } catch (error) {
      // Ignore per-client failures
    }
  }
}

self.addEventListener('sync', (event) => {
  if (!event || !event.tag) {
    return
  }

  if (event.tag === BACKGROUND_SYNC_TAG) {
    console.log('[SW] Background sync triggered')
    event.waitUntil(notifyClientsForSync())
  }
})

// Periodic background sync for content updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-update') {
    event.waitUntil(
      caches.open(CALCULATOR_CACHE).then((cache) => {
        // Refresh calculator files in background
        return Promise.all(
          CALCULATOR_URLS.map((url) => 
            fetch(url).then((response) => {
              if (response.status === 200) {
                return cache.put(url, response)
              }
            }).catch(() => {})
          )
        )
      })
    )
  }
})
