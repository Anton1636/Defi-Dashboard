const CACHE_NAME = 'nexora-v1'
const STATIC_CACHE = 'nexora-static-v1'

// Static assets to cache on install
const STATIC_ASSETS = [
	'/',
	'/portfolio',
	'/positions',
	'/alerts',
	'/manifest.json',
]

// Install — cache static assets
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(STATIC_CACHE).then(cache => {
			return cache.addAll(STATIC_ASSETS).catch(err => {
				console.warn('[SW] Failed to cache some assets:', err)
			})
		}),
	)
	self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', event => {
	event.waitUntil(
		caches
			.keys()
			.then(keys =>
				Promise.all(
					keys
						.filter(k => k !== CACHE_NAME && k !== STATIC_CACHE)
						.map(k => caches.delete(k)),
				),
			),
	)
	self.clients.claim()
})

// Fetch strategy:
// - API calls → Network first, fallback to cache
// - Static assets → Cache first, fallback to network
// - Navigation → Network first, fallback to cached index
self.addEventListener('fetch', event => {
	const { request } = event
	const url = new URL(request.url)

	// Skip non-GET and chrome-extension requests
	if (request.method !== 'GET') return
	if (url.protocol === 'chrome-extension:') return

	// API calls — network first
	if (url.pathname.startsWith('/api/')) {
		event.respondWith(
			fetch(request)
				.then(res => {
					if (res.ok) {
						const clone = res.clone()
						caches.open(CACHE_NAME).then(c => c.put(request, clone))
					}
					return res
				})
				.catch(() => caches.match(request)),
		)
		return
	}

	// Static files — cache first
	if (url.pathname.match(/\.(js|css|png|jpg|svg|ico|woff2?)$/)) {
		event.respondWith(
			caches.match(request).then(cached => cached ?? fetch(request)),
		)
		return
	}

	// Navigation — network first, fallback to cache
	event.respondWith(
		fetch(request)
			.then(res => {
				const clone = res.clone()
				caches.open(CACHE_NAME).then(c => c.put(request, clone))
				return res
			})
			.catch(() => caches.match(request) ?? caches.match('/')),
	)
})

// Push notifications
self.addEventListener('push', event => {
	const data = event.data?.json() ?? {}
	event.waitUntil(
		self.registration.showNotification(data.title ?? 'NEXORA Alert', {
			body: data.body ?? 'Check your portfolio',
			icon: '/icons/icon-192.png',
			badge: '/icons/icon-72.png',
			tag: data.tag ?? 'nexora-alert',
			data: { url: data.url ?? '/alerts' },
			actions: [
				{ action: 'view', title: 'View' },
				{ action: 'dismiss', title: 'Dismiss' },
			],
		}),
	)
})

// Notification click
self.addEventListener('notificationclick', event => {
	event.notification.close()
	if (event.action === 'dismiss') return
	const url = event.notification.data?.url ?? '/alerts'
	event.waitUntil(
		clients.matchAll({ type: 'window' }).then(list => {
			const existing = list.find(c => c.url.includes(url))
			if (existing) return existing.focus()
			return clients.openWindow(url)
		}),
	)
})
