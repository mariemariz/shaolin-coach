const CACHE_NAME = 'shaolin-coach-v1'
const urlsToCache = [
  '/shaolin-coach/',
  '/shaolin-coach/index.html',
  '/shaolin-coach/manifest.json',
]

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Interceptar requisições (estratégia: Network first, fallback para cache)
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') {
    return
  }

  // Ignorar requisições para a API (se houver)
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Não fazer cache de requisições da API
          return response
        })
        .catch(() => {
          // Se não houver conexão, verificar cache
          return caches.match(event.request)
        })
    )
    return
  }

  // Para outros recursos: Network first, fallback cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Fazer cache de respostas bem-sucedidas
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
      .catch(() => {
        // Se falhar a requisição, tentar cache
        return caches.match(event.request).then((response) => {
          return response || new Response('Offline - recurso não disponível', { status: 503 })
        })
      })
  )
})
