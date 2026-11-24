import { app, save } from '$lib/store.svelte.js';
import { REPORT_TYPES, WATER_POINTS, distanceM } from '$lib/data/static.js';

export function newDraft(pointId = null) {
	app.draft = { photos: [], lat: null, lng: null, accuracy: null, point: pointId, type: null, aiType: 'leak', note: '', voice: null, voiceSecs: 0, startedAt: Date.now() };
	save();
}

export function nearestPoint(lat, lng) {
	return [...WATER_POINTS].sort((a, b) => distanceM({ lat, lng }, a) - distanceM({ lat, lng }, b))[0];
}

// Shrink a photo to at most 1280 px and about 300 KB so it sends on a weak signal.
export async function compress(source) {
	const img = source instanceof HTMLVideoElement ? source : await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = source; });
	const w = img.videoWidth || img.naturalWidth, h = img.videoHeight || img.naturalHeight;
	const scale = Math.min(1, 1280 / Math.max(w, h));
	const c = document.createElement('canvas'); c.width = Math.round(w * scale); c.height = Math.round(h * scale);
	c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
	let q = 0.72, url = c.toDataURL('image/jpeg', q);
	while (url.length * 0.75 > 300_000 && q > 0.35) { q -= 0.1; url = c.toDataURL('image/jpeg', q); }
	return url;
}

export function fileToDataUrl(file) {
	return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
}

export function typeLabel(id) { return REPORT_TYPES.find((t) => t.id === id)?.label || 'Water problem'; }

export function fmtNow() {
	const d = new Date();
	return `Today, ${d.toTimeString().slice(0, 5)}`;
}

export function submitDraft() {
	const d = app.draft;
	const p = WATER_POINTS.find((x) => x.id === d.point);
	const id = `RPT-MKN-0${app.nextId}`;
	app.nextId += 1;
	const report = {
		id, type: d.type, title: typeLabel(d.type), point: d.point, place: p ? `${p.name} · ${p.ward}` : 'Your location',
		when: fmtNow(), status: 'waiting', note: d.note ? `“${d.note}”` : (d.voice ? 'Voice note attached.' : ''), photos: d.photos.length, photoUrls: d.photos,
		accuracy: d.accuracy, steps: [['Saved on this phone', 'Today'], ['Sent', null], ['Being checked', null], ['Fixed', null]]
	};
	app.reports.unshift(report);
	app.draft = null;
	save();
	return id;
}

export function markSent(report) {
	report.status = 'unverified';
	report.steps = [['Sent', 'Today'], ['Being checked', null], ['Fault confirmed', null], ['Fixed', null]];
	save();
}
