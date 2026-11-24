<script>
	import 'maplibre-gl/dist/maplibre-gl.css';
	import maplibregl from 'maplibre-gl';
	import { goto } from '$app/navigation';
	import { WATER_POINTS } from '$lib/data/static.js';
	import { here } from '$lib/geo/location.svelte.js';
	let el;
	const colour = { working: '#1e7a4c', repair: '#a04a00', faulty: '#b3261e', unverified: '#5b4b9a' };
	$effect(() => {
		const dark = document.documentElement.dataset.theme === 'dark';
		const tiles = dark
			? ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', 'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png']
			: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png'];
		const map = new maplibregl.Map({
			container: el,
			style: { version: 8, sources: { osm: { type: 'raster', tiles, tileSize: 256, attribution: '© OpenStreetMap contributors' + (dark ? ' © CARTO' : '') } }, layers: [{ id: 'osm', type: 'raster', source: 'osm' }] },
			center: [here.lng, here.lat], zoom: 13.5, attributionControl: { compact: true }
		});
		map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'right');
		for (const p of WATER_POINTS) {
			const m = document.createElement('button');
			m.className = 'mm-marker'; m.style.background = colour[p.status]; m.setAttribute('aria-label', `${p.name}, ${p.status}`);
			m.onclick = () => goto(`/nearby/${p.id}`);
			new maplibregl.Marker({ element: m }).setLngLat([p.lng, p.lat]).addTo(map);
		}
		const me = document.createElement('span'); me.className = 'mm-me';
		new maplibregl.Marker({ element: me }).setLngLat([here.lng, here.lat]).addTo(map);
		return () => map.remove();
	});
</script>

<div class="map" bind:this={el}></div>

<style>
	.map { position: fixed; inset: 0 0 calc(var(--nav-h) + env(safe-area-inset-bottom)) 0; max-width: 480px; margin: 0 auto; background: var(--surface-map-land); }
	:global(.mm-marker) { width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid #fff; box-shadow: 0 2px 6px rgb(0 0 0 / 0.3); cursor: pointer; }
	:global(.mm-me) { width: 18px; height: 18px; border-radius: 50%; background: #00658b; border: 3px solid #fff; box-shadow: 0 0 0 6px rgb(0 101 139 / 0.25); }
</style>
