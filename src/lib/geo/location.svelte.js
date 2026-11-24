import { DEMO_LOCATION } from '$lib/data/static.js';

export const here = $state({ lat: DEMO_LOCATION.lat, lng: DEMO_LOCATION.lng, accuracy: null, real: false, status: 'idle' });

// Uses the phone's location when allowed; if far from Makueni, keeps the demo spot so the static data stays nearby.
export function locate() {
	if (!navigator.geolocation) { here.status = 'unavailable'; return; }
	here.status = 'locating';
	navigator.geolocation.getCurrentPosition(
		(p) => {
			const near = Math.abs(p.coords.latitude - DEMO_LOCATION.lat) < 0.5 && Math.abs(p.coords.longitude - DEMO_LOCATION.lng) < 0.5;
			if (near) { here.lat = p.coords.latitude; here.lng = p.coords.longitude; here.real = true; }
			here.accuracy = Math.round(p.coords.accuracy);
			here.status = 'ready';
		},
		() => { here.status = 'denied'; },
		{ enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
	);
}
