<script>
	import '@fontsource/figtree/400.css';
	import '@fontsource/figtree/500.css';
	import '@fontsource/figtree/600.css';
	import '@fontsource/figtree/700.css';
	import '@fontsource/jetbrains-mono/500.css';
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { app, session, applyTheme } from '$lib/store.svelte.js';
	import { markSent } from '$lib/report/draft.js';
	let { children } = $props();

	const PUBLIC = ['/sign-in', '/nearby'];
	$effect(() => {
		const path = $page.url.pathname;
		const isPublic = PUBLIC.some((p) => path.startsWith(p));
		if (!app.signedIn && !isPublic && path !== '/') goto('/sign-in', { replaceState: true });
		else if (app.signedIn && !session.unlocked && !path.startsWith('/unlock')) goto('/unlock', { replaceState: true });
	});
	$effect(() => {
		applyTheme();
		const mq = matchMedia('(prefers-color-scheme: dark)');
		const h = () => applyTheme();
		mq.addEventListener('change', h);
		return () => mq.removeEventListener('change', h);
	});
	// Reports saved offline send themselves when the phone is back online.
	$effect(() => {
		const flush = () => app.reports.filter((r) => r.status === 'waiting').forEach((r) => markSent(r));
		if (navigator.onLine) setTimeout(flush, 3000);
		addEventListener('online', flush);
		return () => removeEventListener('online', flush);
	});
</script>

<div class="app">{@render children()}</div>

<style>
	.app { max-width: 480px; margin: 0 auto; min-height: 100dvh; position: relative; }
</style>
