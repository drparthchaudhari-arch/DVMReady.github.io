/* global self, caches, clients, fetch, Promise */

/**
 * DVMReady Service Worker - Optimized for Maximum Performance
 * 
 * Strategies:
 * - Precache: Critical app shell (install time)
 * - Cache-First: Static assets (CSS, JS, images) - fastest repeat loads
 * - Network-First: HTML pages - freshness priority
 * - Stale-While-Revalidate: API calls - responsive + fresh
 * - LRU Eviction: Prevents cache bloat
 * - Offline Fallback: Graceful degradation
 */

// ============================================================================
// CACHE VERSIONING - BUMP THIS TO FORCE UPDATE
// ============================================================================
const CACHE_VERSION = 'dvmready-v4.0'
const CACHE_BUILT = '2026-02-26'

// ============================================================================
// CACHE NAMES - Organized by content type
// ============================================================================
const CACHE_NAMES = {
  PRECACHE: `dvmready-precache-${CACHE_VERSION}`,
  STATIC: `dvmready-static-${CACHE_VERSION}`,
  IMAGES: `dvmready-images-${CACHE_VERSION}`,
  API: `dvmready-api-${CACHE_VERSION}`,
  RUNTIME: `dvmready-runtime-${CACHE_VERSION}`,
  TOOLS: `dvmready-tools-${CACHE_VERSION}`,
}

// ============================================================================
// CACHE LIMITS - Prevents unbounded growth
// ============================================================================
const CACHE_LIMITS = {
  IMAGES: { maxEntries: 100, maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  API: { maxEntries: 200, maxAge: 7 * 24 * 60 * 60 * 1000 },     // 7 days
  RUNTIME: { maxEntries: 100 },
  STATIC: { maxEntries: 300 },
  TOOLS: { maxEntries: 50 },
}

// ============================================================================
// CRITICAL RESOURCES - Precached for offline use
// ============================================================================
const PRECACHE_URLS = [
  // Core HTML pages
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/search.html',
  '/404.html',
  
  // Tool index
  '/tools/',
  '/tools/index.html',
  
  // Essential calculators (top priority for offline)
  '/tools/dose-calculator.html',
  '/tools/fluid-calculator.html',
  '/tools/cri-calculator.html',
  '/tools/emergency-drug-chart.html',
  
  // Core CSS
  '/assets/css/tokens.css',
  '/assets/css/portal.css',
  '/assets/css/logo-styles.css',
  '/assets/css/dvmready-masterpiece.css',
  '/assets/css/animations-enhanced.css',
  '/assets/css/beautiful-animations.css',
  '/assets/css/calculator-dashboard.css',
  '/assets/css/calculator-print.css',
  '/assets/css/floating-elements.css',
  '/assets/css/unified-calculator.css',
  
  // Core JavaScript
  '/assets/js/nav-status.js',
  '/assets/js/theme-toggle.js',
  '/assets/js/legal-compliance.js',
  '/assets/js/preferences.js',
  '/assets/js/auth-system.js',
  '/assets/js/animations.js',
  '/assets/js/beautiful-animations.js',
  '/assets/js/calculator-print.js',
  '/assets/js/clinic-utilities.js',
  
  // Calculator scripts
  '/assets/js/dose-calculator.js',
  '/assets/js/fluid-calculator.js',
  '/assets/js/cri-calculator.js',
  '/assets/js/emergency-drug-chart.js',
  '/assets/js/drug-formulary-data.js',
  '/assets/js/transfusion-helper.js',
  
  // Critical images
  '/assets/img/dvmready-logo.png',
  '/assets/img/dvmready-logo-pro.svg',
  '/assets/img/dvmready-icon.svg',
  '/assets/img/dvmready-favicon.svg',
  '/assets/img/apple-touch-icon.png',
  '/assets/img/favicon-32x32.png',
  '/assets/img/favicon-16x16.png',
  
  // App manifest
  '/manifest.json',
]

// Optional URLs - cached if available but won't block install
const OPTIONAL_CACHE_URLS = [
  '/assets/img/icon-192x192.svg',
  '/assets/img/icon-512x512.svg',
  '/assets/img/dvmready-logo-animated.svg',
  '/assets/css/page-enhancements.css',
  '/assets/css/portal-enhancements.css',
]

// ============================================================================
// URL PATTERNS - For routing requests to appropriate strategies
// ============================================================================
const URL_PATTERNS = {
  // Analytics/external services to skip
  ANALYTICS: [
    /google-analytics/,
    /googletagmanager/,
    /gtag/,
    /segment/,
    /mixpanel/,
    /amplitude/,
    /hotjar/,
    /fullstory/,
    /intercom/,
    /crisp/,
    /drift/,
    /zendesk/,
    /firebase\/analytics/,
    /facebook\.com\/tr/,
  ],
  
  // External domains to skip caching
  EXTERNAL_DOMAINS: [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
    'unpkg.com',
    'cdnjs.cloudflare.com',
    'js.stripe.com',
    'api.stripe.com',
    'pay.google.com',
    'applepay.apple.com',
  ],
  
  // API endpoints (Stale-While-Revalidate)
  API: [
    /\/api\//,
    /\/supabase\//,
    /\.supabase\.co/,
    /\/auth\//,
    /\/data\//,
  ],
  
  // Static assets (Cache-First)
  STATIC_ASSETS: [
    /\.(js|mjs)$/,
    /\.(css|scss|sass)$/,
    /\.woff2?$/,
  ],
  
  // Images (Cache-First with LRU)
  IMAGES: [
    /\.(png|jpg|jpeg|gif|webp)$/,
    /\.(svg)$/,
    /\.(ico)$/,
  ],
  
  // Tools pages (Network-First but cached)
  TOOLS: /^\/tools\//,
  
  // HTML pages
  HTML: /\.(html?|\/)$/,
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if URL is from same origin
 */
function isSameOrigin(url) {
  try {
    const parsed = new URL(url, self.location.origin)
    return parsed.origin === self.location.origin
  } catch {
    return false
  }
}

/**
 * Check if request should be skipped (analytics, external, etc.)
 */
function shouldSkipRequest(request) {
  const url = request.url
  
  // Skip non-GET requests
  if (request.method !== 'GET') return true
  
  // Skip analytics
  for (const pattern of URL_PATTERNS.ANALYTICS) {
    if (pattern.test(url)) return true
  }
  
  // Skip external domains
  try {
    const parsed = new URL(url)
    if (URL_PATTERNS.EXTERNAL_DOMAINS.includes(parsed.hostname)) return true
    if (parsed.protocol === 'chrome-extension:') return true
  } catch {
    return true
  }
  
  return false
}

/**
 * Determine content type from URL
 */
function getContentType(url) {
  const pathname = new URL(url).pathname.toLowerCase()
  
  if (URL_PATTERNS.STATIC_ASSETS.some(p => p.test(pathname))) return 'static'
  if (URL_PATTERNS.IMAGES.some(p => p.test(pathname))) return 'image'
  if (URL_PATTERNS.TOOLS.test(pathname)) return 'tool'
  if (URL_PATTERNS.HTML.test(pathname) || pathname.endsWith('/')) return 'html'
  if (URL_PATTERNS.API.some(p => p.test(pathname))) return 'api'
  
  return 'runtime'
}

/**
 * LRU Cache Eviction - Remove oldest entries when limit exceeded
 */
async function evictLRU(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const requests = await cache.keys()
  
  if (requests.length <= maxEntries) return
  
  // Sort by last accessed (if available) or just remove oldest
  const toDelete = requests.slice(0, requests.length - maxEntries)
  
  await Promise.all(
    toDelete.map(request => {
      console.log(`[SW] LRU evicting: ${request.url}`)
      return cache.delete(request)
    })
  )
}

/**
 * Time-based cache cleanup
 */
async function cleanupExpiredCache(cacheName, maxAge) {
  const cache = await caches.open(cacheName)
  const requests = await cache.keys()
  const now = Date.now()
  
  for (const request of requests) {
    const response = await cache.match(request)
    if (response) {
      const dateHeader = response.headers.get('date')
      if (dateHeader) {
        const cachedTime = new Date(dateHeader).getTime()
        if (now - cachedTime > maxAge) {
          console.log(`[SW] Expired cache deleted: ${request.url}`)
          await cache.delete(request)
        }
      }
    }
  }
}

// ============================================================================
// CACHING STRATEGIES
// ============================================================================

/**
 * Cache-First: Return from cache immediately, fetch in background
 * Best for: CSS, JS, fonts (static assets that rarely change)
 */
async function cacheFirstStrategy(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  // Return cached version immediately if available
  if (cached) {
    // Revalidate in background if requested
    if (options.revalidate) {
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            cache.put(request, response)
          }
        })
        .catch(() => {})
    }
    return cached
  }
  
  // Fetch from network
  try {
    const response = await fetch(request)
    
    if (response && response.status === 200) {
      // Clone before storing
      const clone = response.clone()
      cache.put(request, clone)
      
      // Enforce cache limits
      if (options.maxEntries) {
        await evictLRU(cacheName, options.maxEntries)
      }
    }
    
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Network-First: Try network, fallback to cache
 * Best for: HTML pages (freshness priority)
 */
async function networkFirstStrategy(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName)
  
  try {
    // Try network first
    const response = await fetch(request)
    
    if (response && response.status === 200) {
      // Update cache with fresh response
      const clone = response.clone()
      cache.put(request, clone)
      
      if (options.maxEntries) {
        await evictLRU(cacheName, options.maxEntries)
      }
    }
    
    return response
  } catch (error) {
    // Network failed - try cache
    const cached = await cache.match(request)
    
    if (cached) {
      console.log(`[SW] Serving cached (offline): ${request.url}`)
      return cached
    }
    
    // No cache - return offline fallback for navigation
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/index.html')
      if (fallback) return fallback
    }
    
    throw error
  }
}

/**
 * Stale-While-Revalidate: Return cache immediately, update in background
 * Best for: API calls (responsive + eventually fresh)
 */
async function staleWhileRevalidateStrategy(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  // Always fetch fresh version
  const fetchPromise = fetch(request)
    .then(async response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone())
        
        if (options.maxEntries) {
          await evictLRU(cacheName, options.maxEntries)
        }
      }
      return response
    })
    .catch(() => null)
  
  // Return cached version immediately if available
  if (cached) {
    // Update in background
    fetchPromise.catch(() => {})
    return cached
  }
  
  // Wait for network response
  const fresh = await fetchPromise
  if (fresh) {
    return fresh
  }
  
  throw new Error('Resource unavailable offline')
}

/**
 * Network-Only: Always fetch from network, don't cache
 * For analytics, auth tokens, etc.
 */
async function networkOnlyStrategy(request) {
  return fetch(request)
}

// ============================================================================
// SERVICE WORKER EVENT HANDLERS
// ============================================================================

/**
 * INSTALL: Precache critical resources
 */
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing ${CACHE_VERSION}...`)
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAMES.PRECACHE)
      
      // Cache critical URLs
      console.log(`[SW] Precaching ${PRECACHE_URLS.length} critical resources...`)
      
      const results = await Promise.allSettled(
        PRECACHE_URLS.map(url => 
          cache.add(url).catch(err => {
            console.warn(`[SW] Failed to precache: ${url}`, err.message)
            throw err
          })
        )
      )
      
      const succeeded = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length
      
      console.log(`[SW] Precache complete: ${succeeded} succeeded, ${failed} failed`)
      
      // Also try optional URLs (don't fail if they don't exist)
      await Promise.all(
        OPTIONAL_CACHE_URLS.map(url => 
          cache.add(url).catch(() => {})
        )
      )
      
      // Activate immediately
      await self.skipWaiting()
      console.log(`[SW] Installation complete - activating...`)
    })()
  )
})

/**
 * ACTIVATE: Clean up old caches and claim clients
 */
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating ${CACHE_VERSION}...`)
  
  event.waitUntil(
    (async () => {
      // Get all existing caches
      const cacheNames = await caches.keys()
      
      // Delete old dvmready caches
      const deletionPromises = cacheNames
        .filter(name => {
          // Keep current version
          if (name.includes(CACHE_VERSION)) return false
          // Only delete our cache names
          return name.startsWith('dvmready-')
        })
        .map(async oldName => {
          console.log(`[SW] Deleting old cache: ${oldName}`)
          await caches.delete(oldName)
        })
      
      await Promise.all(deletionPromises)
      
      // Claim all clients immediately
      await clients.claim()
      
      console.log(`[SW] Activation complete - controlling ${(await clients.matchAll()).length} clients`)
    })()
  )
})

/**
 * FETCH: Route requests to appropriate strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip certain requests
  if (shouldSkipRequest(request)) {
    return
  }
  
  // Skip same-origin check for some external fonts/CDNs that should be cached
  const shouldCacheExternal = URL_PATTERNS.EXTERNAL_DOMAINS.includes(url.hostname) && 
    (url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff') || url.pathname.endsWith('.css'))
  
  if (!isSameOrigin(request.url) && !shouldCacheExternal) {
    return
  }
  
  const contentType = getContentType(request.url)
  
  // Route to appropriate strategy
  switch (contentType) {
    case 'static':
      // Cache-First: CSS, JS, fonts
      event.respondWith(
        cacheFirstStrategy(request, CACHE_NAMES.STATIC, {
          maxEntries: CACHE_LIMITS.STATIC.maxEntries,
          revalidate: true, // Update in background
        })
      )
      break
      
    case 'image':
      // Cache-First for images with LRU
      event.respondWith(
        cacheFirstStrategy(request, CACHE_NAMES.IMAGES, {
          maxEntries: CACHE_LIMITS.IMAGES.maxEntries,
          revalidate: false,
        })
      )
      break
      
    case 'api':
      // Stale-While-Revalidate for APIs
      event.respondWith(
        staleWhileRevalidateStrategy(request, CACHE_NAMES.API, {
          maxEntries: CACHE_LIMITS.API.maxEntries,
        })
      )
      break
      
    case 'tool':
      // Network-First for tools (need fresh calculators)
      event.respondWith(
        networkFirstStrategy(request, CACHE_NAMES.TOOLS, {
          maxEntries: CACHE_LIMITS.TOOLS.maxEntries,
        })
      )
      break
      
    case 'html':
    default:
      // Network-First for HTML pages
      event.respondWith(
        networkFirstStrategy(request, CACHE_NAMES.RUNTIME, {
          maxEntries: CACHE_LIMITS.RUNTIME.maxEntries,
        })
      )
      break
  }
})

/**
 * MESSAGE: Handle messages from main thread
 */
self.addEventListener('message', (event) => {
  if (!event?.data) return
  
  const { type, payload } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      console.log('[SW] Skip waiting requested')
      self.skipWaiting()
      break
      
    case 'GET_VERSION':
      event.ports?.[0]?.postMessage({ 
        version: CACHE_VERSION, 
        built: CACHE_BUILT,
        caches: Object.keys(CACHE_NAMES).length
      })
      break
      
    case 'CLEAR_CACHE':
      // Clear specific cache or all
      event.waitUntil(
        (async () => {
          const cacheName = payload?.cache
          if (cacheName && CACHE_NAMES[cacheName]) {
            await caches.delete(CACHE_NAMES[cacheName])
            console.log(`[SW] Cleared cache: ${CACHE_NAMES[cacheName]}`)
          } else {
            // Clear all runtime caches
            await Promise.all(
              Object.values(CACHE_NAMES).map(name => 
                caches.delete(name).catch(() => false)
              )
            )
            console.log('[SW] Cleared all caches')
          }
          event.ports?.[0]?.postMessage({ success: true })
        })()
      )
      break
      
    case 'PRECACHE_URLS':
      // Dynamically add URLs to precache
      if (payload?.urls && Array.isArray(payload.urls)) {
        event.waitUntil(
          (async () => {
            const cache = await caches.open(CACHE_NAMES.PRECACHE)
            await Promise.all(
              payload.urls.map(url => 
                fetch(url)
                  .then(r => r.status === 200 && cache.put(url, r))
                  .catch(() => {})
              )
            )
            event.ports?.[0]?.postMessage({ success: true })
          })()
        )
      }
      break
  }
})

/**
 * BACKGROUND SYNC: Handle deferred operations
 */
self.addEventListener('sync', (event) => {
  if (!event?.tag) return
  
  console.log(`[SW] Background sync: ${event.tag}`)
  
  switch (event.tag) {
    case 'dvmready-sync':
      event.waitUntil(
        notifyClients('sync-request')
      )
      break
      
    case 'cache-cleanup':
      event.waitUntil(
        performCacheCleanup()
      )
      break
  }
})

/**
 * PERIODIC SYNC: Background content updates
 */
self.addEventListener('periodicsync', (event) => {
  if (!event?.tag) return
  
  console.log(`[SW] Periodic sync: ${event.tag}`)
  
  switch (event.tag) {
    case 'content-update':
      event.waitUntil(
        refreshCriticalCaches()
      )
      break
      
    case 'cache-maintenance':
      event.waitUntil(
        performCacheCleanup()
      )
      break
  }
})

/**
 * PUSH: Handle push notifications (if enabled)
 */
self.addEventListener('push', (event) => {
  if (!event?.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/assets/img/dvmready-icon.svg',
    badge: '/assets/img/favicon-32x32.png',
    tag: data.tag || 'dvmready',
    requireInteraction: data.requireInteraction || false,
    data: data.data || {},
    actions: data.actions || [],
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'DVMReady', options)
  )
})

/**
 * NOTIFICATION CLICK: Handle notification interactions
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const url = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Focus existing window if open
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function notifyClients(messageType) {
  const allClients = await clients.matchAll({ 
    type: 'window', 
    includeUncontrolled: true 
  })
  
  allClients.forEach(client => {
    try {
      client.postMessage({ type: `dvmready-${messageType}` })
    } catch (err) {
      // Ignore individual client errors
    }
  })
}

async function performCacheCleanup() {
  console.log('[SW] Performing cache cleanup...')
  
  // Clean up expired entries
  await cleanupExpiredCache(CACHE_NAMES.IMAGES, CACHE_LIMITS.IMAGES.maxAge)
  await cleanupExpiredCache(CACHE_NAMES.API, CACHE_LIMITS.API.maxAge)
  
  // Enforce size limits
  await evictLRU(CACHE_NAMES.IMAGES, CACHE_LIMITS.IMAGES.maxEntries)
  await evictLRU(CACHE_NAMES.API, CACHE_LIMITS.API.maxEntries)
  await evictLRU(CACHE_NAMES.STATIC, CACHE_LIMITS.STATIC.maxEntries)
  await evictLRU(CACHE_NAMES.RUNTIME, CACHE_LIMITS.RUNTIME.maxEntries)
  await evictLRU(CACHE_NAMES.TOOLS, CACHE_LIMITS.TOOLS.maxEntries)
  
  console.log('[SW] Cache cleanup complete')
}

async function refreshCriticalCaches() {
  console.log('[SW] Refreshing critical caches...')
  
  // Refresh essential calculators
  const criticalTools = [
    '/tools/dose-calculator.html',
    '/tools/fluid-calculator.html',
    '/tools/cri-calculator.html',
  ]
  
  const cache = await caches.open(CACHE_NAMES.TOOLS)
  
  await Promise.all(
    criticalTools.map(async url => {
      try {
        const response = await fetch(url, { cache: 'no-cache' })
        if (response.status === 200) {
          await cache.put(url, response)
        }
      } catch (err) {
        console.warn(`[SW] Failed to refresh: ${url}`)
      }
    })
  )
  
  console.log('[SW] Critical cache refresh complete')
}

// Log initialization
console.log(`[SW] Service Worker ${CACHE_VERSION} loaded`)
