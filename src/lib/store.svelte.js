// App state kept on the phone (localStorage). No server: this is a static prototype.
import { browser } from '$app/environment';
import { SEED_REPORTS } from '$lib/data/static.js';

const KEY = 'mm.state.v1';

const fresh = () => ({
	phone: '',
	name: '',
	pinHash: '',
	signedIn: false,
	biometric: false,
	credentialId: '',
	theme: 'system',
	sms: true,
	reports: structuredClone(SEED_REPORTS),
	draft: null,
	nextId: 312,
	seenMessages: []
});

function load() {
	if (!browser) return fresh();
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? { ...fresh(), ...JSON.parse(raw) } : fresh();
	} catch {
		return fresh();
	}
}

export const app = $state(load());

// Unlock lasts for this browser session only, so reopening the app asks for PIN or fingerprint.
export const session = $state({ unlocked: browser ? sessionStorage.getItem('mm.unlocked') === '1' : false });

export function save() {
	if (!browser) return;
	localStorage.setItem(KEY, JSON.stringify(app));
	localStorage.setItem('mm.theme', app.theme);
}

export function setUnlocked(v) {
	session.unlocked = v;
	if (browser) v ? sessionStorage.setItem('mm.unlocked', '1') : sessionStorage.removeItem('mm.unlocked');
}

export async function hashPin(pin) {
	const data = new TextEncoder().encode('majimap:' + pin);
	const buf = await crypto.subtle.digest('SHA-256', data);
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function applyTheme() {
	if (!browser) return;
	const t = app.theme;
	const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
	document.documentElement.dataset.theme = dark ? 'dark' : 'light';
	setSystemBars(location.pathname);
}

// Android system bars (status bar and gesture/navigation bar) take the page's theme-color in an installed PWA.
// Rule from the designs: match the bottom nav when the screen has one, the page background when it does not,
// and the camera's dark surface on the camera.
const NAV_ROUTES = ['/home', '/reports', '/nearby', '/account', '/sent'];
export function setSystemBars(path) {
	if (!browser) return;
	const css = getComputedStyle(document.documentElement);
	const token = path === '/report' ? null : NAV_ROUTES.some((r) => path.startsWith(r)) ? '--surface-raised' : '--surface-base';
	const colour = token ? css.getPropertyValue(token).trim() : '#0b1318';
	let meta = document.querySelector('meta[name="theme-color"]');
	if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
	meta.setAttribute('content', colour);
}

export function signOut() {
	app.signedIn = false;
	app.pinHash = '';
	app.biometric = false;
	app.credentialId = '';
	save();
	setUnlocked(false);
}

export function deleteAccount() {
	const theme = app.theme;
	Object.assign(app, fresh(), { theme });
	save();
	setUnlocked(false);
}

export function initials(name) {
	if (!name) return '';
	return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}

export function maskPhone(p) {
	const d = (p || '').replace(/\D/g, '');
	if (d.length < 7) return p;
	return `${d.slice(0, 4)} ••• ${d.slice(-3)}`;
}

export function prettyPhone(p) {
	const d = (p || '').replace(/\D/g, '');
	return d.length === 10 ? `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : p;
}
