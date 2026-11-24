/// <reference types="@sveltejs/kit" />
// Offline-first: cache the built app and static files; map tiles are cached as they are viewed.
import { build, files, version } from '$service-worker';

const CACHE = `majimap-${version}`;
const TILES = 'majimap-tiles';
const ASSETS = [...build, ...files];

self.addEventListener('install', (e) => {
	e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== TILES).map((k) => caches.delete(k)))).then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (e) => {
	if (e.request.method !== 'GET') return;
	const url = new URL(e.request.url);

	if (url.hostname.endsWith('tile.openstreetmap.org') || url.hostname.endsWith('basemaps.cartocdn.com')) {
		e.respondWith(
			caches.open(TILES).then(async (c) => {
				const hit = await c.match(e.request);
				if (hit) return hit;
				const res = await fetch(e.request);
				if (res.ok) c.put(e.request, res.clone());
				return res;
			})
		);
		return;
	}
	if (url.origin !== location.origin) return;

	e.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);
			if (ASSETS.includes(url.pathname)) {
				const hit = await cache.match(url.pathname);
				if (hit) return hit;
			}
			try {
				return await fetch(e.request);
			} catch {
				// SPA fallback when offline: serve the app shell.
				return (await cache.match(e.request)) || (await cache.match('/')) || Response.error();
			}
		})()
	);
});
